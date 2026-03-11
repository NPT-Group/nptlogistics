// src/lib/mail/quotes/sendQuoteCustomerConfirmationEmail.ts
import { sendMailAppOnly } from "@/lib/mail/mailer";
import { escapeHtml } from "@/lib/mail/utils";
import { buildDefaultEmailTemplate } from "@/lib/mail/templates/defaultTemplate";
import { NEXT_PUBLIC_NPT_LOGISTICS_EMAIL } from "@/config/env";

import type { ILogisticsQuote } from "@/types/logisticsQuote.types";

function fmtDate(v?: string | Date) {
  if (!v) return "—";
  const d = typeof v === "string" ? new Date(v) : v;
  if (Number.isNaN(d.getTime())) return escapeHtml(String(v));
  return escapeHtml(d.toISOString().slice(0, 10)); // YYYY-MM-DD
}

export type SendQuoteCustomerConfirmationEmailParams = {
  quote: ILogisticsQuote;

  /** optional: override recipient (otherwise quote.contact.email) */
  to?: string;

  /** optional: include website / campaign label */
  sourceLabel?: string;
};

export async function sendQuoteCustomerConfirmationEmail(
  params: SendQuoteCustomerConfirmationEmailParams,
): Promise<void> {
  const q: any = params.quote;
  const contact: any = q.contact || {};
  const service: any = q.serviceDetails || {};

  const toAddr = params.to || contact.email;
  if (!toAddr) return; // no customer email -> silently skip

  const firstName = contact.firstName ? String(contact.firstName) : "";
  const safeName = escapeHtml(firstName || "there");

  const safePrimary = escapeHtml(String(service.primaryService || "Quote"));
  const safeId = escapeHtml(String(q.quoteId || "—"));

  const subject = `We received your quote request – ${safePrimary}`;

  const bodyHtml = `
    <p style="margin:0 0 12px 0;">Hi ${safeName},</p>

    <p style="margin:0 0 12px 0;">
      Thanks for reaching out to NPT Logistics — we’ve received your quote request and our team will review it shortly.
    </p>

    <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;">
      <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Your request</p>
      <p style="margin:0; font-size:13px; color:#6b7280;">
        Reference ID:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeId}</span>
        • Service: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safePrimary}</span>
      </p>
      <p style="margin:6px 0 0 0; font-size:13px; color:#6b7280;">
        Submitted: ${fmtDate(q.createdAt)}
        ${params.sourceLabel ? `• Source: ${escapeHtml(params.sourceLabel)}` : ""}
      </p>
    </div>

    <p style="margin:0 0 12px 0; color:#374151;">
      If you need to add details or correct anything, just reply to this email and include your Reference ID.
    </p>

    <p style="margin:0 0 24px 0;">
      — NPT Logistics<br/>
      <a href="mailto:${escapeHtml(NEXT_PUBLIC_NPT_LOGISTICS_EMAIL)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(
        NEXT_PUBLIC_NPT_LOGISTICS_EMAIL,
      )}</a>
    </p>
  `;

  const html = buildDefaultEmailTemplate({
    subject,
    heading: "We’ve got it!",
    subtitle: `Reference ID: ${safeId}`,
    bodyHtml,
    footerContactEmail: NEXT_PUBLIC_NPT_LOGISTICS_EMAIL,
  });

  await sendMailAppOnly({
    from: NEXT_PUBLIC_NPT_LOGISTICS_EMAIL,
    to: [String(toAddr)],
    subject,
    html,
  });
}
