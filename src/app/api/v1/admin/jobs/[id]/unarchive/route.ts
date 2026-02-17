// src/app/api/v1/admin/jobs/[id]/unarchive/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { EJobPostingStatus } from "@/types/jobPosting.types";

export const POST = async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;

    const job = await JobPostingModel.findById(id);
    if (!job) return errorResponse(404, "Job posting not found");

    if ((job as any).status !== EJobPostingStatus.ARCHIVED) {
      return errorResponse(409, "Job is not archived");
    }

    // Default restore target:
    (job as any).status = EJobPostingStatus.PUBLISHED;

    await job.save();

    const obj = job.toObject({ virtuals: true, getters: true });
    return successResponse(200, "Job posting unarchived", {
      jobPosting: { ...obj, id: obj?._id?.toString?.() ?? id },
    });
  } catch (err) {
    return errorResponse(err);
  }
};
