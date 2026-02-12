// src/app/api/v1/admin/jobs/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import {
  parseBool,
  parseEnumParam,
  parsePagination,
  parseSort,
  buildMeta,
  rx,
} from "@/lib/utils/queryUtils";
import { trim } from "@/lib/utils/stringUtils";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { JobApplicationModel } from "@/mongoose/models/JobApplication";

import type { IJobPosting } from "@/types/jobPosting.types";
import { EJobPostingStatus, EWorkplaceType, EEmploymentType } from "@/types/jobPosting.types";
import type { IBlogAuthor } from "@/types/blogPost.types";
import type { BlockNoteDocJSON, IFileAsset } from "@/types/shared.types";

import {
  ensureUniqueJobSlug,
  finalizeJobDocAssetsAllOrNothing,
} from "@/lib/utils/jobs/jobPostingUtils";

/* -------------------------------------------------------------------------- */
/* GET /api/v1/admin/jobs                                                     */
/* -------------------------------------------------------------------------- */

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    await guard();

    const url = new URL(req.url);
    const sp = url.searchParams;

    const q = trim(sp.get("q"));
    const status = parseEnumParam(
      sp.get("status"),
      Object.values(EJobPostingStatus) as readonly EJobPostingStatus[],
      "status",
    );

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
    const allowApplications = parseBool(sp.get("allowApplications"));

    const includeDescription = parseBool(sp.get("includeDescription")) ?? false;
    const includeAppsCount = parseBool(sp.get("includeAppsCount")) ?? true;

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 100);
    const allowedSortKeys = ["createdAt", "updatedAt", "publishedAt", "title", "status"] as const;
    const { sortBy, sortDir } = parseSort(
      sp.get("sortBy"),
      sp.get("sortDir"),
      allowedSortKeys,
      "createdAt",
    );

    const filter: any = {};
    if (status) filter.status = status;
    if (workplaceType) filter.workplaceType = workplaceType;
    if (employmentType) filter.employmentType = employmentType;
    if (department) filter.department = rx(department);
    if (allowApplications != null) filter.allowApplications = allowApplications;

    if (location) {
      filter["locations.label"] = rx(location);
    }

    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      filter.$and = tokens.map((t) => ({
        $or: [
          { title: rx(t) },
          { summary: rx(t) },
          { slug: rx(t) },
          { department: rx(t) },
          { tags: rx(t) },
        ],
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
      status: 1,
      allowApplications: 1,
      publishedAt: 1,
      closedAt: 1,
      createdBy: 1,
      lastEditedBy: 1,
      lastEditedAt: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    if (includeDescription) projection.description = 1;

    const total = await JobPostingModel.countDocuments(filter);

    const docs = await JobPostingModel.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .select(projection)
      .lean();

    // optional apps count in one aggregate pass
    const appsCountByJob: Record<string, number> = {};
    if (includeAppsCount && docs.length) {
      const ids = docs.map((d: any) => d._id);
      const agg = await JobApplicationModel.aggregate([
        { $match: { jobPostingId: { $in: ids } } },
        { $group: { _id: "$jobPostingId", count: { $sum: 1 } } },
      ]);
      for (const row of agg) appsCountByJob[String(row._id)] = row.count;
    }

    const items = docs.map((d: any) => ({
      ...d,
      id: d?._id?.toString?.() ?? d?.id ?? "",
      ...(includeAppsCount ? { applicationsCount: appsCountByJob[String(d._id)] ?? 0 } : {}),
    }));

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: {
        q: q ?? null,
        status: status ?? null,
        workplaceType: workplaceType ?? null,
        employmentType: employmentType ?? null,
        department: department ?? null,
        location: location ?? null,
        allowApplications: allowApplications ?? null,
        includeDescription,
        includeAppsCount,
      },
    });

    return successResponse(200, "Job postings list", { items, meta });
  } catch (err) {
    return errorResponse(err);
  }
};

/* -------------------------------------------------------------------------- */
/* POST /api/v1/admin/jobs                                                    */
/* -------------------------------------------------------------------------- */

type PostBody = {
  title: string;
  slug?: string;
  department?: string;
  workplaceType: EWorkplaceType;
  employmentType?: EEmploymentType;

  numberOfOpenings?: number;

  locations: {
    label: string;
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }[];

  summary?: string;
  tags?: string[];

  description: BlockNoteDocJSON;

  coverImage?: IFileAsset;

  compensation?: any;
  benefitsPreview?: string[];

  allowApplications?: boolean;
};

export const POST = async (req: NextRequest) => {
  let rollback: (() => Promise<void>) | null = null;

  try {
    await connectDB();
    const user = await guard();

    const body = await parseJsonBody<PostBody>(req);

    const title = trim(body?.title);
    if (!title) return errorResponse(400, "title is required");

    if (!body?.workplaceType) return errorResponse(400, "workplaceType is required");

    const locations = Array.isArray(body?.locations)
      ? body.locations.filter((l) => trim(l?.label))
      : [];
    if (!locations.length) return errorResponse(400, "At least one location is required");

    const incomingDoc = body?.description as BlockNoteDocJSON;
    if (!incomingDoc || typeof incomingDoc !== "object")
      return errorResponse(400, "description (BlockNote JSON) is required");

    const requestedSlug = trim(body?.slug);
    const slug = requestedSlug
      ? await ensureUniqueJobSlug(requestedSlug)
      : await ensureUniqueJobSlug(title);

    const now = new Date();
    const author: IBlogAuthor = { id: user.id, name: user.name, email: user.email };

    const job = new JobPostingModel({
      title,
      slug,
      department: trim(body?.department),
      workplaceType: body.workplaceType,
      employmentType: body.employmentType,

      numberOfOpenings: Math.max(1, Number(body?.numberOfOpenings ?? 1)),

      locations,

      summary: trim(body?.summary),
      tags: Array.isArray(body?.tags)
        ? body.tags.map((t) => String(t).trim()).filter(Boolean)
        : undefined,

      description: incomingDoc,
      coverImage: body?.coverImage,

      compensation: body?.compensation ?? undefined,
      benefitsPreview: Array.isArray(body?.benefitsPreview)
        ? body.benefitsPreview.map((x) => String(x).trim()).filter(Boolean)
        : undefined,

      status: EJobPostingStatus.DRAFT,
      allowApplications: body?.allowApplications ?? true,

      createdBy: author,
      lastEditedBy: author,
      lastEditedAt: now,
      createdAt: now,
      updatedAt: now,
    } as Partial<IJobPosting>);

    const jobId = job._id.toString();

    // finalize any embedded assets (and cover image) into jobs final area
    const finalized = await finalizeJobDocAssetsAllOrNothing({
      jobId,
      description: incomingDoc,
      coverImage: job.coverImage,
    });

    rollback = finalized.rollback;

    job.description = finalized.description;
    job.coverImage = finalized.coverImage;

    await job.validate();
    await job.save();

    const obj = job.toObject({ virtuals: true, getters: true });
    return successResponse(201, "Job posting created", {
      jobPosting: { ...obj, id: obj?._id?.toString?.() ?? jobId },
      assetsFinalizedCount: finalized.movedCount,
    });
  } catch (err) {
    if (rollback) await rollback();
    return errorResponse(err);
  }
};
