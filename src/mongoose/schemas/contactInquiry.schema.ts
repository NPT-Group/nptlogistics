// src/mongoose/schemas/contactInquiry.schema.ts
import { Schema } from "mongoose";
import type { IContactInquiry } from "@/types/contactInquiry.types";
import {
  CONTACT_INQUIRY_MAX_ATTACHMENTS,
  CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES,
} from "@/types/contactInquiry.types";
import { EFileMimeType } from "@/types/shared.types";

import {
  contactInquiryDetailsBaseSchema,
  registerContactInquiryDiscriminators,
} from "./contactInquiry/inquiry.schema";
import { fileAssetSchema } from "./sharedSchemas";

registerContactInquiryDiscriminators();

const ALLOWED_CONTACT_INQUIRY_MIME_TYPES = new Set<string>([
  EFileMimeType.JPEG,
  EFileMimeType.JPG,
  EFileMimeType.PNG,
  EFileMimeType.WEBP,
  EFileMimeType.PDF,
  EFileMimeType.DOC,
  EFileMimeType.DOCX,
  EFileMimeType.XLS,
  EFileMimeType.XLSX,
  EFileMimeType.CSV,
  EFileMimeType.ODS,
]);

function isAllowedAttachmentMime(mimeType?: string) {
  if (!mimeType) return false;
  return ALLOWED_CONTACT_INQUIRY_MIME_TYPES.has(String(mimeType));
}

export const contactInquirySchema = new Schema<IContactInquiry>(
  {
    inquiryId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    inquiry: { type: contactInquiryDetailsBaseSchema, required: true },

    attachments: {
      type: [fileAssetSchema],
      required: false,
      default: [],
      validate: [
        {
          validator: (v: unknown[]) =>
            Array.isArray(v) && v.length <= CONTACT_INQUIRY_MAX_ATTACHMENTS,
          message: `attachments cannot contain more than ${CONTACT_INQUIRY_MAX_ATTACHMENTS} files`,
        },
        {
          validator: (v: any[]) =>
            Array.isArray(v) &&
            v.every(
              (file) =>
                !file?.sizeBytes ||
                (Number.isFinite(Number(file.sizeBytes)) &&
                  Number(file.sizeBytes) <= CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES),
            ),
          message: `each attachment must be ${CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES} bytes or smaller`,
        },
        {
          validator: (v: any[]) =>
            Array.isArray(v) && v.every((file) => isAllowedAttachmentMime(file?.mimeType)),
          message: "attachments contain unsupported file type(s)",
        },
      ],
    },

    marketingEmailConsent: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Helpful indexes
contactInquirySchema.index({ "inquiry.category": 1, createdAt: -1 });
contactInquirySchema.index({ "inquiry.contact.email": 1, createdAt: -1 });
contactInquirySchema.index({ "inquiry.contact.fullName": 1 });
contactInquirySchema.index({ "inquiry.contact.contactName": 1 });
contactInquirySchema.index({ "inquiry.details.inquiryType": 1 });
