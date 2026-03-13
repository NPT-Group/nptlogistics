// src/app/(site)/components/forms/LogisticsQuoteForm/helpers.ts
import {
  ELogisticsPrimaryService,
  type EFTLEquipmentType,
  type EFTLAddon,
  type ELTLEquipmentType,
  type ELTLAddon,
} from "@/types/logisticsQuote.types";

import { makeServiceDetailsDefaults } from "./defaults";
import { FTL_ADDON_COMPAT, LTL_ADDON_COMPAT } from "./schema";
import type { LogisticsQuoteSubmitValues } from "./schema";
import { NAV_OFFSET } from "@/constants/ui";

export {
  focusFieldPath,
  focusFirstError,
  getFirstRenderableErrorPath,
  pulseFieldHighlight,
  scrollToFieldPath,
} from "@/components/forms/rhf/errorFocus";

/* ───────────────────────── Reset helpers ───────────────────────── */

export function buildServiceDetailsOnPrimaryServiceChange(ps: ELogisticsPrimaryService) {
  return makeServiceDetailsDefaults(ps);
}

export function resetFtlAddonsOnEquipmentChange() {
  return [] as EFTLAddon[];
}

export function resetLtlAddonsOnEquipmentChange() {
  return [] as ELTLAddon[];
}

export function getAllowedFtlAddons(equipment?: EFTLEquipmentType) {
  if (!equipment) return [] as readonly EFTLAddon[];
  return FTL_ADDON_COMPAT[equipment] || [];
}

export function getAllowedLtlAddons(equipment?: ELTLEquipmentType) {
  if (!equipment) return [] as readonly ELTLAddon[];
  return LTL_ADDON_COMPAT[equipment] || [];
}

/* ───────────────────────── Shared config for this form ───────────────────────── */

export const LOGISTICS_FORM_ERROR_FOCUS_OPTIONS = {
  scrollOffset: NAV_OFFSET + 50,
  fieldPathAttr: "data-field-path",
  focusDelayMs: 300,
  pulseDurationMs: 2000,
  pulseClassName: "npt-field-error-pulse",
  scrollBehavior: "smooth" as const,
};

/* ───────────────────────── Normalization ───────────────────────── */

function trim<T>(v: T): T {
  return (typeof v === "string" ? v.trim() : v) as T;
}

function lowerTrim<T>(v: T): T {
  return (typeof v === "string" ? v.trim().toLowerCase() : v) as T;
}

function upperTrim<T>(v: T): T {
  return (typeof v === "string" ? v.trim().toUpperCase() : v) as T;
}

function normalizePhone<T>(v: T): T {
  if (typeof v !== "string") return v;

  const trimmed = v.trim();
  if (!trimmed) return "" as T;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return `${hasPlus ? "+" : ""}${digits}` as T;
}

function normalizeAddress(a: any) {
  if (!a) return;

  a.street1 = trim(a.street1);
  if (a.street2 != null) a.street2 = trim(a.street2);
  a.city = trim(a.city);
  a.region = trim(a.region);
  a.postalCode = trim(a.postalCode);

  if (a.countryCode != null) {
    a.countryCode = upperTrim(a.countryCode);
  }
}

function normalizeWeight(w: any) {
  if (!w) return;
  if (w.unit != null) w.unit = trim(w.unit);
}

function normalizeDimensions(d: any) {
  if (!d) return;
}

export function normalizeBeforeSubmit(
  values: LogisticsQuoteSubmitValues,
): LogisticsQuoteSubmitValues {
  const v: any = structuredClone(values);

  v.turnstileToken = trim(v.turnstileToken);
  if (v.sourceLabel != null) v.sourceLabel = trim(v.sourceLabel);

  if (v.identification) {
    if (v.identification.identity != null) {
      v.identification.identity = trim(v.identification.identity);
    }
    if (v.identification.brokerType != null) {
      v.identification.brokerType = trim(v.identification.brokerType);
    }
  }

  if (v.contact) {
    v.contact.firstName = trim(v.contact.firstName);
    v.contact.lastName = trim(v.contact.lastName);
    v.contact.company = trim(v.contact.company);
    v.contact.email = lowerTrim(v.contact.email);

    if (v.contact.phone != null) v.contact.phone = normalizePhone(v.contact.phone);
    if (v.contact.preferredContactMethod != null) {
      v.contact.preferredContactMethod = trim(v.contact.preferredContactMethod);
    }

    if (v.contact.companyAddress != null) {
      v.contact.companyAddress = trim(v.contact.companyAddress);
    }
  }

  if (v.finalNotes != null) v.finalNotes = trim(v.finalNotes);

  if (Array.isArray(v.attachments)) {
    v.attachments = v.attachments.map((file: any) => ({
      ...file,
      url: trim(file.url),
      s3Key: trim(file.s3Key),
      mimeType: trim(file.mimeType),
      originalName: file.originalName != null ? trim(file.originalName) : file.originalName,
    }));
  }

  const sd = v.serviceDetails;
  if (sd) {
    switch (sd.primaryService) {
      case ELogisticsPrimaryService.FTL: {
        normalizeAddress(sd.origin);
        normalizeAddress(sd.destination);
        sd.equipment = trim(sd.equipment);
        sd.pickupDate = trim(sd.pickupDate);
        sd.commodityDescription = trim(sd.commodityDescription);
        normalizeWeight(sd.approximateTotalWeight);
        if (sd.dimensions) normalizeDimensions(sd.dimensions);
        if (Array.isArray(sd.addons)) sd.addons = sd.addons.map((x: any) => trim(x));
        break;
      }

      case ELogisticsPrimaryService.LTL: {
        normalizeAddress(sd.origin);
        normalizeAddress(sd.destination);
        sd.equipment = trim(sd.equipment);
        sd.pickupDate = trim(sd.pickupDate);
        sd.commodityDescription = trim(sd.commodityDescription);

        if (Array.isArray(sd.palletLines)) {
          sd.palletLines = sd.palletLines.map((line: any) => {
            const next = { ...line };
            normalizeDimensions(next.dimensions);
            return next;
          });
        }

        normalizeWeight(sd.approximateTotalWeight);
        if (Array.isArray(sd.addons)) sd.addons = sd.addons.map((x: any) => trim(x));
        break;
      }

      case ELogisticsPrimaryService.INTERNATIONAL: {
        normalizeAddress(sd.origin);
        normalizeAddress(sd.destination);
        sd.mode = trim(sd.mode);
        sd.pickupDate = trim(sd.pickupDate);
        sd.commodityDescription = trim(sd.commodityDescription);
        normalizeWeight(sd.estimatedWeight);
        if (sd.shipmentSize != null) sd.shipmentSize = trim(sd.shipmentSize);
        break;
      }

      case ELogisticsPrimaryService.WAREHOUSING: {
        normalizeAddress(sd.requiredLocation);
        if (sd.estimatedVolume?.volumeType != null) {
          sd.estimatedVolume.volumeType = trim(sd.estimatedVolume.volumeType);
        }
        sd.expectedDuration = trim(sd.expectedDuration);
        break;
      }

      default:
        break;
    }
  }

  return v as LogisticsQuoteSubmitValues;
}

/**
 * Exact API body structure expected by:
 * /api/v1/quotes/logistics/submit
 */
export function toApiSubmitBody(values: LogisticsQuoteSubmitValues) {
  const v = normalizeBeforeSubmit(values);

  return {
    turnstileToken: v.turnstileToken,
    serviceDetails: v.serviceDetails,
    identification: v.identification,
    contact: v.contact,
    finalNotes: v.finalNotes,
    attachments: v.attachments,
    marketingEmailConsent: v.marketingEmailConsent,
    sourceLabel: v.sourceLabel,
  };
}
