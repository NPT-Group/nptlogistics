import { sendMailAppOnly } from "@/lib/mail/mailer";
import { escapeHtml } from "@/lib/mail/utils";
import { buildDefaultEmailTemplate } from "@/lib/mail/templates/defaultTemplate";
import { getContactInquiryDepartmentEmail } from "@/config/contact";

import type { IContactInquiry } from "@/types/contactInquiry.types";
import { EContactInquiryCategory } from "@/types/contactInquiry.types";

function fmtDate(v?: string | Date) {
  if (!v) return "—";
  const d = typeof v === "string" ? new Date(v) : v;
  if (Number.isNaN(d.getTime())) return escapeHtml(String(v));
  return escapeHtml(d.toISOString().slice(0, 10));
}

function humanizeEnumFallback(v: string) {
  return v
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function getInquiryContactName(inquiry: IContactInquiry["inquiry"]): string | undefined {
  switch (inquiry.category) {
    case EContactInquiryCategory.CUSTOMER_SALES:
    case EContactInquiryCategory.SAFETY:
    case EContactInquiryCategory.IT_SUPPORT:
    case EContactInquiryCategory.GENERAL:
      return inquiry.contact.fullName;

    case EContactInquiryCategory.CARRIERS:
      return inquiry.contact.contactName;

    default:
      return undefined;
  }
}

function getInquiryContactEmail(inquiry: IContactInquiry["inquiry"]): string | undefined {
  return inquiry.contact?.email;
}

export type SendContactInquiryCustomerConfirmationEmailParams = {
  inquiry: IContactInquiry;
  to?: string;
  sourceLabel?: string;
};

export async function sendContactInquiryCustomerConfirmationEmail(
  params: SendContactInquiryCustomerConfirmationEmailParams,
): Promise<void> {
  const inquiry = params.inquiry;
  const category = inquiry.inquiry?.category;
  const departmentEmail = getContactInquiryDepartmentEmail(category);

  const toAddr = params.to || getInquiryContactEmail(inquiry.inquiry);
  if (!toAddr) return;

  const contactName = getInquiryContactName(inquiry.inquiry) || "there";
  const firstName = String(contactName).trim().split(/\s+/)[0] || "there";

  const safeName = escapeHtml(firstName);
  const safeInquiryId = escapeHtml(String(inquiry.inquiryId || "—"));
  const safeCategory = escapeHtml(category ? humanizeEnumFallback(category) : "Contact Inquiry");

  const subject = `We received your message – ${safeCategory}`;

  const bodyHtml = `
    <p style="margin:0 0 12px 0;">Hi ${safeName},</p>

    <p style="margin:0 0 12px 0;">
      Thanks for contacting NPT Logistics — we’ve received your message and routed it to the appropriate team.
    </p>

    <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;">
      <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Your inquiry</p>
      <p style="margin:0; font-size:13px; color:#6b7280;">
        Reference ID:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeInquiryId}</span>
        • Category:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeCategory}</span>
      </p>
      <p style="margin:6px 0 0 0; font-size:13px; color:#6b7280;">
        Submitted: ${fmtDate(inquiry.createdAt)}
        ${params.sourceLabel ? ` • Source: ${escapeHtml(params.sourceLabel)}` : ""}
      </p>
    </div>

    <p style="margin:0 0 12px 0; color:#374151;">
      A team member will follow up as soon as possible. If you need to add details or correct anything,
      reply to this email and include your Reference ID.
    </p>

    <p style="margin:0 0 24px 0;">
      — NPT Logistics<br/>
      <a href="mailto:${escapeHtml(departmentEmail)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(
        departmentEmail,
      )}</a>
    </p>
  `;

  const html = buildDefaultEmailTemplate({
    subject,
    heading: "We’ve got your message",
    subtitle: `Reference ID: ${safeInquiryId}`,
    bodyHtml,
    footerContactEmail: departmentEmail,
  });

  await sendMailAppOnly({
    from: departmentEmail,
    to: [String(toAddr)],
    subject,
    html,
  });
}
