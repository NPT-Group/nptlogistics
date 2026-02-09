// src/mongoose/schemas/sharedSchemas.ts
import { Schema, SchemaTypeOptions } from "mongoose";
import { IFileAsset, IGeoLocation } from "@/types/shared.types";
import { encryptField, decryptField } from "@/lib/utils/encryption";

export const fileAssetSchema = new Schema<IFileAsset>(
  {
    url: { type: String, required: true },
    s3Key: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number },
    originalName: { type: String },
  },
  { _id: false },
);

export const geoLocationSchema = new Schema<IGeoLocation>(
  {
    country: String,
    region: String,
    city: String,
    timezone: String,
    latitude: Number,
    longitude: Number,
  },
  { _id: false },
);

export const encryptedStringField: SchemaTypeOptions<string> = {
  type: String,
  set: encryptField,
  get: decryptField,
};
