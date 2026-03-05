// src/app/(site)/components/LogisticsQuoteForm/helpers.ts
import type { FieldErrors, FieldValues } from "react-hook-form";

import {
  ELogisticsPrimaryService,
  EFTLEquipmentType,
  EFTLAddon,
} from "@/types/logisticsQuote.types";

import { makeServiceDetailsDefaults } from "./defaults";
import { FTL_ADDON_COMPAT } from "./schema";
import type { LogisticsQuoteSubmitValues } from "./schema";

/* ───────────────────────── Reset helpers ───────────────────────── */

export function buildServiceDetailsOnPrimaryServiceChange(ps: ELogisticsPrimaryService) {
  return makeServiceDetailsDefaults(ps);
}

export function resetFtlAddonsOnEquipmentChange() {
  return [] as EFTLAddon[];
}

export function getAllowedFtlAddons(equipment?: EFTLEquipmentType) {
  if (!equipment) return [] as readonly EFTLAddon[];
  return FTL_ADDON_COMPAT[equipment] || [];
}

/* ───────────────────────── Error UX helpers ───────────────────────── */

export function getFirstErrorPath<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): string | null {
  const walk = (obj: any, prefix = ""): string | null => {
    if (!obj || typeof obj !== "object") return null;
    if (obj.message && typeof obj.message === "string") return prefix || null;

    for (const key of Object.keys(obj)) {
      const next = obj[key];
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      const found = walk(next, nextPrefix);
      if (found) return found;
    }
    return null;
  };

  return walk(errors, "");
}

export function scrollToFieldPath(path: string) {
  const el = document.querySelector<HTMLElement>(`[data-field-path="${CSS.escape(path)}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function pulseFieldHighlight(path: string, opts?: { ms?: number }) {
  const ms = opts?.ms ?? 2000;
  const el = document.querySelector<HTMLElement>(`[data-field-path="${CSS.escape(path)}"]`);
  if (!el) return;

  el.classList.add("npt-field-error-pulse");
  window.setTimeout(() => el.classList.remove("npt-field-error-pulse"), ms);
}

export function focusFirstError<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
) {
  const first = getFirstErrorPath(errors);
  if (!first) return;
  scrollToFieldPath(first);
  pulseFieldHighlight(first);
}

/* ───────────────────────── Normalization ───────────────────────── */

function trim(v: any) {
  return typeof v === "string" ? v.trim() : v;
}
function lowerTrim(v: any) {
  return typeof v === "string" ? v.trim().toLowerCase() : v;
}
function upperTrim(v: any) {
  return typeof v === "string" ? v.trim().toUpperCase() : v;
}

export function normalizeBeforeSubmit(
  values: LogisticsQuoteSubmitValues,
): LogisticsQuoteSubmitValues {
  const v: any = structuredClone(values);

  v.turnstileToken = trim(v.turnstileToken);
  if (v.sourceLabel != null) v.sourceLabel = trim(v.sourceLabel);

  if (v.identification) {
    v.identification.identity = trim(v.identification.identity);
    if (v.identification.brokerType != null)
      v.identification.brokerType = trim(v.identification.brokerType);
  }

  if (v.contact) {
    v.contact.firstName = trim(v.contact.firstName);
    v.contact.lastName = trim(v.contact.lastName);
    v.contact.company = trim(v.contact.company);
    v.contact.email = lowerTrim(v.contact.email);
    if (v.contact.phone != null) v.contact.phone = trim(v.contact.phone);
    if (v.contact.preferredContactMethod != null)
      v.contact.preferredContactMethod = trim(v.contact.preferredContactMethod);

    if (v.contact.companyAddress) {
      v.contact.companyAddress.street1 = trim(v.contact.companyAddress.street1);
      if (v.contact.companyAddress.street2 != null)
        v.contact.companyAddress.street2 = trim(v.contact.companyAddress.street2);
      v.contact.companyAddress.city = trim(v.contact.companyAddress.city);
      v.contact.companyAddress.region = trim(v.contact.companyAddress.region);
      v.contact.companyAddress.postalCode = trim(v.contact.companyAddress.postalCode);
      v.contact.companyAddress.countryCode = upperTrim(v.contact.companyAddress.countryCode);
    }
  }

  if (v.finalNotes != null) v.finalNotes = trim(v.finalNotes);

  const sd = v.serviceDetails;
  if (sd) {
    const normAddr = (a: any) => {
      if (!a) return;
      a.street1 = trim(a.street1);
      if (a.street2 != null) a.street2 = trim(a.street2);
      a.city = trim(a.city);
      a.region = trim(a.region);
      a.postalCode = trim(a.postalCode);
      a.countryCode = upperTrim(a.countryCode);
    };

    switch (sd.primaryService) {
      case ELogisticsPrimaryService.FTL:
      case ELogisticsPrimaryService.LTL:
      case ELogisticsPrimaryService.INTERNATIONAL:
        normAddr(sd.origin);
        normAddr(sd.destination);
        sd.commodityDescription = trim(sd.commodityDescription);
        break;

      case ELogisticsPrimaryService.WAREHOUSING:
        normAddr(sd.requiredLocation);
        break;

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
    sourceLabel: v.sourceLabel,
  };
}
