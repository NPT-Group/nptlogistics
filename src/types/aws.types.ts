// src/types/aws.types.ts
import { EFileMimeType } from "./shared.types";

/** High-level “bucket namespaces” you can extend any time. */
export enum ES3Namespace {
  BLOG_POSTS = "blog-posts",
}

/**
 * Logical folder fragments (NO namespace or IDs).
 * For NPT Logistics, we currently only support blog media uploads.
 */
export enum ES3Folder {
  BLOG_MEDIA_IMAGES = "media/images",
  BLOG_MEDIA_VIDEOS = "media/videos",
}

export interface IPresignRequest {
  /** Top-level namespace (e.g., "blogs"). */
  namespace: ES3Namespace;

  /** Folder fragment (no namespace/id inside). */
  folder: ES3Folder;

  /** Optional client-suggested filename (server still appends a UUID). */
  filename?: string;

  /** Content-Type (e.g., "image/jpeg", "video/mp4"). */
  mimeType: EFileMimeType;

  /**
   * Optional entity id (e.g., blogPostId).
   * Typical shapes (server-side convention):
   *  - with id:    temp-files/blogs/{docId}/{folder}/{file}
   *  - without id: temp-files/blogs/{folder}/{file}
   */
  docId?: string;

  /** Optional size guard in bytes (the API will validate). */
  filesize?: number;
}

export interface IPresignResponse {
  /** Resolved S3 key (relative path in the bucket). */
  key: string;

  /** One-time upload URL. */
  url: string;

  /** Public or signed-access URL to use in IFileAsset.url. */
  publicUrl: string;

  /** Expiry in seconds for the presigned URL. */
  expiresIn: number;

  /** Echoed/normalized MIME type. */
  mimeType: EFileMimeType;
}
