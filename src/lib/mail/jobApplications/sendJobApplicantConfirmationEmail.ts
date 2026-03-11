// src/lib/utils/mail/jobApplicants/sendJobApplicantConfirmationEmail.ts
import { sendMailAppOnly } from "@/lib/mail/mailer";
import { escapeHtml } from "@/lib/mail/utils";
import { buildDefaultEmailTemplate } from "@/lib/mail/templates/defaultTemplate";
import { NEXT_PUBLIC_NPT_HR_EMAIL } from "@/config/env";

export type SendJobApplicantConfirmationEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  applicationId?: string;
};

export async function sendJobApplicantConfirmationEmail(
  params: SendJobApplicantConfirmationEmailParams,
): Promise<void> {
  const { to, firstName, lastName, jobTitle, applicationId } = params;

  const fullName = `${firstName} ${lastName}`.trim();
  const escapedName = escapeHtml(fullName || "there");
  const escapedJobTitle = jobTitle ? escapeHtml(jobTitle) : "";
  const escapedAppId = applicationId ? escapeHtml(applicationId) : "";

  const subject = escapedJobTitle
    ? `NPT Careers – Application Received (${escapedJobTitle})`
    : "NPT Careers – Application Received";

  const jobTitleLine = escapedJobTitle
    ? `<p style="margin:0 0 12px 0;">Position: <strong style="font-weight:600; color:#111827;">${escapedJobTitle}</strong></p>`
    : "";

  const appIdLine = escapedAppId
    ? `<p style="margin:0 0 16px 0; font-size:13px; color:#6b7280;">Reference: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${escapedAppId}</span></p>`
    : "";

  const bodyHtml = `
    <p style="margin:0 0 16px 0;">Hi ${escapedName},</p>
    <p style="margin:0 0 12px 0;">
      Thanks for applying. We’ve received your application${escapedJobTitle ? " for the role below" : ""}.
    </p>
    ${jobTitleLine}
    ${appIdLine}
    <p style="margin:0 0 16px 0;">
      Our team will review your submission and reach out if there’s a fit for next steps.
    </p>
    <p style="margin:0 0 4px 0;">Thank you,</p>
    <p style="margin:0 0 24px 0;">NPT Recruiting</p>
  `;

  const html = buildDefaultEmailTemplate({
    subject,
    heading: "We received your application",
    subtitle: escapedJobTitle ? `Position: ${escapedJobTitle}` : "NPT Careers",
    bodyHtml,
    footerContactEmail: NEXT_PUBLIC_NPT_HR_EMAIL,
  });

  await sendMailAppOnly({
    from: NEXT_PUBLIC_NPT_HR_EMAIL,
    to: [to],
    subject,
    html,
  });
}
