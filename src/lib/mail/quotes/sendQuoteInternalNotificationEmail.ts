// src/lib/mail/quotes/sendQuoteNotificationEmail.ts
import { sendMailAppOnly, type GraphAttachment } from "@/lib/mail/mailer";
import { escapeHtml } from "@/lib/mail/utils";
import { buildDefaultEmailTemplate } from "@/lib/mail/templates/defaultTemplate";
import { NPT_QUOTES_EMAIL } from "@/config/env";

import type { IFileAsset } from "@/types/shared.types";
import {
  ELogisticsPrimaryService,
  type ILogisticsQuote,
  type QuoteServiceDetails,
  type LogisticsAddress,
  type LogisticsWeight,
  type LogisticsDimensions,
  type WarehousingVolume,
} from "@/types/logisticsQuote.types";
import { filenameForAsset } from "@/lib/utils/files/mime";
import {
  BROKER_TYPE_LABEL,
  EQUIPMENT_LABEL,
  FTL_ADDON_LABEL,
  IDENTITY_LABEL,
  LTL_ADDON_LABEL,
  PREF_CONTACT_LABEL,
  INTL_MODE_LABEL,
  INTL_SIZE_LABEL,
  WAREHOUSING_DURATION_LABEL,
  WAREHOUSING_VOLUME_TYPE_LABEL,
  labelFromMap,
  labelsFromMap,
} from "@/lib/utils/enums/logisticsLabels";

/* ───────────────────────── Small formatting helpers ───────────────────────── */

function yn(v?: boolean) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}

function fmtDate(v?: string | Date) {
  if (!v) return "—";
  const d = typeof v === "string" ? new Date(v) : v;
  if (Number.isNaN(d.getTime())) return escapeHtml(String(v));
  // Keep it readable, timezone-agnostic (backend can decide later if needed).
  return escapeHtml(d.toISOString().slice(0, 10)); // YYYY-MM-DD
}

function fmtAddress(a?: LogisticsAddress) {
  if (!a) return "—";
  const parts = [
    a.street1,
    a.street2,
    `${a.city}, ${a.region} ${a.postalCode}`.trim(),
    a.countryCode,
  ].filter(Boolean);
  return escapeHtml(parts.join(" • "));
}

function fmtWeight(w?: LogisticsWeight) {
  if (!w) return "—";
  const value = typeof w.value === "number" ? w.value : Number(w.value);
  const safeVal = Number.isFinite(value) ? String(value) : escapeHtml(String(w.value));
  return `${escapeHtml(safeVal)} ${escapeHtml(w.unit)}`;
}

function fmtDims(d?: LogisticsDimensions) {
  if (!d) return "—";
  const l = Number(d.length);
  const w = Number(d.width);
  const h = Number(d.height);
  const safe = [l, w, h].every((n) => Number.isFinite(n))
    ? `${l} × ${w} × ${h}`
    : `${d.length} × ${d.width} × ${d.height}`;
  return escapeHtml(safe);
}

function fmtWarehousingVolume(vol?: WarehousingVolume) {
  if (!vol) return "—";
  const label = labelFromMap(vol.volumeType, WAREHOUSING_VOLUME_TYPE_LABEL);
  const value =
    typeof vol.value === "number" ? String(vol.value) : escapeHtml(String((vol as any).value));
  return `${escapeHtml(label)}: ${escapeHtml(value)}`;
}

/* ───────────────────────── Attachments helper (S3 -> Graph) ───────────────────────── */

async function assetToAttachment(
  asset?: IFileAsset,
  fallbackBase = "attachment",
): Promise<{ attachment?: GraphAttachment; note?: string }> {
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

/* ───────────────────────── Service-specific rendering ───────────────────────── */

function renderServiceSummary(service: QuoteServiceDetails): string {
  switch (service.primaryService) {
    case ELogisticsPrimaryService.FTL: {
      const s: any = service;
      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (FTL)</p>
        <ul style="margin:0 0 16px 18px; padding:0;">
          <li style="margin:0 0 8px 0;">Equipment: <strong>${escapeHtml(labelFromMap(s.equipment, EQUIPMENT_LABEL))}</strong></li>
          <li style="margin:0 0 8px 0;">Origin: ${fmtAddress(s.origin)}</li>
          <li style="margin:0 0 8px 0;">Destination: ${fmtAddress(s.destination)}</li>
          <li style="margin:0 0 8px 0;">Ready Date: ${fmtDate(s.readyDate)} (Flexible: ${yn(s.readyDateFlexible)})</li>
          <li style="margin:0 0 8px 0;">Commodity: ${escapeHtml(String(s.commodityDescription || "—"))}</li>
          <li style="margin:0 0 8px 0;">Approx. Total Weight: ${fmtWeight(s.approximateTotalWeight)}</li>
          <li style="margin:0 0 8px 0;">Estimated Pallet Count: ${escapeHtml(String(s.estimatedPalletCount ?? "—"))}</li>
          <li style="margin:0 0 8px 0;">Dimensions (L×W×H): ${fmtDims(s.dimensions)}</li>
          <li style="margin:0;">
            Add-ons: ${(() => {
              const labels = labelsFromMap(s.addons, FTL_ADDON_LABEL);
              return labels.length ? escapeHtml(labels.join(", ")) : "—";
            })()}
          </li>
        </ul>
      `;
    }

    case ELogisticsPrimaryService.LTL: {
      const s: any = service;
      const palletLines = Array.isArray(s.palletLines) ? s.palletLines : [];
      const palletLinesHtml = palletLines.length
        ? `
          <table role="presentation" cellspacing="0" cellpadding="0" width="100%"
                 style="border-collapse:separate; border-spacing:0; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; margin:0 0 16px 0;">
            <thead>
              <tr>
                <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Qty</th>
                <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Dimensions (L×W×H)</th>
                <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Line Weight</th>
              </tr>
            </thead>
            <tbody>
              ${palletLines
                .map((pl: any) => {
                  const qty = escapeHtml(String(pl?.quantity ?? "—"));
                  const dims = fmtDims(pl?.dimensions);
                  const w = pl?.totalWeight ? fmtWeight(pl.totalWeight) : "—";
                  return `
                    <tr>
                      <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${qty}</td>
                      <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${dims}</td>
                      <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${w}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        `
        : `<p style="margin:0 0 16px 0; color:#6b7280;">No pallet lines provided.</p>`;

      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (LTL)</p>
        <ul style="margin:0 0 12px 18px; padding:0;">
          <li style="margin:0 0 8px 0;">Origin: ${fmtAddress(s.origin)}</li>
          <li style="margin:0 0 8px 0;">Destination: ${fmtAddress(s.destination)}</li>
          <li style="margin:0 0 8px 0;">Ready Date: ${fmtDate(s.readyDate)}</li>
          <li style="margin:0 0 8px 0;">Commodity: ${escapeHtml(String(s.commodityDescription || "—"))}</li>
          <li style="margin:0 0 8px 0;">Stackable: ${yn(s.stackable)}</li>
          <li style="margin:0 0 8px 0;">Approx. Total Weight: ${s.approximateTotalWeight ? fmtWeight(s.approximateTotalWeight) : "—"}</li>
          <li style="margin:0;">
            Add-ons: ${(() => {
              const labels = labelsFromMap(s.addons, LTL_ADDON_LABEL);
              return labels.length ? escapeHtml(labels.join(", ")) : "—";
            })()}
          </li>
        </ul>

        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Pallet Lines</p>
        ${palletLinesHtml}
      `;
    }

    case ELogisticsPrimaryService.INTERNATIONAL: {
      const s: any = service;
      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (International)</p>
        <ul style="margin:0 0 16px 18px; padding:0;">
          <li style="margin:0 0 8px 0;">
            Mode: <strong>${escapeHtml(labelFromMap(s.mode, INTL_MODE_LABEL))}</strong>
          </li>
          <li style="margin:0 0 8px 0;">Origin: ${fmtAddress(s.origin)}</li>
          <li style="margin:0 0 8px 0;">Destination: ${fmtAddress(s.destination)}</li>
          <li style="margin:0 0 8px 0;">Ready Date: ${fmtDate(s.readyDate)}</li>
          <li style="margin:0 0 8px 0;">Commodity: ${escapeHtml(String(s.commodityDescription || "—"))}</li>
          <li style="margin:0 0 8px 0;">Estimated Weight: ${fmtWeight(s.estimatedWeight)}</li>
          <li style="margin:0;">
            Shipment Size: ${escapeHtml(labelFromMap(s.shipmentSize, INTL_SIZE_LABEL))}
          </li>
        </ul>
      `;
    }

    case ELogisticsPrimaryService.WAREHOUSING: {
      const s: any = service;
      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (Warehousing)</p>
        <ul style="margin:0 0 16px 18px; padding:0;">
          <li style="margin:0 0 8px 0;">Required Location: ${fmtAddress(s.requiredLocation)}</li>
          <li style="margin:0 0 8px 0;">Estimated Volume: ${fmtWarehousingVolume(s.estimatedVolume)}</li>
          <li style="margin:0;">
            Expected Duration: ${escapeHtml(labelFromMap(s.expectedDuration, WAREHOUSING_DURATION_LABEL))}
          </li>
        </ul>
      `;
    }

    default:
      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details</p>
        <p style="margin:0 0 16px 0; color:#6b7280;">Unknown service type.</p>
      `;
  }
}

function renderContactAndIdentification(q: ILogisticsQuote): string {
  const c: any = q.contact || {};
  const id: any = q.identification || {};

  const safeName = escapeHtml(`${c.firstName || ""} ${c.lastName || ""}`.trim() || "—");
  const safeEmail = c.email ? escapeHtml(String(c.email)) : "—";
  const safeCompany = c.company ? escapeHtml(String(c.company)) : "—";
  const safePhone = c.phone ? escapeHtml(String(c.phone)) : "";

  const identity = id.identity ? escapeHtml(labelFromMap(id.identity, IDENTITY_LABEL)) : "—";
  const brokerType = id.brokerType
    ? escapeHtml(labelFromMap(id.brokerType, BROKER_TYPE_LABEL))
    : "";
  const preferred = c.preferredContactMethod
    ? escapeHtml(labelFromMap(c.preferredContactMethod, PREF_CONTACT_LABEL))
    : "—";

  return `
    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Identification</p>
    <ul style="margin:0 0 16px 18px; padding:0;">
      <li style="margin:0 0 8px 0;">Identity: <strong>${identity}</strong></li>
      ${brokerType ? `<li style="margin:0;">Broker Type: ${brokerType}</li>` : ""}
    </ul>

    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Contact</p>
    <ul style="margin:0 0 16px 18px; padding:0;">
      <li style="margin:0 0 8px 0;"><strong>${safeName}</strong></li>
      <li style="margin:0 0 8px 0;">Company: ${safeCompany}</li>
      <li style="margin:0 0 8px 0;">
        Email:
        ${
          safeEmail !== "—"
            ? `<a href="mailto:${safeEmail}" style="color:#2563eb; text-decoration:none;">${safeEmail}</a>`
            : "—"
        }
      </li>
      ${
        safePhone
          ? `<li style="margin:0 0 8px 0;">Phone: <a href="tel:${safePhone}" style="color:#2563eb; text-decoration:none;">${safePhone}</a></li>`
          : `<li style="margin:0 0 8px 0;">Phone: —</li>`
      }
      <li style="margin:0;">Preferred Contact: ${preferred}</li>
    </ul>

    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Company Address</p>
    <p style="margin:0 0 16px 0; color:#374151;">${fmtAddress((q as any)?.contact?.companyAddress)}</p>
  `;
}

/* ───────────────────────── Public API ───────────────────────── */

export type SendQuoteNotificationEmailParams = {
  /** Sales/ops mailbox recipient (often same as NPT_QUOTES_EMAIL) */
  to?: string;

  /** Optional "reply-to" is not supported by current mailer; include in body if desired. */
  quote: ILogisticsQuote;

  /** If you want the subject to mention website, campaign, etc. */
  sourceLabel?: string;
};

export async function sendQuoteInternalNotificationEmail(
  params: SendQuoteNotificationEmailParams,
): Promise<void> {
  const toAddr = params.to || NPT_QUOTES_EMAIL;

  const q = params.quote;
  const service = q.serviceDetails;

  // Prefer Mongo id. Fall back safely if some upstream mapper adds `id`.
  const safeId = escapeHtml(String((q as any)?._id || (q as any)?.id || "—"));
  const safePrimary = escapeHtml(String(service?.primaryService || "QUOTE"));
  const safeSource = params.sourceLabel ? escapeHtml(params.sourceLabel) : "";

  const subject = `New Quote Received – ${safePrimary}${safeSource ? ` (${safeSource})` : ""}`;

  // ───────────────────────── Attach ALL quote attachments ─────────────────────────
  const attachments: GraphAttachment[] = [];
  const attachmentNotes: string[] = [];

  const files: IFileAsset[] = Array.isArray(q.attachments) ? q.attachments : [];
  for (let i = 0; i < files.length; i++) {
    const asset = files[i];
    const fallbackBase = `quote-attachment-${i + 1}`;
    try {
      const { attachment, note } = await assetToAttachment(asset, fallbackBase);
      if (attachment) attachments.push(attachment);
      if (note) attachmentNotes.push(note);
    } catch {
      attachmentNotes.push(`Failed to attach ${fallbackBase} due to an unexpected error.`);
    }
  }
  // ───────────────────────────────────────────────────────────────────────────────

  const attachmentsBlock = `
    <p style="margin:16px 0 8px 0; font-weight:600; color:#111827;">Attachments</p>
    ${
      files.length
        ? `
          <ul style="margin:0 0 12px 18px; padding:0;">
            ${files
              .map((a, idx) => {
                const name =
                  (a as any)?.originalName ||
                  (a as any)?.filename ||
                  (a as any)?.name ||
                  `Attachment ${idx + 1}`;
                const mime = (a as any)?.mimeType ? String((a as any).mimeType) : "";
                const size = (a as any)?.sizeBytes ? `${Number((a as any).sizeBytes)} bytes` : "";
                const meta = [mime, size].filter(Boolean).join(" • ");
                return `<li style="margin:0 0 8px 0;">${escapeHtml(String(name))}${meta ? ` <span style="color:#6b7280;">(${escapeHtml(meta)})</span>` : ""}</li>`;
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

  const finalNotes = (q as any)?.finalNotes ? escapeHtml(String((q as any).finalNotes)) : "";

  const finalNotesBlock = `
    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Final Notes</p>
    ${
      finalNotes
        ? `<div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; white-space:pre-wrap;">${finalNotes}</div>`
        : `<p style="margin:0 0 16px 0; color:#6b7280;">—</p>`
    }
  `;

  const metaBlock = `
    <div style="margin:0 0 16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;">
      <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Quote</p>
      <p style="margin:0; font-size:13px; color:#6b7280;">
        Quote ID:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeId}</span>
        • Primary Service: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safePrimary}</span>
      </p>
      <p style="margin:6px 0 0 0; font-size:13px; color:#6b7280;">
        Created: ${fmtDate((q as any)?.createdAt)} • Updated: ${fmtDate((q as any)?.updatedAt)}
        • Cross-border: ${yn((q as any)?.crossBorder)}
      </p>
    </div>
  `;

  const bodyHtml = `
    <p style="margin:0 0 12px 0;">A new quote has been submitted.</p>

    ${metaBlock}
    ${attachmentsBlock}
    ${renderServiceSummary(service)}
    ${renderContactAndIdentification(q)}
    ${finalNotesBlock}

    <p style="margin:0 0 24px 0;">NPT Logistics</p>
  `;

  const html = buildDefaultEmailTemplate({
    subject,
    heading: "New quote received",
    subtitle: safePrimary,
    bodyHtml,
    footerContactEmail: NPT_QUOTES_EMAIL,
  });

  await sendMailAppOnly({
    from: NPT_QUOTES_EMAIL,
    to: [toAddr],
    subject,
    html,
    attachments: attachments.length ? attachments : undefined,
  });
}
