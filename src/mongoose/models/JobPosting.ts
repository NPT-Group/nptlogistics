// src/mongoose/models/JobPosting.ts
import mongoose, { Model } from "mongoose";
import type { IJobPosting } from "@/types/jobPosting.types";
import { jobPostingSchema } from "@/mongoose/schemas/jobPosting.schema";

export const JobPostingModel: Model<IJobPosting> =
  (mongoose.models.JobPosting as Model<IJobPosting>) ||
  mongoose.model<IJobPosting>("JobPosting", jobPostingSchema);
