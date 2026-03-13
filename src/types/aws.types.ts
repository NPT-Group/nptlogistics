// src/types/aws.types.ts
import { EFileMimeType } from "./shared.types";

/** High-level “bucket namespaces” you can extend any time. */
export enum ES3Namespace {
  BLOG_POSTS = "blog-posts",
  JOBS = "jobs",
  QUOTES = "quotes",
  CONTACT_INQUIRIES = "contact-inquiries",
}

/**
 * Logical folder fragments (NO namespace or IDs).
 * IMPORTANT: these are relative fragments appended under:
 *   temp-files/{namespace}/{docId?}/{folder}/...
 * and finalized under:
 *   submissions/{namespace}/{entityId}/{folder}/...
 */
export enum ES3Folder {
  // Shared
  MEDIA_IMAGES = "media/images",
  MEDIA_VIDEOS = "media/videos",
  ATTACHMENTS = "attachments",

  // Jobs
  JOB_APPLICATION_RESUMES = "applications/resumes",
  JOB_APPLICATION_PHOTOS = "applications/photos",
}

export interface IPresignRequest {
  namespace: ES3Namespace;
  folder: ES3Folder;
  filename?: string;
  mimeType: EFileMimeType;
  docId?: string;
  filesize?: number;
}

export interface IPresignResponse {
  key: string;
  url: string;
  publicUrl: string;
  expiresIn: number;
  mimeType: EFileMimeType;
}
