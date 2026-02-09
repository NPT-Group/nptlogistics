// src/app/api/v1/admin/blog/comments/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { parsePagination, parseSort, buildMeta, rx } from "@/lib/utils/queryUtils";
import { trim, lowerTrim } from "@/lib/utils/stringUtils";

import { BlogCommentModel } from "@/mongoose/models/BlogComment";
import { BlogPostModel } from "@/mongoose/models/BlogPost";

/**
 * GET /api/v1/admin/blog/comments
 * Admin-only comments moderation list (delete handled elsewhere).
 *
 * Features:
 * - Search q across name/email/comment (tokenized AND, each token OR across fields)
 * - Optional filter by postId
 * - Pagination + sorting
 * - Lightweight enrichment with blog post title/slug
 * - Resilient to dangling blogPostId references (post deleted) → postTitle/slug null
 */
export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    await guard();

    const url = new URL(req.url);
    const sp = url.searchParams;

    const q = trim(sp.get("q"));
    const postId = trim(sp.get("postId"));

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 200);
    const allowedSortKeys = ["createdAt"] as const;
    const { sortBy, sortDir } = parseSort(sp.get("sortBy"), sp.get("sortDir"), allowedSortKeys, "createdAt");

    const filter: any = {};
    if (postId) filter.blogPostId = postId;

    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      filter.$and = tokens.map((t) => ({
        $or: [{ name: rx(t) }, { email: rx(t) }, { comment: rx(t) }],
      }));
    }

    const total = await BlogCommentModel.countDocuments(filter);

    const docs = await BlogCommentModel.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .select({ blogPostId: 1, name: 1, email: 1, comment: 1, createdAt: 1 })
      .lean();

    // Enrich with post slug/title (resilient to deleted posts)
    const postIds = Array.from(new Set(docs.map((d: any) => String(d.blogPostId)).filter(Boolean)));

    const posts = postIds.length
      ? await BlogPostModel.find({ _id: { $in: postIds } })
          .select({ _id: 1, slug: 1, title: 1 })
          .lean()
      : [];

    const idToPost = new Map<string, { slug?: string; title?: string }>();
    for (const p of posts as any[]) idToPost.set(String(p._id), { slug: p.slug, title: p.title });

    const items = docs.map((d: any) => {
      const pid = d?.blogPostId?.toString?.() ?? String(d?.blogPostId ?? "");
      const post = pid ? idToPost.get(pid) : undefined;

      return {
        id: d?._id?.toString?.() ?? "",
        blogPostId: pid,

        // Enrichment
        postSlug: post?.slug ?? null,
        postTitle: post?.title ?? null,

        // Convenience for UI linking
        postAdminUrl: pid ? `/admin/blog/${encodeURIComponent(pid)}` : null,

        name: d?.name,
        email: lowerTrim(d?.email ?? undefined),
        comment: d?.comment,
        createdAt: d?.createdAt,
      };
    });

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: { q: q ?? null, postId: postId ?? null },
    });

    return successResponse(200, "Blog comments (admin)", { items, meta });
  } catch (error) {
    return errorResponse(error);
  }
};
