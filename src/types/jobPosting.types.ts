// src/types/jobPosting.types.ts
import type { ObjectId } from "mongoose";
import type { IBlogAuthor } from "@/types/blogPost.types";
import type { BlockNoteDocJSON, IFileAsset } from "@/types/shared.types";

export enum EJobPostingStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

export enum EWorkplaceType {
  ONSITE = "ONSITE",
  HYBRID = "HYBRID",
  REMOTE = "REMOTE",
}

export enum EEmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  TEMPORARY = "TEMPORARY",
  INTERN = "INTERN",
}

export type JobLocation = {
  label: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
};

export type JobCompensation = {
  currency?: string; // CAD, USD
  min?: number;
  max?: number;
  interval?: "HOUR" | "YEAR" | "MONTH";
  note?: string;
  isPublic?: boolean;
};

export interface IJobPosting {
  id: ObjectId | string;

  // core
  title: string;
  slug: string;
  department?: string;
  workplaceType: EWorkplaceType;
  employmentType?: EEmploymentType;

  numberOfOpenings: number;

  locations: JobLocation[];

  summary?: string;
  tags?: string[];

  // rich content
  description: BlockNoteDocJSON;

  // optional media (for list banner or header)
  coverImage?: IFileAsset;

  // optional structured extras
  compensation?: JobCompensation;
  benefitsPreview?: string[];

  // controls
  status: EJobPostingStatus;
  allowApplications: boolean;
  viewCount?: number;
  applicationsCount?: number;

  publishedAt?: Date | string;
  closedAt?: Date | string;

  // audit
  createdBy: IBlogAuthor;
  lastEditedBy?: IBlogAuthor;
  lastEditedAt?: Date | string;

  createdAt: Date | string;
  updatedAt: Date | string;
}
