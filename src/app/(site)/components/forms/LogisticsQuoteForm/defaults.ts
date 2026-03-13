// src/app/(site)/components/forms/LogisticsQuoteForm/defaults.ts
// src/app/(site)/components/forms/LogisticsQuoteForm/defaults.ts
import {
  ECustomerIdentity,
  EDimensionUnit,
  EInternationalMode,
  ELogisticsPrimaryService,
  EOceanLoadType,
  EPreferredContactMethod,
  EWarehousingDuration,
  EWarehousingVolumeType,
  EWeightUnit,
  type CargoLine,
  type LogisticsAddress,
  type OceanContainerLine,
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

export const EMPTY_DIMS = {
  length: 0,
  width: 0,
  height: 0,
} as const;

export const EMPTY_CARGO_LINE: CargoLine = {
  quantity: 0,
  length: 0,
  width: 0,
  height: 0,
  weightPerUnit: 0,
};

export const EMPTY_CONTAINER_LINE: OceanContainerLine = {
  quantity: 0,
  containerType: undefined as never,
};

export function makeServiceDetailsDefaults(
  primaryService: ELogisticsPrimaryService,
): ServiceDetailsValues {
  switch (primaryService) {
    case ELogisticsPrimaryService.FTL:
      return {
        primaryService,
        equipment: undefined as never,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        pickupDate: "",
        commodityDescription: "",
        approximateTotalWeight: 0,
        weightUnit: EWeightUnit.LB,
        estimatedPalletCount: undefined,
        dimensions: undefined,
        dimensionUnit: undefined,
        pickupDateFlexible: false,
        addons: [],
      };

    case ELogisticsPrimaryService.LTL:
      return {
        primaryService,
        equipment: undefined as never,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        pickupDate: "",
        commodityDescription: "",
        weightUnit: EWeightUnit.LB,
        dimensionUnit: EDimensionUnit.IN,
        stackable: false,
        cargoLines: [{ ...EMPTY_CARGO_LINE }],
        approximateTotalWeight: 0,
        addons: [],
      };

    case ELogisticsPrimaryService.INTERNATIONAL:
      return {
        primaryService,
        mode: EInternationalMode.AIR,
        origin: { ...EMPTY_ADDRESS },
        destination: { ...EMPTY_ADDRESS },
        pickupDate: "",
        commodityDescription: "",
        weightUnit: EWeightUnit.KG,
        dimensionUnit: EDimensionUnit.CM,
        cargoLines: [{ ...EMPTY_CARGO_LINE }],
        approximateTotalWeight: 0,
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

export function makeInternationalAirDefaults(): Extract<
  ServiceDetailsValues,
  {
    primaryService: ELogisticsPrimaryService.INTERNATIONAL;
    mode: EInternationalMode.AIR;
  }
> {
  return {
    primaryService: ELogisticsPrimaryService.INTERNATIONAL,
    mode: EInternationalMode.AIR,
    origin: { ...EMPTY_ADDRESS },
    destination: { ...EMPTY_ADDRESS },
    pickupDate: "",
    commodityDescription: "",
    weightUnit: EWeightUnit.KG,
    dimensionUnit: EDimensionUnit.CM,
    cargoLines: [{ ...EMPTY_CARGO_LINE }],
    approximateTotalWeight: 0,
  };
}

export function makeInternationalOceanLclDefaults(): Extract<
  ServiceDetailsValues,
  {
    primaryService: ELogisticsPrimaryService.INTERNATIONAL;
    mode: EInternationalMode.OCEAN;
    oceanLoadType: EOceanLoadType.LCL;
  }
> {
  return {
    primaryService: ELogisticsPrimaryService.INTERNATIONAL,
    mode: EInternationalMode.OCEAN,
    oceanLoadType: EOceanLoadType.LCL,
    origin: { ...EMPTY_ADDRESS },
    destination: { ...EMPTY_ADDRESS },
    pickupDate: "",
    commodityDescription: "",
    weightUnit: EWeightUnit.KG,
    dimensionUnit: EDimensionUnit.CM,
    cargoLines: [{ ...EMPTY_CARGO_LINE }],
    approximateTotalWeight: 0,
  };
}

export function makeInternationalOceanFclDefaults(): Extract<
  ServiceDetailsValues,
  {
    primaryService: ELogisticsPrimaryService.INTERNATIONAL;
    mode: EInternationalMode.OCEAN;
    oceanLoadType: EOceanLoadType.FCL;
  }
> {
  return {
    primaryService: ELogisticsPrimaryService.INTERNATIONAL,
    mode: EInternationalMode.OCEAN,
    oceanLoadType: EOceanLoadType.FCL,
    origin: { ...EMPTY_ADDRESS },
    destination: { ...EMPTY_ADDRESS },
    pickupDate: "",
    commodityDescription: "",
    containerLines: [{ ...EMPTY_CONTAINER_LINE }],
  };
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
    preferredContactMethod: EPreferredContactMethod.EMAIL,
    companyAddress: "",
  },

  finalNotes: "",
  attachments: [],
  marketingEmailConsent: false,
};
