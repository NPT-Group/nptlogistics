// src/app/(site)/components/forms/LogisticsQuoteForm/schema.ts
// src/app/(site)/components/forms/LogisticsQuoteForm/schema.ts
import { z } from "zod";

import {
  EBrokerType,
  ECustomerIdentity,
  EDimensionUnit,
  EInternationalMode,
  ELogisticsPrimaryService,
  EOceanContainerType,
  EOceanLoadType,
  EPreferredContactMethod,
  EFTLAddon,
  EFTLEquipmentType,
  ELTLAddon,
  ELTLEquipmentType,
  EWarehousingDuration,
  EWarehousingVolumeType,
  EWeightUnit,
} from "@/types/logisticsQuote.types";

import { NORTH_AMERICAN_COUNTRY_CODES } from "@/config/countries";
import type { IFileAsset } from "@/types/shared.types";

/* ──────────────────────────────────────────────────────────────────────────────
  SUBMIT BODY schema (matches API expectation)
  Body shape:
    {
      turnstileToken,
      serviceDetails?,
      identification,
      contact,
      finalNotes?,
      attachments?,
      marketingEmailConsent?,
      sourceLabel?
    }
────────────────────────────────────────────────────────────────────────────── */

const requiredString = (label: string) => z.string().trim().min(1, `${label} is required`);

const optionalTrimmedString = () =>
  z.preprocess((v) => {
    if (typeof v !== "string") return v;
    const trimmed = v.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().optional());

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .toLowerCase()
  .email("Please enter a valid email address");

const phoneField = z
  .preprocess((v) => {
    if (typeof v !== "string") return v;
    const trimmed = v.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().optional())
  .refine((value) => {
    if (!value) return true;

    const allowedPattern = /^[+\d\s().\-xextEXT#]+$/;
    if (!allowedPattern.test(value)) return false;

    const digits = value.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }, "Please enter a valid phone number");

const iso2CountryCode = z
  .string()
  .trim()
  .min(1, "Country is required")
  .transform((s) => s.toUpperCase())
  .refine((s) => s.length === 2, "Please select a valid country");

const numberFromInput = (label: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "") return undefined;

        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : value;
      }

      return value;
    },
    z.number({
      error: (issue) => {
        if (issue.input === undefined) {
          return `${label} is required`;
        }
        return `${label} must be a valid number`;
      },
    }),
  );

const positiveNumber = (label: string) =>
  numberFromInput(label).refine((n) => n > 0, {
    message: `${label} must be greater than 0`,
  });

const integerMin1 = (label: string) =>
  numberFromInput(label)
    .refine((n) => Number.isInteger(n), {
      message: `${label} must be a whole number`,
    })
    .refine((n) => n >= 1, {
      message: `${label} must be at least 1`,
    });

const isoDateField = (label: string) =>
  z
    .union([z.string().trim().min(1, `${label} is required`), z.date()])
    .superRefine((v, ctx) => {
      const d = v instanceof Date ? v : new Date(String(v));
      if (Number.isNaN(d.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} is invalid`,
        });
      }
    })
    .transform((v) => {
      const d = v instanceof Date ? v : new Date(String(v));
      return d.toISOString();
    });

const enumField = <T extends Record<string, string | number>>(enumObj: T, message: string) =>
  z.nativeEnum(enumObj, {
    error: () => message,
  });

function isNorthAmerica(code?: string) {
  if (!code) return false;
  return (NORTH_AMERICAN_COUNTRY_CODES as readonly string[]).includes(code.toUpperCase());
}

/* ───────────────────────────── Shared ───────────────────────────── */

export const logisticsAddressSchema = z.object({
  street1: requiredString("Street address"),
  street2: optionalTrimmedString(),
  city: requiredString("City"),
  region: requiredString("State / province"),
  postalCode: requiredString("Postal / ZIP code"),
  countryCode: iso2CountryCode,
});

export const logisticsDimensionsSchema = z.object({
  length: positiveNumber("Length"),
  width: positiveNumber("Width"),
  height: positiveNumber("Height"),
});

const weightUnitField = enumField(EWeightUnit, "Please select a weight unit");
const dimensionUnitField = enumField(EDimensionUnit, "Please select a dimension unit");

export const cargoLineSchema = z.object({
  quantity: integerMin1("Quantity"),
  length: positiveNumber("Length"),
  width: positiveNumber("Width"),
  height: positiveNumber("Height"),
  weightPerUnit: positiveNumber("Weight per unit"),
});

export const oceanContainerLineSchema = z.object({
  quantity: integerMin1("Quantity"),
  containerType: enumField(EOceanContainerType, "Please select a container type"),
});

export const warehousingVolumeSchema = z.object({
  volumeType: enumField(EWarehousingVolumeType, "Please select a volume type"),
  value: positiveNumber("Estimated volume"),
});

export const fileAssetSchema: z.ZodType<IFileAsset> = z.object({
  url: requiredString("File URL"),
  s3Key: requiredString("File key"),
  mimeType: z.string().trim().min(1, "File type is required"),
  sizeBytes: z.number().optional(),
  originalName: z.string().optional(),
});

/* ───────────────────────── Equipment → allowed add-ons ────────────────────── */

export const FTL_ADDON_COMPAT: Record<EFTLEquipmentType, readonly EFTLAddon[]> = {
  [EFTLEquipmentType.DRY_VAN]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
    EFTLAddon.APPOINTMENT_REQUIRED,
  ],
  [EFTLEquipmentType.REEFER]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
    EFTLAddon.APPOINTMENT_REQUIRED,
  ],
  [EFTLEquipmentType.FLATBED]: [
    EFTLAddon.OVERSIZED_OVERWEIGHT,
    EFTLAddon.ESCORT_VEHICLES_REQUIRED,
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
    EFTLAddon.APPOINTMENT_REQUIRED,
  ],
  [EFTLEquipmentType.STEP_DECK]: [
    EFTLAddon.OVERSIZED_OVERWEIGHT,
    EFTLAddon.ESCORT_VEHICLES_REQUIRED,
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
    EFTLAddon.APPOINTMENT_REQUIRED,
  ],
  [EFTLEquipmentType.RGN_LOWBOY]: [
    EFTLAddon.OVERSIZED_OVERWEIGHT,
    EFTLAddon.ESCORT_VEHICLES_REQUIRED,
    EFTLAddon.EXPEDITED,
    EFTLAddon.APPOINTMENT_REQUIRED,
  ],
  [EFTLEquipmentType.CONESTOGA]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
    EFTLAddon.APPOINTMENT_REQUIRED,
  ],
};

export const LTL_ADDON_COMPAT: Record<ELTLEquipmentType, readonly ELTLAddon[]> = {
  [ELTLEquipmentType.DRY_VAN]: [
    ELTLAddon.LIFTGATE_REQUIRED,
    ELTLAddon.RESIDENTIAL_DELIVERY,
    ELTLAddon.APPOINTMENT_REQUIRED,
    ELTLAddon.EXPEDITED,
    ELTLAddon.TEAM_DRIVERS,
    ELTLAddon.HAZARDOUS_MATERIALS,
  ],
  [ELTLEquipmentType.FLATBED]: [
    ELTLAddon.LIFTGATE_REQUIRED,
    ELTLAddon.RESIDENTIAL_DELIVERY,
    ELTLAddon.APPOINTMENT_REQUIRED,
    ELTLAddon.OVERSIZED_OVERWEIGHT,
    ELTLAddon.ESCORT_VEHICLES_REQUIRED,
    ELTLAddon.EXPEDITED,
    ELTLAddon.TEAM_DRIVERS,
    ELTLAddon.HAZARDOUS_MATERIALS,
  ],
  [ELTLEquipmentType.STEP_DECK]: [
    ELTLAddon.LIFTGATE_REQUIRED,
    ELTLAddon.RESIDENTIAL_DELIVERY,
    ELTLAddon.APPOINTMENT_REQUIRED,
    ELTLAddon.OVERSIZED_OVERWEIGHT,
    ELTLAddon.ESCORT_VEHICLES_REQUIRED,
    ELTLAddon.EXPEDITED,
    ELTLAddon.TEAM_DRIVERS,
    ELTLAddon.HAZARDOUS_MATERIALS,
  ],
  [ELTLEquipmentType.CONESTOGA]: [
    ELTLAddon.LIFTGATE_REQUIRED,
    ELTLAddon.RESIDENTIAL_DELIVERY,
    ELTLAddon.APPOINTMENT_REQUIRED,
    ELTLAddon.EXPEDITED,
    ELTLAddon.TEAM_DRIVERS,
    ELTLAddon.HAZARDOUS_MATERIALS,
  ],
};

/* ───────────────────────────── Service Details ───────────────────────────── */

export const ftlDetailsSchema = z
  .object({
    primaryService: z.literal(ELogisticsPrimaryService.FTL),

    equipment: enumField(EFTLEquipmentType, "Please select an equipment type"),

    origin: logisticsAddressSchema,
    destination: logisticsAddressSchema,

    pickupDate: isoDateField("Pickup date"),
    commodityDescription: requiredString("Commodity description"),

    approximateTotalWeight: positiveNumber("Approximate total weight"),
    weightUnit: weightUnitField,

    estimatedPalletCount: integerMin1("Estimated pallet count").optional(),

    dimensions: logisticsDimensionsSchema.optional(),
    dimensionUnit: dimensionUnitField.optional(),

    pickupDateFlexible: z.coerce.boolean().optional(),

    addons: z.array(z.nativeEnum(EFTLAddon)).optional(),
  })
  .superRefine((val, ctx) => {
    if (!isNorthAmerica(val.origin.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["origin", "countryCode"],
        message: "Origin country must be Canada, United States, or Mexico",
      });
    }

    if (!isNorthAmerica(val.destination.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination", "countryCode"],
        message: "Destination country must be Canada, United States, or Mexico",
      });
    }

    if (val.dimensions && !val.dimensionUnit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dimensionUnit"],
        message: "Please select a dimension unit when dimensions are provided",
      });
    }

    if (!val.dimensions && val.dimensionUnit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dimensions"],
        message: "Dimensions are required when a dimension unit is selected",
      });
    }

    if (val.addons?.length) {
      const allowed = new Set(FTL_ADDON_COMPAT[val.equipment] || []);
      for (const addon of val.addons) {
        if (!allowed.has(addon)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["addons"],
            message: "One or more selected add-ons are not available for the chosen equipment type",
          });
          break;
        }
      }
    }
  });

export const ltlDetailsSchema = z
  .object({
    primaryService: z.literal(ELogisticsPrimaryService.LTL),

    equipment: enumField(ELTLEquipmentType, "Please select an equipment type"),

    origin: logisticsAddressSchema,
    destination: logisticsAddressSchema,

    pickupDate: isoDateField("Pickup date"),
    commodityDescription: requiredString("Commodity description"),

    weightUnit: weightUnitField,
    dimensionUnit: dimensionUnitField,

    stackable: z.coerce.boolean(),

    cargoLines: z.array(cargoLineSchema).min(1, "Add at least one cargo line"),

    approximateTotalWeight: positiveNumber("Approximate total weight"),

    addons: z.array(z.nativeEnum(ELTLAddon)).optional(),
  })
  .superRefine((val, ctx) => {
    if (!isNorthAmerica(val.origin.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["origin", "countryCode"],
        message: "Origin country must be Canada, United States, or Mexico",
      });
    }

    if (!isNorthAmerica(val.destination.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination", "countryCode"],
        message: "Destination country must be Canada, United States, or Mexico",
      });
    }

    if (val.addons?.length) {
      const allowed = new Set(LTL_ADDON_COMPAT[val.equipment] || []);
      for (const addon of val.addons) {
        if (!allowed.has(addon)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["addons"],
            message: "One or more selected add-ons are not available for the chosen equipment type",
          });
          break;
        }
      }
    }
  });

export const intlAirDetailsSchema = z.object({
  primaryService: z.literal(ELogisticsPrimaryService.INTERNATIONAL),

  mode: z.literal(EInternationalMode.AIR),

  origin: logisticsAddressSchema,
  destination: logisticsAddressSchema,

  pickupDate: isoDateField("Pickup date"),
  commodityDescription: requiredString("Commodity description"),

  weightUnit: weightUnitField,
  dimensionUnit: dimensionUnitField,

  cargoLines: z.array(cargoLineSchema).min(1, "Add at least one cargo line"),

  approximateTotalWeight: positiveNumber("Approximate total weight"),
});

export const intlOceanLclDetailsSchema = z.object({
  primaryService: z.literal(ELogisticsPrimaryService.INTERNATIONAL),

  mode: z.literal(EInternationalMode.OCEAN),
  oceanLoadType: z.literal(EOceanLoadType.LCL),

  origin: logisticsAddressSchema,
  destination: logisticsAddressSchema,

  pickupDate: isoDateField("Pickup date"),
  commodityDescription: requiredString("Commodity description"),

  weightUnit: weightUnitField,
  dimensionUnit: dimensionUnitField,

  cargoLines: z.array(cargoLineSchema).min(1, "Add at least one cargo line"),

  approximateTotalWeight: positiveNumber("Approximate total weight"),
});

export const intlOceanFclDetailsSchema = z.object({
  primaryService: z.literal(ELogisticsPrimaryService.INTERNATIONAL),

  mode: z.literal(EInternationalMode.OCEAN),
  oceanLoadType: z.literal(EOceanLoadType.FCL),

  origin: logisticsAddressSchema,
  destination: logisticsAddressSchema,

  pickupDate: isoDateField("Pickup date"),
  commodityDescription: requiredString("Commodity description"),

  containerLines: z.array(oceanContainerLineSchema).min(1, "Add at least one container line"),
});

export const intlDetailsSchema = z.union([
  intlAirDetailsSchema,
  intlOceanLclDetailsSchema,
  intlOceanFclDetailsSchema,
]);

export const warehousingDetailsSchema = z
  .object({
    primaryService: z.literal(ELogisticsPrimaryService.WAREHOUSING),

    requiredLocation: logisticsAddressSchema,

    estimatedVolume: warehousingVolumeSchema,

    expectedDuration: enumField(EWarehousingDuration, "Please select a storage duration"),
  })
  .superRefine((val, ctx) => {
    if (!isNorthAmerica(val.requiredLocation.countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requiredLocation", "countryCode"],
        message: "Warehouse location must be in Canada, United States, or Mexico",
      });
    }
  });

export const serviceDetailsSchema = z.union([
  ftlDetailsSchema,
  ltlDetailsSchema,
  intlAirDetailsSchema,
  intlOceanLclDetailsSchema,
  intlOceanFclDetailsSchema,
  warehousingDetailsSchema,
]);

/* ───────────────────────── Identification + Contact ───────────────────────── */

export const identificationSchema = z.union([
  z.object({
    identity: z.literal(ECustomerIdentity.SHIPPER),
    brokerType: z.undefined().optional(),
  }),
  z.object({
    identity: z.literal(ECustomerIdentity.BROKER),
    brokerType: enumField(EBrokerType, "Please select a broker type"),
  }),
]);

export const contactSchema = z
  .object({
    firstName: requiredString("First name"),
    lastName: requiredString("Last name"),
    email: emailField,
    company: requiredString("Company name"),

    phone: phoneField,
    preferredContactMethod: z.nativeEnum(EPreferredContactMethod).optional(),

    companyAddress: optionalTrimmedString().refine(
      (s) => s == null || s.length <= 400,
      "Company address must be 400 characters or less",
    ),
  })
  .superRefine((val, ctx) => {
    if (val.preferredContactMethod === EPreferredContactMethod.PHONE && !val.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Phone is required when phone is the preferred contact method",
      });
    }
  });

/* ───────────────────────────── SUBMIT BODY ───────────────────────────── */

export const logisticsQuoteSubmitSchema = z
  .object({
    turnstileToken: z.string().trim().min(1, "Please complete the verification challenge"),

    serviceDetails: serviceDetailsSchema.optional(),

    identification: identificationSchema,
    contact: contactSchema,

    finalNotes: z.preprocess((v) => {
      if (typeof v !== "string") return v;
      const trimmed = v.trim();
      return trimmed === "" ? undefined : trimmed;
    }, z.string().max(6000, "Final notes must be 6000 characters or less").optional()),

    attachments: z.array(fileAssetSchema).optional(),

    marketingEmailConsent: z.coerce.boolean().optional(),

    sourceLabel: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.serviceDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceDetails", "primaryService"],
        message: "Please select a service",
      });
    }
  });

export type LogisticsQuoteSubmitValues = z.infer<typeof logisticsQuoteSubmitSchema>;
