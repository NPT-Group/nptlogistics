// src/app/api/v1/admin/jobs/[id]/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { trim } from "@/lib/utils/stringUtils";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { JobApplicationModel } from "@/mongoose/models/JobApplication";

import type { IBlogAuthor } from "@/types/blogPost.types";
import type { BlockNoteDocJSON, IFileAsset } from "@/types/shared.types";
import { EJobPostingStatus, EWorkplaceType, EEmploymentType } from "@/types/jobPosting.types";

import {
  ensureUniqueJobSlug,
  finalizeJobDocAssetsAllOrNothing,
  cleanupRemovedJobAssets,
} from "@/lib/utils/jobs/jobPostingUtils";
import { collectS3KeysDeep } from "@/lib/utils/s3Helper";
import { deleteS3Objects } from "@/lib/utils/s3Helper/server";

/* -------------------------------------------------------------------------- */
/* GET /api/v1/admin/jobs/:id                                                 */
/* -------------------------------------------------------------------------- */

export const GET = async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;

    const job = await JobPostingModel.findById(id).lean();
    if (!job) return errorResponse(404, "Job posting not found");

    const applicationsCount = await JobApplicationModel.countDocuments({ jobPostingId: id });

    return successResponse(200, "Job posting", {
      jobPosting: { ...job, id: job?._id?.toString?.() ?? id },
      applicationsCount,
    });
  } catch (err) {
    return errorResponse(err);
  }
};

/* -------------------------------------------------------------------------- */
/* PATCH /api/v1/admin/jobs/:id                                               */
/* -------------------------------------------------------------------------- */

type PatchBody = {
  title?: string;
  slug?: string;
  department?: string;
  workplaceType?: EWorkplaceType;
  employmentType?: EEmploymentType;

  numberOfOpenings?: number;

  locations?: {
    label: string;
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }[];

  summary?: string;
  tags?: string[];

  description?: BlockNoteDocJSON;

  coverImage?: IFileAsset | null;

  compensation?: any;
  benefitsPreview?: string[];

  status?: EJobPostingStatus;
  allowApplications?: boolean;
};

export const PATCH = async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  let rollback: (() => Promise<void>) | null = null;

  try {
    await connectDB();
    const user = await guard();

    const { id } = await ctx.params;

    const existing = await JobPostingModel.findById(id);
    if (!existing) return errorResponse(404, "Job posting not found");

    const beforeSnapshot = {
      description: (existing as any).description,
      coverImage: (existing as any).coverImage,
    };

    const body = await parseJsonBody<PatchBody>(req);

    const nextTitle = body?.title != null ? trim(body.title) : undefined;
    if (body?.title != null && !nextTitle) return errorResponse(400, "title cannot be empty");

    const requestedSlug = body?.slug != null ? trim(body.slug) : undefined;
    if (requestedSlug === "") return errorResponse(400, "slug cannot be empty");

    if (nextTitle != null) (existing as any).title = nextTitle;

    if (body?.department !== undefined) (existing as any).department = trim(body.department);

    if (body?.workplaceType !== undefined) (existing as any).workplaceType = body.workplaceType;
    if (body?.employmentType !== undefined) (existing as any).employmentType = body.employmentType;

    if (body?.numberOfOpenings !== undefined) {
      (existing as any).numberOfOpenings = Math.max(1, Number(body.numberOfOpenings));
    }

    if (requestedSlug != null) {
      if (requestedSlug && requestedSlug !== (existing as any).slug) {
        (existing as any).slug = await ensureUniqueJobSlug(requestedSlug);
      }
    }

    if (body?.locations !== undefined) {
      const locs = Array.isArray(body.locations)
        ? body.locations.filter((l) => trim(l?.label))
        : [];
      if (!locs.length) return errorResponse(400, "At least one location is required");
      (existing as any).locations = locs;
    }

    if (body?.summary !== undefined) (existing as any).summary = trim(body.summary);

    if (body?.tags !== undefined) {
      (existing as any).tags = Array.isArray(body.tags)
        ? body.tags.map((t) => String(t).trim()).filter(Boolean)
        : undefined;
    }

    if (body?.compensation !== undefined)
      (existing as any).compensation = body.compensation ?? undefined;

    if (body?.benefitsPreview !== undefined) {
      (existing as any).benefitsPreview = Array.isArray(body.benefitsPreview)
        ? body.benefitsPreview.map((x) => String(x).trim()).filter(Boolean)
        : undefined;
    }

    if (body?.status !== undefined) (existing as any).status = body.status;
    if (body?.allowApplications !== undefined)
      (existing as any).allowApplications = body.allowApplications;

    // description update
    if (body?.description !== undefined) {
      const doc = body.description;
      if (!doc || typeof doc !== "object")
        return errorResponse(400, "description must be valid BlockNote JSON");
      (existing as any).description = doc;
    }

    // cover image update
    if (body?.coverImage !== undefined) {
      (existing as any).coverImage = body.coverImage === null ? undefined : body.coverImage;
    }

    // finalize embedded assets / cover image
    const jobId = existing._id.toString();
    const finalized = await finalizeJobDocAssetsAllOrNothing({
      jobId,
      description: (existing as any).description as any,
      coverImage: (existing as any).coverImage as any,
    });

    rollback = finalized.rollback;

    (existing as any).description = finalized.description;
    (existing as any).coverImage = finalized.coverImage;

    const editor: IBlogAuthor = { id: user.id, name: user.name, email: user.email };
    (existing as any).lastEditedBy = editor;
    (existing as any).lastEditedAt = new Date();
    (existing as any).updatedAt = new Date();

    await existing.validate();
    await existing.save();

    // best-effort cleanup removed assets
    try {
      const afterSnapshot = {
        description: (existing as any).description,
        coverImage: (existing as any).coverImage,
      };
      await cleanupRemovedJobAssets(beforeSnapshot, afterSnapshot);
    } catch (e) {
      console.warn("Job asset cleanup failed:", e);
    }

    const obj = existing.toObject({ virtuals: true, getters: true });
    return successResponse(200, "Job posting updated", {
      jobPosting: { ...obj, id: obj?._id?.toString?.() ?? jobId },
      assetsFinalizedCount: finalized.movedCount,
    });
  } catch (err) {
    if (rollback) await rollback();
    return errorResponse(err);
  }
};

/* -------------------------------------------------------------------------- */
/* DELETE /api/v1/admin/jobs/:id                                              */
/* -------------------------------------------------------------------------- */

export const DELETE = async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;

    const job = await JobPostingModel.findById(id).select({ description: 1, coverImage: 1 }).lean();
    if (!job) return errorResponse(404, "Job posting not found");

    // delete job + its applications
    await JobPostingModel.deleteOne({ _id: id });
    const apps = await JobApplicationModel.find({ jobPostingId: id })
      .select({ resume: 1, photo: 1 })
      .lean();
    await JobApplicationModel.deleteMany({ jobPostingId: id });

    // best-effort S3 cleanup:
    try {
      // job media embedded in description + cover
      const jobKeys = collectS3KeysDeep({
        description: (job as any).description,
        coverImage: (job as any).coverImage,
      });

      // application assets (resume/photo)
      const appKeys = apps.flatMap((a: any) =>
        collectS3KeysDeep({ resume: a.resume, photo: a.photo }),
      );

      const all = Array.from(new Set([...jobKeys, ...appKeys]));
      if (all.length) await deleteS3Objects(all);
    } catch (e) {
      console.warn("Failed to delete job/app S3 assets:", id, e);
    }

    return successResponse(200, "Job posting deleted", { id });
  } catch (err) {
    return errorResponse(err);
  }
};
