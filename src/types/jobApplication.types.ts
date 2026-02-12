// src/types/jobApplication.types.ts
import type { ObjectId } from "mongoose";
import type { IFileAsset } from "@/types/shared.types";
import type { IBlogAuthor } from "@/types/blogPost.types";

export enum EJobApplicationStatus {
  RECEIVED = "RECEIVED",
  VIEWED = "VIEWED",
  ARCHIVED = "ARCHIVED",
}

export interface IJobApplication {
  id: ObjectId | string;

  jobPostingId: ObjectId | string;

  // applicant
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  currentLocation?: string; // "Milton, Canada"
  addressLine?: string;

  // attachments
  resume: IFileAsset; // required
  photo?: IFileAsset;

  coverLetter?: string;

  linkedInUrl?: string;
  portfolioUrl?: string;

  // light screening (generic)
  commuteMode?: string;
  canWorkOnsite?: boolean;
  hasReferences?: boolean;

  // admin-only tracking
  status: EJobApplicationStatus;
  viewedAt?: Date | string;
  viewedBy?: IBlogAuthor;

  createdAt: Date | string;
  updatedAt: Date | string;
}
