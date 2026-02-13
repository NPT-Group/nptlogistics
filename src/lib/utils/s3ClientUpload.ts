"use client";

import type { IFileAsset } from "@/types/shared.types";
import { EFileMimeType } from "@/types/shared.types";
import { ES3Folder, ES3Namespace } from "@/types/aws.types";

type PresignResponse = {
  key: string;
  url: string;
  publicUrl: string;
  expiresIn: number;
  mimeType: string;
};

function pickMessage(json: any, fallback: string) {
  return json?.message || json?.error?.message || fallback;
}

async function readJsonSafe(res: Response) {
  return res.json().catch(() => ({}));
}

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

  const data = (json?.data ?? json) as PresignResponse;

  // PUT must use the signed Content-Type
  const put = await fetch(data.url, {
    method: "PUT",
    headers: { "Content-Type": data.mimeType },
    body: file,
  });

  if (!put.ok) throw new Error("Failed to upload file to storage");

  const asset: IFileAsset = {
    url: data.publicUrl,
    s3Key: data.key,
    mimeType: data.mimeType,
    sizeBytes: file.size,
    originalName: file.name,
  };

  return asset;
}
