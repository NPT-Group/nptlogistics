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

import { sendJobApplicantConfirmationEmail } from "@/lib/mail/jobApplications/sendJobApplicantConfirmationEmail";
import { sendJobApplicantHrNotificationEmail } from "@/lib/mail/jobApplications/sendJobApplicantHrNotificationEmail";

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

/**
 * Derive the public-facing site origin from the incoming request.
 * Works for localhost, http/https, and reverse-proxy deployments.
 */
function getSiteUrlFromRequest(req: NextRequest): string {
  // 1) Prefer req.nextUrl.origin (Next.js usually sets this well)
  const origin = req.nextUrl?.origin;
  if (origin && origin !== "null") return origin;

  // 2) Fall back to proxy headers
  const h = req.headers;
  const proto = (h.get("x-forwarded-proto") || "").split(",")[0].trim();
  const forwardedHost = (h.get("x-forwarded-host") || "").split(",")[0].trim();
  if (proto && forwardedHost) return `${proto}://${forwardedHost}`;

  // 3) Fall back to host header; assume https unless clearly localhost
  const host = (h.get("host") || "").trim();
  if (host) {
    const scheme = host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    return `${scheme}://${host}`;
  }

  // 4) Last resort
  return "http://localhost:3000";
}

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
      // expectedAction: "job_apply",
    });

    if (!turnstile.ok) {
      return errorResponse(400, "Turnstile validation failed");
    }
    // --- end Turnstile ---

    const firstName = trim(body?.firstName);
    const lastName = trim(body?.lastName);
    const email = trim(body?.email);

    if (!firstName || !lastName || !email)
      return errorResponse(400, "firstName, lastName, email are required");

    const emailLower = String(email).toLowerCase();

    // Prevent duplicate applications for the same job + email
    const alreadyApplied = await JobApplicationModel.exists({
      jobPostingId: (job as any)._id,
      email: emailLower,
    });

    if (alreadyApplied) {
      return errorResponse(409, "You have already applied for this job with this email");
    }

    if (!body?.resume?.s3Key || !body?.resume?.url || !body?.resume?.mimeType) {
      return errorResponse(400, "resume is required and must be a valid file asset");
    }

    // Create app first to get id for final folder
    const app = new JobApplicationModel({
      jobPostingId: (job as any)._id,

      firstName,
      lastName,
      email: emailLower,
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

    const jobId = String((job as any)._id);
    const jobTitle = (job as any)?.title || (job as any)?.name || undefined;
    const siteUrl = getSiteUrlFromRequest(req);

    // ───────────────────────── Applicant confirmation (non-blocking) ─────────────────────────
    try {
      await sendJobApplicantConfirmationEmail({
        to: emailLower,
        firstName,
        lastName,
        jobTitle,
        applicationId: appId,
      });
    } catch (mailErr) {
      console.warn("Failed to send applicant confirmation email:", mailErr);
    }
    // ────────────────────────────────────────────────────────────────────────────────────────

    // ───────────────────────── HR notification (non-blocking) ─────────────────────────
    try {
      await sendJobApplicantHrNotificationEmail({
        siteUrl,
        applicationId: appId,
        job: {
          id: jobId,
          title: jobTitle,
          slug: (job as any)?.slug || s,
        },
        applicant: {
          firstName,
          lastName,
          email: emailLower,
          phone: trim(body?.phone),
          currentLocation: trim(body?.currentLocation),
          addressLine: trim(body?.addressLine),
          linkedInUrl: trim(body?.linkedInUrl),
          portfolioUrl: trim(body?.portfolioUrl),
          commuteMode: trim(body?.commuteMode),
          canWorkOnsite: body?.canWorkOnsite,
          hasReferences: body?.hasReferences,
          coverLetter: trim(body?.coverLetter),
        },
        // attach finalized files (self-sustaining email)
        resume: app.resume as any,
        photo: app.photo as any,
      });
    } catch (mailErr) {
      console.warn("Failed to send HR notification email:", mailErr);
    }
    // ─────────────────────────────────────────────────────────────────────────────────

    const obj = app.toObject({ virtuals: true, getters: true });

    return successResponse(201, "Application submitted", {
      jobApplication: { ...obj, id: obj?._id?.toString?.() ?? appId },
    });
  } catch (err) {
    return errorResponse(err);
  }
};
