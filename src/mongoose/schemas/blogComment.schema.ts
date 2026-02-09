// src/mongoose/schemas/blogComment.schema.ts
import { Schema } from "mongoose";
import type { IBlogComment } from "@/types/blogComment.types";

export const blogCommentSchema = new Schema<IBlogComment>(
  {
    blogPostId: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    comment: { type: String, required: true, trim: true, maxlength: 5000 },

    // createdAt handled by timestamps
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Helpful index for moderation / sorting by most recent per post
blogCommentSchema.index({ blogPostId: 1, createdAt: -1 });
