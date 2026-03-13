// src/app/(site)/components/forms/LogisticsQuoteForm/helpers.ts
// src/app/(site)/components/forms/LogisticsQuoteForm/helpers.ts
import {
  EInternationalMode,
  ELogisticsPrimaryService,
  EOceanLoadType,
  type EFTLAddon,
  type EFTLEquipmentType,
  type ELTLAddon,
  type ELTLEquipmentType,
} from "@/types/logisticsQuote.types";

import {
  makeInternationalAirDefaults,
  makeInternationalOceanFclDefaults,
  makeInternationalOceanLclDefaults,
  makeServiceDetailsDefaults,
} from "./defaults";
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

export function buildInternationalDetailsOnModeChange(mode: EInternationalMode) {
  switch (mode) {
    case EInternationalMode.AIR:
      return makeInternationalAirDefaults();
    case EInternationalMode.OCEAN:
      return makeInternationalOceanLclDefaults();
    default: {
      const _x: never = mode;
      throw new Error(`Unsupported international mode: ${_x}`);
    }
  }
}

export function buildInternationalDetailsOnOceanLoadTypeChange(loadType: EOceanLoadType) {
  switch (loadType) {
    case EOceanLoadType.LCL:
      return makeInternationalOceanLclDefaults();
    case EOceanLoadType.FCL:
      return makeInternationalOceanFclDefaults();
    default: {
      const _x: never = loadType;
      throw new Error(`Unsupported ocean load type: ${_x}`);
    }
  }
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

function normalizeAddress(a: unknown) {
  if (!a || typeof a !== "object") return;

  const addr = a as Record<string, unknown>;
  addr.street1 = trim(addr.street1);
  if (addr.street2 != null) addr.street2 = trim(addr.street2);
  addr.city = trim(addr.city);
  addr.region = trim(addr.region);
  addr.postalCode = trim(addr.postalCode);

  if (addr.countryCode != null) {
    addr.countryCode = upperTrim(addr.countryCode);
  }
}

function normalizeDimensions(d: unknown) {
  if (!d || typeof d !== "object") return;
}

function normalizeCargoLines(lines: unknown) {
  if (!Array.isArray(lines)) return lines;

  return lines.map((line) => {
    if (!line || typeof line !== "object") return line;
    const next = { ...(line as Record<string, unknown>) };
    return next;
  });
}

function normalizeContainerLines(lines: unknown) {
  if (!Array.isArray(lines)) return lines;

  return lines.map((line) => {
    if (!line || typeof line !== "object") return line;
    const next = { ...(line as Record<string, unknown>) };

    if (next.containerType != null) {
      next.containerType = trim(next.containerType);
    }

    return next;
  });
}

export function normalizeBeforeSubmit(
  values: LogisticsQuoteSubmitValues,
): LogisticsQuoteSubmitValues {
  const v = structuredClone(values) as LogisticsQuoteSubmitValues & {
    [key: string]: unknown;
  };

  v.turnstileToken = trim(v.turnstileToken);
  if (v.sourceLabel != null) v.sourceLabel = trim(v.sourceLabel);

  if (v.identification) {
    if ("identity" in v.identification && v.identification.identity != null) {
      v.identification.identity = trim(v.identification.identity);
    }

    if ("brokerType" in v.identification && v.identification.brokerType != null) {
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
    v.attachments = v.attachments.map((file) => ({
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
        if (sd.weightUnit != null) sd.weightUnit = trim(sd.weightUnit);
        if (sd.dimensionUnit != null) sd.dimensionUnit = trim(sd.dimensionUnit);
        if (sd.dimensions) normalizeDimensions(sd.dimensions);
        if (Array.isArray(sd.addons)) sd.addons = sd.addons.map((x) => trim(x));
        break;
      }

      case ELogisticsPrimaryService.LTL: {
        normalizeAddress(sd.origin);
        normalizeAddress(sd.destination);
        sd.equipment = trim(sd.equipment);
        sd.pickupDate = trim(sd.pickupDate);
        sd.commodityDescription = trim(sd.commodityDescription);
        sd.weightUnit = trim(sd.weightUnit);
        sd.dimensionUnit = trim(sd.dimensionUnit);

        if (Array.isArray(sd.cargoLines)) {
          sd.cargoLines = normalizeCargoLines(sd.cargoLines) as typeof sd.cargoLines;
        }

        if (Array.isArray(sd.addons)) sd.addons = sd.addons.map((x) => trim(x));
        break;
      }

      case ELogisticsPrimaryService.INTERNATIONAL: {
        normalizeAddress(sd.origin);
        normalizeAddress(sd.destination);
        sd.mode = trim(sd.mode);
        sd.pickupDate = trim(sd.pickupDate);
        sd.commodityDescription = trim(sd.commodityDescription);

        if (sd.mode === EInternationalMode.AIR) {
          sd.weightUnit = trim(sd.weightUnit);
          sd.dimensionUnit = trim(sd.dimensionUnit);

          if (Array.isArray(sd.cargoLines)) {
            sd.cargoLines = normalizeCargoLines(sd.cargoLines) as typeof sd.cargoLines;
          }
        }

        if (sd.mode === EInternationalMode.OCEAN) {
          if ("oceanLoadType" in sd && sd.oceanLoadType != null) {
            sd.oceanLoadType = trim(sd.oceanLoadType);
          }

          if (sd.oceanLoadType === EOceanLoadType.LCL) {
            sd.weightUnit = trim(sd.weightUnit);
            sd.dimensionUnit = trim(sd.dimensionUnit);

            if (Array.isArray(sd.cargoLines)) {
              sd.cargoLines = normalizeCargoLines(sd.cargoLines) as typeof sd.cargoLines;
            }
          }

          if (sd.oceanLoadType === EOceanLoadType.FCL) {
            if (Array.isArray(sd.containerLines)) {
              sd.containerLines = normalizeContainerLines(
                sd.containerLines,
              ) as typeof sd.containerLines;
            }
          }
        }

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

  return v;
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
