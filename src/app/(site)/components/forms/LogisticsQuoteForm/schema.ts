// src/app/(site)/components/forms/LogisticsQuoteForm/schema.ts
import { z } from "zod";

import {
  EBrokerType,
  ECustomerIdentity,
  EDimensionUnit,
  EFTLAddon,
  EFTLEquipmentType,
  EInternationalMode,
  ELogisticsPrimaryService,
  EOceanContainerType,
  EOceanLoadType,
  ELTLAddon,
  ELTLEquipmentType,
  EPreferredContactMethod,
  EWarehousingDuration,
  EWarehousingVolumeType,
  EWeightUnit,
} from "@/types/logisticsQuote.types";

import { NORTH_AMERICAN_COUNTRY_CODES } from "@/config/countries";
import type { IFileAsset } from "@/types/shared.types";

/* ──────────────────────────────────────────────────────────────────────────────
  SUBMIT BODY schema (form-facing)
  RHF uses input types, so defaults can safely use "" / undefined for empty fields.
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

const optionalPositiveNumber = (label: string) =>
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
    z
      .number({
        error: () => `${label} must be a valid number`,
      })
      .refine((n) => n > 0, {
        message: `${label} must be greater than 0`,
      })
      .optional(),
  );

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

const requiredEnumField = <T extends Record<string, string | number>>(
  enumObj: T,
  message: string,
) =>
  z.preprocess(
    (value) => {
      if (value === "") return undefined;
      return value;
    },
    z.union([z.nativeEnum(enumObj), z.undefined()]).superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        });
      }
    }),
  );

function isNorthAmerica(code?: string) {
  if (!code) return false;
  return (NORTH_AMERICAN_COUNTRY_CODES as readonly string[]).includes(code.toUpperCase());
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalObjectIfBlank<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return z.preprocess((value) => {
    if (value == null) return undefined;
    if (!isPlainObject(value)) return value;

    const allBlank = Object.values(value).every((v) => v === "" || v === null || v === undefined);

    return allBlank ? undefined : value;
  }, schema.optional());
}

/** Shared: Address */
export const logisticsAddressSchema = z.object({
  street1: requiredString("Street address"),
  street2: optionalTrimmedString(),
  city: requiredString("City"),
  region: requiredString("State / province"),
  postalCode: requiredString("Postal / ZIP code"),
  countryCode: iso2CountryCode,
});

/** Shared: Dimensions (no unit stored) */
export const logisticsDimensionsSchema = z.object({
  length: positiveNumber("Length"),
  width: positiveNumber("Width"),
  height: positiveNumber("Height"),
});

export const cargoLineSchema = z.object({
  quantity: integerMin1("Quantity"),
  length: positiveNumber("Length"),
  width: positiveNumber("Width"),
  height: positiveNumber("Height"),
  weightPerUnit: positiveNumber("Weight per unit"),
});

export const oceanContainerLineSchema = z.object({
  quantity: integerMin1("Quantity"),
  containerType: requiredEnumField(EOceanContainerType, "Please select a container type"),
});

/** Attachments */
export const fileAssetSchema = z.object({
  url: requiredString("File URL"),
  s3Key: requiredString("File key"),
  mimeType: z.string().trim().min(1, "File type is required"),
  sizeBytes: z.number().optional(),
  originalName: z.string().optional(),
}) satisfies z.ZodType<IFileAsset>;

/** Equipment -> allowed add-ons (must match backend rules) */
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

const weightUnitField = requiredEnumField(EWeightUnit, "Please select a weight unit");
const dimensionUnitField = requiredEnumField(EDimensionUnit, "Please select a dimension unit");
const ftlEquipmentField = requiredEnumField(EFTLEquipmentType, "Please select an equipment type");
const ltlEquipmentField = requiredEnumField(ELTLEquipmentType, "Please select an equipment type");
const internationalModeField = requiredEnumField(
  EInternationalMode,
  "Please select a shipping mode",
);

/* ───────────────────────────── Service Details ───────────────────────────── */

export const ftlDetailsSchema = z
  .object({
    primaryService: z.literal(ELogisticsPrimaryService.FTL),

    equipment: ftlEquipmentField,

    origin: logisticsAddressSchema,
    destination: logisticsAddressSchema,

    pickupDate: isoDateField("Pickup date"),
    commodityDescription: requiredString("Commodity description"),

    approximateTotalWeight: positiveNumber("Approximate total weight"),
    weightUnit: weightUnitField,

    estimatedPalletCount: optionalPositiveNumber("Estimated pallet count").refine(
      (v) => v === undefined || Number.isInteger(v),
      { message: "Estimated pallet count must be a whole number" },
    ),

    dimensions: optionalObjectIfBlank(logisticsDimensionsSchema),
    dimensionUnit: z.union([z.nativeEnum(EDimensionUnit), z.undefined()]).optional(),

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
        message: "Please select a dimension unit",
      });
    }

    if (val.addons?.length && val.equipment) {
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

    equipment: ltlEquipmentField,

    origin: logisticsAddressSchema,
    destination: logisticsAddressSchema,

    pickupDate: isoDateField("Pickup date"),
    commodityDescription: requiredString("Commodity description"),

    weightUnit: weightUnitField,
    dimensionUnit: dimensionUnitField,

    stackable: z.coerce.boolean(),

    cargoLines: z.array(cargoLineSchema).min(1, "Add at least one pallet line"),

    approximateTotalWeight: optionalPositiveNumber("Approximate total weight"),

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

    if (val.addons?.length && val.equipment) {
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

export const intlDetailsSchema = z
  .object({
    primaryService: z.literal(ELogisticsPrimaryService.INTERNATIONAL),

    mode: internationalModeField,
    oceanLoadType: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.union([z.nativeEnum(EOceanLoadType), z.undefined()]).optional(),
    ),

    origin: logisticsAddressSchema,
    destination: logisticsAddressSchema,

    pickupDate: isoDateField("Pickup date"),
    commodityDescription: requiredString("Commodity description"),

    weightUnit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.union([z.nativeEnum(EWeightUnit), z.undefined()]).optional(),
    ),
    dimensionUnit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.union([z.nativeEnum(EDimensionUnit), z.undefined()]).optional(),
    ),

    cargoLines: z.array(cargoLineSchema).optional(),
    approximateTotalWeight: optionalPositiveNumber("Approximate total weight"),

    containerLines: z.array(oceanContainerLineSchema).optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.mode) {
      return;
    }

    if (val.mode === EInternationalMode.AIR) {
      if (!val.weightUnit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["weightUnit"],
          message: "Please select a weight unit",
        });
      }

      if (!val.dimensionUnit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dimensionUnit"],
          message: "Please select a dimension unit",
        });
      }

      if (!val.cargoLines || val.cargoLines.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cargoLines"],
          message: "Add at least one cargo line",
        });
      }

      if (val.oceanLoadType !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["oceanLoadType"],
          message: "Ocean load type is only allowed for ocean shipments",
        });
      }

      if (val.containerLines !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["containerLines"],
          message: "Container lines are only allowed for ocean FCL shipments",
        });
      }
    }

    if (val.mode === EInternationalMode.OCEAN) {
      if (!val.oceanLoadType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["oceanLoadType"],
          message: "Please select an ocean load type",
        });
        return;
      }

      if (val.oceanLoadType === EOceanLoadType.LCL) {
        if (!val.weightUnit) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["weightUnit"],
            message: "Please select a weight unit",
          });
        }

        if (!val.dimensionUnit) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dimensionUnit"],
            message: "Please select a dimension unit",
          });
        }

        if (!val.cargoLines || val.cargoLines.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["cargoLines"],
            message: "Add at least one cargo line",
          });
        }

        if (val.containerLines !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["containerLines"],
            message: "Container lines are only allowed for ocean FCL shipments",
          });
        }
      }

      if (val.oceanLoadType === EOceanLoadType.FCL) {
        if (!val.containerLines || val.containerLines.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["containerLines"],
            message: "Add at least one container line",
          });
        }

        if (val.weightUnit !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["weightUnit"],
            message: "Weight unit is not used for ocean FCL",
          });
        }

        if (val.dimensionUnit !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dimensionUnit"],
            message: "Dimension unit is not used for ocean FCL",
          });
        }

        if (val.cargoLines !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["cargoLines"],
            message: "Cargo lines are only allowed for air and ocean LCL",
          });
        }
      }
    }
  });

export const warehousingVolumeSchema = z.object({
  volumeType: enumField(EWarehousingVolumeType, "Please select a volume type"),
  value: positiveNumber("Estimated volume"),
});

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

export const serviceDetailsSchema = z.discriminatedUnion("primaryService", [
  ftlDetailsSchema,
  ltlDetailsSchema,
  intlDetailsSchema,
  warehousingDetailsSchema,
]);

/* ───────────────────────────── Identification + Contact ───────────────────────────── */

export const identificationSchema = z
  .object({
    identity: z.union([z.nativeEnum(ECustomerIdentity), z.literal(""), z.undefined()]),
    brokerType: z.union([z.nativeEnum(EBrokerType), z.undefined()]).optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.identity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["identity"],
        message: "Please select who you are",
      });
      return;
    }

    if (val.identity === ECustomerIdentity.BROKER && !val.brokerType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["brokerType"],
        message: "Please select a broker type",
      });
    }

    if (val.identity !== ECustomerIdentity.BROKER && val.brokerType !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["brokerType"],
        message: "Broker type is only allowed when customer type is Broker",
      });
    }
  });

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

/**
 * Form values should use INPUT types so RHF defaults can safely be:
 * - ""
 * - undefined
 * - partial pre-selection states
 */
export type LogisticsQuoteSubmitValues = z.input<typeof logisticsQuoteSubmitSchema>;

/** Parsed/normalized submit body */
export type LogisticsQuoteSubmitParsedValues = z.output<typeof logisticsQuoteSubmitSchema>;
