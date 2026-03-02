// src/app/api/v1/blog/categories/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { trim } from "@/lib/utils/stringUtils";

import { BlogCategoryModel } from "@/mongoose/models/BlogCategory";
import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { EBlogStatus } from "@/types/blogPost.types";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = trim(searchParams.get("q"));

    const cats = await BlogCategoryModel.find({})
      .select({ name: 1, slug: 1 })
      .sort({ name: 1 })
      .lean();

    const match: any = { status: EBlogStatus.PUBLISHED };
    if (q) match.$text = { $search: q };

    const counts = await BlogPostModel.aggregate([
      { $match: match },
      { $unwind: "$categoryIds" },
      { $group: { _id: "$categoryIds", count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    for (const row of counts as any[]) countMap.set(String(row._id), Number(row.count) || 0);

    const data = (cats as any[]).map((c) => ({
      id: String(c._id),
      name: c.name,
      slug: c.slug,
      postCount: countMap.get(String(c._id)) ?? 0,
    }));

    return successResponse(200, "Request successful", data);
  } catch (err) {
    return errorResponse(err);
  }
}
