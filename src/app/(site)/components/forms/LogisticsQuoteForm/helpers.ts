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

import { makeServiceDetailsDefaults } from "./defaults";
import {
  FTL_ADDON_COMPAT,
  LTL_ADDON_COMPAT,
  logisticsQuoteSubmitSchema,
  type LogisticsQuoteSubmitParsedValues,
  type LogisticsQuoteSubmitValues,
} from "./schema";
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

function normalizeCargoLine(line: any) {
  if (!line) return line;

  return {
    ...line,
    quantity: line.quantity,
    length: line.length,
    width: line.width,
    height: line.height,
    weightPerUnit: line.weightPerUnit,
  };
}

function normalizeContainerLine(line: any) {
  if (!line) return line;

  return {
    ...line,
    quantity: line.quantity,
    containerType: line.containerType != null ? trim(line.containerType) : line.containerType,
  };
}

function sumCargoLineWeight(lines: any[] | undefined): number | undefined {
  if (!Array.isArray(lines) || lines.length === 0) return undefined;

  let total = 0;

  for (const line of lines) {
    const qty = Number(line?.quantity);
    const weightPerUnit = Number(line?.weightPerUnit);

    if (!Number.isFinite(qty) || !Number.isFinite(weightPerUnit)) {
      return undefined;
    }

    total += qty * weightPerUnit;
  }

  return total > 0 ? total : undefined;
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
        sd.equipment = sd.equipment != null ? trim(sd.equipment) : sd.equipment;
        sd.pickupDate = trim(sd.pickupDate);
        sd.commodityDescription = trim(sd.commodityDescription);
        sd.weightUnit = sd.weightUnit != null ? trim(sd.weightUnit) : sd.weightUnit;
        sd.dimensionUnit = sd.dimensionUnit != null ? trim(sd.dimensionUnit) : sd.dimensionUnit;

        if (sd.addons) {
          sd.addons = sd.addons.map((x: any) => trim(x));
        }

        if (sd.dimensions) {
          const { length, width, height } = sd.dimensions;
          const allBlank =
            (length === "" || length == null) &&
            (width === "" || width == null) &&
            (height === "" || height == null);

          if (allBlank) {
            sd.dimensions = undefined;
            sd.dimensionUnit = undefined;
          }
        }

        break;
      }

      case ELogisticsPrimaryService.LTL: {
        normalizeAddress(sd.origin);
        normalizeAddress(sd.destination);
        sd.equipment = sd.equipment != null ? trim(sd.equipment) : sd.equipment;
        sd.pickupDate = trim(sd.pickupDate);
        sd.commodityDescription = trim(sd.commodityDescription);
        sd.weightUnit = sd.weightUnit != null ? trim(sd.weightUnit) : sd.weightUnit;
        sd.dimensionUnit = sd.dimensionUnit != null ? trim(sd.dimensionUnit) : sd.dimensionUnit;

        if (Array.isArray(sd.cargoLines)) {
          sd.cargoLines = sd.cargoLines.map((line: any) => normalizeCargoLine(line));
        }

        sd.approximateTotalWeight = sumCargoLineWeight(sd.cargoLines);

        if (Array.isArray(sd.addons)) {
          sd.addons = sd.addons.map((x: any) => trim(x));
        }

        break;
      }

      case ELogisticsPrimaryService.INTERNATIONAL: {
        normalizeAddress(sd.origin);
        normalizeAddress(sd.destination);

        sd.mode = sd.mode != null ? trim(sd.mode) : sd.mode;
        sd.oceanLoadType = sd.oceanLoadType != null ? trim(sd.oceanLoadType) : sd.oceanLoadType;
        sd.pickupDate = trim(sd.pickupDate);
        sd.commodityDescription = trim(sd.commodityDescription);
        sd.weightUnit = sd.weightUnit != null ? trim(sd.weightUnit) : sd.weightUnit;
        sd.dimensionUnit = sd.dimensionUnit != null ? trim(sd.dimensionUnit) : sd.dimensionUnit;

        if (sd.mode === "") sd.mode = undefined;
        if (sd.oceanLoadType === "") sd.oceanLoadType = undefined;
        if (sd.weightUnit === "") sd.weightUnit = undefined;
        if (sd.dimensionUnit === "") sd.dimensionUnit = undefined;

        if (Array.isArray(sd.cargoLines)) {
          sd.cargoLines = sd.cargoLines.map((line: any) => normalizeCargoLine(line));
        }

        if (Array.isArray(sd.containerLines)) {
          sd.containerLines = sd.containerLines.map((line: any) => normalizeContainerLine(line));
        }

        if (sd.mode === EInternationalMode.AIR) {
          sd.oceanLoadType = undefined;
          sd.containerLines = undefined;
          sd.approximateTotalWeight = sumCargoLineWeight(sd.cargoLines);
        } else if (sd.mode === EInternationalMode.OCEAN) {
          if (sd.oceanLoadType === EOceanLoadType.LCL) {
            sd.containerLines = undefined;
            sd.approximateTotalWeight = sumCargoLineWeight(sd.cargoLines);
          } else if (sd.oceanLoadType === EOceanLoadType.FCL) {
            sd.weightUnit = undefined;
            sd.dimensionUnit = undefined;
            sd.cargoLines = undefined;
            sd.approximateTotalWeight = undefined;
          } else {
            sd.approximateTotalWeight = undefined;
          }
        } else {
          sd.oceanLoadType = undefined;
          sd.approximateTotalWeight = undefined;
        }

        break;
      }

      case ELogisticsPrimaryService.WAREHOUSING: {
        normalizeAddress(sd.requiredLocation);

        if (sd.estimatedVolume?.volumeType != null) {
          sd.estimatedVolume.volumeType = trim(sd.estimatedVolume.volumeType);
        }

        if (sd.expectedDuration != null) {
          sd.expectedDuration = trim(sd.expectedDuration);
        }

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
export function toApiSubmitBody(
  values: LogisticsQuoteSubmitValues,
): LogisticsQuoteSubmitParsedValues {
  const normalized = normalizeBeforeSubmit(values);
  return logisticsQuoteSubmitSchema.parse(normalized);
}
