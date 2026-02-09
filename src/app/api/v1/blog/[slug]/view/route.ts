// src/app/api/v1/blog/[slug]/view/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { EBlogStatus } from "@/types/blogPost.types";

/**
 * POST /api/v1/blog/:slug/view
 * Increments viewCount for a published post by 1 (atomic).
 *
 * Notes:
 * - "Unique" / dedupe is handled client-side (sessionStorage).
 * - Server increments are intentionally simple and fast ($inc).
 */
export const POST = async (_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  try {
    await connectDB();

    const { slug } = await ctx.params;
    const safeSlug = String(slug || "").trim();
    if (!safeSlug) return errorResponse(400, "slug is required");

    const updated = await BlogPostModel.findOneAndUpdate(
      { slug: safeSlug, status: EBlogStatus.PUBLISHED },
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .select({ _id: 1, slug: 1, viewCount: 1 })
      .lean();

    if (!updated) return errorResponse(404, "Blog post not found");

    return successResponse(200, "View counted", {
      slug: updated.slug,
      viewCount: updated.viewCount ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
};
