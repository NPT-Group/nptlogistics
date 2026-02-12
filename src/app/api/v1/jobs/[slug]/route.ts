// src/app/api/v1/jobs/[slug]/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { trim } from "@/lib/utils/stringUtils";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { EJobPostingStatus } from "@/types/jobPosting.types";

/* -------------------------------------------------------------------------- */
/* GET /api/v1/jobs/:slug (public detail)                                     */
/* -------------------------------------------------------------------------- */

export const GET = async (_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  try {
    await connectDB();

    const { slug } = await ctx.params;
    const s = trim(slug);
    if (!s) return errorResponse(400, "Invalid slug");

    const job = await JobPostingModel.findOne({
      slug: s,
      status: EJobPostingStatus.PUBLISHED,
    }).lean();
    if (!job) return errorResponse(404, "Job not found");

    return successResponse(200, "Job", {
      jobPosting: { ...job, id: job?._id?.toString?.() ?? "" },
    });
  } catch (err) {
    return errorResponse(err);
  }
};
