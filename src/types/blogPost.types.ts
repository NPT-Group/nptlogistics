// src/types/blog.types.ts

import { ObjectId } from "mongoose";
import type { BlockNoteDocJSON, IFileAsset } from "./shared.types";
import { IBlogComment } from "./blogComment.types";

/** Publish lifecycle */
export enum EBlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

/** Category collection */
export interface IBlogCategory {
  id: ObjectId | string;
  name: string;
  slug: string; // unique, url-friendly
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IBlogAuthor {
  id: string; // Azure AD oid (preferred) or sub
  name: string;
  email: string;
}

/**
 * Stored blog post.
 * - body is BlockNote JSON saved in DB
 * - bannerImage is stored separately (S3) and referenced here
 * - categories are separate Mongo collections, referenced by id
 */
export interface IBlogPost {
  id: ObjectId | string;

  // core
  title: string;
  slug: string;
  excerpt?: string;
  body: BlockNoteDocJSON;

  // media
  bannerImage?: IFileAsset;

  // author (Azure AD identity snapshot)
  author: IBlogAuthor;

  // relations
  categoryIds?: ObjectId[] | string[];

  // comments
  comments: IBlogComment[];

  // publishing
  status: EBlogStatus;
  publishedAt?: Date | string;

  // optional UX/meta
  readingTimeMinutes?: number;
  viewCount?: number;

  // audit
  lastEditedBy?: IBlogAuthor; // who last changed the post
  lastEditedAt?: Date | string; // when it was last changed
  createdAt: Date | string;
  updatedAt: Date | string;
}
