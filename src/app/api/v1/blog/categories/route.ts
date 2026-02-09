// src/app/api/v1/blog/categories/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";

import { BlogCategoryModel } from "@/mongoose/models/BlogCategory";
import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { EBlogStatus } from "@/types/blogPost.types";

/**
 * GET /api/v1/blog/categories
 *
 * Returns categories sorted by name, plus:
 * - postCount: number of PUBLISHED posts referencing that category
 *
 * Notes:
 * - We count only PUBLISHED posts (public-facing UX).
 * - We aggregate on BlogPost.categoryIds (ObjectId[]) and map counts back to categories.
 */
export const GET = async (_req: NextRequest) => {
  try {
    await connectDB();

    const [cats, counts] = await Promise.all([
      BlogCategoryModel.find({}).sort({ name: 1 }).select({ name: 1, slug: 1, description: 1, createdAt: 1, updatedAt: 1 }).lean(),
      BlogPostModel.aggregate<{ _id: any; count: number }>([{ $match: { status: EBlogStatus.PUBLISHED } }, { $unwind: "$categoryIds" }, { $group: { _id: "$categoryIds", count: { $sum: 1 } } }]),
    ]);

    const countById = new Map<string, number>();
    for (const c of counts) countById.set(String(c._id), Number(c.count ?? 0));

    const items = cats.map((d: any) => ({
      id: d?._id?.toString?.() ?? "",
      name: d?.name,
      slug: d?.slug,
      description: d?.description ?? "",
      postCount: countById.get(String(d?._id)) ?? 0,
      createdAt: d?.createdAt,
      updatedAt: d?.updatedAt,
    }));

    return successResponse(200, "Blog categories", { items });
  } catch (error) {
    return errorResponse(error);
  }
};
