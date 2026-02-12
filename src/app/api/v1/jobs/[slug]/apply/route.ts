// src/app/api/v1/jobs/[slug]/apply/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { trim } from "@/lib/utils/stringUtils";
import { finalizeAssetSafe, makeEntityFinalPrefix } from "@/lib/utils/s3Helper";

import { JobPostingModel } from "@/mongoose/models/JobPosting";
import { JobApplicationModel } from "@/mongoose/models/JobApplication";

import { EJobPostingStatus } from "@/types/jobPosting.types";
import { ES3Namespace, ES3Folder } from "@/types/aws.types";
import { EJobApplicationStatus } from "@/types/jobApplication.types";
import type { IFileAsset } from "@/types/shared.types";

import { verifyTurnstileToken, getRequestIp } from "@/lib/utils/turnstile";

type ApplyBody = {
  // Turnstile
  turnstileToken: string;

  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  currentLocation?: string;
  addressLine?: string;

  resume: IFileAsset;
  photo?: IFileAsset;

  coverLetter?: string;

  linkedInUrl?: string;
  portfolioUrl?: string;

  commuteMode?: string;
  canWorkOnsite?: boolean;
  hasReferences?: boolean;
};

export const POST = async (req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  try {
    await connectDB();

    const { slug } = await ctx.params;
    const s = trim(slug);
    if (!s) return errorResponse(400, "Invalid slug");

    const job = await JobPostingModel.findOne({ slug: s }).lean();
    if (!job) return errorResponse(404, "Job not found");

    if ((job as any).status !== EJobPostingStatus.PUBLISHED)
      return errorResponse(400, "Job is not accepting applications");
    if ((job as any).allowApplications === false)
      return errorResponse(400, "Applications are disabled for this job");

    const body = await parseJsonBody<ApplyBody>(req);

    // --- Turnstile validation (required) ---
    const ip = getRequestIp(req.headers);
    const turnstile = await verifyTurnstileToken({
      token: body?.turnstileToken,
      ip,
      // If your frontend sets an action, set expectedAction here to enforce it.
      // expectedAction: "job_apply",
    });

    if (!turnstile.ok) {
      // Use 400 so bots don’t learn too much; keep message simple
      return errorResponse(400, "Turnstile validation failed");
      // If you want debugging in dev, you can log:
      // console.warn("Turnstile failed:", turnstile);
    }
    // --- end Turnstile ---

    const firstName = trim(body?.firstName);
    const lastName = trim(body?.lastName);
    const email = trim(body?.email);

    if (!firstName || !lastName || !email)
      return errorResponse(400, "firstName, lastName, email are required");

    if (!body?.resume?.s3Key || !body?.resume?.url || !body?.resume?.mimeType) {
      return errorResponse(400, "resume is required and must be a valid file asset");
    }

    // Create app first to get id for final folder
    const app = new JobApplicationModel({
      jobPostingId: (job as any)._id,

      firstName,
      lastName,
      email: String(email).toLowerCase(),
      phone: trim(body?.phone),

      currentLocation: trim(body?.currentLocation),
      addressLine: trim(body?.addressLine),

      resume: body.resume,
      photo: body.photo,

      coverLetter: trim(body?.coverLetter),

      linkedInUrl: trim(body?.linkedInUrl),
      portfolioUrl: trim(body?.portfolioUrl),

      commuteMode: trim(body?.commuteMode),
      canWorkOnsite: body?.canWorkOnsite,
      hasReferences: body?.hasReferences,

      status: EJobApplicationStatus.RECEIVED,
    });

    const appId = app._id.toString();

    // Finalize uploaded temp files into final submissions
    const resumeFolder = makeEntityFinalPrefix(
      ES3Namespace.JOBS,
      appId,
      ES3Folder.JOB_APPLICATION_RESUMES,
    );
    const photoFolder = makeEntityFinalPrefix(
      ES3Namespace.JOBS,
      appId,
      ES3Folder.JOB_APPLICATION_PHOTOS,
    );

    app.resume = (await finalizeAssetSafe(app.resume as any, resumeFolder)) as any;
    app.photo = (await finalizeAssetSafe(app.photo as any, photoFolder)) as any;

    await app.validate();
    await app.save();

    const obj = app.toObject({ virtuals: true, getters: true });

    return successResponse(201, "Application submitted", {
      jobApplication: { ...obj, id: obj?._id?.toString?.() ?? appId },
    });
  } catch (err) {
    return errorResponse(err);
  }
};
