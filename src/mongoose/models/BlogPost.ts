// src/mongoose/models/BlogPost.ts
import mongoose, { Model } from "mongoose";
import type { IBlogPost } from "@/types/blogPost.types";
import { blogPostSchema } from "@/mongoose/schemas/blogPost.schema";

export const BlogPostModel: Model<IBlogPost> = (mongoose.models.BlogPost as Model<IBlogPost>) || mongoose.model<IBlogPost>("BlogPost", blogPostSchema);
