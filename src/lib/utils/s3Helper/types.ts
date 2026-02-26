// src/lib/utils/s3Helper/types.ts

import type { EFileMimeType } from "@/types/shared.types";
import type { ES3Folder, ES3Namespace } from "@/types/aws.types";

export interface UploadToS3Options {
  file: File;
  namespace: ES3Namespace;
  folder: ES3Folder;
  docId?: string;
  allowedMimeTypes?: readonly EFileMimeType[];
  maxSizeMB?: number;
}
