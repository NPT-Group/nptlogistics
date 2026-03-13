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

3. Units:
   - Weight and dimension units are selected ONCE per applicable shipment section.
   - LTL, International Air, and International Ocean LCL use shared section-level:
     - weightUnit
     - dimensionUnit
   - Repeating line items do NOT store per-line unit objects.

4. Weight:
   - FTL stores:
     - approximateTotalWeight
     - weightUnit
   - LTL stores:
     - cargoLines[].weightPerUnit
     - approximateTotalWeight (backend-derived)
     - weightUnit
   - International Air stores:
     - cargoLines[].weightPerUnit
     - approximateTotalWeight (backend-derived)
     - weightUnit
   - Ocean LCL stores:
     - cargoLines[].weightPerUnit
     - approximateTotalWeight (backend-derived)
     - weightUnit
   - Ocean FCL does not require cargo-line dimensions/weights for core quoting flow.

5. Dimensions:
   - Stored as numeric length/width/height on each cargo line.
   - Unit is stored once at section level using EDimensionUnit.
   - FTL optional top-level dimensions remain available for whole-shipment reference.

6. Cross-border:
   - Derived in backend:
     crossBorder = origin.countryCode !== destination.countryCode
   - Applies only where origin/destination exists.

7. Equipment-addon compatibility:
   - Must be validated in service layer / schema validation.

8. LTL / Air / Ocean LCL line modeling:
   - Shared CargoLine stores:
     - quantity
     - length
     - width
     - height
     - weightPerUnit
   - No packageType stored.
   - UI may still label these differently by service
     (e.g. "Pallet lines" for LTL, "Cargo lines" for Air/LCL).

9. Backend normalization:
   - Incoming payloads may be normalized/trimmed in validation layer.
   - Derived fields such as approximateTotalWeight and crossBorder are backend-owned.

10. Naming:
   - "readyDate" has been renamed to "pickupDate".
   - "readyDateFlexible" has been renamed to "pickupDateFlexible".

11. FTL equipment model:
   - FTL equipment treats FLATBED and STEP_DECK as separate values.

12. LTL equipment model:
   - LTL requires explicit equipment selection.
   - LTL add-ons must be validated against selected LTL equipment.

13. International model:
   - International is further discriminated by:
     - AIR
     - OCEAN + FCL
     - OCEAN + LCL
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

export enum EDimensionUnit {
  IN = "IN",
  CM = "CM",
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
  STEP_DECK = "STEP_DECK",
  RGN_LOWBOY = "RGN_LOWBOY",
  CONESTOGA = "CONESTOGA",
}

export enum EFTLAddon {
  EXPEDITED = "EXPEDITED",
  TEAM_DRIVERS = "TEAM_DRIVERS",
  HAZARDOUS_MATERIALS = "HAZARDOUS_MATERIALS",
  APPOINTMENT_REQUIRED = "APPOINTMENT_REQUIRED",
  OVERSIZED_OVERWEIGHT = "OVERSIZED_OVERWEIGHT",
  ESCORT_VEHICLES_REQUIRED = "ESCORT_VEHICLES_REQUIRED",
}

export enum ELTLEquipmentType {
  DRY_VAN = "DRY_VAN",
  STEP_DECK = "STEP_DECK",
  FLATBED = "FLATBED",
  CONESTOGA = "CONESTOGA",
}

export enum ELTLAddon {
  LIFTGATE_REQUIRED = "LIFTGATE_REQUIRED",
  RESIDENTIAL_DELIVERY = "RESIDENTIAL_DELIVERY",
  APPOINTMENT_REQUIRED = "APPOINTMENT_REQUIRED",
  HAZARDOUS_MATERIALS = "HAZARDOUS_MATERIALS",
  EXPEDITED = "EXPEDITED",
  TEAM_DRIVERS = "TEAM_DRIVERS",
  OVERSIZED_OVERWEIGHT = "OVERSIZED_OVERWEIGHT",
  ESCORT_VEHICLES_REQUIRED = "ESCORT_VEHICLES_REQUIRED",
}

export enum EInternationalMode {
  AIR = "AIR",
  OCEAN = "OCEAN",
}

export enum EOceanLoadType {
  FCL = "FCL",
  LCL = "LCL",
}

export enum EOceanContainerType {
  DRY_20 = "DRY_20",
  DRY_40 = "DRY_40",
  DRY_40_HC = "DRY_40_HC",
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
 * Whole-shipment dimensions WITHOUT unit.
 * Use only where top-level shipment dimensions are needed.
 * Unit is stored separately in dimensionUnit when applicable.
 */
export type LogisticsDimensions = {
  length: number;
  width: number;
  height: number;
};

/**
 * Shared repeating line item for LTL, International Air, and Ocean LCL.
 * Units come from parent section:
 * - weightUnit
 * - dimensionUnit
 */
export type CargoLine = {
  quantity: number; // >= 1
  length: number; // >= 1
  width: number; // >= 1
  height: number; // >= 1
  weightPerUnit: number; // >= 1
};

export type OceanContainerLine = {
  quantity: number; // >= 1
  containerType: EOceanContainerType;
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

  pickupDate: Date | string;
  commodityDescription: string;

  approximateTotalWeight: number;
  weightUnit: EWeightUnit;

  estimatedPalletCount?: number;

  /**
   * Optional whole-shipment dimensions.
   * If provided, interpreted using dimensionUnit.
   */
  dimensions?: LogisticsDimensions;
  dimensionUnit?: EDimensionUnit;

  pickupDateFlexible?: boolean;

  /**
   * Equipment compatibility must be validated:
   *
   * DRY_VAN → EXPEDITED, TEAM_DRIVERS, HAZMAT, APPOINTMENT_REQUIRED
   * REEFER → EXPEDITED, TEAM_DRIVERS, HAZMAT, APPOINTMENT_REQUIRED
   * FLATBED → OVERSIZED, ESCORT, EXPEDITED, TEAM_DRIVERS, HAZMAT, APPOINTMENT_REQUIRED
   * STEP_DECK → OVERSIZED, ESCORT, EXPEDITED, TEAM_DRIVERS, HAZMAT, APPOINTMENT_REQUIRED
   * RGN → OVERSIZED, ESCORT, EXPEDITED, APPOINTMENT_REQUIRED
   * CONESTOGA → EXPEDITED, TEAM_DRIVERS, HAZMAT, APPOINTMENT_REQUIRED
   */
  addons?: EFTLAddon[];
};

/* ───────────────────────────── LTL ───────────────────────────── */

export type QuoteLTLDetails = {
  primaryService: ELogisticsPrimaryService.LTL;

  /**
   * LTL requires explicit equipment selection.
   */
  equipment: ELTLEquipmentType;

  /**
   * MUST be North American countries only.
   */
  origin: LogisticsAddress;
  destination: LogisticsAddress;

  pickupDate: Date | string;
  commodityDescription: string;

  weightUnit: EWeightUnit;
  dimensionUnit: EDimensionUnit;

  stackable: boolean;

  /**
   * UI may label these as "Pallet lines".
   */
  cargoLines: CargoLine[];

  /**
   * Backend-derived from:
   * sum(quantity * weightPerUnit)
   */
  approximateTotalWeight: number;

  /**
   * Equipment compatibility must be validated:
   *
   * DRY_VAN → LIFTGATE_REQUIRED, RESIDENTIAL_DELIVERY, APPOINTMENT_REQUIRED,
   *            EXPEDITED, TEAM_DRIVERS, HAZARDOUS_MATERIALS
   *
   * FLATBED → LIFTGATE_REQUIRED, RESIDENTIAL_DELIVERY, APPOINTMENT_REQUIRED,
   *            OVERSIZED_OVERWEIGHT, ESCORT_VEHICLES_REQUIRED,
   *            EXPEDITED, TEAM_DRIVERS, HAZARDOUS_MATERIALS
   *
   * STEP_DECK → LIFTGATE_REQUIRED, RESIDENTIAL_DELIVERY, APPOINTMENT_REQUIRED,
   *             OVERSIZED_OVERWEIGHT, ESCORT_VEHICLES_REQUIRED,
   *             EXPEDITED, TEAM_DRIVERS, HAZARDOUS_MATERIALS
   *
   * CONESTOGA → LIFTGATE_REQUIRED, RESIDENTIAL_DELIVERY, APPOINTMENT_REQUIRED,
   *             EXPEDITED, TEAM_DRIVERS, HAZARDOUS_MATERIALS
   */
  addons?: ELTLAddon[];
};

/* ───────────────────────────── International ───────────────────────────── */

export type QuoteInternationalAirDetails = {
  primaryService: ELogisticsPrimaryService.INTERNATIONAL;
  mode: EInternationalMode.AIR;

  /**
   * Any ISO country allowed.
   */
  origin: LogisticsAddress;
  destination: LogisticsAddress;

  pickupDate: Date | string;
  commodityDescription: string;

  weightUnit: EWeightUnit;
  dimensionUnit: EDimensionUnit;

  /**
   * UI label: "Cargo lines"
   */
  cargoLines: CargoLine[];

  /**
   * Backend-derived from:
   * sum(quantity * weightPerUnit)
   */
  approximateTotalWeight: number;
};

export type QuoteInternationalOceanLCLDetails = {
  primaryService: ELogisticsPrimaryService.INTERNATIONAL;
  mode: EInternationalMode.OCEAN;
  oceanLoadType: EOceanLoadType.LCL;

  /**
   * Any ISO country allowed.
   */
  origin: LogisticsAddress;
  destination: LogisticsAddress;

  pickupDate: Date | string;
  commodityDescription: string;

  weightUnit: EWeightUnit;
  dimensionUnit: EDimensionUnit;

  /**
   * UI label: "Cargo lines"
   */
  cargoLines: CargoLine[];

  /**
   * Backend-derived from:
   * sum(quantity * weightPerUnit)
   */
  approximateTotalWeight: number;
};

export type QuoteInternationalOceanFCLDetails = {
  primaryService: ELogisticsPrimaryService.INTERNATIONAL;
  mode: EInternationalMode.OCEAN;
  oceanLoadType: EOceanLoadType.FCL;

  /**
   * Any ISO country allowed.
   */
  origin: LogisticsAddress;
  destination: LogisticsAddress;

  pickupDate: Date | string;
  commodityDescription: string;

  /**
   * UI label: "Container lines"
   */
  containerLines: OceanContainerLine[];
};

export type QuoteInternationalDetails =
  | QuoteInternationalAirDetails
  | QuoteInternationalOceanLCLDetails
  | QuoteInternationalOceanFCLDetails;

/* ───────────────────────────── Warehousing ───────────────────────────── */

export enum EWarehousingVolumeType {
  PALLET_COUNT = "PALLET_COUNT",
  SQUARE_FOOTAGE = "SQUARE_FOOTAGE",
}

/**
 * Warehousing volume (simple scalar).
 * - PALLET_COUNT => value = pallets
 * - SQUARE_FOOTAGE => value = square feet
 */
export type WarehousingVolume = {
  volumeType: EWarehousingVolumeType;
  value: number; // >= 1
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

  companyAddress?: string;
};

/* ───────────────────────────── Root Model ───────────────────────────── */

export interface ILogisticsQuote {
  _id: ObjectId | string;

  /**
   * Friendly customer-facing reference ID.
   * Backend-generated and unique.
   * Example: NPT-260311-7G4K2
   */
  quoteId: string;

  serviceDetails: QuoteServiceDetails;

  identification: QuoteIdentification;
  contact: QuoteContact;

  finalNotes?: string;

  attachments?: IFileAsset[];

  marketingEmailConsent?: boolean;

  /**
   * Derived in backend.
   * Not user-editable.
   */
  crossBorder?: boolean;

  createdAt: Date | string;
  updatedAt: Date | string;
}

/* ───────────────────────────── Draft Helper ───────────────────────────── */

export type LogisticsQuoteDraft = Partial<
  Omit<ILogisticsQuote, "_id" | "quoteId" | "createdAt" | "updatedAt">
>;
