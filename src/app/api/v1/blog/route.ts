// src/app/api/v1/blog/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { parsePagination, parseSort, buildMeta, rx } from "@/lib/utils/queryUtils";
import { trim } from "@/lib/utils/stringUtils";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { BlogCategoryModel } from "@/mongoose/models/BlogCategory";
import { EBlogStatus } from "@/types/blogPost.types";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const sp = url.searchParams;

    const q = trim(sp.get("q"));
    const categoryId = trim(sp.get("categoryId"));

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 50);
    const allowedSortKeys = ["publishedAt", "createdAt", "title", "viewCount"] as const;
    const { sortBy, sortDir } = parseSort(sp.get("sortBy"), sp.get("sortDir"), allowedSortKeys, "publishedAt");

    const filter: any = { status: EBlogStatus.PUBLISHED };

    if (categoryId) {
      const exists = await BlogCategoryModel.exists({ _id: categoryId });
      if (!exists) return errorResponse(404, "Category not found");
      filter.categoryIds = categoryId;
    }

    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      filter.$and = tokens.map((t) => ({
        $or: [{ title: rx(t) }, { excerpt: rx(t) }, { slug: rx(t) }],
      }));
    }

    const total = await BlogPostModel.countDocuments(filter);

    const docs = await BlogPostModel.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .select({
        title: 1,
        slug: 1,
        excerpt: 1,
        bannerImage: 1,
        author: 1,
        categoryIds: 1,
        readingTimeMinutes: 1,
        viewCount: 1,
        publishedAt: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .lean();

    const items = docs.map((d: any) => ({
      id: d?._id?.toString?.() ?? "",
      title: d?.title,
      slug: d?.slug,
      excerpt: d?.excerpt ?? "",
      bannerImage: d?.bannerImage ?? null,
      author: d?.author,
      categoryIds: (d?.categoryIds ?? []).map((x: any) => x?.toString?.() ?? String(x)),
      readingTimeMinutes: d?.readingTimeMinutes ?? null,
      viewCount: d?.viewCount ?? 0,
      publishedAt: d?.publishedAt ?? null,
      createdAt: d?.createdAt,
      updatedAt: d?.updatedAt,
    }));

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: { q: q ?? null, categoryId: categoryId ?? null },
    });

    return successResponse(200, "Blog posts", { items, meta });
  } catch (error) {
    return errorResponse(error);
  }
};
