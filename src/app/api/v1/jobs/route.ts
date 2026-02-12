// src/app/api/v1/jobs/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parsePagination, parseSort, buildMeta, parseEnumParam, rx } from "@/lib/utils/queryUtils";
import { trim } from "@/lib/utils/stringUtils";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { EJobPostingStatus, EWorkplaceType, EEmploymentType } from "@/types/jobPosting.types";

/* -------------------------------------------------------------------------- */
/* GET /api/v1/jobs (public list)                                             */
/* -------------------------------------------------------------------------- */

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const sp = url.searchParams;

    const q = trim(sp.get("q"));
    const workplaceType = parseEnumParam(
      sp.get("workplaceType"),
      Object.values(EWorkplaceType) as readonly EWorkplaceType[],
      "workplaceType",
    );
    const employmentType = parseEnumParam(
      sp.get("employmentType"),
      Object.values(EEmploymentType) as readonly EEmploymentType[],
      "employmentType",
    );
    const department = trim(sp.get("department"));
    const location = trim(sp.get("location"));

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 50);
    const allowedSortKeys = ["publishedAt", "title", "createdAt"] as const;
    const { sortBy, sortDir } = parseSort(
      sp.get("sortBy"),
      sp.get("sortDir"),
      allowedSortKeys,
      "publishedAt",
    );

    const filter: any = {
      status: EJobPostingStatus.PUBLISHED,
    };

    if (workplaceType) filter.workplaceType = workplaceType;
    if (employmentType) filter.employmentType = employmentType;
    if (department) filter.department = rx(department);
    if (location) filter["locations.label"] = rx(location);

    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      filter.$and = tokens.map((t) => ({
        $or: [{ title: rx(t) }, { summary: rx(t) }, { department: rx(t) }, { tags: rx(t) }],
      }));
    }

    const projection: any = {
      title: 1,
      slug: 1,
      department: 1,
      workplaceType: 1,
      employmentType: 1,
      numberOfOpenings: 1,
      locations: 1,
      summary: 1,
      tags: 1,
      coverImage: 1,
      compensation: 1,
      benefitsPreview: 1,
      allowApplications: 1,
      publishedAt: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const total = await JobPostingModel.countDocuments(filter);

    const docs = await JobPostingModel.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .select(projection)
      .lean();

    const items = docs.map((d: any) => ({ ...d, id: d?._id?.toString?.() ?? d?.id ?? "" }));

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: {
        q: q ?? null,
        workplaceType: workplaceType ?? null,
        employmentType: employmentType ?? null,
        department: department ?? null,
        location: location ?? null,
      },
    });

    return successResponse(200, "Jobs list", { items, meta });
  } catch (err) {
    return errorResponse(err);
  }
};
