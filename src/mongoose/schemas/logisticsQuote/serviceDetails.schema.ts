// src/mongoose/schemas/logisticsQuote/serviceDetails.schema.ts
import { Schema } from "mongoose";

import {
  ELogisticsPrimaryService,
  EFTLEquipmentType,
  EFTLAddon,
  ELTLAddon,
  EInternationalMode,
  EInternationalShipmentSize,
  EWarehousingDuration,
  type QuoteServiceDetails,
  type QuoteFTLDetails,
  type QuoteLTLDetails,
  type QuoteInternationalDetails,
  type QuoteWarehousingDetails,
} from "@/types/logisticsQuote.types";

import { NORTH_AMERICAN_COUNTRY_CODES } from "@/config/countries";

import { logisticsAddressSchema } from "./address.schema";
import { logisticsWeightSchema } from "./weight.schema";
import { logisticsDimensionsSchema } from "./dimensions.schema";
import { warehousingVolumeSchema } from "./warehousingVolume.schema";

function isNorthAmericanCountry(code?: string) {
  if (!code) return false;
  return (NORTH_AMERICAN_COUNTRY_CODES as readonly string[]).includes(String(code).toUpperCase());
}

function requireNorthAmericaAddresses(doc: {
  origin?: any;
  destination?: any;
  requiredLocation?: any;
}) {
  const codes: string[] = [];

  if (doc.origin?.countryCode) codes.push(String(doc.origin.countryCode));
  if (doc.destination?.countryCode) codes.push(String(doc.destination.countryCode));
  if (doc.requiredLocation?.countryCode) codes.push(String(doc.requiredLocation.countryCode));

  return codes.every((c) => isNorthAmericanCountry(c));
}

/**
 * Base discriminator schema for serviceDetails.
 * IMPORTANT: strict discriminator model keyed by `primaryService`.
 */
export const quoteServiceDetailsBaseSchema = new Schema<QuoteServiceDetails>(
  {
    primaryService: {
      type: String,
      required: true,
      enum: Object.values(ELogisticsPrimaryService),
      index: true,
    },
  },
  {
    _id: false,
    discriminatorKey: "primaryService",
  },
);

/* ------------------------------ FTL ------------------------------ */
/**
 * NOTE:
 * - Do NOT re-declare `primaryService` in discriminator schemas.
 * - Discriminator key is owned by base schema.
 */
export const quoteFTLDetailsSchema = new Schema<Omit<QuoteFTLDetails, "primaryService">>(
  {
    equipment: { type: String, required: true, enum: Object.values(EFTLEquipmentType) },

    origin: { type: logisticsAddressSchema, required: true },
    destination: { type: logisticsAddressSchema, required: true },

    readyDate: { type: Date, required: true },
    commodityDescription: { type: String, required: true, trim: true, maxlength: 2000 },

    approximateTotalWeight: { type: logisticsWeightSchema, required: true },

    estimatedPalletCount: { type: Number, required: false, min: 1 },
    dimensions: { type: logisticsDimensionsSchema, required: false },

    readyDateFlexible: { type: Boolean, required: false, default: false },

    addons: { type: [String], required: false, default: [], enum: Object.values(EFTLAddon) },
  },
  { _id: false },
);

quoteFTLDetailsSchema.pre("validate", function () {
  // At runtime, `primaryService` exists (from base discriminator), so this check works fine.
  if (!requireNorthAmericaAddresses(this as any)) {
    throw new Error(
      "FTL origin/destination countryCode must be one of NORTH_AMERICAN_COUNTRY_CODES (CA/US/MX).",
    );
  }
});

/* ------------------------------ LTL ------------------------------ */

const quoteLTLPalletLineSchema = new Schema(
  {
    quantity: { type: Number, required: true, min: 1 },
    dimensions: { type: logisticsDimensionsSchema, required: true },
    weightValue: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

export const quoteLTLDetailsSchema = new Schema<Omit<QuoteLTLDetails, "primaryService">>(
  {
    origin: { type: logisticsAddressSchema, required: true },
    destination: { type: logisticsAddressSchema, required: true },

    readyDate: { type: Date, required: true },
    commodityDescription: { type: String, required: true, trim: true, maxlength: 2000 },

    stackable: { type: Boolean, required: true },

    palletLines: {
      type: [quoteLTLPalletLineSchema],
      required: true,
      validate: [
        (v: any[]) => Array.isArray(v) && v.length > 0,
        "At least one pallet line is required",
      ],
    },

    approximateTotalWeight: { type: logisticsWeightSchema, required: true },

    addons: { type: [String], required: false, default: [], enum: Object.values(ELTLAddon) },
  },
  { _id: false },
);

quoteLTLDetailsSchema.pre("validate", function () {
  if (!requireNorthAmericaAddresses(this as any)) {
    throw new Error(
      "LTL origin/destination countryCode must be one of NORTH_AMERICAN_COUNTRY_CODES (CA/US/MX).",
    );
  }

  const doc = this as any;

  if (!doc.approximateTotalWeight?.unit) {
    throw new Error("LTL approximateTotalWeight.unit is required");
  }

  if (!Array.isArray(doc.palletLines) || doc.palletLines.length === 0) {
    throw new Error("At least one pallet line is required");
  }

  const sum = doc.palletLines.reduce((acc: number, line: any) => {
    const n = Number(line?.weightValue);
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error("Each pallet line weightValue must be a positive number");
    }
    return acc + n;
  }, 0);

  doc.approximateTotalWeight.value = sum;
});

/* --------------------------- International --------------------------- */

export const quoteInternationalDetailsSchema = new Schema<
  Omit<QuoteInternationalDetails, "primaryService">
>(
  {
    mode: { type: String, required: true, enum: Object.values(EInternationalMode) },

    origin: { type: logisticsAddressSchema, required: true },
    destination: { type: logisticsAddressSchema, required: true },

    readyDate: { type: Date, required: true },
    commodityDescription: { type: String, required: true, trim: true, maxlength: 2000 },

    estimatedWeight: { type: logisticsWeightSchema, required: true },

    shipmentSize: {
      type: String,
      required: false,
      enum: Object.values(EInternationalShipmentSize),
    },
  },
  { _id: false },
);

/* --------------------------- Warehousing --------------------------- */

export const quoteWarehousingDetailsSchema = new Schema<
  Omit<QuoteWarehousingDetails, "primaryService">
>(
  {
    requiredLocation: { type: logisticsAddressSchema, required: true },

    estimatedVolume: { type: warehousingVolumeSchema, required: true },

    expectedDuration: { type: String, required: true, enum: Object.values(EWarehousingDuration) },
  },
  { _id: false },
);

quoteWarehousingDetailsSchema.pre("validate", function () {
  if (!requireNorthAmericaAddresses(this as any)) {
    throw new Error(
      "Warehousing requiredLocation.countryCode must be one of NORTH_AMERICAN_COUNTRY_CODES (CA/US/MX).",
    );
  }
});

/* --------------------------- Register service discriminators --------------------------- */

export function registerServiceDetailsDiscriminators() {
  // idempotent-ish protection: Mongoose throws if you re-discriminator same name.
  // Call once at model init time.
  const base: any = quoteServiceDetailsBaseSchema;

  if (!base.discriminators?.[ELogisticsPrimaryService.FTL]) {
    base.discriminator(ELogisticsPrimaryService.FTL, quoteFTLDetailsSchema);
  }
  if (!base.discriminators?.[ELogisticsPrimaryService.LTL]) {
    base.discriminator(ELogisticsPrimaryService.LTL, quoteLTLDetailsSchema);
  }
  if (!base.discriminators?.[ELogisticsPrimaryService.INTERNATIONAL]) {
    base.discriminator(ELogisticsPrimaryService.INTERNATIONAL, quoteInternationalDetailsSchema);
  }
  if (!base.discriminators?.[ELogisticsPrimaryService.WAREHOUSING]) {
    base.discriminator(ELogisticsPrimaryService.WAREHOUSING, quoteWarehousingDetailsSchema);
  }
}
