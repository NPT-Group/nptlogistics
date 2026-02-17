import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { EJobPostingStatus } from "@/types/jobPosting.types";

/**
 * POST /api/v1/jobs/:slug/view
 * Increments viewCount for a published job by 1 (atomic).
 *
 * Notes:
 * - Dedupe is handled client-side (sessionStorage).
 * - Server increment remains simple and fast with $inc.
 */
export const POST = async (_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  try {
    await connectDB();

    const { slug } = await ctx.params;
    const safeSlug = String(slug || "").trim();
    if (!safeSlug) return errorResponse(400, "slug is required");

    const updated = await JobPostingModel.findOneAndUpdate(
      { slug: safeSlug, status: EJobPostingStatus.PUBLISHED },
      { $inc: { viewCount: 1 } },
      { new: true },
    )
      .select({ _id: 1, slug: 1, viewCount: 1 })
      .lean();

    if (!updated) return errorResponse(404, "Job not found");

    return successResponse(200, "View counted", {
      slug: updated.slug,
      viewCount: updated.viewCount ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
};
