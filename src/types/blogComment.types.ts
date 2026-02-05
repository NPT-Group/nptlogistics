import { ObjectId } from "mongoose";

/**
 * Blog comments (guest comments only).
 * Stored in a separate Mongo collection.
 */
export interface IBlogComment {
  id: ObjectId | string;

  blogPostId: ObjectId | string;

  name: string; // mandatory
  email?: string; // optional
  comment: string; // mandatory

  createdAt: Date | string;
}
