// src/lib/utils/files/mime.ts
import { MIME_TO_EXT_MAP, EFileMimeType } from "@/types/shared.types";

/** Normalize "text/csv; charset=utf-8" -> "text/csv" */
export function normalizeMimeType(mime?: string): string {
  return String(mime || "")
    .trim()
    .toLowerCase()
    .split(";")[0]
    .trim();
}

/**
 * Canonical ext from MIME using the single source of truth map.
 * Returns "" if unknown.
 */
export function extFromMime(mime?: string): string {
  const m = normalizeMimeType(mime);

  // Direct hit (preferred)
  if (m && (m as EFileMimeType) in MIME_TO_EXT_MAP) {
    return MIME_TO_EXT_MAP[m as EFileMimeType];
  }

  return "";
}

/**
 * Pick a filename for Graph attachment:
 * - prefer asset-provided name fields
 * - else fallback to `${fallbackBase}.${ext}` (if ext known)
 * - else just fallbackBase
 */
export function filenameForAsset(asset: any, fallbackBase: string, fallbackMime?: string): string {
  const raw =
    asset?.filename || asset?.originalName || asset?.originalFilename || asset?.name || "";

  if (raw && typeof raw === "string") return raw;

  const ext = extFromMime(fallbackMime || asset?.mimeType);
  return ext ? `${fallbackBase}.${ext}` : fallbackBase;
}
