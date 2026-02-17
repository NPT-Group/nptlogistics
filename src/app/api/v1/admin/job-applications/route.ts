// src/app/api/v1/admin/job-applications/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { parseEnumParam, parsePagination, parseSort, buildMeta, rx } from "@/lib/utils/queryUtils";
import { trim } from "@/lib/utils/stringUtils";

import { JobApplicationModel } from "@/mongoose/models/JobApplication";
import { EJobApplicationStatus } from "@/types/jobApplication.types";
import type { IBlogAuthor } from "@/types/blogPost.types";

/* -------------------------------------------------------------------------- */
/* GET /api/v1/admin/job-applications                                         */
/* -------------------------------------------------------------------------- */

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    await guard();

    const url = new URL(req.url);
    const sp = url.searchParams;

    const q = trim(sp.get("q"));
    const jobPostingId = trim(sp.get("jobPostingId"));
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

    const filter: any = {};
    if (jobPostingId) filter.jobPostingId = jobPostingId;
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
      .populate({ path: "jobPostingId", select: "title slug" })
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .lean();

    const items = docs.map((d: any) => {
      const populated =
        d?.jobPostingId && typeof d.jobPostingId === "object" ? d.jobPostingId : null;

      return {
        ...d,
        id: d?._id?.toString?.() ?? d?.id ?? "",
        // keep jobPostingId as a string for convenience/consistency
        jobPostingId: populated?._id?.toString?.() ?? d?.jobPostingId?.toString?.() ?? "",
        // add a stable "jobPosting" object for the client
        jobPosting: populated
          ? {
              id: populated?._id?.toString?.() ?? "",
              title: populated?.title ?? "",
              slug: populated?.slug ?? "",
            }
          : null,
      };
    });

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: { q: q ?? null, jobPostingId: jobPostingId ?? null, status: status ?? null },
    });

    return successResponse(200, "Job applications list", { items, meta });
  } catch (err) {
    return errorResponse(err);
  }
};

/* -------------------------------------------------------------------------- */
/* PATCH /api/v1/admin/job-applications (mark viewed/archive)                 */
/* -------------------------------------------------------------------------- */

type PatchBody = {
  id: string;
  status?: EJobApplicationStatus;
  markViewed?: boolean;
};

export const PATCH = async (req: NextRequest) => {
  try {
    await connectDB();
    const user = await guard();

    const body = await parseJsonBody<PatchBody>(req);
    const id = trim(body?.id);
    if (!id) return errorResponse(400, "id is required");

    const app = await JobApplicationModel.findById(id);
    if (!app) return errorResponse(404, "Application not found");

    if (body?.status !== undefined) (app as any).status = body.status;

    if (body?.markViewed) {
      const viewer: IBlogAuthor = { id: user.id, name: user.name, email: user.email };
      (app as any).status = EJobApplicationStatus.VIEWED;
      (app as any).viewedAt = new Date();
      (app as any).viewedBy = viewer;
    }

    await app.save();

    const obj = app.toObject({ virtuals: true, getters: true });
    return successResponse(200, "Application updated", {
      jobApplication: { ...obj, id: obj?._id?.toString?.() ?? id },
    });
  } catch (err) {
    return errorResponse(err);
  }
};
