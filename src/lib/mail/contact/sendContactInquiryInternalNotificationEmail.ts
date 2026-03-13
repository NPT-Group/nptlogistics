import { sendMailAppOnly, type GraphAttachment } from "@/lib/mail/mailer";
import { escapeHtml } from "@/lib/mail/utils";
import { buildDefaultEmailTemplate } from "@/lib/mail/templates/defaultTemplate";
import { filenameForAsset } from "@/lib/utils/files/mime";
import { getContactInquiryDepartmentEmail } from "@/config/contact";

import type { IFileAsset } from "@/types/shared.types";
import type { IContactInquiry, ContactInquiryDetails } from "@/types/contactInquiry.types";
import {
  EContactInquiryCategory,
  ECustomerSalesInquiryType,
  EInquiryPreferredContactMethod,
  ECarrierInquiryType,
  ECarrierTrailerType,
  ECarrierOperatingRegion,
  ESafetyVehicleType,
  ESafetyIncidentType,
  EITSupportApplicationSystem,
  EITSupportIssueType,
  EITSupportUrgencyLevel,
  EGeneralInquiryType,
} from "@/types/contactInquiry.types";

function humanizeEnumFallback(v: string) {
  return v
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function fmtEnum(v?: string | null) {
  if (!v) return "—";
  return escapeHtml(humanizeEnumFallback(String(v)));
}

function fmtDate(v?: string | Date | null) {
  if (!v) return "—";
  const d = typeof v === "string" ? new Date(v) : v;
  if (Number.isNaN(d.getTime())) return escapeHtml(String(v));
  return escapeHtml(d.toISOString().slice(0, 10));
}

function renderList(items: Array<{ label: string; value?: string | null }>) {
  return `
    <ul style="margin:0 0 16px 18px; padding:0;">
      ${items
        .map(
          (item) =>
            `<li style="margin:0 0 8px 0;">${escapeHtml(item.label)}: ${item.value ? item.value : "—"}</li>`,
        )
        .join("")}
    </ul>
  `;
}

async function assetToAttachment(
  asset?: IFileAsset,
  fallbackBase = "attachment",
): Promise<{ attachment?: GraphAttachment; note?: string }> {
  if (!asset) return {};
  const url = (asset as Partial<IFileAsset> & { url?: string }).url;
  const mimeType = (asset as Partial<IFileAsset> & { mimeType?: string }).mimeType;

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

function categoryLabel(category?: EContactInquiryCategory) {
  return category ? humanizeEnumFallback(category) : "Contact Inquiry";
}

function renderInquirySummary(inquiry: ContactInquiryDetails): string {
  switch (inquiry.category) {
    case EContactInquiryCategory.CUSTOMER_SALES: {
      const c = inquiry.contact;
      const d = inquiry.details;

      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Customer / Sales Inquiry</p>

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Contact</p>
        ${renderList([
          { label: "Name", value: escapeHtml(c.fullName) },
          {
            label: "Email",
            value: `<a href="mailto:${escapeHtml(c.email)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.email)}</a>`,
          },
          {
            label: "Phone",
            value: `<a href="tel:${escapeHtml(c.phone)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.phone)}</a>`,
          },
          { label: "Company", value: c.companyName ? escapeHtml(c.companyName) : "—" },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Details</p>
        ${renderList([
          { label: "Inquiry Type", value: fmtEnum(d.inquiryType as ECustomerSalesInquiryType) },
          {
            label: "Reference / Load Number",
            value: d.loadOrReferenceNumber ? escapeHtml(d.loadOrReferenceNumber) : "—",
          },
          {
            label: "Preferred Contact Method",
            value: fmtEnum(d.preferredContactMethod as EInquiryPreferredContactMethod),
          },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Message</p>
        <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; white-space:pre-wrap;">${escapeHtml(
          d.message,
        )}</div>
      `;
    }

    case EContactInquiryCategory.CARRIERS: {
      const c = inquiry.contact;
      const d = inquiry.details;
      const eq = inquiry.equipmentInformation;

      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Carrier Inquiry</p>

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Contact</p>
        ${renderList([
          { label: "Contact Name", value: escapeHtml(c.contactName) },
          {
            label: "Email",
            value: `<a href="mailto:${escapeHtml(c.email)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.email)}</a>`,
          },
          {
            label: "Phone",
            value: `<a href="tel:${escapeHtml(c.phone)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.phone)}</a>`,
          },
          {
            label: "Carrier Company",
            value: c.carrierCompanyName ? escapeHtml(c.carrierCompanyName) : "—",
          },
          { label: "DOT Number", value: c.dotNumber ? escapeHtml(c.dotNumber) : "—" },
          { label: "MC Number", value: c.mcNumber ? escapeHtml(c.mcNumber) : "—" },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Details</p>
        ${renderList([
          { label: "Inquiry Type", value: fmtEnum(d.inquiryType as ECarrierInquiryType) },
          {
            label: "Trailer Type",
            value: fmtEnum(eq?.trailerType as ECarrierTrailerType),
          },
          {
            label: "Operating Regions",
            value:
              Array.isArray(d.operatingRegions) && d.operatingRegions.length
                ? escapeHtml(
                    d.operatingRegions
                      .map((v) => humanizeEnumFallback(v as ECarrierOperatingRegion))
                      .join(", "),
                  )
                : "—",
          },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Message</p>
        <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; white-space:pre-wrap;">${escapeHtml(
          d.message,
        )}</div>
      `;
    }

    case EContactInquiryCategory.SAFETY: {
      const c = inquiry.contact;
      const i = inquiry.incidentInformation;
      const d = inquiry.details;

      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Safety Inquiry</p>

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Contact</p>
        ${renderList([
          { label: "Name", value: escapeHtml(c.fullName) },
          {
            label: "Email",
            value: `<a href="mailto:${escapeHtml(c.email)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.email)}</a>`,
          },
          {
            label: "Phone",
            value: `<a href="tel:${escapeHtml(c.phone)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.phone)}</a>`,
          },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Incident Information</p>
        ${renderList([
          {
            label: "Location",
            value: i?.locationOfIncident ? escapeHtml(i.locationOfIncident) : "—",
          },
          { label: "Incident Date", value: fmtDate(i?.dateOfIncident) },
          { label: "Vehicle Type", value: fmtEnum(i?.vehicleType as ESafetyVehicleType) },
          { label: "Incident Type", value: fmtEnum(i?.incidentType as ESafetyIncidentType) },
          {
            label: "Reference / Load Number",
            value: i?.referenceOrLoadNumber ? escapeHtml(i.referenceOrLoadNumber) : "—",
          },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Description</p>
        <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; white-space:pre-wrap;">${escapeHtml(
          d.descriptionOfIncident,
        )}</div>
      `;
    }

    case EContactInquiryCategory.IT_SUPPORT: {
      const c = inquiry.contact;
      const s = inquiry.systemInformation;
      const d = inquiry.details;

      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">IT Support Inquiry</p>

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Contact</p>
        ${renderList([
          { label: "Name", value: escapeHtml(c.fullName) },
          {
            label: "Email",
            value: `<a href="mailto:${escapeHtml(c.email)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.email)}</a>`,
          },
          {
            label: "Phone",
            value: c.phone
              ? `<a href="tel:${escapeHtml(c.phone)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.phone)}</a>`
              : "—",
          },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">System Information</p>
        ${renderList([
          {
            label: "Application / System",
            value: fmtEnum(s?.applicationOrSystem as EITSupportApplicationSystem),
          },
          { label: "Issue Type", value: fmtEnum(s?.typeOfIssue as EITSupportIssueType) },
          { label: "Urgency", value: fmtEnum(s?.urgencyLevel as EITSupportUrgencyLevel) },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Message</p>
        <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; white-space:pre-wrap;">${escapeHtml(
          d.message,
        )}</div>
      `;
    }

    case EContactInquiryCategory.GENERAL: {
      const c = inquiry.contact;
      const d = inquiry.details;

      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">General Inquiry</p>

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Contact</p>
        ${renderList([
          { label: "Name", value: escapeHtml(c.fullName) },
          {
            label: "Email",
            value: `<a href="mailto:${escapeHtml(c.email)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.email)}</a>`,
          },
          {
            label: "Phone",
            value: c.phone
              ? `<a href="tel:${escapeHtml(c.phone)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(c.phone)}</a>`
              : "—",
          },
          { label: "Company", value: c.company ? escapeHtml(c.company) : "—" },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Details</p>
        ${renderList([
          { label: "Inquiry Type", value: fmtEnum(d.inquiryType as EGeneralInquiryType) },
        ])}

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Message</p>
        <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; white-space:pre-wrap;">${escapeHtml(
          d.message,
        )}</div>
      `;
    }

    default:
      return `
        <p style="margin:0 0 16px 0; color:#6b7280;">Unknown inquiry type.</p>
      `;
  }
}

export type SendContactInquiryInternalNotificationEmailParams = {
  to?: string;
  inquiry: IContactInquiry;
  sourceLabel?: string;
};

export async function sendContactInquiryInternalNotificationEmail(
  params: SendContactInquiryInternalNotificationEmailParams,
): Promise<void> {
  const inquiry = params.inquiry;
  const category = inquiry.inquiry?.category;
  const departmentEmail = params.to || getContactInquiryDepartmentEmail(category);

  const safeInquiryId = escapeHtml(String(inquiry.inquiryId || "—"));
  const safeCategory = escapeHtml(categoryLabel(category));
  const safeSource = params.sourceLabel ? escapeHtml(params.sourceLabel) : "";

  const subject = `New Contact Inquiry – ${safeCategory}${safeSource ? ` (${safeSource})` : ""}`;

  const attachments: GraphAttachment[] = [];
  const attachmentNotes: string[] = [];
  const files: IFileAsset[] = Array.isArray(inquiry.attachments) ? inquiry.attachments : [];

  for (let i = 0; i < files.length; i++) {
    const asset = files[i];
    const fallbackBase = `contact-inquiry-attachment-${i + 1}`;

    try {
      const { attachment, note } = await assetToAttachment(asset, fallbackBase);
      if (attachment) attachments.push(attachment);
      if (note) attachmentNotes.push(note);
    } catch {
      attachmentNotes.push(`Failed to attach ${fallbackBase} due to an unexpected error.`);
    }
  }

  const attachmentsBlock = `
    <p style="margin:16px 0 8px 0; font-weight:600; color:#111827;">Attachments</p>
    ${
      files.length
        ? `
          <ul style="margin:0 0 12px 18px; padding:0;">
            ${files
              .map((a, idx) => {
                const meta = a as IFileAsset & {
                  originalName?: string;
                  filename?: string;
                  name?: string;
                  sizeBytes?: number;
                  mimeType?: string;
                };

                const name =
                  meta.originalName || meta.filename || meta.name || `Attachment ${idx + 1}`;
                const mime = meta.mimeType ? String(meta.mimeType) : "";
                const size = meta.sizeBytes ? `${Number(meta.sizeBytes)} bytes` : "";
                const metaText = [mime, size].filter(Boolean).join(" • ");

                return `<li style="margin:0 0 8px 0;">${escapeHtml(String(name))}${metaText ? ` <span style="color:#6b7280;">(${escapeHtml(metaText)})</span>` : ""}</li>`;
              })
              .join("")}
          </ul>
        `
        : `<p style="margin:0 0 16px 0; color:#6b7280;">No attachments provided.</p>`
    }

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

  const metaBlock = `
    <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;">
      <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Inquiry</p>
      <p style="margin:0; font-size:13px; color:#6b7280;">
        Reference ID:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeInquiryId}</span>
        • Category:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeCategory}</span>
      </p>
      <p style="margin:6px 0 0 0; font-size:13px; color:#6b7280;">
        Created: ${fmtDate(inquiry.createdAt)} • Updated: ${fmtDate(inquiry.updatedAt)}
      </p>
    </div>
  `;

  const bodyHtml = `
    <p style="margin:0 0 12px 0;">A new contact inquiry has been submitted.</p>
    ${metaBlock}
    ${attachmentsBlock}
    ${renderInquirySummary(inquiry.inquiry)}
    <p style="margin:0 0 24px 0;">NPT Logistics</p>
  `;

  const html = buildDefaultEmailTemplate({
    subject,
    heading: "New contact inquiry received",
    subtitle: safeCategory,
    bodyHtml,
    footerContactEmail: departmentEmail,
  });

  await sendMailAppOnly({
    from: departmentEmail,
    to: [departmentEmail],
    subject,
    html,
    attachments: attachments.length ? attachments : undefined,
  });
}
