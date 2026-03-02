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
import {
  warehousingVolumeBaseSchema,
  warehousingVolumePalletCountSchema,
  warehousingVolumeSquareFootageSchema,
} from "./warehousingVolume.schema";

function isNorthAmericanCountry(code?: string) {
  if (!code) return false;
  return (NORTH_AMERICAN_COUNTRY_CODES as readonly string[]).includes(code.toUpperCase());
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
    strict: "throw", // catch unknown fields in serviceDetails
  },
);

/* ------------------------------ FTL ------------------------------ */

export const quoteFTLDetailsSchema = new Schema<QuoteFTLDetails>(
  {
    primaryService: { type: String, required: true, enum: [ELogisticsPrimaryService.FTL] },

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
  { _id: false, strict: "throw" },
);

// FTL
quoteFTLDetailsSchema.pre("validate", function () {
  if (!requireNorthAmericaAddresses(this)) {
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
    totalWeight: { type: logisticsWeightSchema, required: false },
  },
  { _id: false, strict: "throw" },
);

export const quoteLTLDetailsSchema = new Schema<QuoteLTLDetails>(
  {
    primaryService: { type: String, required: true, enum: [ELogisticsPrimaryService.LTL] },

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

    approximateTotalWeight: { type: logisticsWeightSchema, required: false },

    addons: { type: [String], required: false, default: [], enum: Object.values(ELTLAddon) },
  },
  { _id: false, strict: "throw" },
);

// LTL
quoteLTLDetailsSchema.pre("validate", function () {
  if (!requireNorthAmericaAddresses(this)) {
    throw new Error(
      "LTL origin/destination countryCode must be one of NORTH_AMERICAN_COUNTRY_CODES (CA/US/MX).",
    );
  }
});

/* --------------------------- International --------------------------- */

export const quoteInternationalDetailsSchema = new Schema<QuoteInternationalDetails>(
  {
    primaryService: {
      type: String,
      required: true,
      enum: [ELogisticsPrimaryService.INTERNATIONAL],
    },

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
  { _id: false, strict: "throw" },
);

/* --------------------------- Warehousing --------------------------- */

export const quoteWarehousingDetailsSchema = new Schema<QuoteWarehousingDetails>(
  {
    primaryService: { type: String, required: true, enum: [ELogisticsPrimaryService.WAREHOUSING] },

    requiredLocation: { type: logisticsAddressSchema, required: true },

    estimatedVolume: { type: warehousingVolumeBaseSchema, required: true },

    expectedDuration: { type: String, required: true, enum: Object.values(EWarehousingDuration) },
  },
  { _id: false, strict: "throw" },
);

// Warehousing
quoteWarehousingDetailsSchema.pre("validate", function () {
  if (!requireNorthAmericaAddresses(this)) {
    throw new Error(
      "Warehousing requiredLocation.countryCode must be one of NORTH_AMERICAN_COUNTRY_CODES (CA/US/MX).",
    );
  }
});

/* --------------------------- Attach volume discriminators --------------------------- */

(quoteWarehousingDetailsSchema.path("estimatedVolume") as any).discriminator(
  "PALLET_COUNT",
  warehousingVolumePalletCountSchema,
);

(quoteWarehousingDetailsSchema.path("estimatedVolume") as any).discriminator(
  "SQUARE_FOOTAGE",
  warehousingVolumeSquareFootageSchema,
);

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
