// src/app/(site)/components/forms/LogisticsQuoteForm/defaults.ts
import {
  ELogisticsPrimaryService,
  EWarehousingDuration,
  EWarehousingVolumeType,
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
  countryCode: "",
};

export const EMPTY_WEIGHT = {
  value: 0,
  unit: undefined,
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
        equipment: undefined,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        pickupDate: "",
        commodityDescription: "",
        approximateTotalWeight: { ...EMPTY_WEIGHT },
        estimatedPalletCount: undefined,
        dimensions: undefined,
        pickupDateFlexible: false,
        addons: [],
      };

    case ELogisticsPrimaryService.LTL:
      return {
        primaryService,
        equipment: undefined,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        pickupDate: "",
        commodityDescription: "",
        stackable: false,
        palletLines: [
          {
            quantity: 0,
            dimensions: { ...EMPTY_DIMS },
            weightValue: 0,
          },
        ],
        approximateTotalWeight: { ...EMPTY_WEIGHT },
        addons: [],
      };

    case ELogisticsPrimaryService.INTERNATIONAL:
      return {
        primaryService,
        mode: undefined,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        pickupDate: "",
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

  serviceDetails: undefined,

  identification: {
    identity: "",
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
