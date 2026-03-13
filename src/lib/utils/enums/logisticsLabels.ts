// src/lib/utils/enums/logisticsLabels.ts
import {
  EFTLAddon,
  ELTLAddon,
  EFTLEquipmentType,
  ELTLEquipmentType,
  EBrokerType,
  ECustomerIdentity,
  EInternationalMode,
  EOceanLoadType,
  EOceanContainerType,
  EWarehousingDuration,
  EPreferredContactMethod,
  EWarehousingVolumeType,
  ELogisticsPrimaryService,
  EWeightUnit,
  EDimensionUnit,
} from "@/types/logisticsQuote.types";

/** Fallback: "OVERSIZED_OVERWEIGHT" -> "Oversized overweight" */
export function humanizeEnumFallback(v: string) {
  return v
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/** Small helper: prefer map label; fallback to humanize */
export function labelFromMap<T extends string>(value: T | undefined, map: Record<T, string>) {
  if (!value) return "—";
  return map[value] ?? humanizeEnumFallback(String(value));
}

/** List helper */
export function labelsFromMap<T extends string>(
  values: readonly T[] | undefined,
  map: Record<T, string>,
) {
  if (!values?.length) return [];
  return values.map((v) => map[v] ?? humanizeEnumFallback(String(v)));
}

/* ───────────────────────── Label maps (source of truth) ───────────────────────── */

export const PRIMARY_SERVICE_LABEL: Record<ELogisticsPrimaryService, string> = {
  [ELogisticsPrimaryService.FTL]: "FTL",
  [ELogisticsPrimaryService.LTL]: "LTL",
  [ELogisticsPrimaryService.INTERNATIONAL]: "International",
  [ELogisticsPrimaryService.WAREHOUSING]: "Warehousing",
};

/* ───────────────────────── Units ───────────────────────── */

export const WEIGHT_UNIT_LABEL: Record<EWeightUnit, string> = {
  [EWeightUnit.LB]: "lb",
  [EWeightUnit.KG]: "kg",
};

export const DIMENSION_UNIT_LABEL: Record<EDimensionUnit, string> = {
  [EDimensionUnit.IN]: "in",
  [EDimensionUnit.CM]: "cm",
};

/* ───────────────────────── Addons ───────────────────────── */

export const FTL_ADDON_LABEL: Record<EFTLAddon, string> = {
  [EFTLAddon.EXPEDITED]: "Expedited",
  [EFTLAddon.TEAM_DRIVERS]: "Team drivers",
  [EFTLAddon.HAZARDOUS_MATERIALS]: "Hazardous materials (HAZMAT)",
  [EFTLAddon.APPOINTMENT_REQUIRED]: "Appointment required",
  [EFTLAddon.OVERSIZED_OVERWEIGHT]: "Oversized / overweight",
  [EFTLAddon.ESCORT_VEHICLES_REQUIRED]: "Escort vehicles required",
};

export const LTL_ADDON_LABEL: Record<ELTLAddon, string> = {
  [ELTLAddon.LIFTGATE_REQUIRED]: "Liftgate required",
  [ELTLAddon.RESIDENTIAL_DELIVERY]: "Residential delivery",
  [ELTLAddon.APPOINTMENT_REQUIRED]: "Appointment required",
  [ELTLAddon.HAZARDOUS_MATERIALS]: "Hazardous materials (HAZMAT)",
  [ELTLAddon.EXPEDITED]: "Expedited",
  [ELTLAddon.TEAM_DRIVERS]: "Team drivers",
  [ELTLAddon.OVERSIZED_OVERWEIGHT]: "Oversized / overweight",
  [ELTLAddon.ESCORT_VEHICLES_REQUIRED]: "Escort vehicles required",
};

/* ───────────────────────── Equipment ───────────────────────── */

export const FTL_EQUIPMENT_LABEL: Record<EFTLEquipmentType, string> = {
  [EFTLEquipmentType.DRY_VAN]: "Dry van",
  [EFTLEquipmentType.REEFER]: "Temperature controlled",
  [EFTLEquipmentType.FLATBED]: "Flatbed",
  [EFTLEquipmentType.STEP_DECK]: "Step deck",
  [EFTLEquipmentType.RGN_LOWBOY]: "RGN / Lowboy",
  [EFTLEquipmentType.CONESTOGA]: "Conestoga",
};

export const LTL_EQUIPMENT_LABEL: Record<ELTLEquipmentType, string> = {
  [ELTLEquipmentType.DRY_VAN]: "Dry van",
  [ELTLEquipmentType.STEP_DECK]: "Step deck",
  [ELTLEquipmentType.FLATBED]: "Flatbed",
  [ELTLEquipmentType.CONESTOGA]: "Conestoga",
};

/* ───────────────────────── Identity / Contact ───────────────────────── */

export const BROKER_TYPE_LABEL: Record<EBrokerType, string> = {
  [EBrokerType.FREIGHT_BROKER]: "Freight broker",
  [EBrokerType.CUSTOMS_BROKER]: "Customs broker",
  [EBrokerType.BOTH]: "Freight + customs broker",
};

export const IDENTITY_LABEL: Record<ECustomerIdentity, string> = {
  [ECustomerIdentity.SHIPPER]: "Shipper",
  [ECustomerIdentity.BROKER]: "Broker",
};

export const PREF_CONTACT_LABEL: Record<EPreferredContactMethod, string> = {
  [EPreferredContactMethod.EMAIL]: "Email",
  [EPreferredContactMethod.PHONE]: "Phone",
};

/* ───────────────────────── International ───────────────────────── */

export const INTL_MODE_LABEL: Record<EInternationalMode, string> = {
  [EInternationalMode.AIR]: "Air",
  [EInternationalMode.OCEAN]: "Ocean",
};

export const OCEAN_LOAD_TYPE_LABEL: Record<EOceanLoadType, string> = {
  [EOceanLoadType.FCL]: "Full container load (FCL)",
  [EOceanLoadType.LCL]: "Less than container load (LCL)",
};

export const OCEAN_CONTAINER_TYPE_LABEL: Record<EOceanContainerType, string> = {
  [EOceanContainerType.DRY_20]: "20 ft container",
  [EOceanContainerType.DRY_40]: "40 ft container",
  [EOceanContainerType.DRY_40_HC]: "40 ft high cube container",
};

/* ───────────────────────── Warehousing ───────────────────────── */

export const WAREHOUSING_DURATION_LABEL: Record<EWarehousingDuration, string> = {
  [EWarehousingDuration.SHORT_TERM]: "Short-term",
  [EWarehousingDuration.LONG_TERM_ONGOING]: "Long-term / ongoing",
};

export const WAREHOUSING_VOLUME_TYPE_LABEL: Record<EWarehousingVolumeType, string> = {
  [EWarehousingVolumeType.PALLET_COUNT]: "Pallet count",
  [EWarehousingVolumeType.SQUARE_FOOTAGE]: "Square footage",
};
