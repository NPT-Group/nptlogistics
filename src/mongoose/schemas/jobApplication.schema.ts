// src/mongoose/schemas/jobApplication.schema.ts
import { Schema } from "mongoose";
import type { IJobApplication } from "@/types/jobApplication.types";
import { EJobApplicationStatus } from "@/types/jobApplication.types";
import { fileAssetSchema } from "@/mongoose/schemas/sharedSchemas";
import type { IBlogAuthor } from "@/types/blogPost.types";

const blogAuthorSchema = new Schema<IBlogAuthor>(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { _id: false },
);

export const jobApplicationSchema = new Schema<IJobApplication>(
  {
    jobPostingId: { type: Schema.Types.ObjectId, ref: "JobPosting", required: true, index: true },

    firstName: { type: String, required: true, trim: true, maxlength: 120 },
    lastName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 50 },

    currentLocation: { type: String, trim: true, maxlength: 200 },
    addressLine: { type: String, trim: true, maxlength: 300 },

    resume: { type: fileAssetSchema, required: true },
    photo: { type: fileAssetSchema, required: false },

    coverLetter: { type: String, trim: true, maxlength: 8000 },

    linkedInUrl: { type: String, trim: true, maxlength: 500 },
    portfolioUrl: { type: String, trim: true, maxlength: 500 },

    commuteMode: { type: String, trim: true, maxlength: 200 },
    canWorkOnsite: { type: Boolean },
    hasReferences: { type: Boolean },

    status: {
      type: String,
      enum: Object.values(EJobApplicationStatus),
      default: EJobApplicationStatus.RECEIVED,
      index: true,
    },
    viewedAt: { type: Date },
    viewedBy: { type: blogAuthorSchema, required: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

jobApplicationSchema.index({ jobPostingId: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1, createdAt: -1 });
