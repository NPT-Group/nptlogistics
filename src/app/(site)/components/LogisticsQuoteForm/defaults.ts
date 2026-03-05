// src/app/(site)/components/LogisticsQuoteForm/defaults.ts
import {
  ECustomerIdentity,
  EInternationalMode,
  ELogisticsPrimaryService,
  EWarehousingDuration,
  EWarehousingVolumeType,
  EWeightUnit,
  type LogisticsAddress,
} from "@/types/logisticsQuote.types";

import type { LogisticsQuoteSubmitValues } from "./schema";

type ServiceDetailsValues = NonNullable<LogisticsQuoteSubmitValues["serviceDetails"]>;

/** Empty building blocks */
export const EMPTY_ADDRESS: LogisticsAddress = {
  street1: "",
  street2: "",
  city: "",
  region: "",
  postalCode: "",
  countryCode: "CA",
};

export const EMPTY_WEIGHT = {
  value: 0,
  unit: EWeightUnit.LB,
};

export const EMPTY_DIMS = {
  length: 0,
  width: 0,
  height: 0,
};

export function makeServiceDetailsDefaults(
  primaryService: ELogisticsPrimaryService,
): ServiceDetailsValues {
  switch (primaryService) {
    case ELogisticsPrimaryService.FTL:
      return {
        primaryService,
        // set by EquipmentSelector step
        // @ts-expect-error intentionally unset until equipment selection step
        equipment: undefined,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        readyDate: new Date().toISOString(),
        commodityDescription: "",
        approximateTotalWeight: { ...EMPTY_WEIGHT },
        estimatedPalletCount: undefined,
        dimensions: undefined,
        readyDateFlexible: false,
        addons: [],
      };

    case ELogisticsPrimaryService.LTL:
      return {
        primaryService,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        readyDate: new Date().toISOString(),
        commodityDescription: "",
        stackable: false,
        palletLines: [
          {
            quantity: 1,
            dimensions: { ...EMPTY_DIMS },
            totalWeight: undefined,
          },
        ],
        approximateTotalWeight: undefined,
        addons: [],
      };

    case ELogisticsPrimaryService.INTERNATIONAL:
      return {
        primaryService,
        mode: EInternationalMode.AIR,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        readyDate: new Date().toISOString(),
        commodityDescription: "",
        estimatedWeight: { ...EMPTY_WEIGHT },
        shipmentSize: undefined,
      };

    case ELogisticsPrimaryService.WAREHOUSING:
      return {
        primaryService,
        requiredLocation: { ...EMPTY_ADDRESS },
        estimatedVolume: {
          volumeType: EWarehousingVolumeType.PALLET_COUNT,
          value: 1,
        },
        expectedDuration: EWarehousingDuration.SHORT_TERM,
      };

    default: {
      const _x: never = primaryService;
      throw new Error(`Unsupported primaryService: ${_x}`);
    }
  }
}

/**
 * RHF defaults for submit-body schema.
 * - serviceDetails starts undefined (no selection yet)
 */
export const LOGISTICS_QUOTE_SUBMIT_DEFAULTS: LogisticsQuoteSubmitValues = {
  turnstileToken: "",
  sourceLabel: "NPT Logistics Quote Form",

  // no primary service selected on load
  serviceDetails: undefined,

  identification: {
    identity: ECustomerIdentity.SHIPPER,
  },

  contact: {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    preferredContactMethod: undefined,
    companyAddress: "",
  },

  finalNotes: "",
  attachments: [],
  marketingEmailConsent: false,
};
