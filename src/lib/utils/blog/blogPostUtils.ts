// src/lib/utils/blog/blogPostUtils.ts
import { EBlogStatus, type BlockNoteDocJSON } from "@/types/blogPost.types";
import type { IFileAsset } from "@/types/shared.types";
import { ES3Folder, ES3Namespace } from "@/types/aws.types";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { slugify } from "@/lib/utils/stringUtils";
import { makeEntityFinalPrefix, isTempKey, keyJoin, publicUrlForKey, moveS3Object, collectS3KeysDeep, deleteS3Objects, diffS3KeysToDelete } from "@/lib/utils/s3Helper";

/* -------------------------------------------------------------------------- */
/* Slug                                                                       */
/* -------------------------------------------------------------------------- */

/** Ensure uniqueness by suffixing -2, -3, ... if needed */
export async function ensureUniqueSlug(base: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;

  const exists0 = await BlogPostModel.exists({ slug: candidate });
  if (!exists0) return candidate;

  for (let i = 2; i < 1000; i++) {
    candidate = `${root}-${i}`;
    const exists = await BlogPostModel.exists({ slug: candidate });
    if (!exists) return candidate;
  }

  return `${root}-${Date.now()}`;
}

/* -------------------------------------------------------------------------- */
/* Status normalization (IMPORTANT)                                           */
/* -------------------------------------------------------------------------- */

/**
 * Invariants:
 * - DRAFT: publishedAt must be undefined
 * - PUBLISHED: publishedAt must exist (defaults to now if missing)
 * - ARCHIVED: keep publishedAt as historical (do not auto-clear)
 */
export function normalizePublishFields(status: EBlogStatus, publishedAt?: Date | null): Date | undefined {
  if (status === EBlogStatus.DRAFT) return undefined;

  if (status === EBlogStatus.PUBLISHED) {
    return publishedAt ?? new Date();
  }

  // ARCHIVED: keep as-is (may be undefined if never published)
  return publishedAt ?? undefined;
}

/* -------------------------------------------------------------------------- */
/* Reading time                                                               */
/* -------------------------------------------------------------------------- */

/** Pull human-readable text out of BlockNote-ish JSON (best-effort). */
function extractTextFromBlockNote(v: unknown): string {
  const out: string[] = [];
  const seen = new Set<object>();

  const walk = (node: any) => {
    if (!node) return;
    if (typeof node === "string") {
      out.push(node);
      return;
    }
    if (typeof node !== "object") return;

    if (seen.has(node as object)) return;
    seen.add(node as object);

    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }

    // common shapes:
    // - { text: "..." }
    // - { content: [...] }
    // - { children: [...] }
    // - { props: { ... } }
    if (typeof node.text === "string") out.push(node.text);

    for (const k of Object.keys(node)) walk(node[k]);
  };

  walk(v);
  return out.join(" ");
}

/** Always computed server-side (200 wpm baseline, min 1). */
export function calcReadingTimeMinutesFromBlockNote(body: BlockNoteDocJSON): number {
  const text = extractTextFromBlockNote(body);
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200) || 1);
}

/* -------------------------------------------------------------------------- */
/* Asset finalization (all-or-nothing)                                        */
/* -------------------------------------------------------------------------- */

type MovePair = { fromKey: string; toKey: string };

function isFileAssetLike(v: any): v is IFileAsset {
  return v && typeof v === "object" && typeof v.s3Key === "string" && typeof v.url === "string" && typeof v.mimeType === "string";
}

function guessBlogMediaFolder(asset: IFileAsset): ES3Folder | string {
  const mt = (asset.mimeType || "").toLowerCase();

  if (mt.startsWith("image/")) return ES3Folder.BLOG_MEDIA_IMAGES;
  if (mt.startsWith("video/")) return ES3Folder.BLOG_MEDIA_VIDEOS;

  const k = (asset.s3Key || "").toLowerCase();
  if (k.includes("/media/images/")) return ES3Folder.BLOG_MEDIA_IMAGES;
  if (k.includes("/media/videos/")) return ES3Folder.BLOG_MEDIA_VIDEOS;

  return "media";
}

async function rollbackMoves(moves: MovePair[]) {
  for (let i = moves.length - 1; i >= 0; i--) {
    const m = moves[i];
    try {
      await moveS3Object({ fromKey: m.toKey, toKey: m.fromKey });
    } catch (e) {
      console.warn("Rollback move failed:", m, e);
    }
  }
}

async function finalizeTempAssetsDeep<T>({ input, postId, moved }: { input: T; postId: string; moved: MovePair[] }): Promise<T> {
  const cache = new Map<string, IFileAsset>(); // tempKey -> finalized asset
  const seen = new Set<object>();

  const walk = async (node: any): Promise<any> => {
    if (!node || typeof node !== "object") return node;

    if (seen.has(node as object)) return node;
    seen.add(node as object);

    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) node[i] = await walk(node[i]);
      return node;
    }

    for (const k of Object.keys(node)) node[k] = await walk(node[k]);

    // If this node is an asset object
    if (isFileAssetLike(node) && isTempKey(node.s3Key)) {
      const tempKey = node.s3Key;

      const cached = cache.get(tempKey);
      if (cached) return cached;

      const folder = guessBlogMediaFolder(node);
      const destPrefix = makeEntityFinalPrefix(ES3Namespace.BLOG_POSTS, postId, folder);
      const filename = tempKey.split("/").pop() || "file";
      const finalKey = keyJoin(destPrefix, filename);

      await moveS3Object({ fromKey: tempKey, toKey: finalKey });

      const finalized: IFileAsset = {
        ...node,
        s3Key: finalKey,
        url: publicUrlForKey(finalKey),
      };

      cache.set(tempKey, finalized);
      moved.push({ fromKey: tempKey, toKey: finalKey });

      return finalized;
    }

    // Patch common BlockNote shape: object has { asset, url }
    if (node.asset && isFileAssetLike(node.asset) && typeof node.url === "string") {
      node.url = node.asset.url;
    }

    return node;
  };

  const cloned = JSON.parse(JSON.stringify(input)) as T;
  return (await walk(cloned)) as T;
}

/**
 * Blog-post specific "all or nothing" finalization:
 * - finalizes bannerImage (if temp)
 * - deep-finalizes any IFileAsset-like objects inside BlockNote JSON
 * - returns updated { bannerImage, body } plus an internal rollback plan
 */
export async function finalizeBlogPostAssetsAllOrNothing(args: { postId: string; body: BlockNoteDocJSON; bannerImage?: IFileAsset }): Promise<{
  body: BlockNoteDocJSON;
  bannerImage?: IFileAsset;
  movedCount: number;
  rollback: () => Promise<void>;
}> {
  const moves: MovePair[] = [];

  try {
    let bannerImage = args.bannerImage;

    // Banner
    if (bannerImage?.s3Key && isTempKey(bannerImage.s3Key)) {
      const tempKey = bannerImage.s3Key;
      const dest = makeEntityFinalPrefix(ES3Namespace.BLOG_POSTS, args.postId, "banner");
      const filename = tempKey.split("/").pop() || "banner";
      const finalKey = keyJoin(dest, filename);

      await moveS3Object({ fromKey: tempKey, toKey: finalKey });
      moves.push({ fromKey: tempKey, toKey: finalKey });

      bannerImage = { ...bannerImage, s3Key: finalKey, url: publicUrlForKey(finalKey) };
    }

    // Body (deep)
    const body = await finalizeTempAssetsDeep({
      input: args.body,
      postId: args.postId,
      moved: moves,
    });

    return {
      body,
      bannerImage,
      movedCount: moves.length,
      rollback: async () => rollbackMoves(moves),
    };
  } catch (e) {
    if (moves.length) await rollbackMoves(moves);
    throw e;
  }
}

/* -------------------------------------------------------------------------- */
/* Asset cleanup helpers                                                      */
/* -------------------------------------------------------------------------- */

/** Delete S3 objects referenced by a post (banner + body). Best-effort. */
export async function deleteAllBlogPostAssets(args: { body?: unknown; bannerImage?: unknown }) {
  const keys = collectS3KeysDeep({ body: args.body, bannerImage: args.bannerImage });
  const finalKeys = keys.filter((k) => !isTempKey(k));
  await deleteS3Objects(finalKeys);
}

/** Delete assets that were removed between before/after (best-effort). */
export async function cleanupRemovedAssets(before: unknown, after: unknown) {
  const toDelete = diffS3KeysToDelete(before, after);
  if (toDelete.length) await deleteS3Objects(toDelete);
}
