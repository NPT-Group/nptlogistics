// src/mongoose/schemas/blogPost.schema.ts
import { Schema } from "mongoose";
import { type IBlogPost, type IBlogAuthor, EBlogStatus } from "@/types/blogPost.types";
import { fileAssetSchema } from "@/mongoose/schemas/sharedSchemas";

const blogAuthorSchema = new Schema<IBlogAuthor>(
  {
    id: { type: String, required: true, trim: true }, // Azure AD oid (preferred) or sub
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { _id: false },
);

export const blogPostSchema = new Schema<IBlogPost>(
  {
    // core
    title: { type: String, required: true, trim: true, maxlength: 300 },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    excerpt: { type: String, trim: true, maxlength: 1000 },

    // BlockNote JSON (schema evolves; keep flexible)
    body: { type: Schema.Types.Mixed, required: true },

    // media
    bannerImage: { type: fileAssetSchema, required: false },

    // author snapshot
    author: { type: blogAuthorSchema, required: true },

    // relations
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "BlogCategory", index: true }],

    // publishing
    status: {
      type: String,
      enum: {
        values: Object.values(EBlogStatus),
        message: `Status must be one of: ${Object.values(EBlogStatus).join(", ")}`,
      },
      default: EBlogStatus.DRAFT,
      index: true,
    },
    publishedAt: { type: Date, index: true },

    // optional UX/meta
    readingTimeMinutes: { type: Number, min: 1 },
    viewCount: { type: Number, default: 0, min: 0 },

    // audit
    lastEditedBy: { type: blogAuthorSchema, required: false },
    lastEditedAt: { type: Date, required: false },
  },
  {
    timestamps: true, // createdAt + updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Virtual populate:
 * post.comments -> BlogComment[]
 *
 * Usage:
 *   BlogPost.findById(id).populate("comments")
 */
blogPostSchema.virtual("comments", {
  ref: "BlogComment",
  localField: "_id",
  foreignField: "blogPostId",
  justOne: false,
});

// Useful indexes
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ "author.id": 1, createdAt: -1 });
