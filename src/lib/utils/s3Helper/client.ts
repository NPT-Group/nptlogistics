// src/lib/utils/s3Helper/client.ts
"use client";

import type { IFileAsset } from "@/types/shared.types";
import { EFileMimeType } from "@/types/shared.types";
import type { ES3Folder, ES3Namespace } from "@/types/aws.types";

import { isTempKey } from "./shared";

/* ───────────────────────── Small helpers (client) ───────────────────────── */

function pickMessage(json: any, fallback: string) {
  return json?.message || json?.error?.message || fallback;
}

async function readJsonSafe(res: Response) {
  return res.json().catch(() => ({}));
}

/* ───────────────────────── Client-side presigned upload ───────────────────────── */

/**
 * Public-friendly upload returning an IFileAsset shape.
 */
export async function uploadToS3PresignedPublic(opts: {
  file: File;
  namespace: ES3Namespace;
  folder: ES3Folder;
  docId?: string;
  allowedMimeTypes: readonly EFileMimeType[];
  maxSizeMB?: number;
}): Promise<IFileAsset> {
  const { file, namespace, folder, docId, allowedMimeTypes, maxSizeMB = 10 } = opts;

  const mt = (file.type || "").toLowerCase() as EFileMimeType;
  if (!allowedMimeTypes.includes(mt)) {
    throw new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(", ")}`);
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size exceeds ${maxSizeMB}MB.`);
  }

  const res = await fetch("/api/v1/presign/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      namespace,
      folder,
      mimeType: mt,
      docId: (docId || "public").trim(),
      filesize: file.size,
      filename: file.name,
    }),
  });

  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to get presigned URL"));

  const data = (json?.data ?? json) as {
    key: string;
    url: string;
    publicUrl: string;
    expiresIn: number;
    mimeType: string;
  };

  const put = await fetch(data.url, {
    method: "PUT",
    headers: { "Content-Type": data.mimeType },
    body: file,
  });

  if (!put.ok) throw new Error("Failed to upload file to storage");

  return {
    url: data.publicUrl,
    s3Key: data.key,
    mimeType: data.mimeType,
    sizeBytes: file.size,
    originalName: file.name,
  };
}

/* ───────────────────────── Temp cleanup (client) ───────────────────────── */

/**
 * Delete temp S3 files via your API.
 * - Filters non-temp keys with `isTempKey`.
 * - No-ops if none remain.
 */
export async function deleteTempFiles(
  keys: string[],
): Promise<{ deleted?: string[]; failed?: string[] }> {
  if (!Array.isArray(keys) || keys.length === 0) return { deleted: [] };
  const tempKeys = keys.filter((k) => isTempKey(k));
  if (tempKeys.length === 0) return { deleted: [] };

  const res = await fetch("/api/v1/delete-temp-files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keys: tempKeys }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete temp files");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

/** Convenience: delete a single temp file if applicable. Returns true if deleted. */
export async function deleteTempFile(file?: IFileAsset): Promise<boolean> {
  if (!file?.s3Key || !isTempKey(file.s3Key)) return false;
  await deleteTempFiles([file.s3Key]);
  return true;
}

/* ───────────────────────── Presigned download (client) ───────────────────────── */

/**
 * Frontend helper to fetch a presigned GET URL that ALWAYS downloads.
 */
export async function getDownloadUrlFromS3Key({
  s3Key,
  filename,
  expiresIn,
}: {
  s3Key: string;
  filename?: string;
  expiresIn?: number;
}): Promise<string> {
  const res = await fetch("/api/v1/presign/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: s3Key, filename, expiresIn }),
  });

  if (!res.ok) {
    const { message } = await res.json().catch(() => ({ message: "" }));
    throw new Error(message || "Failed to get presigned download URL.");
  }

  const { data } = await res.json();
  return data.url as string;
}
