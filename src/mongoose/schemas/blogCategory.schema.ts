// src/mongoose/schemas/blogCategory.schema.ts
import { Schema } from "mongoose";
import type { IBlogCategory } from "@/types/blogPost.types";

export const blogCategorySchema = new Schema<IBlogCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Useful indexes
blogCategorySchema.index({ name: 1 });
