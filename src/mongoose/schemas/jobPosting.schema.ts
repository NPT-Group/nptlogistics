// src/mongoose/schemas/jobPosting.schema.ts
import { Schema } from "mongoose";
import type { IJobPosting, JobLocation, JobCompensation } from "@/types/jobPosting.types";
import { EJobPostingStatus, EWorkplaceType, EEmploymentType } from "@/types/jobPosting.types";
import { fileAssetSchema } from "@/mongoose/schemas/sharedSchemas";
import { type IBlogAuthor } from "@/types/blogPost.types";

const blogAuthorSchema = new Schema<IBlogAuthor>(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { _id: false },
);

const jobLocationSchema = new Schema<JobLocation>(
  {
    label: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    region: { type: String, trim: true },
    city: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false },
);

const jobCompSchema = new Schema<JobCompensation>(
  {
    currency: { type: String, trim: true },
    min: { type: Number },
    max: { type: Number },
    interval: { type: String, enum: ["HOUR", "YEAR", "MONTH"] },
    note: { type: String, trim: true },
    isPublic: { type: Boolean, default: false },
  },
  { _id: false },
);

export const jobPostingSchema = new Schema<IJobPosting>(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    department: { type: String, trim: true, maxlength: 200 },

    workplaceType: {
      type: String,
      required: true,
      enum: Object.values(EWorkplaceType),
      index: true,
    },
    employmentType: {
      type: String,
      enum: Object.values(EEmploymentType),
      index: true,
    },

    numberOfOpenings: { type: Number, required: true, min: 1, default: 1 },

    locations: {
      type: [jobLocationSchema],
      default: [],
      validate: [(v: any[]) => v?.length > 0, "At least one location is required"],
    },

    summary: { type: String, trim: true, maxlength: 1200 },
    tags: [{ type: String, trim: true, maxlength: 50 }],

    description: { type: Schema.Types.Mixed, required: true }, // BlockNote JSON

    coverImage: { type: fileAssetSchema, required: false },

    compensation: { type: jobCompSchema, required: false },
    benefitsPreview: [{ type: String, trim: true, maxlength: 200 }],

    status: {
      type: String,
      enum: Object.values(EJobPostingStatus),
      default: EJobPostingStatus.DRAFT,
      index: true,
    },
    allowApplications: { type: Boolean, default: true, index: true },
    viewCount: { type: Number, default: 0, min: 0 },

    publishedAt: { type: Date, index: true },
    closedAt: { type: Date },

    createdBy: { type: blogAuthorSchema, required: true },
    lastEditedBy: { type: blogAuthorSchema, required: false },
    lastEditedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

jobPostingSchema.index({ status: 1, publishedAt: -1 });
jobPostingSchema.index({ department: 1, workplaceType: 1, employmentType: 1 });
jobPostingSchema.index({ "locations.label": 1 });
jobPostingSchema.index({ title: "text", summary: "text", department: "text", tags: "text" });
