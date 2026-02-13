// src/lib/utils/jobs/jobPostingUtils.ts
import type { IFileAsset } from "@/types/shared.types";
import type { BlockNoteDocJSON } from "@/types/shared.types";
import { slugify, trim } from "@/lib/utils/stringUtils";
import {
  finalizeAssetWithCache,
  makeEntityFinalPrefix,
  diffS3KeysToDelete,
  deleteS3Objects,
} from "@/lib/utils/s3Helper";
import { ES3Namespace, ES3Folder } from "@/types/aws.types";
import { JobPostingModel } from "@/mongoose/models/JobPosting";

// ✅ add these imports
import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES, EFileMimeType } from "@/types/shared.types";

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
    typeof v.mimeType === "string",
  );
}

// ✅ helper: decide folder by mimeType
function folderForJobMediaAsset(asset: IFileAsset): ES3Folder {
  const mt = String(asset.mimeType || "").toLowerCase() as EFileMimeType;

  // Prefer explicit video match first
  if (mt.startsWith("video/") || VIDEO_MIME_TYPES.includes(mt)) return ES3Folder.MEDIA_VIDEOS;

  // Then images
  if (mt.startsWith("image/") || IMAGE_MIME_TYPES.includes(mt)) return ES3Folder.MEDIA_IMAGES;

  // If something odd slips through, keep it in images (or throw if you prefer strictness)
  return ES3Folder.MEDIA_IMAGES;
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
}): Promise<{
  description: BlockNoteDocJSON;
  coverImage?: IFileAsset;
  movedCount: number;
  rollback: () => Promise<void>;
}> {
  const cache = new Map<string, IFileAsset>();
  const movedFinalKeys: string[] = [];
  const onMoved = (finalKey: string) => movedFinalKeys.push(finalKey);

  // ✅ build both final destinations once
  const finalImagesFolder = makeEntityFinalPrefix(ES3Namespace.JOBS, jobId, ES3Folder.MEDIA_IMAGES);
  const finalVideosFolder = makeEntityFinalPrefix(ES3Namespace.JOBS, jobId, ES3Folder.MEDIA_VIDEOS);

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
      return finalized ?? v;
    }

    const out: Record<string, any> = { ...v };
    for (const k of Object.keys(out)) {
      out[k] = await walk(out[k]);
    }

    // ✅ IMPORTANT: BlockNote blocks store the render URL separately from the asset object.
    // If an object has both { url, asset }, ensure url tracks asset.url (finalized).
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

  const nextDescription = (await walk(description)) as BlockNoteDocJSON;

  // cover image: always images
  const nextCover = await finalizeAssetWithCache(coverImage, finalImagesFolder, cache, onMoved);

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
