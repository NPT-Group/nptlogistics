// src/app/(site)/components/forms/LogisticsQuoteForm/defaults.ts
import {
  ECustomerIdentity,
  EDimensionUnit,
  ELogisticsPrimaryService,
  EWarehousingDuration,
  EWarehousingVolumeType,
  EWeightUnit,
} from "@/types/logisticsQuote.types";

import type { LogisticsQuoteSubmitValues } from "./schema";

type ServiceDetailsValues = NonNullable<LogisticsQuoteSubmitValues["serviceDetails"]>;

type AddressInput = {
  street1: string;
  street2: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
};

/** Empty building blocks */
export const EMPTY_ADDRESS: AddressInput = {
  street1: "",
  street2: "",
  city: "",
  region: "",
  postalCode: "",
  countryCode: "",
};

export const EMPTY_DIMS = {
  length: "",
  width: "",
  height: "",
};

export const EMPTY_CARGO_LINE = {
  quantity: "",
  length: "",
  width: "",
  height: "",
  weightPerUnit: "",
};

export const EMPTY_CONTAINER_LINE = {
  quantity: "",
  containerType: undefined,
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
        approximateTotalWeight: "",
        weightUnit: undefined,
        estimatedPalletCount: undefined,
        dimensions: undefined,
        dimensionUnit: undefined,
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
        weightUnit: EWeightUnit.LB,
        dimensionUnit: EDimensionUnit.IN,
        stackable: false,
        cargoLines: [{ ...EMPTY_CARGO_LINE }],
        approximateTotalWeight: undefined,
        addons: [],
      };

    case ELogisticsPrimaryService.INTERNATIONAL:
      return {
        primaryService,
        mode: undefined,
        oceanLoadType: undefined,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        pickupDate: "",
        commodityDescription: "",
        weightUnit: EWeightUnit.LB,
        dimensionUnit: EDimensionUnit.IN,
        cargoLines: undefined,
        approximateTotalWeight: undefined,
        containerLines: undefined,
      };

    case ELogisticsPrimaryService.WAREHOUSING:
      return {
        primaryService,
        requiredLocation: { ...EMPTY_ADDRESS },
        estimatedVolume: {
          volumeType: EWarehousingVolumeType.PALLET_COUNT,
          value: "",
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
    identity: ECustomerIdentity.SHIPPER,
    brokerType: undefined,
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
