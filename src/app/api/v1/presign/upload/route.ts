// src/app/api/v1/presign/upload/route.ts
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";

import { ES3Namespace, ES3Folder, IPresignRequest, IPresignResponse } from "@/types/aws.types";
import {
  EFileMimeType,
  MIME_TO_EXT_MAP,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
  SPREADSHEET_MIME_TYPES,
} from "@/types/shared.types";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { getPresignedPutUrl } from "@/lib/utils/s3Helper/server";
import { APP_AWS_BUCKET_NAME, APP_AWS_REGION } from "@/config/env";
import { DEFAULT_FILE_SIZE_LIMIT_MB, S3_TEMP_FOLDER } from "@/constants/aws";

function isEnumValue<T extends object>(enm: T, value: unknown): value is T[keyof T] {
  return Object.values(enm).includes(value as any);
}

const RESUME_MIME_TYPES: readonly EFileMimeType[] = [
  EFileMimeType.PDF,
  EFileMimeType.DOC,
  EFileMimeType.DOCX,
];

const QUOTE_ALLOWED_MIME_TYPES: readonly EFileMimeType[] = Object.values(EFileMimeType);
const CONTACT_INQUIRY_ALLOWED_MIME_TYPES: readonly EFileMimeType[] = Object.values(EFileMimeType);

export async function POST(req: NextRequest) {
  try {
    const body = await parseJsonBody<IPresignRequest>(req);
    const { namespace, folder, mimeType, filesize } = body || {};
    const docId = body?.docId?.trim();

    if (!namespace || !folder || !mimeType) {
      return errorResponse(400, "Missing required fields: namespace, folder or mimeType");
    }

    if (!isEnumValue(ES3Namespace, namespace)) {
      return errorResponse(
        400,
        `Invalid namespace. Must be one of: ${Object.values(ES3Namespace).join(", ")}`,
      );
    }

    if (!isEnumValue(ES3Folder, folder)) {
      return errorResponse(
        400,
        `Invalid folder. Must be one of: ${Object.values(ES3Folder).join(", ")}`,
      );
    }

    const normalizedMime = (mimeType as string).toLowerCase() as EFileMimeType;

    // Allowed mime types per folder (+ namespace override for quotes/contact inquiries)
    let allowedMime: readonly EFileMimeType[] = [];

    if (namespace === ES3Namespace.QUOTES) {
      allowedMime = QUOTE_ALLOWED_MIME_TYPES;
    } else if (namespace === ES3Namespace.CONTACT_INQUIRIES) {
      allowedMime = CONTACT_INQUIRY_ALLOWED_MIME_TYPES;
    } else {
      if (folder === ES3Folder.MEDIA_IMAGES) {
        allowedMime = IMAGE_MIME_TYPES;
      } else if (folder === ES3Folder.MEDIA_VIDEOS) {
        allowedMime = VIDEO_MIME_TYPES;
      } else if (folder === ES3Folder.JOB_APPLICATION_RESUMES) {
        allowedMime = RESUME_MIME_TYPES;
      } else if (folder === ES3Folder.JOB_APPLICATION_PHOTOS) {
        allowedMime = IMAGE_MIME_TYPES;
      } else if (folder === ES3Folder.ATTACHMENTS) {
        // non-quotes attachments: allow docs + spreadsheets by default
        allowedMime = [...RESUME_MIME_TYPES, ...SPREADSHEET_MIME_TYPES];
      }
    }

    if (!allowedMime.length || !allowedMime.includes(normalizedMime)) {
      return errorResponse(
        400,
        `Invalid file type for folder "${folder}" (namespace "${namespace}"). Allowed: ${allowedMime.join(
          ", ",
        )}`,
      );
    }

    const extFromMime = MIME_TO_EXT_MAP[normalizedMime];
    if (!extFromMime) return errorResponse(400, `Unsupported mimeType: ${mimeType}`);

    if (filesize && filesize > DEFAULT_FILE_SIZE_LIMIT_MB * 1024 * 1024) {
      return errorResponse(400, `File exceeds ${DEFAULT_FILE_SIZE_LIMIT_MB}MB limit`);
    }

    // temp-files/{namespace}/{docId?}/{folder}/{ts-uuid}.{ext}
    const nsPrefix = `${S3_TEMP_FOLDER}/${namespace}`;
    const folderPrefix = docId ? `${nsPrefix}/${docId}/${folder}` : `${nsPrefix}/${folder}`;
    const finalFilename = `${Date.now()}-${randomUUID()}.${extFromMime}`;
    const fullKey = `${folderPrefix}/${finalFilename}`;

    const { url } = await getPresignedPutUrl({ key: fullKey, fileType: normalizedMime });

    const publicUrl = `https://${APP_AWS_BUCKET_NAME}.s3.${APP_AWS_REGION}.amazonaws.com/${fullKey}`;

    const result: IPresignResponse = {
      key: fullKey,
      url,
      publicUrl,
      expiresIn: 900,
      mimeType: normalizedMime,
    };

    return successResponse(200, "Presigned URL generated", result);
  } catch (err) {
    return errorResponse(err);
  }
}
