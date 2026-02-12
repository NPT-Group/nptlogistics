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

  const finalMediaFolder = makeEntityFinalPrefix(ES3Namespace.JOBS, jobId, ES3Folder.MEDIA_IMAGES);

  // Deep walk + replace
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

    // If it looks like a file asset, finalize it
    if (isLikelyFileAsset(v)) {
      const finalized = await finalizeAssetWithCache(v, finalMediaFolder, cache, onMoved);
      return finalized ?? v;
    }

    const out: Record<string, any> = { ...v };
    for (const k of Object.keys(out)) {
      out[k] = await walk(out[k]);
    }
    return out;
  }

  const nextDescription = (await walk(description)) as BlockNoteDocJSON;

  // cover image: finalize to images folder as well
  const nextCover = await finalizeAssetWithCache(coverImage, finalMediaFolder, cache, onMoved);

  async function rollback() {
    // best-effort rollback of moved objects (delete finals). (Only keys we moved.)
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
