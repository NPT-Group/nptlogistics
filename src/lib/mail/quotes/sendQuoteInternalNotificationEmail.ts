// src/lib/mail/quotes/sendQuoteInternalNotificationEmail.ts
import { sendMailAppOnly, type GraphAttachment } from "@/lib/mail/mailer";
import { escapeHtml } from "@/lib/mail/utils";
import { buildDefaultEmailTemplate } from "@/lib/mail/templates/defaultTemplate";
import { NEXT_PUBLIC_NPT_LOGISTICS_EMAIL } from "@/config/env";

import type { IFileAsset } from "@/types/shared.types";
import {
  ELogisticsPrimaryService,
  EInternationalMode,
  EOceanLoadType,
  type ILogisticsQuote,
  type QuoteServiceDetails,
  type LogisticsAddress,
  type LogisticsDimensions,
  type WarehousingVolume,
  type QuoteFTLDetails,
  type QuoteLTLDetails,
  type QuoteInternationalDetails,
  type QuoteWarehousingDetails,
  type CargoLine,
  type OceanContainerLine,
  type EWeightUnit,
  type EDimensionUnit,
} from "@/types/logisticsQuote.types";
import { filenameForAsset } from "@/lib/utils/files/mime";
import {
  BROKER_TYPE_LABEL,
  FTL_EQUIPMENT_LABEL,
  LTL_EQUIPMENT_LABEL,
  FTL_ADDON_LABEL,
  IDENTITY_LABEL,
  LTL_ADDON_LABEL,
  PREF_CONTACT_LABEL,
  PRIMARY_SERVICE_LABEL,
  INTL_MODE_LABEL,
  OCEAN_LOAD_TYPE_LABEL,
  OCEAN_CONTAINER_TYPE_LABEL,
  WAREHOUSING_DURATION_LABEL,
  WAREHOUSING_VOLUME_TYPE_LABEL,
  WEIGHT_UNIT_LABEL,
  DIMENSION_UNIT_LABEL,
  labelFromMap,
  labelsFromMap,
} from "@/lib/utils/enums/logisticsLabels";
import { getCountryNameFromCode } from "@/config/countries";

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
  return escapeHtml(d.toISOString().slice(0, 10));
}

function fmtAddress(a?: LogisticsAddress) {
  if (!a) return "—";

  const locality = [a.city, a.region, a.postalCode].filter(Boolean).join(", ");
  const countryName = escapeHtml(getCountryNameFromCode(a.countryCode));

  const parts = [a.street1, a.street2, locality, countryName]
    .filter(Boolean)
    .map((part) => escapeHtml(String(part)));

  return parts.join(" • ");
}

function fmtCompanyAddress(v?: unknown) {
  if (v === null || v === undefined) return "—";
  const s = String(v).trim();
  return s ? escapeHtml(s) : "—";
}

function fmtScalarWeight(value?: number, unit?: EWeightUnit) {
  if (value === null || value === undefined) return "—";
  const numeric = Number(value);
  const safeVal = Number.isFinite(numeric) ? String(numeric) : escapeHtml(String(value));
  const unitLabel = unit ? labelFromMap(unit, WEIGHT_UNIT_LABEL) : undefined;
  return unitLabel ? `${escapeHtml(safeVal)} ${escapeHtml(unitLabel)}` : escapeHtml(safeVal);
}

function fmtDims(d?: LogisticsDimensions, unit?: EDimensionUnit) {
  if (!d) return "—";
  const l = Number(d.length);
  const w = Number(d.width);
  const h = Number(d.height);
  const safe = [l, w, h].every((n) => Number.isFinite(n))
    ? `${l} × ${w} × ${h}`
    : `${d.length} × ${d.width} × ${d.height}`;
  const unitLabel = unit ? labelFromMap(unit, DIMENSION_UNIT_LABEL) : "";
  return escapeHtml(`${safe}${unitLabel ? ` ${unitLabel}` : ""}`);
}

function fmtLineDims(length?: number, width?: number, height?: number, unit?: EDimensionUnit) {
  const vals = [Number(length), Number(width), Number(height)];
  const safe = vals.every((n) => Number.isFinite(n))
    ? `${vals[0]} × ${vals[1]} × ${vals[2]}`
    : `${length ?? "—"} × ${width ?? "—"} × ${height ?? "—"}`;
  const unitLabel = unit ? labelFromMap(unit, DIMENSION_UNIT_LABEL) : "";
  return escapeHtml(`${safe}${unitLabel ? ` ${unitLabel}` : ""}`);
}

function fmtWarehousingVolume(vol?: WarehousingVolume) {
  if (!vol) return "—";
  const label = labelFromMap(vol.volumeType, WAREHOUSING_VOLUME_TYPE_LABEL);
  const value = typeof vol.value === "number" ? String(vol.value) : escapeHtml(String(vol.value));
  return `${escapeHtml(label)}: ${escapeHtml(value)}`;
}

function getServiceSubjectLabel(service: QuoteServiceDetails | undefined): string {
  if (!service) return "Quote";

  if (service.primaryService !== ELogisticsPrimaryService.INTERNATIONAL) {
    return labelFromMap(service.primaryService, PRIMARY_SERVICE_LABEL);
  }

  if (service.mode === EInternationalMode.AIR) {
    return `${labelFromMap(ELogisticsPrimaryService.INTERNATIONAL, PRIMARY_SERVICE_LABEL)} ${labelFromMap(
      service.mode,
      INTL_MODE_LABEL,
    )}`;
  }

  if (service.mode === EInternationalMode.OCEAN) {
    const oceanLabel = labelFromMap(service.mode, INTL_MODE_LABEL);

    if ("oceanLoadType" in service && service.oceanLoadType) {
      return `${labelFromMap(ELogisticsPrimaryService.INTERNATIONAL, PRIMARY_SERVICE_LABEL)} ${oceanLabel} ${labelFromMap(
        service.oceanLoadType,
        OCEAN_LOAD_TYPE_LABEL,
      )}`;
    }

    return `${labelFromMap(ELogisticsPrimaryService.INTERNATIONAL, PRIMARY_SERVICE_LABEL)} ${oceanLabel}`;
  }

  return labelFromMap(ELogisticsPrimaryService.INTERNATIONAL, PRIMARY_SERVICE_LABEL);
}

/* ───────────────────────── Attachments helper (S3 -> Graph) ───────────────────────── */

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

/* ───────────────────────── Service-specific rendering ───────────────────────── */

function renderCargoLinesTable(
  cargoLines: CargoLine[],
  weightUnit?: EWeightUnit,
  dimensionUnit?: EDimensionUnit,
  title = "Cargo Lines",
): string {
  if (!cargoLines.length) {
    return `
      <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">${escapeHtml(title)}</p>
      <p style="margin:0 0 16px 0; color:#6b7280;">No cargo lines provided.</p>
    `;
  }

  return `
    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">${escapeHtml(title)}</p>
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%"
           style="border-collapse:separate; border-spacing:0; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; margin:0 0 16px 0;">
      <thead>
        <tr>
          <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Qty</th>
          <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Weight / Unit</th>
          <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Dimensions (L×W×H)</th>
          <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Line Total Weight</th>
        </tr>
      </thead>
      <tbody>
        ${cargoLines
          .map((line) => {
            const qty = Number(line.quantity);
            const unitWeight = Number(line.weightPerUnit);
            const lineTotal =
              Number.isFinite(qty) && Number.isFinite(unitWeight) ? qty * unitWeight : undefined;

            return `
              <tr>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${escapeHtml(String(line.quantity ?? "—"))}</td>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${fmtScalarWeight(line.weightPerUnit, weightUnit)}</td>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${fmtLineDims(
                  line.length,
                  line.width,
                  line.height,
                  dimensionUnit,
                )}</td>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${fmtScalarWeight(lineTotal, weightUnit)}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderOceanContainerLinesTable(containerLines: OceanContainerLine[]): string {
  if (!containerLines.length) {
    return `
      <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Container Lines</p>
      <p style="margin:0 0 16px 0; color:#6b7280;">No container lines provided.</p>
    `;
  }

  return `
    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Container Lines</p>
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%"
           style="border-collapse:separate; border-spacing:0; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; margin:0 0 16px 0;">
      <thead>
        <tr>
          <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Qty</th>
          <th align="left" style="padding:10px 12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-size:12px; color:#6b7280;">Container Type</th>
        </tr>
      </thead>
      <tbody>
        ${containerLines
          .map((line) => {
            return `
              <tr>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${escapeHtml(String(line.quantity ?? "—"))}</td>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6;">${escapeHtml(
                  labelFromMap(line.containerType, OCEAN_CONTAINER_TYPE_LABEL),
                )}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderServiceSummary(service: QuoteServiceDetails): string {
  switch (service.primaryService) {
    case ELogisticsPrimaryService.FTL: {
      const s: QuoteFTLDetails = service;
      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (FTL)</p>
        <ul style="margin:0 0 16px 18px; padding:0;">
          <li style="margin:0 0 8px 0;">Equipment: <strong>${escapeHtml(labelFromMap(s.equipment, FTL_EQUIPMENT_LABEL))}</strong></li>
          <li style="margin:0 0 8px 0;">Origin: ${fmtAddress(s.origin)}</li>
          <li style="margin:0 0 8px 0;">Destination: ${fmtAddress(s.destination)}</li>
          <li style="margin:0 0 8px 0;">Pickup Date: ${fmtDate(s.pickupDate)} (Flexible: ${yn(s.pickupDateFlexible)})</li>
          <li style="margin:0 0 8px 0;">Commodity: ${escapeHtml(String(s.commodityDescription || "—"))}</li>
          <li style="margin:0 0 8px 0;">Approx. Total Weight: ${fmtScalarWeight(s.approximateTotalWeight, s.weightUnit)}</li>
          <li style="margin:0 0 8px 0;">Estimated Pallet Count: ${escapeHtml(String(s.estimatedPalletCount ?? "—"))}</li>
          <li style="margin:0 0 8px 0;">Dimensions (L×W×H): ${fmtDims(s.dimensions, s.dimensionUnit)}</li>
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
      const s: QuoteLTLDetails = service;
      const cargoLines = Array.isArray(s.cargoLines) ? s.cargoLines : [];

      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (LTL)</p>
        <ul style="margin:0 0 12px 18px; padding:0;">
          <li style="margin:0 0 8px 0;">Equipment: <strong>${escapeHtml(labelFromMap(s.equipment, LTL_EQUIPMENT_LABEL))}</strong></li>
          <li style="margin:0 0 8px 0;">Origin: ${fmtAddress(s.origin)}</li>
          <li style="margin:0 0 8px 0;">Destination: ${fmtAddress(s.destination)}</li>
          <li style="margin:0 0 8px 0;">Pickup Date: ${fmtDate(s.pickupDate)}</li>
          <li style="margin:0 0 8px 0;">Commodity: ${escapeHtml(String(s.commodityDescription || "—"))}</li>
          <li style="margin:0 0 8px 0;">Weight Unit: ${escapeHtml(labelFromMap(s.weightUnit, WEIGHT_UNIT_LABEL))}</li>
          <li style="margin:0 0 8px 0;">Dimension Unit: ${escapeHtml(labelFromMap(s.dimensionUnit, DIMENSION_UNIT_LABEL))}</li>
          <li style="margin:0 0 8px 0;">Stackable: ${yn(s.stackable)}</li>
          <li style="margin:0 0 8px 0;">Approx. Total Weight: ${fmtScalarWeight(s.approximateTotalWeight, s.weightUnit)}</li>
          <li style="margin:0;">
            Add-ons: ${(() => {
              const labels = labelsFromMap(s.addons, LTL_ADDON_LABEL);
              return labels.length ? escapeHtml(labels.join(", ")) : "—";
            })()}
          </li>
        </ul>

        ${renderCargoLinesTable(cargoLines, s.weightUnit, s.dimensionUnit, "Pallet Lines")}
      `;
    }

    case ELogisticsPrimaryService.INTERNATIONAL: {
      const s: QuoteInternationalDetails = service;

      if (s.mode === EInternationalMode.AIR) {
        const cargoLines = Array.isArray(s.cargoLines) ? s.cargoLines : [];

        return `
          <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (International Air)</p>
          <ul style="margin:0 0 12px 18px; padding:0;">
            <li style="margin:0 0 8px 0;">Mode: <strong>${escapeHtml(labelFromMap(s.mode, INTL_MODE_LABEL))}</strong></li>
            <li style="margin:0 0 8px 0;">Origin: ${fmtAddress(s.origin)}</li>
            <li style="margin:0 0 8px 0;">Destination: ${fmtAddress(s.destination)}</li>
            <li style="margin:0 0 8px 0;">Pickup Date: ${fmtDate(s.pickupDate)}</li>
            <li style="margin:0 0 8px 0;">Commodity: ${escapeHtml(String(s.commodityDescription || "—"))}</li>
            <li style="margin:0 0 8px 0;">Weight Unit: ${escapeHtml(labelFromMap(s.weightUnit, WEIGHT_UNIT_LABEL))}</li>
            <li style="margin:0 0 8px 0;">Dimension Unit: ${escapeHtml(labelFromMap(s.dimensionUnit, DIMENSION_UNIT_LABEL))}</li>
            <li style="margin:0 0 8px 0;">Approx. Total Weight: ${fmtScalarWeight(s.approximateTotalWeight, s.weightUnit)}</li>
          </ul>

          ${renderCargoLinesTable(cargoLines, s.weightUnit, s.dimensionUnit, "Cargo Lines")}
        `;
      }

      if (s.mode === EInternationalMode.OCEAN && s.oceanLoadType === EOceanLoadType.LCL) {
        const cargoLines = Array.isArray(s.cargoLines) ? s.cargoLines : [];

        return `
          <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (International Ocean LCL)</p>
          <ul style="margin:0 0 12px 18px; padding:0;">
            <li style="margin:0 0 8px 0;">Mode: <strong>${escapeHtml(labelFromMap(s.mode, INTL_MODE_LABEL))}</strong></li>
            <li style="margin:0 0 8px 0;">Ocean Load Type: <strong>${escapeHtml(labelFromMap(s.oceanLoadType, OCEAN_LOAD_TYPE_LABEL))}</strong></li>
            <li style="margin:0 0 8px 0;">Origin: ${fmtAddress(s.origin)}</li>
            <li style="margin:0 0 8px 0;">Destination: ${fmtAddress(s.destination)}</li>
            <li style="margin:0 0 8px 0;">Pickup Date: ${fmtDate(s.pickupDate)}</li>
            <li style="margin:0 0 8px 0;">Commodity: ${escapeHtml(String(s.commodityDescription || "—"))}</li>
            <li style="margin:0 0 8px 0;">Weight Unit: ${escapeHtml(labelFromMap(s.weightUnit, WEIGHT_UNIT_LABEL))}</li>
            <li style="margin:0 0 8px 0;">Dimension Unit: ${escapeHtml(labelFromMap(s.dimensionUnit, DIMENSION_UNIT_LABEL))}</li>
            <li style="margin:0 0 8px 0;">Approx. Total Weight: ${fmtScalarWeight(s.approximateTotalWeight, s.weightUnit)}</li>
          </ul>

          ${renderCargoLinesTable(cargoLines, s.weightUnit, s.dimensionUnit, "Cargo Lines")}
        `;
      }

      if (s.mode === EInternationalMode.OCEAN && s.oceanLoadType === EOceanLoadType.FCL) {
        const containerLines = Array.isArray(s.containerLines) ? s.containerLines : [];

        return `
          <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (International Ocean FCL)</p>
          <ul style="margin:0 0 12px 18px; padding:0;">
            <li style="margin:0 0 8px 0;">Mode: <strong>${escapeHtml(labelFromMap(s.mode, INTL_MODE_LABEL))}</strong></li>
            <li style="margin:0 0 8px 0;">Ocean Load Type: <strong>${escapeHtml(labelFromMap(s.oceanLoadType, OCEAN_LOAD_TYPE_LABEL))}</strong></li>
            <li style="margin:0 0 8px 0;">Origin: ${fmtAddress(s.origin)}</li>
            <li style="margin:0 0 8px 0;">Destination: ${fmtAddress(s.destination)}</li>
            <li style="margin:0 0 8px 0;">Pickup Date: ${fmtDate(s.pickupDate)}</li>
            <li style="margin:0 0 8px 0;">Commodity: ${escapeHtml(String(s.commodityDescription || "—"))}</li>
          </ul>

          ${renderOceanContainerLinesTable(containerLines)}
        `;
      }

      return `
        <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Service Details (International)</p>
        <p style="margin:0 0 16px 0; color:#6b7280;">Unknown international quote structure.</p>
      `;
    }

    case ELogisticsPrimaryService.WAREHOUSING: {
      const s: QuoteWarehousingDetails = service;
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
  const c = q.contact || {};
  const id = q.identification || {};

  const safeName = escapeHtml(`${c.firstName || ""} ${c.lastName || ""}`.trim() || "—");
  const rawEmail = c.email ? String(c.email) : "";
  const safeEmail = rawEmail ? escapeHtml(rawEmail) : "—";
  const safeCompany = c.company ? escapeHtml(String(c.company)) : "—";
  const rawPhone = c.phone ? String(c.phone) : "";
  const safePhone = rawPhone ? escapeHtml(rawPhone) : "";

  const identity = "identity" in id ? escapeHtml(labelFromMap(id.identity, IDENTITY_LABEL)) : "—";
  const brokerType =
    "brokerType" in id && id.brokerType
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
          rawEmail
            ? `<a href="mailto:${escapeHtml(rawEmail)}" style="color:#2563eb; text-decoration:none;">${safeEmail}</a>`
            : "—"
        }
      </li>
      ${
        rawPhone
          ? `<li style="margin:0 0 8px 0;">Phone: <a href="tel:${escapeHtml(rawPhone)}" style="color:#2563eb; text-decoration:none;">${safePhone}</a></li>`
          : `<li style="margin:0 0 8px 0;">Phone: —</li>`
      }
      <li style="margin:0 0 8px 0;">Preferred Contact: ${preferred}</li>
      <li style="margin:0;">Marketing Consent: ${yn(q.marketingEmailConsent)}</li>
    </ul>

    <p style="margin:0 0 8px 0; font-weight:600; color:#111827;">Company Address</p>
    <p style="margin:0 0 16px 0; color:#374151;">${fmtCompanyAddress(c.companyAddress)}</p>
  `;
}

/* ───────────────────────── Public API ───────────────────────── */

export type SendQuoteNotificationEmailParams = {
  to?: string;
  quote: ILogisticsQuote;
  sourceLabel?: string;
};

export async function sendQuoteInternalNotificationEmail(
  params: SendQuoteNotificationEmailParams,
): Promise<void> {
  const toAddr = params.to || NEXT_PUBLIC_NPT_LOGISTICS_EMAIL;

  const q = params.quote;
  const service = q.serviceDetails;

  const safeId = escapeHtml(String(q.quoteId || "—"));
  const primaryLabel = getServiceSubjectLabel(service);
  const safePrimary = escapeHtml(primaryLabel);
  const safeSource = params.sourceLabel ? escapeHtml(params.sourceLabel) : "";

  const subject = `New Quote Received – ${safePrimary}${safeSource ? ` (${safeSource})` : ""}`;

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

  const finalNotes = q.finalNotes ? escapeHtml(String(q.finalNotes)) : "";

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
        Reference ID:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safeId}</span>
        • Primary Service:
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${safePrimary}</span>
      </p>
      <p style="margin:6px 0 0 0; font-size:13px; color:#6b7280;">
        Created: ${fmtDate(q.createdAt)} • Updated: ${fmtDate(q.updatedAt)}
        • Cross-border: ${yn(q.crossBorder)}
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
    footerContactEmail: NEXT_PUBLIC_NPT_LOGISTICS_EMAIL,
  });

  await sendMailAppOnly({
    from: NEXT_PUBLIC_NPT_LOGISTICS_EMAIL,
    to: [toAddr],
    subject,
    html,
    attachments: attachments.length ? attachments : undefined,
  });
}
