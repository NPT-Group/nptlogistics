// src/app/api/v1/admin/jobs/[id]/applications/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import {
  parseEnumParam,
  parsePagination,
  parseSort,
  buildMeta,
  rx,
} from "@/lib/utils/queryUtils";
import { trim } from "@/lib/utils/stringUtils";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { JobApplicationModel } from "@/mongoose/models/JobApplication";
import { EJobApplicationStatus } from "@/types/jobApplication.types";

export const GET = async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;

    const jobExists = await JobPostingModel.exists({ _id: id });
    if (!jobExists) return errorResponse(404, "Job posting not found");

    const url = new URL(req.url);
    const sp = url.searchParams;
    const q = trim(sp.get("q"));
    const status = parseEnumParam(
      sp.get("status"),
      Object.values(EJobApplicationStatus) as readonly EJobApplicationStatus[],
      "status",
    );

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 200);
    const allowedSortKeys = ["createdAt", "updatedAt", "status"] as const;
    const { sortBy, sortDir } = parseSort(
      sp.get("sortBy"),
      sp.get("sortDir"),
      allowedSortKeys,
      "createdAt",
    );

    const filter: any = { jobPostingId: id };
    if (status) filter.status = status;

    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      filter.$and = tokens.map((t) => ({
        $or: [
          { firstName: rx(t) },
          { lastName: rx(t) },
          { email: rx(t) },
          { currentLocation: rx(t) },
        ],
      }));
    }

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
      filters: { jobPostingId: id, q: q ?? null, status: status ?? null },
    });

    return successResponse(200, "Job applications", { items, meta });
  } catch (err) {
    return errorResponse(err);
  }
};
