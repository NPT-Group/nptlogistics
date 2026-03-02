// src/types/logisticsQuote.types.ts

import type { ObjectId } from "mongoose";
import type { IFileAsset, ICountry } from "@/types/shared.types";

/* ──────────────────────────────────────────────────────────────────────────────
BUSINESS RULE SUMMARY

1. Primary service is SINGLE-SELECT (strict discriminator model).
2. Country storage:
   - Always store ISO-2 country code (CA, US, MX, etc.).
   - FTL, LTL, Warehousing → ONLY NORTH_AMERICAN_COUNTRY_CODES.
   - International → ANY ISO country code allowed.
3. Weight:
   - ALWAYS requires unit (KG or LB).
4. Dimensions:
   - Stored as numeric L/W/H only.
   - NO dimension unit stored (internal normalization).
5. Cross-border:
   - Derived in backend:
     crossBorder = origin.countryCode !== destination.countryCode
6. Equipment-addon compatibility:
   - Must be validated in service layer / schema validation.
────────────────────────────────────────────────────────────────────────────── */

/* ───────────────────────────── Enums ───────────────────────────── */

export enum ELogisticsPrimaryService {
  FTL = "FTL",
  LTL = "LTL",
  INTERNATIONAL = "INTERNATIONAL",
  WAREHOUSING = "WAREHOUSING",
}

export enum EWeightUnit {
  KG = "KG",
  LB = "LB",
}

export enum ECustomerIdentity {
  SHIPPER = "SHIPPER",
  BROKER = "BROKER",
}

export enum EBrokerType {
  FREIGHT_BROKER = "FREIGHT_BROKER",
  CUSTOMS_BROKER = "CUSTOMS_BROKER",
  BOTH = "BOTH",
}

export enum EFTLEquipmentType {
  DRY_VAN = "DRY_VAN",
  REEFER = "REEFER",
  FLATBED = "FLATBED",
  RGN_LOWBOY = "RGN_LOWBOY",
  CONESTOGA = "CONESTOGA",
}

export enum EFTLAddon {
  EXPEDITED = "EXPEDITED",
  TEAM_DRIVERS = "TEAM_DRIVERS",
  HAZARDOUS_MATERIALS = "HAZARDOUS_MATERIALS",
  OVERSIZED_OVERWEIGHT = "OVERSIZED_OVERWEIGHT",
  ESCORT_VEHICLES_REQUIRED = "ESCORT_VEHICLES_REQUIRED",
}

export enum ELTLAddon {
  LIFTGATE_REQUIRED = "LIFTGATE_REQUIRED",
  RESIDENTIAL_DELIVERY = "RESIDENTIAL_DELIVERY",
  APPOINTMENT_REQUIRED = "APPOINTMENT_REQUIRED",
  HAZARDOUS_MATERIALS = "HAZARDOUS_MATERIALS",
  EXPEDITED_HANDLING = "EXPEDITED_HANDLING",
}

export enum EInternationalMode {
  AIR = "AIR",
  OCEAN = "OCEAN",
}

export enum EInternationalShipmentSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export enum EWarehousingDuration {
  SHORT_TERM = "SHORT_TERM",
  LONG_TERM_ONGOING = "LONG_TERM_ONGOING",
}

export enum EPreferredContactMethod {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
}

/* ───────────────────────────── Shared Types ───────────────────────────── */

/**
 * Standardized logistics address.
 *
 * IMPORTANT:
 * - countryCode stores ISO-2 code (e.g., CA, US, MX).
 * - Validation rules by service:
 *
 *   FTL, LTL, Warehousing:
 *     countryCode MUST be one of NORTH_AMERICAN_COUNTRY_CODES
 *
 *   International:
 *     countryCode can be any ISO-2 code from ALL_COUNTRIES
 */
export type LogisticsAddress = {
  street1: string;
  street2?: string;
  city: string;
  region: string; // State / Province
  postalCode: string;
  countryCode: ICountry["code"]; // ISO-2
};

/**
 * Dimensions WITHOUT unit.
 * Internal team determines measurement unit.
 */
export type LogisticsDimensions = {
  length: number;
  width: number;
  height: number;
};

/**
 * Weight ALWAYS requires unit.
 */
export type LogisticsWeight = {
  value: number;
  unit: EWeightUnit;
};

/* ───────────────────────────── FTL ───────────────────────────── */

export type QuoteFTLDetails = {
  primaryService: ELogisticsPrimaryService.FTL;

  equipment: EFTLEquipmentType;

  /**
   * Business rule:
   * origin.countryCode and destination.countryCode
   * MUST be CA, US, or MX (North America only).
   */
  origin: LogisticsAddress;
  destination: LogisticsAddress;

  readyDate: Date | string;
  commodityDescription: string;

  approximateTotalWeight: LogisticsWeight;

  estimatedPalletCount?: number;
  dimensions?: LogisticsDimensions;

  readyDateFlexible?: boolean;

  /**
   * Equipment compatibility must be validated:
   *
   * DRY_VAN → EXPEDITED, TEAM_DRIVERS, HAZMAT
   * REEFER → EXPEDITED, TEAM_DRIVERS, HAZMAT
   * FLATBED → OVERSIZED, ESCORT, EXPEDITED, TEAM_DRIVERS, HAZMAT
   * RGN → OVERSIZED, ESCORT, EXPEDITED
   * CONESTOGA → EXPEDITED, TEAM_DRIVERS, HAZMAT
   */
  addons?: EFTLAddon[];
};

/* ───────────────────────────── LTL ───────────────────────────── */

export type QuoteLTLPalletLine = {
  quantity: number; // >= 1
  dimensions: LogisticsDimensions;
  totalWeight?: LogisticsWeight;
};

export type QuoteLTLDetails = {
  primaryService: ELogisticsPrimaryService.LTL;

  /**
   * MUST be North American countries only.
   */
  origin: LogisticsAddress;
  destination: LogisticsAddress;

  readyDate: Date | string;
  commodityDescription: string;

  stackable: boolean;

  palletLines: QuoteLTLPalletLine[];

  approximateTotalWeight?: LogisticsWeight;

  addons?: ELTLAddon[];
};

/* ───────────────────────────── International ───────────────────────────── */

export type QuoteInternationalDetails = {
  primaryService: ELogisticsPrimaryService.INTERNATIONAL;

  mode: EInternationalMode;

  /**
   * Any ISO country allowed.
   */
  origin: LogisticsAddress;
  destination: LogisticsAddress;

  readyDate: Date | string;
  commodityDescription: string;

  estimatedWeight: LogisticsWeight;

  shipmentSize?: EInternationalShipmentSize;
};

/* ───────────────────────────── Warehousing ───────────────────────────── */

export type WarehousingVolume =
  | {
      type: "PALLET_COUNT";
      palletCount: number;
    }
  | {
      type: "SQUARE_FOOTAGE";
      squareFeet: number;
    };

export type QuoteWarehousingDetails = {
  primaryService: ELogisticsPrimaryService.WAREHOUSING;

  /**
   * Location MUST be CA, US, or MX.
   */
  requiredLocation: LogisticsAddress;

  estimatedVolume: WarehousingVolume;

  expectedDuration: EWarehousingDuration;
};

/* ───────────────────────────── Union Type ───────────────────────────── */

export type QuoteServiceDetails =
  | QuoteFTLDetails
  | QuoteLTLDetails
  | QuoteInternationalDetails
  | QuoteWarehousingDetails;

/* ───────────────────────────── Contact & Identification ───────────────────────────── */

export type QuoteIdentification =
  | {
      identity: ECustomerIdentity.SHIPPER;
      brokerType?: never;
    }
  | {
      identity: ECustomerIdentity.BROKER;
      brokerType: EBrokerType;
    };

export type QuoteContact = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;

  phone?: string;
  preferredContactMethod?: EPreferredContactMethod;

  companyAddress?: LogisticsAddress;
};

/* ───────────────────────────── Root Model ───────────────────────────── */

export interface ILogisticsQuote {
  id: ObjectId | string;

  serviceDetails: QuoteServiceDetails;

  identification: QuoteIdentification;
  contact: QuoteContact;

  finalNotes?: string;

  attachments?: IFileAsset[];

  /**
   * Derived in backend.
   * Not user-editable.
   */
  crossBorder?: boolean;

  createdAt: Date | string;
  updatedAt: Date | string;
}

/* ───────────────────────────── Draft Helper ───────────────────────────── */

export type LogisticsQuoteDraft = Partial<Omit<ILogisticsQuote, "id" | "createdAt" | "updatedAt">>;
