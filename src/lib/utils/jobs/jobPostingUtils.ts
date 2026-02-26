// src/lib/utils/jobs/jobPostingUtils.ts
import type { IFileAsset } from "@/types/shared.types";
import type { BlockNoteDocJSON } from "@/types/shared.types";
import { slugify, trim } from "@/lib/utils/stringUtils";
import {
  makeEntityFinalPrefix,
  diffS3KeysToDelete,
  normalizeFileAsset,
} from "@/lib/utils/s3Helper";
import {
  finalizeAssetWithCache,
  deleteS3Objects,
  publicUrlForKey,
} from "@/lib/utils/s3Helper/server";
import { ES3Namespace, ES3Folder } from "@/types/aws.types";
import { JobPostingModel } from "@/mongoose/models/JobPosting";
import {
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
  EFileMimeType,
  MIME_TO_EXT_MAP,
} from "@/types/shared.types";

const normalize = (asset: any) => normalizeFileAsset(asset, publicUrlForKey);

/** Ensure unique slug for JobPosting collection. */
export async function ensureUniqueJobSlug(requested: string): Promise<string> {
  const base = slugify(trim(requested) || "job");
  let candidate = base;
  let i = 1;

  while (await JobPostingModel.exists({ slug: candidate })) {
    i += 1;
    candidate = `${base}-${i}`;
    if (candidate.length > 140) candidate = candidate.slice(0, 140);
  }

  return candidate;
}

function isLikelyFileAsset(v: any): v is IFileAsset {
  return Boolean(
    v &&
    typeof v === "object" &&
    typeof v.s3Key === "string" &&
    typeof v.url === "string" &&
    (typeof v.mimeType === "string" || v.mimeType == null),
  );
}

// helper: decide folder by mimeType
function folderForJobMediaAsset(asset: IFileAsset): ES3Folder {
  const mt = String(asset.mimeType || "").toLowerCase() as EFileMimeType;

  // Prefer explicit video match first
  if (mt.startsWith("video/") || VIDEO_MIME_TYPES.includes(mt)) return ES3Folder.MEDIA_VIDEOS;

  // Then images
  if (mt.startsWith("image/") || IMAGE_MIME_TYPES.includes(mt)) return ES3Folder.MEDIA_IMAGES;

  // If something odd slips through, keep it in images (or throw if you prefer strictness)
  return ES3Folder.MEDIA_IMAGES;
}

// invert MIME_TO_EXT_MAP for ext->mime inference
const EXT_TO_MIME: Record<string, EFileMimeType> = Object.entries(MIME_TO_EXT_MAP).reduce(
  (acc, [mime, ext]) => {
    acc[ext] = mime as EFileMimeType;
    return acc;
  },
  {} as Record<string, EFileMimeType>,
);

function tryParseS3KeyFromUrl(u: string): string | undefined {
  try {
    const url = new URL(u);
    if (!url.hostname.toLowerCase().includes("amazonaws.com")) return;
    const key = url.pathname.replace(/^\/+/, "").trim();
    return key || undefined;
  } catch {
    return;
  }
}

function inferMimeFromKey(key: string): string | undefined {
  const base = key.split("/").pop() || "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot >= base.length - 1) return undefined;
  const ext = base.slice(dot + 1).toLowerCase();
  return EXT_TO_MIME[ext] || undefined;
}

// --- cycle-safe deep transforms ---
function stripPutUrlDeep<T>(input: T): T {
  const seen = new WeakSet<object>();

  const walk = (v: any): any => {
    if (!v || typeof v !== "object") return v;

    if (v instanceof Date) return v;
    if (v instanceof RegExp) return v;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(v)) return v;

    if (seen.has(v)) return v;
    seen.add(v);

    if (Array.isArray(v)) return v.map(walk);

    // if it's an asset, normalize (removes putUrl + flattens)
    if (isLikelyFileAsset(v)) return normalize(v) ?? v;

    const out: any = { ...v };
    if ("putUrl" in out) delete out.putUrl;

    for (const k of Object.keys(out)) out[k] = walk(out[k]);

    if (out.asset && typeof out.asset === "object") {
      const norm = normalize(out.asset);
      if (norm) out.asset = norm;
      if ("putUrl" in out.asset) delete out.asset.putUrl;
    }

    return out;
  };

  return walk(input);
}

function hydrateAssetFromUrlDeep<T>(input: T): T {
  const seen = new WeakSet<object>();

  const walk = (v: any): any => {
    if (!v || typeof v !== "object") return v;

    if (v instanceof Date) return v;
    if (v instanceof RegExp) return v;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(v)) return v;

    if (seen.has(v)) return v;
    seen.add(v);

    if (Array.isArray(v)) return v.map(walk);

    // LEAF: if it's already an asset, normalize it and stop
    if (isLikelyFileAsset(v)) {
      return normalize(v) ?? v;
    }

    const out: any = { ...v };

    // recurse children
    for (const k of Object.keys(out)) out[k] = walk(out[k]);

    // If this object has an `asset`, normalize it (and flatten)
    if (out.asset && typeof out.asset === "object") {
      const norm = normalize(out.asset);
      if (norm) out.asset = norm;
      if ("putUrl" in out.asset) delete out.asset.putUrl;
    }

    // If it has a url but no asset, infer a minimal asset
    if (typeof out.url === "string" && out.url && !out.asset) {
      const inferredKey = tryParseS3KeyFromUrl(out.url);
      if (inferredKey) {
        out.asset = normalize({
          s3Key: inferredKey,
          url: publicUrlForKey(inferredKey),
          mimeType: inferMimeFromKey(inferredKey) || "application/octet-stream",
        });
      }
    }

    // If it has an asset, props.url should match asset.url
    if (out.asset && typeof out.asset === "object" && typeof out.asset.url === "string") {
      out.url = out.asset.url;
    }

    return out;
  };

  return walk(input);
}

/**
 * Finalize temp assets found inside an arbitrary JSON doc (BlockNote doc).
 * - Walks the object graph
 * - Replaces any IFileAsset with temp s3Key by moving to final
 */
export async function finalizeJobDocAssetsAllOrNothing({
  jobId,
  description,
  coverImage,
}: {
  jobId: string;
  description: BlockNoteDocJSON;
  coverImage?: IFileAsset;
}) {
  const cache = new Map<string, IFileAsset>();
  const movedFinalKeys: string[] = [];
  const onMoved = (finalKey: string) => movedFinalKeys.push(finalKey);

  const finalImagesFolder = makeEntityFinalPrefix(ES3Namespace.JOBS, jobId, ES3Folder.MEDIA_IMAGES);
  const finalVideosFolder = makeEntityFinalPrefix(ES3Namespace.JOBS, jobId, ES3Folder.MEDIA_VIDEOS);

  // 1) normalize incoming doc:
  // - re-add missing asset based on url
  // - ensure mimeType exists
  // - strip putUrl everywhere
  const normalizedInputDesc = stripPutUrlDeep(hydrateAssetFromUrlDeep(description));
  const normalizedCover = stripPutUrlDeep(coverImage);

  const seen = new Set<object>();

  async function walk(v: any): Promise<any> {
    if (!v || typeof v !== "object") return v;
    if (seen.has(v)) return v;
    seen.add(v);

    if (Array.isArray(v)) {
      const out = [];
      for (const item of v) out.push(await walk(item));
      return out;
    }

    if (isLikelyFileAsset(v)) {
      const folder = folderForJobMediaAsset(v);
      const dest = folder === ES3Folder.MEDIA_VIDEOS ? finalVideosFolder : finalImagesFolder;

      const finalized = await finalizeAssetWithCache(v, dest, cache, onMoved);
      const out = finalized ?? v;

      // clamp: if s3Key exists, url MUST be derived from it (prevents temp url lingering)
      if (out?.s3Key) {
        out.url = publicUrlForKey(out.s3Key);
      }

      // ensure no nested asset chains survive
      if ((out as any)?.asset) delete (out as any).asset;

      return out;
    }

    const out: Record<string, any> = { ...v };
    for (const k of Object.keys(out)) out[k] = await walk(out[k]);

    // Keep BlockNote url in sync with asset.url post-finalize
    if (
      typeof out.url === "string" &&
      isLikelyFileAsset(out.asset) &&
      typeof out.asset.url === "string" &&
      out.asset.url
    ) {
      out.url = out.asset.url;
    }

    return out;
  }

  const nextDescription = (await walk(normalizedInputDesc)) as BlockNoteDocJSON;

  // cover image (always images)
  const nextCover = await finalizeAssetWithCache(
    normalizedCover as any,
    finalImagesFolder,
    cache,
    onMoved,
  );

  if (nextCover?.s3Key) nextCover.url = publicUrlForKey(nextCover.s3Key);
  if ((nextCover as any)?.asset) delete (nextCover as any).asset;

  async function rollback() {
    if (!movedFinalKeys.length) return;
    try {
      await deleteS3Objects(movedFinalKeys);
    } catch (e) {
      console.warn("Job assets rollback failed:", e);
    }
  }

  return {
    description: nextDescription,
    coverImage: nextCover,
    movedCount: movedFinalKeys.length,
    rollback,
  };
}

/** Best-effort cleanup of removed (final) assets when updating. */
export async function cleanupRemovedJobAssets(before: unknown, after: unknown): Promise<void> {
  const keys = diffS3KeysToDelete(before, after);
  if (!keys.length) return;
  await deleteS3Objects(keys);
}
