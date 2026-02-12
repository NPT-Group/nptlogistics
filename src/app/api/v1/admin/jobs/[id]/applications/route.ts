// src/app/api/v1/admin/jobs/[id]/applications/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parsePagination, parseSort, buildMeta } from "@/lib/utils/queryUtils";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { JobApplicationModel } from "@/mongoose/models/JobApplication";

export const GET = async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;

    const jobExists = await JobPostingModel.exists({ _id: id });
    if (!jobExists) return errorResponse(404, "Job posting not found");

    const url = new URL(req.url);
    const sp = url.searchParams;

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 200);
    const allowedSortKeys = ["createdAt", "updatedAt", "status"] as const;
    const { sortBy, sortDir } = parseSort(
      sp.get("sortBy"),
      sp.get("sortDir"),
      allowedSortKeys,
      "createdAt",
    );

    const filter: any = { jobPostingId: id };

    const total = await JobApplicationModel.countDocuments(filter);

    const docs = await JobApplicationModel.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .lean();

    const items = docs.map((d: any) => ({ ...d, id: d?._id?.toString?.() ?? d?.id ?? "" }));

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: { jobPostingId: id },
    });

    return successResponse(200, "Job applications", { items, meta });
  } catch (err) {
    return errorResponse(err);
  }
};
