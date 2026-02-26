// src/lib/utils/s3Helper/server.ts

import {
  APP_AWS_ACCESS_KEY_ID,
  APP_AWS_BUCKET_NAME,
  APP_AWS_REGION,
  APP_AWS_SECRET_ACCESS_KEY,
} from "@/config/env";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DEFAULT_PRESIGN_EXPIRY_SECONDS } from "@/constants/aws";
import type { IFileAsset } from "@/types/shared.types";

import { isTempKey, keyJoin, trimSlashes } from "./shared";

/* ───────────────────────── S3 client (server-only) ───────────────────────── */

const s3 = new S3Client({
  region: APP_AWS_REGION,
  credentials: {
    accessKeyId: APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: APP_AWS_SECRET_ACCESS_KEY,
  },
});

/* ───────────────────────── URL helpers (server-config aware) ───────────────────────── */

/** Public URL for a given S3 key (no ACL change implied). */
export const publicUrlForKey = (key: string) =>
  `https://${APP_AWS_BUCKET_NAME}.s3.${APP_AWS_REGION}.amazonaws.com/${trimSlashes(key)}`;

/* ───────────────────────── Core ops (server-only) ───────────────────────── */

/** Put a small binary directly (server-side). Prefer presigned uploads for browsers. */
export async function uploadBinaryToS3({
  fileBuffer,
  fileType,
  folder, // full prefix path without trailing slash
}: {
  fileBuffer: Buffer;
  fileType: string;
  folder: string;
}): Promise<{ url: string; key: string }> {
  const extension = (fileType.split("/")[1] || "bin").toLowerCase();
  const key = `${trimSlashes(folder)}/${uuidv4()}.${extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: APP_AWS_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: fileType,
    }),
  );

  return { url: publicUrlForKey(key), key };
}

/** Batch delete using S3 DeleteObjects (handles up to 1000 keys per call). */
export async function deleteS3Objects(keys: string[]): Promise<void> {
  if (!Array.isArray(keys) || keys.length === 0) return;

  const Bucket = APP_AWS_BUCKET_NAME;
  const CHUNK = 1000;

  for (let i = 0; i < keys.length; i += CHUNK) {
    const slice = keys.slice(i, i + CHUNK).map((Key) => ({ Key }));

    try {
      const res = await s3.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: slice, Quiet: true },
        }),
      );

      if (res.Errors && res.Errors.length) {
        for (const err of res.Errors) {
          console.error(`Failed to delete S3 object: ${err?.Key} (${err?.Code} ${err?.Message})`);
        }
      }
    } catch (err: any) {
      console.error(
        `DeleteObjects batch failed (${i}-${i + slice.length - 1}):`,
        err?.name,
        err?.message,
        err,
      );
    }
  }
}

/** Move via copy+delete (S3 has no native move). */
export async function moveS3Object({
  fromKey,
  toKey,
}: {
  fromKey: string;
  toKey: string;
}): Promise<{ url: string; key: string }> {
  const Bucket = APP_AWS_BUCKET_NAME;

  await s3.send(
    new CopyObjectCommand({
      Bucket,
      CopySource: `${Bucket}/${fromKey}`,
      Key: toKey,
    }),
  );
  await s3.send(new DeleteObjectCommand({ Bucket, Key: fromKey }));

  return { url: publicUrlForKey(toKey), key: toKey };
}

/** HEAD request to see if an object exists. */
export async function s3ObjectExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: APP_AWS_BUCKET_NAME, Key: key }));
    return true;
  } catch (err: any) {
    if (err?.name === "NotFound") return false;
    console.error("S3 existence check failed:", err);
    return false;
  }
}

/** Server-side: create a presigned PUT URL for the exact key + Content-Type. */
export async function getPresignedPutUrl({
  key,
  fileType,
  expiresIn = DEFAULT_PRESIGN_EXPIRY_SECONDS,
}: {
  key: string;
  fileType: string;
  expiresIn?: number;
}): Promise<{ url: string }> {
  const command = new PutObjectCommand({
    Bucket: APP_AWS_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn });
  return { url };
}

/* ───────────────────────── Bytes helpers (server) ───────────────────────── */

async function fetchBytesFromUrl(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch object: ${res.status} ${res.statusText}`);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

async function getS3ObjectBytes(key: string): Promise<Uint8Array> {
  const out = await s3.send(new GetObjectCommand({ Bucket: APP_AWS_BUCKET_NAME, Key: key }));
  const body: any = out.Body;

  if (body?.transformToByteArray) return await body.transformToByteArray();

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    body.on("data", (d: Buffer) => chunks.push(d));
    body.on("end", () => resolve());
    body.on("error", reject);
  });
  return new Uint8Array(Buffer.concat(chunks));
}

/**
 * Load image bytes from an asset (for PDF embedding, etc.).
 * Keep this for image workflows only. If you need generic bytes, add another helper.
 */
export async function loadImageBytesFromAsset(asset?: IFileAsset): Promise<Uint8Array> {
  if (!asset) throw new Error("Asset is undefined");
  if (asset.s3Key) return getS3ObjectBytes(asset.s3Key);
  if (asset.url) return fetchBytesFromUrl(asset.url);
  throw new Error("Asset is missing both s3Key and url");
}

/* ───────────────────────── Finalization helpers (server) ───────────────────────── */

/** True if asset is already final (or empty). */
export const isFinalOrEmptyAsset = (asset?: IFileAsset) => !asset?.s3Key || !isTempKey(asset.s3Key);

/**
 * Move a temp asset to a final folder prefix and return the updated asset.
 * `finalFolder` should be a full prefix, e.g. makeFinalPrefix(namespace, id, folder)
 */
export async function finalizeAsset(asset: IFileAsset, finalFolder: string): Promise<IFileAsset> {
  if (!asset?.s3Key) throw new Error("Missing s3Key in file asset");
  if (!asset.mimeType) throw new Error("Missing mimeType in file asset");

  if (!isTempKey(asset.s3Key)) return asset;

  const filename = asset.s3Key.split("/").pop();
  const finalKey = keyJoin(finalFolder, filename!);

  const moved = await moveS3Object({ fromKey: asset.s3Key, toKey: finalKey });
  return { ...asset, s3Key: moved.key, url: moved.url };
}

/** Safe wrapper that tolerates undefined asset. */
export async function finalizeAssetSafe(
  asset: IFileAsset | undefined,
  finalFolder: string,
): Promise<IFileAsset | undefined> {
  if (!asset) return asset;
  return finalizeAsset(asset, finalFolder);
}

/** Finalize a vector of assets (only those that are temp). */
export async function finalizeAssetVector(
  vec: IFileAsset[] | undefined,
  dest: string,
): Promise<IFileAsset[] | undefined> {
  if (!Array.isArray(vec)) return vec;
  const out: IFileAsset[] = [];
  for (const a of vec) out.push(isTempKey(a?.s3Key) ? await finalizeAsset(a, dest) : a);
  return out;
}

/**
 * Cache-aware single-asset finalizer (generic).
 */
export async function finalizeAssetWithCache(
  asset: IFileAsset | undefined,
  finalFolder: string,
  cache: Map<string, IFileAsset>,
  onMoved?: (finalKey: string) => void,
): Promise<IFileAsset | undefined> {
  if (!asset?.s3Key) return asset;
  if (!isTempKey(asset.s3Key)) return asset;

  const cached = cache.get(asset.s3Key);
  if (cached) return cached;

  const moved = await finalizeAsset(asset, finalFolder);
  cache.set(asset.s3Key, moved);
  onMoved?.(moved.s3Key);
  return moved;
}

/**
 * Cache-aware vector finalizer (generic).
 */
export async function finalizeVectorWithCache(
  vec: IFileAsset[] | undefined,
  dest: string,
  cache: Map<string, IFileAsset>,
  onMoved?: (finalKey: string) => void,
): Promise<IFileAsset[]> {
  if (!Array.isArray(vec)) return [];
  const out: IFileAsset[] = [];
  for (const a of vec) {
    const finalized = await finalizeAssetWithCache(a, dest, cache, onMoved);
    out.push(finalized ?? a);
  }
  return out;
}

/* ───────────────────────── Presigned GET download (server) ───────────────────────── */

function sanitizeDownloadName(name: string): string {
  return name.replace(/["<>:\\|?*\n\r\t]+/g, "").trim();
}

function getExtFromKey(key: string): string | undefined {
  const base = key.split("/").pop() || "";
  const dot = base.lastIndexOf(".");
  if (dot > 0 && dot < base.length - 1) return base.slice(dot + 1);
  return undefined;
}

function ensureExtension(filename: string, key: string): string {
  if (/\.[A-Za-z0-9]+$/.test(filename)) return filename;
  const ext = getExtFromKey(key);
  return ext ? `${filename}.${ext}` : filename;
}

/**
 * Generate a presigned GET URL that downloads with a stable filename (with extension)
 * and the object's original Content-Type when available.
 */
export async function getPresignedGetUrl({
  key,
  filename,
  disposition = "attachment",
  expiresIn = DEFAULT_PRESIGN_EXPIRY_SECONDS,
}: {
  key: string;
  filename?: string;
  disposition?: "inline" | "attachment";
  expiresIn?: number;
}): Promise<{ url: string }> {
  let storedContentType: string | undefined;
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: APP_AWS_BUCKET_NAME, Key: key }));
    storedContentType = head.ContentType || undefined;
  } catch {
    // best-effort
  }

  const baseName = sanitizeDownloadName(filename || key.split("/").pop() || "download");
  const finalName = ensureExtension(baseName, key);
  const encoded = encodeURIComponent(finalName);

  const contentDisposition = `${disposition}; filename="${finalName}"; filename*=UTF-8''${encoded}`;
  const responseContentType = storedContentType || "application/octet-stream";

  const command = new GetObjectCommand({
    Bucket: APP_AWS_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: contentDisposition,
    ResponseContentType: responseContentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn });
  return { url };
}
