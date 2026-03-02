// src/lib/utils/s3Helper/shared.ts

import { S3_SUBMISSIONS_FOLDER, S3_TEMP_FOLDER } from "@/constants/aws";
import type { IFileAsset } from "@/types/shared.types";

/* ───────────────────────── Key helpers (pure) ───────────────────────── */

/** Strip leading/trailing slashes. */
export const trimSlashes = (p: string) => p.replace(/^\/+|\/+$/g, "");

/** Join path parts safely, trimming slashes on each segment. */
export const keyJoin = (...parts: Array<string | null | undefined>) =>
  parts
    .filter((p) => typeof p === "string" && p.length > 0)
    .map((p) => trimSlashes(String(p)))
    .join("/");

/** Is this a temp object? (Namespace-agnostic) */
export const isTempKey = (key?: string) =>
  Boolean(key && trimSlashes(key).startsWith(trimSlashes(`${S3_TEMP_FOLDER}/`)));

/** Build a temp prefix with arbitrary subfolders. */
export const makeTempPrefix = (...parts: string[]) => keyJoin(S3_TEMP_FOLDER, ...parts);

/** Build a submissions (final) prefix with arbitrary subfolders. */
export const makeFinalPrefix = (...parts: string[]) => keyJoin(S3_SUBMISSIONS_FOLDER, ...parts);

/** Convenience: make a final prefix for any entity (namespace/id/folder). */
export const makeEntityFinalPrefix = (namespace: string, id: string, folder: string) =>
  makeFinalPrefix(namespace, id, folder);

/* ───────────────────────── URL helpers (pure) ───────────────────────── */

/**
 * S3 URL Parser
 * Extracts the S3 object key from various S3 URL formats
 */
export function tryParseS3KeyFromUrl(u: string): string | undefined {
  try {
    const url = new URL(u);

    // Handles: https://bucket.s3.region.amazonaws.com/<key>
    // Also works for most S3 virtual-host style URLs.
    const host = url.hostname.toLowerCase();
    if (!host.includes("amazonaws.com")) return;

    const key = url.pathname.replace(/^\/+/, "").trim();
    return key || undefined;
  } catch {
    return;
  }
}

/**
 * Recursively collects all S3 keys from a given input object or data structure.
 * - Directly from `s3Key` string fields
 * - By parsing S3 keys from `url` fields that point to S3 resources
 */
export function collectS3KeysDeep(input: unknown): string[] {
  const out = new Set<string>();
  const seen = new Set<object>();

  const walk = (v: unknown) => {
    if (!v || typeof v !== "object") return;

    if (seen.has(v as object)) return;
    seen.add(v as object);

    if (Array.isArray(v)) {
      for (const item of v) walk(item);
      return;
    }

    const obj = v as Record<string, unknown>;

    const maybeKey = obj["s3Key"];
    if (typeof maybeKey === "string") {
      const k = maybeKey.trim();
      if (k) out.add(k);
    }

    const maybeUrl = obj["url"];
    if (typeof maybeUrl === "string" && maybeUrl) {
      const k = tryParseS3KeyFromUrl(maybeUrl);
      if (k) out.add(k);
    }

    for (const key of Object.keys(obj)) walk(obj[key]);
  };

  walk(input);
  return Array.from(out);
}

/**
 * Diff two arbitrary objects and return S3 keys present in `before` but missing in `after`.
 * - Uses `collectS3KeysDeep` to find all keys in both objects.
 * - Excludes temp keys via `isTempKey`.
 */
export function diffS3KeysToDelete(before: unknown, after: unknown): string[] {
  const beforeKeys = new Set(collectS3KeysDeep(before));
  const afterKeys = new Set(collectS3KeysDeep(after));

  const out: string[] = [];
  for (const k of beforeKeys) {
    if (!afterKeys.has(k) && !isTempKey(k)) out.push(k);
  }
  return out;
}

/* ───────────────────────── Asset normalization (pure) ───────────────────────── */

function isObject(v: unknown): v is Record<string, any> {
  return Boolean(v && typeof v === "object");
}

export function isLikelyFileAsset(v: any): v is IFileAsset {
  return Boolean(
    v &&
    typeof v === "object" &&
    typeof v.s3Key === "string" &&
    typeof v.url === "string" &&
    (typeof v.mimeType === "string" || v.mimeType == null),
  );
}

/**
 * Normalize an asset object:
 * - Flattens nested `asset.asset.asset...`
 * - Ensures `url` always matches `publicUrlForKey(s3Key)` when s3Key exists
 * - Removes putUrl
 *
 * NOTE: This function depends on `publicUrlForKey`, which is server-config aware,
 * so it is exported from `server.ts`. This file keeps only the pure helpers.
 */
export function normalizeFileAsset(
  asset: any,
  publicUrlForKey: (k: string) => string,
): IFileAsset | undefined {
  if (!isObject(asset)) return undefined;

  let out: any = { ...asset };

  if ("putUrl" in out) delete out.putUrl;

  let cur: any = out;
  while (isObject(cur.asset)) {
    const inner = cur.asset;

    if (isObject(inner) && "putUrl" in inner) delete (inner as any).putUrl;

    const outerKey = typeof cur.s3Key === "string" ? cur.s3Key : undefined;
    const innerKey = typeof inner.s3Key === "string" ? inner.s3Key : undefined;

    const outerFinal = outerKey && !isTempKey(outerKey);
    const innerFinal = innerKey && !isTempKey(innerKey);

    const bestKey =
      (outerFinal ? outerKey : undefined) ||
      (innerFinal ? innerKey : undefined) ||
      outerKey ||
      innerKey;

    cur = {
      ...inner,
      ...cur,
      s3Key: bestKey,
    };

    out = cur;
    if ("asset" in out) delete out.asset;
  }

  if (typeof out.s3Key === "string" && out.s3Key) {
    out.url = publicUrlForKey(out.s3Key);
  }

  if ("asset" in out) delete out.asset;

  return out as IFileAsset;
}
