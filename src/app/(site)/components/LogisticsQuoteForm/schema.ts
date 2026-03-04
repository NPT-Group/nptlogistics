// src/app/(site)/components/LogisticsQuoteForm/schema.ts
import { z } from "zod";

import {
  EBrokerType,
  ECustomerIdentity,
  EInternationalMode,
  EInternationalShipmentSize,
  ELogisticsPrimaryService,
  EPreferredContactMethod,
  EFTLAddon,
  EFTLEquipmentType,
  ELTLAddon,
  EWarehousingDuration,
  EWarehousingVolumeType,
  EWeightUnit,
} from "@/types/logisticsQuote.types";

import { NORTH_AMERICAN_COUNTRY_CODES } from "@/config/countries";
import type { IFileAsset } from "@/types/shared.types";

/* ──────────────────────────────────────────────────────────────────────────────
  SUBMIT BODY schema (matches API expectation)
  Body shape:
    { turnstileToken, serviceDetails?, identification, contact, finalNotes?, attachments?, sourceLabel? }
────────────────────────────────────────────────────────────────────────────── */

const trimStr = z.string().trim().min(1, "Required");
const optTrimStr = z.preprocess(
  (v) => (typeof v === "string" ? v.trim() : v),
  z.string().optional(),
);

const upper2 = z
  .string()
  .trim()
  .toUpperCase()
  .refine((s) => s.length === 2, "Must be ISO-2 (2 letters)");

const lowerEmail = z.string().trim().toLowerCase().email("Invalid email");

const posNumber = z.coerce.number().refine((n) => Number.isFinite(n) && n > 0, "Must be > 0");

const intMin1 = z.coerce
  .number()
  .refine((n) => Number.isFinite(n) && Math.floor(n) === n && n >= 1, "Must be an integer >= 1");

const dateISO = z.union([z.string().trim().min(1, "Required"), z.date()]).transform((v) => {
  const d = v instanceof Date ? v : new Date(String(v));
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  return d.toISOString();
});

/** Shared: Address */
export const logisticsAddressSchema = z.object({
  street1: trimStr,
  street2: optTrimStr,
  city: trimStr,
  region: trimStr,
  postalCode: trimStr,
  countryCode: upper2,
});

/** Shared: Weight */
export const logisticsWeightSchema = z.object({
  value: posNumber,
  unit: z.nativeEnum(EWeightUnit),
});

/** Shared: Dimensions (no unit stored) */
export const logisticsDimensionsSchema = z.object({
  length: posNumber,
  width: posNumber,
  height: posNumber,
});

/** Attachments */
export const fileAssetSchema: z.ZodType<IFileAsset> = z.object({
  url: trimStr,
  s3Key: trimStr,
  mimeType: z.string().min(1, "mimeType is required"),
  sizeBytes: z.number().optional(),
  originalName: z.string().optional(),
});

function isNorthAmerica(code?: string) {
  if (!code) return false;
  return (NORTH_AMERICAN_COUNTRY_CODES as readonly string[]).includes(code.toUpperCase());
}

/** Equipment -> allowed add-ons (must match backend) */
export const FTL_ADDON_COMPAT: Record<EFTLEquipmentType, readonly EFTLAddon[]> = {
  [EFTLEquipmentType.DRY_VAN]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
  ],
  [EFTLEquipmentType.REEFER]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
  ],
  [EFTLEquipmentType.FLATBED]: [
    EFTLAddon.OVERSIZED_OVERWEIGHT,
    EFTLAddon.ESCORT_VEHICLES_REQUIRED,
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
  ],
  [EFTLEquipmentType.RGN_LOWBOY]: [
    EFTLAddon.OVERSIZED_OVERWEIGHT,
    EFTLAddon.ESCORT_VEHICLES_REQUIRED,
    EFTLAddon.EXPEDITED,
  ],
  [EFTLEquipmentType.CONESTOGA]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
  ],
};

/* ───────────────────────────── Service Details ───────────────────────────── */

export const ftlDetailsSchema = z
  .object({
    primaryService: z.literal(ELogisticsPrimaryService.FTL),

    equipment: z.nativeEnum(EFTLEquipmentType),

    origin: logisticsAddressSchema,
    destination: logisticsAddressSchema,

    readyDate: dateISO,
    commodityDescription: trimStr,

    approximateTotalWeight: logisticsWeightSchema,

    estimatedPalletCount: intMin1.optional(),
    dimensions: logisticsDimensionsSchema.optional(),

    readyDateFlexible: z.coerce.boolean().optional(),

    addons: z.array(z.nativeEnum(EFTLAddon)).optional(),
  })
  .superRefine((val, ctx) => {
    if (!isNorthAmerica(val.origin.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["origin", "countryCode"],
        message: "FTL origin must be CA/US/MX",
      });
    }
    if (!isNorthAmerica(val.destination.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination", "countryCode"],
        message: "FTL destination must be CA/US/MX",
      });
    }

    if (val.addons && val.addons.length) {
      const allowed = new Set(FTL_ADDON_COMPAT[val.equipment] || []);
      for (const a of val.addons) {
        if (!allowed.has(a)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["addons"],
            message: `FTL add-on ${a} is not compatible with equipment ${val.equipment}`,
          });
        }
      }
    }
  });

export const ltlPalletLineSchema = z.object({
  quantity: intMin1,
  dimensions: logisticsDimensionsSchema,
  totalWeight: logisticsWeightSchema.optional(),
});

export const ltlDetailsSchema = z
  .object({
    primaryService: z.literal(ELogisticsPrimaryService.LTL),

    origin: logisticsAddressSchema,
    destination: logisticsAddressSchema,

    readyDate: dateISO,
    commodityDescription: trimStr,

    stackable: z.coerce.boolean(),

    palletLines: z.array(ltlPalletLineSchema).min(1, "palletLines must have at least 1 line"),

    approximateTotalWeight: logisticsWeightSchema.optional(),

    addons: z.array(z.nativeEnum(ELTLAddon)).optional(),
  })
  .superRefine((val, ctx) => {
    if (!isNorthAmerica(val.origin.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["origin", "countryCode"],
        message: "LTL origin must be CA/US/MX",
      });
    }
    if (!isNorthAmerica(val.destination.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination", "countryCode"],
        message: "LTL destination must be CA/US/MX",
      });
    }
  });

export const intlDetailsSchema = z.object({
  primaryService: z.literal(ELogisticsPrimaryService.INTERNATIONAL),

  mode: z.nativeEnum(EInternationalMode),

  origin: logisticsAddressSchema,
  destination: logisticsAddressSchema,

  readyDate: dateISO,
  commodityDescription: trimStr,

  estimatedWeight: logisticsWeightSchema,

  shipmentSize: z.nativeEnum(EInternationalShipmentSize).optional(),
});

export const warehousingVolumeSchema = z.object({
  volumeType: z.nativeEnum(EWarehousingVolumeType),
  value: posNumber,
});

export const warehousingDetailsSchema = z
  .object({
    primaryService: z.literal(ELogisticsPrimaryService.WAREHOUSING),

    requiredLocation: logisticsAddressSchema,

    estimatedVolume: warehousingVolumeSchema,

    expectedDuration: z.nativeEnum(EWarehousingDuration),
  })
  .superRefine((val, ctx) => {
    if (!isNorthAmerica(val.requiredLocation.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requiredLocation", "countryCode"],
        message: "Warehousing requiredLocation must be CA/US/MX",
      });
    }
  });

export const serviceDetailsSchema = z.discriminatedUnion("primaryService", [
  ftlDetailsSchema,
  ltlDetailsSchema,
  intlDetailsSchema,
  warehousingDetailsSchema,
]);

/* ───────────────────────────── Identification + Contact ───────────────────────────── */

export const identificationSchema = z.discriminatedUnion("identity", [
  z.object({
    identity: z.literal(ECustomerIdentity.SHIPPER),
    brokerType: z.never().optional(),
  }),
  z.object({
    identity: z.literal(ECustomerIdentity.BROKER),
    brokerType: z.nativeEnum(EBrokerType),
  }),
]);

export const contactSchema = z.object({
  firstName: trimStr,
  lastName: trimStr,
  email: lowerEmail,
  company: trimStr,

  phone: optTrimStr,
  preferredContactMethod: z.nativeEnum(EPreferredContactMethod).optional(),

  companyAddress: logisticsAddressSchema.optional(),
});

/* ───────────────────────────── SUBMIT BODY ───────────────────────────── */

export const logisticsQuoteSubmitSchema = z
  .object({
    turnstileToken: z.string().trim().min(1, "Please complete the verification challenge"),

    // optional at load; required via superRefine below
    serviceDetails: serviceDetailsSchema.optional(),

    identification: identificationSchema,
    contact: contactSchema,

    finalNotes: z
      .string()
      .optional()
      .transform((s) => (typeof s === "string" ? s.trim() : s))
      .refine((s) => s == null || s.length <= 6000, "finalNotes exceeds maximum length (6000)"),

    attachments: z.array(fileAssetSchema).optional(),

    sourceLabel: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // primary service must be selected
    if (!val.serviceDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceDetails", "primaryService"],
        message: "Please select a primary service",
      });
    }
  });

export type LogisticsQuoteSubmitValues = z.infer<typeof logisticsQuoteSubmitSchema>;
