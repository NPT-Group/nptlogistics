// src/mongoose/schemas/logisticsQuote/serviceDetails.schema.ts
import { Schema } from "mongoose";

import {
  ELogisticsPrimaryService,
  EFTLEquipmentType,
  EFTLAddon,
  ELTLEquipmentType,
  ELTLAddon,
  EInternationalMode,
  EOceanLoadType,
  EOceanContainerType,
  EWarehousingDuration,
  EWeightUnit,
  EDimensionUnit,
  type QuoteServiceDetails,
  type QuoteFTLDetails,
  type QuoteLTLDetails,
  type QuoteWarehousingDetails,
  type CargoLine,
  type OceanContainerLine,
} from "@/types/logisticsQuote.types";

import { NORTH_AMERICAN_COUNTRY_CODES } from "@/config/countries";

import { logisticsAddressSchema } from "./address.schema";
import { logisticsDimensionsSchema } from "./dimensions.schema";
import { warehousingVolumeSchema } from "./warehousingVolume.schema";

function isNorthAmericanCountry(code?: string) {
  if (!code) return false;
  return (NORTH_AMERICAN_COUNTRY_CODES as readonly string[]).includes(String(code).toUpperCase());
}

function requireNorthAmericaAddresses(doc: {
  origin?: { countryCode?: string };
  destination?: { countryCode?: string };
  requiredLocation?: { countryCode?: string };
}) {
  const codes: string[] = [];

  if (doc.origin?.countryCode) codes.push(String(doc.origin.countryCode));
  if (doc.destination?.countryCode) codes.push(String(doc.destination.countryCode));
  if (doc.requiredLocation?.countryCode) codes.push(String(doc.requiredLocation.countryCode));

  return codes.every((c) => isNorthAmericanCountry(c));
}

function requirePositiveNumber(value: unknown) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

/**
 * Explicit schema type for the INTERNATIONAL discriminator document.
 * Do not use the QuoteInternationalDetails union directly as the Schema generic,
 * because TypeScript will only allow fields common to all union members.
 */
type QuoteInternationalDetailsSchemaShape = {
  mode: EInternationalMode;
  origin: QuoteFTLDetails["origin"];
  destination: QuoteFTLDetails["destination"];
  pickupDate: Date | string;
  commodityDescription: string;

  oceanLoadType?: EOceanLoadType;

  weightUnit?: EWeightUnit;
  dimensionUnit?: EDimensionUnit;

  cargoLines?: CargoLine[];
  approximateTotalWeight?: number;

  containerLines?: OceanContainerLine[];
};

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

/* ------------------------------ Shared nested schemas ------------------------------ */

export const cargoLineSchema = new Schema<CargoLine>(
  {
    quantity: { type: Number, required: true, min: 1 },
    length: { type: Number, required: true, min: 0.01 },
    width: { type: Number, required: true, min: 0.01 },
    height: { type: Number, required: true, min: 0.01 },
    weightPerUnit: { type: Number, required: true, min: 0.01 },
  },
  { _id: false },
);

export const oceanContainerLineSchema = new Schema<OceanContainerLine>(
  {
    quantity: { type: Number, required: true, min: 1 },
    containerType: { type: String, required: true, enum: Object.values(EOceanContainerType) },
  },
  { _id: false },
);

/* ------------------------------ FTL ------------------------------ */

export const quoteFTLDetailsSchema = new Schema<Omit<QuoteFTLDetails, "primaryService">>(
  {
    equipment: { type: String, required: true, enum: Object.values(EFTLEquipmentType) },

    origin: { type: logisticsAddressSchema, required: true },
    destination: { type: logisticsAddressSchema, required: true },

    pickupDate: { type: Date, required: true },
    commodityDescription: { type: String, required: true, trim: true, maxlength: 2000 },

    approximateTotalWeight: { type: Number, required: true, min: 1 },
    weightUnit: { type: String, required: true, enum: Object.values(EWeightUnit) },

    estimatedPalletCount: { type: Number, required: false, min: 1 },

    dimensions: { type: logisticsDimensionsSchema, required: false },
    dimensionUnit: { type: String, required: false, enum: Object.values(EDimensionUnit) },

    pickupDateFlexible: { type: Boolean, required: false, default: false },

    addons: { type: [String], required: false, default: [], enum: Object.values(EFTLAddon) },
  },
  { _id: false },
);

quoteFTLDetailsSchema.pre("validate", function () {
  if (!requireNorthAmericaAddresses(this as any)) {
    throw new Error(
      "FTL origin/destination countryCode must be one of NORTH_AMERICAN_COUNTRY_CODES (CA/US/MX).",
    );
  }

  const doc = this as any;

  if (doc.dimensions && !doc.dimensionUnit) {
    throw new Error("FTL dimensionUnit is required when dimensions are provided");
  }

  if (!doc.dimensions && doc.dimensionUnit) {
    throw new Error("FTL dimensions are required when dimensionUnit is provided");
  }
});

/* ------------------------------ LTL ------------------------------ */

export const quoteLTLDetailsSchema = new Schema<Omit<QuoteLTLDetails, "primaryService">>(
  {
    equipment: { type: String, required: true, enum: Object.values(ELTLEquipmentType) },

    origin: { type: logisticsAddressSchema, required: true },
    destination: { type: logisticsAddressSchema, required: true },

    pickupDate: { type: Date, required: true },
    commodityDescription: { type: String, required: true, trim: true, maxlength: 2000 },

    weightUnit: { type: String, required: true, enum: Object.values(EWeightUnit) },
    dimensionUnit: { type: String, required: true, enum: Object.values(EDimensionUnit) },

    stackable: { type: Boolean, required: true },

    cargoLines: {
      type: [cargoLineSchema],
      required: true,
      validate: [
        (v: unknown[]) => Array.isArray(v) && v.length > 0,
        "At least one cargo line is required",
      ],
    },

    approximateTotalWeight: { type: Number, required: true, min: 1 },

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

  if (!Array.isArray(doc.cargoLines) || doc.cargoLines.length === 0) {
    throw new Error("At least one cargo line is required");
  }

  const sum = doc.cargoLines.reduce((acc: number, line: any) => {
    if (!requirePositiveNumber(line?.quantity)) {
      throw new Error("Each cargo line quantity must be a positive number");
    }
    if (!requirePositiveNumber(line?.weightPerUnit)) {
      throw new Error("Each cargo line weightPerUnit must be a positive number");
    }

    return acc + Number(line.quantity) * Number(line.weightPerUnit);
  }, 0);

  doc.approximateTotalWeight = sum;
});

/* --------------------------- International --------------------------- */

export const quoteInternationalDetailsSchema = new Schema<QuoteInternationalDetailsSchemaShape>(
  {
    mode: { type: String, required: true, enum: Object.values(EInternationalMode) },

    origin: { type: logisticsAddressSchema, required: true },
    destination: { type: logisticsAddressSchema, required: true },

    pickupDate: { type: Date, required: true },
    commodityDescription: { type: String, required: true, trim: true, maxlength: 2000 },

    oceanLoadType: {
      type: String,
      required: false,
      enum: Object.values(EOceanLoadType),
    },

    weightUnit: {
      type: String,
      required: false,
      enum: Object.values(EWeightUnit),
    },
    dimensionUnit: {
      type: String,
      required: false,
      enum: Object.values(EDimensionUnit),
    },

    cargoLines: {
      type: [cargoLineSchema],
      required: false,
      default: undefined,
    },

    approximateTotalWeight: {
      type: Number,
      required: false,
      min: 1,
    },

    containerLines: {
      type: [oceanContainerLineSchema],
      required: false,
      default: undefined,
    },
  },
  { _id: false },
);

quoteInternationalDetailsSchema.pre("validate", function () {
  const doc = this as any;

  if (doc.mode === EInternationalMode.AIR) {
    if (doc.oceanLoadType) {
      throw new Error("International AIR must not include oceanLoadType");
    }
    if (!doc.weightUnit) {
      throw new Error("International AIR weightUnit is required");
    }
    if (!doc.dimensionUnit) {
      throw new Error("International AIR dimensionUnit is required");
    }
    if (!Array.isArray(doc.cargoLines) || doc.cargoLines.length === 0) {
      throw new Error("International AIR requires at least one cargo line");
    }
    if (doc.containerLines?.length) {
      throw new Error("International AIR must not include containerLines");
    }

    const sum = doc.cargoLines.reduce((acc: number, line: any) => {
      if (!requirePositiveNumber(line?.quantity)) {
        throw new Error("Each cargo line quantity must be a positive number");
      }
      if (!requirePositiveNumber(line?.weightPerUnit)) {
        throw new Error("Each cargo line weightPerUnit must be a positive number");
      }

      return acc + Number(line.quantity) * Number(line.weightPerUnit);
    }, 0);

    doc.approximateTotalWeight = sum;
    return;
  }

  if (doc.mode === EInternationalMode.OCEAN) {
    if (!doc.oceanLoadType) {
      throw new Error("International OCEAN oceanLoadType is required");
    }

    if (doc.oceanLoadType === EOceanLoadType.LCL) {
      if (!doc.weightUnit) {
        throw new Error("Ocean LCL weightUnit is required");
      }
      if (!doc.dimensionUnit) {
        throw new Error("Ocean LCL dimensionUnit is required");
      }
      if (!Array.isArray(doc.cargoLines) || doc.cargoLines.length === 0) {
        throw new Error("Ocean LCL requires at least one cargo line");
      }
      if (doc.containerLines?.length) {
        throw new Error("Ocean LCL must not include containerLines");
      }

      const sum = doc.cargoLines.reduce((acc: number, line: any) => {
        if (!requirePositiveNumber(line?.quantity)) {
          throw new Error("Each cargo line quantity must be a positive number");
        }
        if (!requirePositiveNumber(line?.weightPerUnit)) {
          throw new Error("Each cargo line weightPerUnit must be a positive number");
        }

        return acc + Number(line.quantity) * Number(line.weightPerUnit);
      }, 0);

      doc.approximateTotalWeight = sum;
      return;
    }

    if (doc.oceanLoadType === EOceanLoadType.FCL) {
      if (doc.weightUnit) {
        throw new Error("Ocean FCL must not include weightUnit");
      }
      if (doc.dimensionUnit) {
        throw new Error("Ocean FCL must not include dimensionUnit");
      }
      if (doc.cargoLines?.length) {
        throw new Error("Ocean FCL must not include cargoLines");
      }
      if (doc.approximateTotalWeight != null) {
        throw new Error("Ocean FCL must not include approximateTotalWeight");
      }
      if (!Array.isArray(doc.containerLines) || doc.containerLines.length === 0) {
        throw new Error("Ocean FCL requires at least one container line");
      }

      for (const line of doc.containerLines) {
        if (!requirePositiveNumber(line?.quantity)) {
          throw new Error("Each container line quantity must be a positive number");
        }
      }
    }
  }
});

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
