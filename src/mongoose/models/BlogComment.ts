// src/mongoose/models/BlogComment.ts
import mongoose, { Model } from "mongoose";
import type { IBlogComment } from "@/types/blogComment.types";
import { blogCommentSchema } from "@/mongoose/schemas/blogComment.schema";

export const BlogCommentModel: Model<IBlogComment> = (mongoose.models.BlogComment as Model<IBlogComment>) || mongoose.model<IBlogComment>("BlogComment", blogCommentSchema);
