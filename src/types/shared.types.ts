// src/types/shared.types.ts

export enum EFileMimeType {
  // Images
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  PNG = "image/png",
  WEBP = "image/webp",

  // Videos (blog media)
  MP4 = "video/mp4",
  WEBM = "video/webm",
  MOV = "video/quicktime",

  // Documents (kept for reuse elsewhere)
  PDF = "application/pdf",
  DOC = "application/msword",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

/**
 * Canonical MIME → file extension map.
 * Single source of truth for S3 keys, uploads, downloads, and validation.
 */
export const MIME_TO_EXT_MAP: Record<EFileMimeType, string> = {
  // Images
  [EFileMimeType.JPEG]: "jpeg",
  [EFileMimeType.JPG]: "jpg",
  [EFileMimeType.PNG]: "png",
  [EFileMimeType.WEBP]: "webp",

  // Videos
  [EFileMimeType.MP4]: "mp4",
  [EFileMimeType.WEBM]: "webm",
  [EFileMimeType.MOV]: "mov",

  // Documents
  [EFileMimeType.PDF]: "pdf",
  [EFileMimeType.DOC]: "doc",
  [EFileMimeType.DOCX]: "docx",
};

/** Grouped helpers (reusable everywhere) */
export const IMAGE_MIME_TYPES: readonly EFileMimeType[] = [
  EFileMimeType.JPEG,
  EFileMimeType.JPG,
  EFileMimeType.PNG,
  EFileMimeType.WEBP,
];

export const VIDEO_MIME_TYPES: readonly EFileMimeType[] = [
  EFileMimeType.MP4,
  EFileMimeType.WEBM,
  EFileMimeType.MOV,
];

/** Runtime helpers */
export const isImageMime = (mt?: string) =>
  typeof mt === "string" && mt.toLowerCase().startsWith("image/");

export const isVideoMime = (mt?: string) =>
  typeof mt === "string" && mt.toLowerCase().startsWith("video/");

/**
 * Generic file asset stored in S3.
 */
export type IFileAsset = {
  url: string;
  s3Key: string;
  mimeType: EFileMimeType | string;
  sizeBytes?: number;
  originalName?: string;
};

/**
 * Geolocation data structure.
 */
export interface IGeoLocation {
  country?: string; // Full country name (e.g., "Canada", "United States")
  region?: string; // State/Province (e.g., "Ontario", "California")
  city?: string; // City name (e.g., "Milton", "Los Angeles")
  timezone?: string;
  latitude?: number; // GPS latitude
  longitude?: number; // GPS longitude
}

/**
 * BlockNote document JSON.
 * Keep it flexible because BlockNote schema can evolve with plugins/blocks.
 */
export type BlockNoteDocJSON = Record<string, any>;
