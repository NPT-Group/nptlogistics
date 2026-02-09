// src/mongoose/models/BlogCategory.ts
import mongoose, { Model } from "mongoose";
import type { IBlogCategory } from "@/types/blogPost.types";
import { blogCategorySchema } from "@/mongoose/schemas/blogCategory.schema";

export const BlogCategoryModel: Model<IBlogCategory> = (mongoose.models.BlogCategory as Model<IBlogCategory>) || mongoose.model<IBlogCategory>("BlogCategory", blogCategorySchema);
