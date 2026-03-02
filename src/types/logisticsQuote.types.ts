// src/types/quoteRequest.types.ts
import type { ObjectId } from "mongoose";
import type { IFileAsset } from "@/types/shared.types";

/** Primary service buttons (single-select) */
export enum EQuotePrimaryService {
  FTL = "FTL",
  LTL = "LTL",
  INTERNATIONAL = "INTERNATIONAL",
  WAREHOUSING = "WAREHOUSING",
}

/** Contact / identification */
export enum EQuotePartyRole {
  SHIPPER = "SHIPPER",
  BROKER = "BROKER",
}

export enum EQuoteBrokerType {
  FREIGHT = "FREIGHT",
  CUSTOMS = "CUSTOMS",
  BOTH = "BOTH",
}

export enum EPreferredContactMethod {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  TEXT = "TEXT",
}

/** FTL */
export enum EFTLEquipmentType {
  DRY_VAN = "DRY_VAN",
  REEFER = "REEFER",
  FLATBED = "FLATBED",
  RGN_LOWBOY = "RGN_LOWBOY",
  CONESTOGA = "CONESTOGA",
  INTERMODAL_CHASSIS = "INTERMODAL_CHASSIS",
}

export enum EFTLAddOn {
  EXPEDITED = "EXPEDITED",
  TEAM_DRIVERS = "TEAM_DRIVERS",
  HAZARDOUS_MATERIALS = "HAZARDOUS_MATERIALS",

  OVERSIZED_OVERWEIGHT = "OVERSIZED_OVERWEIGHT", // flatbed / rgn
  PERMITS_REQUIRED = "PERMITS_REQUIRED", // rgn
  ESCORT_VEHICLES_REQUIRED = "ESCORT_VEHICLES_REQUIRED", // rgn
  OVERWEIGHT_CONTAINER = "OVERWEIGHT_CONTAINER", // intermodal
}

/** LTL */
export enum ELTLAddOn {
  LIFTGATE_REQUIRED = "LIFTGATE_REQUIRED",
  RESIDENTIAL_DELIVERY = "RESIDENTIAL_DELIVERY",
  APPOINTMENT_REQUIRED = "APPOINTMENT_REQUIRED",
  HAZARDOUS_MATERIALS = "HAZARDOUS_MATERIALS",
  CROSS_BORDER = "CROSS_BORDER",
  EXPEDITED_HANDLING = "EXPEDITED_HANDLING",
}

export type Dimensions = {
  length: number;
  width: number;
  height: number;
  unit: "IN" | "CM";
};

/** International */
export enum EInternationalMode {
  AIR = "AIR",
  OCEAN = "OCEAN",
}

export enum EInternationalShipmentSizeBand {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

/** Warehousing */
export enum EWarehousingDuration {
  SHORT_TERM = "SHORT_TERM",
  LONG_TERM_ONGOING = "LONG_TERM_ONGOING",
}

/** Common helpers */
export type CityCountryLocation = {
  city: string;
  country: string;
  region?: string;
  postalCode?: string;
};

export type QuoteContact = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;

  phone?: string;
  preferredContactMethod?: EPreferredContactMethod;

  attachments?: IFileAsset[];
};

export type QuoteIdentification = {
  role: EQuotePartyRole;
  brokerType?: EQuoteBrokerType; // required iff role === BROKER
};

/** Per-path basics (kept explicit + clean) */
export type QuoteFTLBasics = {
  readyDate: Date | string;
  commodity: string;

  approximateTotalWeight: number;
  weightUnit?: "LB" | "KG";

  estimatedPalletCount?: number;
  isReadyDateFlexible?: boolean;
};

export type QuoteLTLBasics = {
  readyDate: Date | string;
  commodity: string;

  approximateTotalWeight: number;
  weightUnit?: "LB" | "KG";

  dimensions: Dimensions;
  palletCount: number;
  isStackable: boolean;
};

export type QuoteInternationalBasics = {
  readyDate: Date | string;
  commodity: string;

  estimatedWeight: number;
  weightUnit?: "LB" | "KG";

  shipmentSizeBand?: EInternationalShipmentSizeBand;
};

/** FTL path */
export type QuoteFTL = {
  service: EQuotePrimaryService.FTL;

  equipment: EFTLEquipmentType;

  pickup: CityCountryLocation;
  delivery: CityCountryLocation;

  basics: QuoteFTLBasics;

  addOns?: EFTLAddOn[];
};

/** LTL path */
export type QuoteLTL = {
  service: EQuotePrimaryService.LTL;

  pickup: CityCountryLocation;
  delivery: CityCountryLocation;

  basics: QuoteLTLBasics;

  addOns?: ELTLAddOn[];
};

/** International path */
export type QuoteInternational = {
  service: EQuotePrimaryService.INTERNATIONAL;

  mode: EInternationalMode;

  originCountry: string;
  destinationCountry: string;

  basics: QuoteInternationalBasics;
};

/** Warehousing path */
export type QuoteWarehousing = {
  service: EQuotePrimaryService.WAREHOUSING;

  requiredLocation: CityCountryLocation;

  estimatedVolume: {
    value: number;
    unit: "PALLETS" | "SQFT";
  };

  duration?: EWarehousingDuration;
};

/** Discriminated union for service-specific data */
export type QuoteServiceDetails = QuoteFTL | QuoteLTL | QuoteInternational | QuoteWarehousing;

/** Lifecycle / routing */
export enum EQuoteRequestStatus {
  NEW = "NEW",
  IN_REVIEW = "IN_REVIEW",
  QUALIFIED = "QUALIFIED",
  CLOSED = "CLOSED",
  SPAM = "SPAM",
}

export type QuoteInternalRouting = {
  lane?: "DOMESTIC" | "CROSS_BORDER" | "INTERNATIONAL";
  priority?: "LOW" | "NORMAL" | "HIGH";
  tags?: string[];
  notes?: string;
};

export interface IQuoteRequest {
  id: ObjectId | string;

  /** Step 1 */
  primaryService: EQuotePrimaryService;

  /** Step 5 */
  details: QuoteServiceDetails;

  /** Step 6 */
  identification: QuoteIdentification;
  contact: QuoteContact;

  /** Step 7 */
  finalNotes?: string;

  status: EQuoteRequestStatus;
  routing?: QuoteInternalRouting;

  createdAt: Date | string;
  updatedAt: Date | string;
}
