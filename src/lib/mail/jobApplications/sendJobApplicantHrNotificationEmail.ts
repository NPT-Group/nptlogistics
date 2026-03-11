// src/lib/utils/mail/jobApplicants/sendJobApplicantHrNotificationEmail.ts
import { sendMailAppOnly, type GraphAttachment } from "@/lib/mail/mailer";
import { escapeHtml } from "@/lib/mail/utils";
import { buildDefaultEmailTemplate } from "@/lib/mail/templates/defaultTemplate";
import { NEXT_PUBLIC_NPT_HR_EMAIL } from "@/config/env";
import type { IFileAsset } from "@/types/shared.types";
import { filenameForAsset } from "@/lib/utils/files/mime";

export type SendJobApplicantHrNotificationEmailParams = {
  /** HR mailbox recipient */
  to?: string;

  /** Base site url, e.g. https://nptlogistics.com */
  siteUrl: string;

  job: {
    id: string;
    title?: string;
    slug?: string;
  };

  applicationId: string;

  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    currentLocation?: string;
    addressLine?: string;
    linkedInUrl?: string;
    portfolioUrl?: string;
    commuteMode?: string;
    canWorkOnsite?: boolean;
    hasReferences?: boolean;
    coverLetter?: string;
  };

  /** Finalized assets (preferred: pass app.resume/app.photo after finalizeAssetSafe) */
  resume?: IFileAsset;
  photo?: IFileAsset;
};

function yn(v?: boolean) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}

function joinUrl(base: string, path: string) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

async function assetToAttachment(
  asset?: IFileAsset,
  fallbackBase = "attachment",
): Promise<{
  attachment?: GraphAttachment;
  note?: string;
}> {
  if (!asset) return {};
  const url = (asset as any)?.url;
  const mimeType = (asset as any)?.mimeType;

  if (!url || !mimeType) {
    return { note: `${fallbackBase} missing url or mimeType (not attached).` };
  }

  const res = await fetch(String(url));
  if (!res.ok) {
    return { note: `Failed to download ${fallbackBase} for attachment (${res.status}).` };
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = mimeType || res.headers.get("content-type") || "application/octet-stream";
  const name = filenameForAsset(asset, fallbackBase, contentType);

  return {
    attachment: {
      name,
      contentType,
      base64: buf.toString("base64"),
    },
  };
}

export async function sendJobApplicantHrNotificationEmail(
  params: SendJobApplicantHrNotificationEmailParams,
): Promise<void> {
  const toAddr = params.to || NEXT_PUBLIC_NPT_HR_EMAIL;

  const jobTitle = params.job?.title?.trim() || "Job Application";
  const safeJobTitle = escapeHtml(jobTitle);

  const fullName = `${params.applicant.firstName} ${params.applicant.lastName}`.trim();
  const safeName = escapeHtml(fullName || "Applicant");

  const safeApplicantEmail = escapeHtml(params.applicant.email);
  const safePhone = params.applicant.phone ? escapeHtml(params.applicant.phone) : "";
  const safeLocation = params.applicant.currentLocation
    ? escapeHtml(params.applicant.currentLocation)
    : "";
  const safeAddress = params.applicant.addressLine ? escapeHtml(params.applicant.addressLine) : "";

  const safeLinkedIn = params.applicant.linkedInUrl ? escapeHtml(params.applicant.linkedInUrl) : "";
  const safePortfolio = params.applicant.portfolioUrl
    ? escapeHtml(params.applicant.portfolioUrl)
    : "";

  const safeCommute = params.applicant.commuteMode ? escapeHtml(params.applicant.commuteMode) : "";
  const safeCover = params.applicant.coverLetter ? escapeHtml(params.applicant.coverLetter) : "";

  const safeAppId = escapeHtml(params.applicationId);
  const safeJobSlug = params.job?.slug ? escapeHtml(params.job.slug) : "";

  const adminUrl = joinUrl(
    params.siteUrl,
    `admin/jobs/${encodeURIComponent(params.job.id)}/applications`,
  );

  const subject = `New Application Received – ${jobTitle}`;

  // ───────────────────────── Attachments (resume/photo) ─────────────────────────
  const attachments: GraphAttachment[] = [];
  const attachmentNotes: string[] = [];

  try {
    const { attachment, note } = await assetToAttachment(params.resume, "resume");
    if (attachment) attachments.push(attachment);
    if (note) attachmentNotes.push(note);
  } catch {
    attachmentNotes.push("Failed to attach resume due to an unexpected error.");
  }

  if (params.photo) {
    try {
      const { attachment, note } = await assetToAttachment(params.photo, "photo");
      if (attachment) attachments.push(attachment);
      if (note) attachmentNotes.push(note);
    } catch {
      attachmentNotes.push("Failed to attach photo due to an unexpected error.");
    }
  }
  // ─────────────────────────────────────────────────────────────────────────────

  const adminButton = `
    <div style="margin:16px 0 0 0;">
      <a href="${adminUrl}"
         style="display:inline-block; background:#111827; color:#ffffff; text-decoration:none; padding:10px 14px; border-radius:10px; font-weight:600; font-size:14px;">
        View applications for this job
      </a>
    </div>
  `;

  const attachmentsBlock = `
    <p style="margin:16px 0 8px 0; font-weight:600; color:#111827;">Attachments</p>
    <ul style="margin:0 0 16px 18px; padding:0;">
      <li style="margin:0 0 8px 0;">Resume: ${params.resume ? "Attached" : "—"}</li>
      <li style="margin:0;">Photo: ${params.photo ? "Attached" : "—"}</li>
    </ul>
    ${
      attachmentNotes.length
        ? `
          <div style="margin:0 0 16px 0; padding:10px 12px; background:#fff7ed; border:1px solid #fdba74; border-radius:10px; color:#9a3412;">
            <p style="margin:0 0 6px 0; font-weight:600;">Attachment notes</p>
            <ul style="margin:0 0 0 18px; padding:0;">
              ${attachmentNotes.map((n) => `<li style="margin:0 0 6px 0;">${escapeHtml(n)}</li>`).join("")}
            </ul>
          </div>
        `
        : ""
    }
  `;

  const linksBlock =
    safeLinkedIn || safePortfolio
      ? `
        <p style="margin:16px 0 8px 0; font-weight:600; color:#111827;">Links</p>
        <ul style="margin:0 0 16px 18px; padding:0;">
          ${
            safeLinkedIn
              ? `<li style="margin:0 0 8px 0;"><a href="${safeLinkedIn}" style="color:#2563eb; text-decoration:none;">LinkedIn</a></li>`
              : ""
          }
          ${
            safePortfolio
              ? `<li style="margin:0;"><a href="${safePortfolio}" style="color:#2563eb; text-decoration:none;">Portfolio</a></li>`
              : ""
          }
        </ul>
      `
      : "";

  const coverLetterBlock = safeCover
    ? `
      <p style="margin:16px 0 8px 0; font-weight:600; color:#111827;">Cover Letter</p>
      <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; white-space:pre-wrap;">
        ${safeCover}
      </div>
    `
    : "";

  const bodyHtml = `
    <p style="margin:0 0 12px 0;">A new application has been submitted.</p>

    <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;">
      <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">${safeJobTitle}</p>
      <p style="margin:0; font-size:13px; color:#6b7280;">
        Application ID:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeAppId}</span>
        ${safeJobSlug ? ` • Job Slug: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeJobSlug}</span>` : ""}
      </p>
      ${adminButton}
    </div>

    ${attachmentsBlock}

    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Applicant</p>
    <ul style="margin:0 0 16px 18px; padding:0;">
      <li style="margin:0 0 8px 0;"><strong>${safeName}</strong></li>
      <li style="margin:0 0 8px 0;">
        Email:
        <a href="mailto:${safeApplicantEmail}" style="color:#2563eb; text-decoration:none;">${safeApplicantEmail}</a>
      </li>
      ${
        safePhone
          ? `<li style="margin:0 0 8px 0;">Phone: <a href="tel:${safePhone}" style="color:#2563eb; text-decoration:none;">${safePhone}</a></li>`
          : `<li style="margin:0 0 8px 0;">Phone: —</li>`
      }
      <li style="margin:0 0 8px 0;">Current Location: ${safeLocation || "—"}</li>
      <li style="margin:0;">Address Line: ${safeAddress || "—"}</li>
    </ul>

    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Notes</p>
    <ul style="margin:0 0 16px 18px; padding:0;">
      <li style="margin:0 0 8px 0;">Commute Mode: ${safeCommute || "—"}</li>
      <li style="margin:0 0 8px 0;">Can Work Onsite: ${yn(params.applicant.canWorkOnsite)}</li>
      <li style="margin:0;">Has References: ${yn(params.applicant.hasReferences)}</li>
    </ul>

    ${linksBlock}
    ${coverLetterBlock}

    <p style="margin:0 0 24px 0;">NPT Careers</p>
  `;

  const html = buildDefaultEmailTemplate({
    subject,
    heading: "New application received",
    subtitle: safeJobTitle,
    bodyHtml,
    footerContactEmail: NEXT_PUBLIC_NPT_HR_EMAIL,
  });

  await sendMailAppOnly({
    from: NEXT_PUBLIC_NPT_HR_EMAIL,
    to: [toAddr],
    subject,
    html,
    attachments: attachments.length ? attachments : undefined,
  });
}
