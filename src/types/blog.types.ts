// src/types/blog.types.ts

import { ObjectId } from "mongoose";
import type { IFileAsset } from "./shared.types";
import { IBlogComment } from "./blogComment.types";

/**
 * BlockNote document JSON.
 * Keep it flexible because BlockNote schema can evolve with plugins/blocks.
 */
export type BlockNoteDocJSON = Record<string, any>;

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

/**
 * Stored blog post.
 * - body is BlockNote JSON saved in DB
 * - bannerImage is stored separately (S3) and referenced here
 * - categories are separate Mongo collections, referenced by id
 */
export interface IBlog {
  id: ObjectId | string;

  // core
  title: string;
  slug: string; // unique
  excerpt?: string; // short summary for cards/meta
  body: BlockNoteDocJSON;

  // media
  bannerImage?: IFileAsset;

  // relations
  authorId: ObjectId | string;
  categoryIds?: ObjectId[] | string[];

  // comments
  commentsEnabled: boolean;
  comments: IBlogComment[]; // array of comment objects

  // publishing
  status: EBlogStatus;
  publishedAt?: Date | string; // set when published

  // optional UX/meta
  readingTimeMinutes?: number;
  viewCount?: number;

  // audit
  createdAt: Date | string;
  updatedAt: Date | string;
}
