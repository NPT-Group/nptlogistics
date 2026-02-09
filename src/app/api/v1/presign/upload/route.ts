// src/app/api/v1/presign/upload/route.ts

import { NextRequest } from "next/server";
import { randomUUID } from "crypto";

import { ES3Namespace, ES3Folder, IPresignRequest, IPresignResponse } from "@/types/aws.types";
import { EFileMimeType, MIME_TO_EXT_MAP, IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "@/types/shared.types";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { getPresignedPutUrl } from "@/lib/utils/s3Helper";
import { APP_AWS_BUCKET_NAME, APP_AWS_REGION } from "@/config/env";
import { DEFAULT_FILE_SIZE_LIMIT_MB, S3_TEMP_FOLDER } from "@/constants/aws";

// Runtime enum value check helper
function isEnumValue<T extends object>(enm: T, value: unknown): value is T[keyof T] {
  return Object.values(enm).includes(value as any);
}

// src/app/api/v1/presign/upload/route.ts
/**
 * Presign Upload API — Blog Media (NPT Logistics)
 *
 * Purpose:
 *   Generates short-lived presigned S3 PUT URLs for uploading
 *   blog media assets (images and videos only).
 *
 * Supported Namespace:
 *   - ES3Namespace.BLOGS
 *
 * Supported Folders & File Types:
 *   - ES3Folder.BLOG_MEDIA_IMAGES
 *       Allowed MIME types:
 *         image/jpeg, image/jpg, image/png, image/webp
 *
 *   - ES3Folder.BLOG_MEDIA_VIDEOS
 *       Allowed MIME types:
 *         video/mp4, video/webm, video/quicktime
 *
 * Validation Rules:
 *   - Namespace must be BLOGS
 *   - Folder must be a valid ES3Folder value
 *   - MIME type must match the allowed list for the folder
 *   - Optional file size is validated against a global MB limit
 *
 * S3 Key Structure (temporary storage):
 *   - With docId (blogPostId):
 *       temp-files/blogs/{docId}/{folder}/{timestamp-uuid}.{ext}
 *
 *   - Without docId:
 *       temp-files/blogs/{folder}/{timestamp-uuid}.{ext}
 *
 * Notes:
 *   - MIME → extension resolution is centralized in shared.types.ts
 *   - Returned publicUrl can be stored directly in IFileAsset.url
 *   - Uploaded files are expected to be finalized/moved after publish
 */

export async function POST(req: NextRequest) {
  try {
    const body = await parseJsonBody<IPresignRequest>(req);
    const { namespace, folder, mimeType, filesize } = body || {};
    const docId = body?.docId?.trim();

    // Required fields
    if (!namespace || !folder || !mimeType) {
      return errorResponse(400, "Missing required fields: namespace, folder or mimeType");
    }

    // Only BLOG_POSTS namespace supported
    if (namespace !== ES3Namespace.BLOG_POSTS) {
      return errorResponse(400, `Namespace not configured: ${namespace}`);
    }

    // Runtime folder validation
    if (!isEnumValue(ES3Folder, folder)) {
      return errorResponse(400, `Invalid folder. Must be one of: ${Object.values(ES3Folder).join(", ")}`);
    }

    // Normalize mime type
    const normalizedMime = (mimeType as string).toLowerCase() as EFileMimeType;

    // Allowed mime types per folder
    const allowedMime: readonly EFileMimeType[] = folder === ES3Folder.BLOG_MEDIA_IMAGES ? IMAGE_MIME_TYPES : folder === ES3Folder.BLOG_MEDIA_VIDEOS ? VIDEO_MIME_TYPES : [];

    if (!allowedMime.includes(normalizedMime)) {
      return errorResponse(400, `Invalid file type for folder "${folder}". Allowed: ${allowedMime.join(", ")}`);
    }

    // Extension from shared canonical map
    const extFromMime = MIME_TO_EXT_MAP[normalizedMime];
    if (!extFromMime) {
      return errorResponse(400, `Unsupported mimeType: ${mimeType}`);
    }

    // Global size check
    if (filesize && filesize > DEFAULT_FILE_SIZE_LIMIT_MB * 1024 * 1024) {
      return errorResponse(400, `File exceeds ${DEFAULT_FILE_SIZE_LIMIT_MB}MB limit`);
    }

    // Key shape:
    // temp-files/blogs/{docId?}/{folder}/{ts-uuid}.{ext}
    const nsPrefix = `${S3_TEMP_FOLDER}/${namespace}`; // e.g. temp-files/blogs
    const folderPrefix = docId ? `${nsPrefix}/${docId}/${folder}` : `${nsPrefix}/${folder}`;
    const finalFilename = `${Date.now()}-${randomUUID()}.${extFromMime}`;
    const fullKey = `${folderPrefix}/${finalFilename}`;

    const { url } = await getPresignedPutUrl({
      key: fullKey,
      fileType: normalizedMime,
    });

    const publicUrl = `https://${APP_AWS_BUCKET_NAME}.s3.${APP_AWS_REGION}.amazonaws.com/${fullKey}`;

    const result: IPresignResponse = {
      key: fullKey,
      url,
      publicUrl,
      expiresIn: 900, // 15 minutes
      mimeType: normalizedMime,
    };

    return successResponse(200, "Presigned URL generated", result);
  } catch (err) {
    return errorResponse(err);
  }
}
