// src/mongoose/models/JobApplication.ts
import mongoose, { Model } from "mongoose";
import type { IJobApplication } from "@/types/jobApplication.types";
import { jobApplicationSchema } from "@/mongoose/schemas/jobApplication.schema";

export const JobApplicationModel: Model<IJobApplication> =
  (mongoose.models.JobApplication as Model<IJobApplication>) ||
  mongoose.model<IJobApplication>("JobApplication", jobApplicationSchema);
