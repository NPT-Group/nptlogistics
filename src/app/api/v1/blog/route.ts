// src/app/api/v1/blog/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { trim } from "@/lib/utils/stringUtils";
import { parsePagination, parseEnumParam } from "@/lib/utils/queryUtils";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { BlogCategoryModel } from "@/mongoose/models/BlogCategory";
import { EBlogStatus } from "@/types/blogPost.types";

const SORT_KEYS = ["newest", "oldest", "mostViewed", "titleAsc", "relevance"] as const;
type SortKey = (typeof SORT_KEYS)[number];

function normalizeSort(sortBy: SortKey, hasQ: boolean): SortKey {
  if (sortBy === "relevance" && !hasQ) return "newest";
  return sortBy;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const q = trim(searchParams.get("q"));
    const categoryId = trim(searchParams.get("categoryId"));
    const categorySlug = trim(searchParams.get("categorySlug"));

    const { page, limit, skip } = parsePagination(
      searchParams.get("page"),
      searchParams.get("limit"),
      50,
    );

    const sortParsed =
      parseEnumParam<SortKey>(searchParams.get("sortBy"), SORT_KEYS, "sortBy") ?? "newest";
    const sortBy = normalizeSort(sortParsed, Boolean(q));

    const filter: any = { status: EBlogStatus.PUBLISHED };

    // category filter: prefer slug
    if (categorySlug) {
      const cat = await BlogCategoryModel.findOne({ slug: categorySlug }).select({ _id: 1 }).lean();
      if (cat?._id) filter.categoryIds = cat._id;
      else filter.categoryIds = "__none__";
    } else if (categoryId) {
      filter.categoryIds = categoryId;
    }

    const findQuery: any = { ...filter };
    const projection: any = {
      title: 1,
      slug: 1,
      excerpt: 1,
      bannerImage: 1,
      categoryIds: 1,
      publishedAt: 1,
      readingTimeMinutes: 1,
      viewCount: 1,
    };

    const useText = Boolean(q);
    if (useText) {
      findQuery.$text = { $search: q };
      projection.score = { $meta: "textScore" };
    }

    // sorting
    let sort: any = { publishedAt: -1 };
    if (sortBy === "oldest") sort = { publishedAt: 1 };
    if (sortBy === "mostViewed") sort = { viewCount: -1, publishedAt: -1 };
    if (sortBy === "titleAsc") sort = { title: 1 };
    if (sortBy === "relevance" && useText)
      sort = { score: { $meta: "textScore" }, publishedAt: -1 };

    const [total, rows] = await Promise.all([
      BlogPostModel.countDocuments(findQuery),
      BlogPostModel.find(findQuery).select(projection).sort(sort).skip(skip).limit(limit).lean(),
    ]);

    // hydrate categories
    const catIds = Array.from(
      new Set(
        rows.flatMap((r: any) =>
          Array.isArray(r.categoryIds) ? r.categoryIds.map((x: any) => String(x)) : [],
        ),
      ),
    );

    const cats = catIds.length
      ? await BlogCategoryModel.find({ _id: { $in: catIds } })
          .select({ name: 1, slug: 1 })
          .lean()
      : [];

    const catMap = new Map<string, { id: string; name: string; slug: string }>();
    for (const c of cats as any[]) {
      catMap.set(String(c._id), { id: String(c._id), name: c.name, slug: c.slug });
    }

    // Map schema fields -> what BlogIndexClient currently expects
    const items = rows.map((r: any) => ({
      id: String(r._id),
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt ?? "",
      coverImage: r.bannerImage
        ? { url: r.bannerImage?.url, alt: r.bannerImage?.alt ?? r.title }
        : null,
      categories: (Array.isArray(r.categoryIds) ? r.categoryIds : [])
        .map((id: any) => catMap.get(String(id)))
        .filter(Boolean),
      publishedAt: r.publishedAt ?? null,
      readTimeMins: r.readingTimeMinutes ?? null,
      viewCount: r.viewCount ?? 0,
    }));

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const meta = { page, limit, total, totalPages };

    return successResponse(200, "Request successful", { items, meta });
  } catch (err) {
    return errorResponse(err);
  }
}
