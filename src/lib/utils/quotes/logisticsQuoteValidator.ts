// src/lib/utils/quotes/logisticsQuoteValidator.ts
import {
  EBrokerType,
  ECustomerIdentity,
  EInternationalMode,
  EInternationalShipmentSize,
  ELogisticsPrimaryService,
  EPreferredContactMethod,
  EFTLAddon,
  EFTLEquipmentType,
  ELTLAddon,
  EWarehousingDuration,
  EWeightUnit,
  type LogisticsAddress,
  type LogisticsDimensions,
  type LogisticsWeight,
  type QuoteServiceDetails,
  EWarehousingVolumeType,
} from "@/types/logisticsQuote.types";

import { NORTH_AMERICAN_COUNTRY_CODES } from "@/config/countries";
import { trim, lowerTrim, upperTrim } from "@/lib/utils/stringUtils";
import type { IFileAsset } from "@/types/shared.types";

function isObj(v: unknown): v is Record<string, any> {
  return Boolean(v && typeof v === "object" && !Array.isArray(v));
}

function isFinitePos(n: any) {
  const x = Number(n);
  return Number.isFinite(x) && x > 0;
}

function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function isNorthAmerica(code?: string) {
  if (!code) return false;
  return (NORTH_AMERICAN_COUNTRY_CODES as readonly string[]).includes(code.toUpperCase());
}

function validateAddress(a: any, label: string) {
  assert(isObj(a), `${label} is required`);

  const street1 = trim(a.street1);
  const city = trim(a.city);
  const region = trim(a.region);
  const postalCode = trim(a.postalCode);
  const countryCode = upperTrim(a.countryCode);

  assert(street1, `${label}.street1 is required`);
  assert(city, `${label}.city is required`);
  assert(region, `${label}.region is required`);
  assert(postalCode, `${label}.postalCode is required`);
  assert(countryCode && countryCode.length === 2, `${label}.countryCode must be ISO-2 (2 letters)`);

  // Normalize back into object so downstream gets a clean shape (optional)
  (a as LogisticsAddress).street1 = street1!;
  if (a.street2 != null) a.street2 = trim(a.street2);
  (a as LogisticsAddress).city = city!;
  (a as LogisticsAddress).region = region!;
  (a as LogisticsAddress).postalCode = postalCode!;
  (a as LogisticsAddress).countryCode = countryCode!;
}

function validateWeight(w: any, label: string) {
  assert(isObj(w), `${label} is required`);
  assert(isFinitePos(w.value), `${label}.value must be a positive number`);

  const unit = String(w.unit || "");
  assert(Object.values(EWeightUnit).includes(unit as any), `${label}.unit must be KG or LB`);

  (w as LogisticsWeight).value = Number(w.value);
  (w as LogisticsWeight).unit = unit as any;
}

function validateDims(d: any, label: string) {
  assert(isObj(d), `${label} is required`);
  assert(isFinitePos(d.length), `${label}.length must be a positive number`);
  assert(isFinitePos(d.width), `${label}.width must be a positive number`);
  assert(isFinitePos(d.height), `${label}.height must be a positive number`);

  (d as LogisticsDimensions).length = Number(d.length);
  (d as LogisticsDimensions).width = Number(d.width);
  (d as LogisticsDimensions).height = Number(d.height);
}

function validateDate(v: any, label: string) {
  const d = v instanceof Date ? v : new Date(String(v));
  assert(!Number.isNaN(d.getTime()), `${label} must be a valid date`);
  return d;
}

function validateIdentification(id: any) {
  assert(isObj(id), "identification is required");

  const identity = String(id.identity || "");
  assert(
    Object.values(ECustomerIdentity).includes(identity as any),
    "identification.identity is invalid",
  );

  if (identity === ECustomerIdentity.BROKER) {
    const bt = String(id.brokerType || "");
    assert(
      Object.values(EBrokerType).includes(bt as any),
      "identification.brokerType is required and invalid",
    );
  } else {
    assert(
      id.brokerType == null,
      "identification.brokerType must not be set when identity is SHIPPER",
    );
  }

  id.identity = identity;
}

function validateContact(c: any) {
  assert(isObj(c), "contact is required");

  const firstName = trim(c.firstName);
  const lastName = trim(c.lastName);
  const email = lowerTrim(c.email);
  const company = trim(c.company);

  assert(firstName, "contact.firstName is required");
  assert(lastName, "contact.lastName is required");
  assert(email, "contact.email is required");
  assert(company, "contact.company is required");

  c.firstName = firstName;
  c.lastName = lastName;
  c.email = email;
  c.company = company;

  if (c.phone != null) c.phone = trim(c.phone);

  if (c.preferredContactMethod != null) {
    const pcm = String(c.preferredContactMethod);
    assert(
      Object.values(EPreferredContactMethod).includes(pcm as any),
      "contact.preferredContactMethod is invalid",
    );
    c.preferredContactMethod = pcm;
  }

  if (c.companyAddress != null) {
    validateAddress(c.companyAddress, "contact.companyAddress");
  }
}

function validateAttachments(arr: any) {
  if (arr == null) return [];
  assert(Array.isArray(arr), "attachments must be an array");

  const out: IFileAsset[] = [];
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    assert(isObj(a), `attachments[${i}] must be an object`);
    assert(trim(a.url), `attachments[${i}].url is required`);
    assert(trim(a.s3Key), `attachments[${i}].s3Key is required`);
    assert(a.mimeType, `attachments[${i}].mimeType is required`);

    out.push({
      url: String(a.url),
      s3Key: String(a.s3Key),
      mimeType: a.mimeType,
      sizeBytes: typeof a.sizeBytes === "number" ? a.sizeBytes : undefined,
      originalName: typeof a.originalName === "string" ? a.originalName : undefined,
    });
  }

  return out;
}

/** Equipment -> allowed add-ons */
const FTL_ADDON_COMPAT: Record<EFTLEquipmentType, readonly EFTLAddon[]> = {
  [EFTLEquipmentType.DRY_VAN]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
  ],
  [EFTLEquipmentType.REEFER]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
  ],
  [EFTLEquipmentType.FLATBED]: [
    EFTLAddon.OVERSIZED_OVERWEIGHT,
    EFTLAddon.ESCORT_VEHICLES_REQUIRED,
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
  ],
  [EFTLEquipmentType.RGN_LOWBOY]: [
    EFTLAddon.OVERSIZED_OVERWEIGHT,
    EFTLAddon.ESCORT_VEHICLES_REQUIRED,
    EFTLAddon.EXPEDITED,
  ],
  [EFTLEquipmentType.CONESTOGA]: [
    EFTLAddon.EXPEDITED,
    EFTLAddon.TEAM_DRIVERS,
    EFTLAddon.HAZARDOUS_MATERIALS,
  ],
};

export function validateLogisticsQuoteRequest(input: {
  serviceDetails: QuoteServiceDetails;
  identification: any;
  contact: any;
  finalNotes?: any;
  attachments?: any;
}): {
  serviceDetails: QuoteServiceDetails;
  identification: any;
  contact: any;
  finalNotes?: string;
  attachments: IFileAsset[];
} {
  assert(isObj(input), "Invalid body");

  const service = input.serviceDetails as any;
  assert(isObj(service), "serviceDetails is required");

  const ps = String(service.primaryService || "");
  assert(
    Object.values(ELogisticsPrimaryService).includes(ps as any),
    "serviceDetails.primaryService is invalid",
  );

  // Service-specific validation + normalization
  switch (ps as ELogisticsPrimaryService) {
    case ELogisticsPrimaryService.FTL: {
      const equipment = String(service.equipment || "");
      assert(
        Object.values(EFTLEquipmentType).includes(equipment as any),
        "serviceDetails.equipment is invalid",
      );

      validateAddress(service.origin, "serviceDetails.origin");
      validateAddress(service.destination, "serviceDetails.destination");
      assert(isNorthAmerica(service.origin.countryCode), "FTL origin must be CA/US/MX");
      assert(isNorthAmerica(service.destination.countryCode), "FTL destination must be CA/US/MX");

      service.readyDate = validateDate(service.readyDate, "serviceDetails.readyDate");
      service.commodityDescription = trim(service.commodityDescription);
      assert(service.commodityDescription, "serviceDetails.commodityDescription is required");

      validateWeight(service.approximateTotalWeight, "serviceDetails.approximateTotalWeight");

      if (service.estimatedPalletCount != null) {
        assert(
          Number(service.estimatedPalletCount) >= 1,
          "serviceDetails.estimatedPalletCount must be >= 1",
        );
        service.estimatedPalletCount = Number(service.estimatedPalletCount);
      }

      if (service.dimensions != null) validateDims(service.dimensions, "serviceDetails.dimensions");

      if (service.readyDateFlexible != null)
        service.readyDateFlexible = Boolean(service.readyDateFlexible);

      if (service.addons != null) {
        assert(Array.isArray(service.addons), "serviceDetails.addons must be an array");
        for (const a of service.addons) {
          assert(
            Object.values(EFTLAddon).includes(a),
            "serviceDetails.addons contains invalid value",
          );
        }
        const allowed = new Set(FTL_ADDON_COMPAT[equipment as EFTLEquipmentType] || []);
        for (const a of service.addons as EFTLAddon[]) {
          assert(allowed.has(a), `FTL add-on ${a} is not compatible with equipment ${equipment}`);
        }
      }

      service.primaryService = ps;
      service.equipment = equipment;
      break;
    }

    case ELogisticsPrimaryService.LTL: {
      validateAddress(service.origin, "serviceDetails.origin");
      validateAddress(service.destination, "serviceDetails.destination");
      assert(isNorthAmerica(service.origin.countryCode), "LTL origin must be CA/US/MX");
      assert(isNorthAmerica(service.destination.countryCode), "LTL destination must be CA/US/MX");

      service.readyDate = validateDate(service.readyDate, "serviceDetails.readyDate");
      service.commodityDescription = trim(service.commodityDescription);
      assert(service.commodityDescription, "serviceDetails.commodityDescription is required");

      service.stackable = Boolean(service.stackable);

      assert(
        Array.isArray(service.palletLines) && service.palletLines.length > 0,
        "palletLines must be a non-empty array",
      );
      for (let i = 0; i < service.palletLines.length; i++) {
        const pl = service.palletLines[i];
        assert(isObj(pl), `palletLines[${i}] must be an object`);
        assert(Number(pl.quantity) >= 1, `palletLines[${i}].quantity must be >= 1`);
        pl.quantity = Number(pl.quantity);

        validateDims(pl.dimensions, `palletLines[${i}].dimensions`);

        if (pl.totalWeight != null) validateWeight(pl.totalWeight, `palletLines[${i}].totalWeight`);
      }

      if (service.approximateTotalWeight != null) {
        validateWeight(service.approximateTotalWeight, "serviceDetails.approximateTotalWeight");
      }

      if (service.addons != null) {
        assert(Array.isArray(service.addons), "serviceDetails.addons must be an array");
        for (const a of service.addons) {
          assert(
            Object.values(ELTLAddon).includes(a),
            "serviceDetails.addons contains invalid value",
          );
        }
      }

      service.primaryService = ps;
      break;
    }

    case ELogisticsPrimaryService.INTERNATIONAL: {
      const mode = String(service.mode || "");
      assert(
        Object.values(EInternationalMode).includes(mode as any),
        "serviceDetails.mode is invalid",
      );

      validateAddress(service.origin, "serviceDetails.origin");
      validateAddress(service.destination, "serviceDetails.destination");

      service.readyDate = validateDate(service.readyDate, "serviceDetails.readyDate");
      service.commodityDescription = trim(service.commodityDescription);
      assert(service.commodityDescription, "serviceDetails.commodityDescription is required");

      validateWeight(service.estimatedWeight, "serviceDetails.estimatedWeight");

      if (service.shipmentSize != null) {
        const ss = String(service.shipmentSize);
        assert(
          Object.values(EInternationalShipmentSize).includes(ss as any),
          "serviceDetails.shipmentSize is invalid",
        );
        service.shipmentSize = ss;
      }

      service.primaryService = ps;
      service.mode = mode;
      break;
    }

    case ELogisticsPrimaryService.WAREHOUSING: {
      validateAddress(service.requiredLocation, "serviceDetails.requiredLocation");
      assert(
        isNorthAmerica(service.requiredLocation.countryCode),
        "Warehousing requiredLocation must be CA/US/MX",
      );

      assert(isObj(service.estimatedVolume), "serviceDetails.estimatedVolume is required");

      const vt = String(service.estimatedVolume.volumeType || "");
      assert(
        Object.values(EWarehousingVolumeType).includes(vt as any),
        "estimatedVolume.volumeType is invalid",
      );

      assert(
        isFinitePos(service.estimatedVolume.value),
        "estimatedVolume.value must be a positive number",
      );

      service.estimatedVolume.volumeType = vt;
      service.estimatedVolume.value = Number(service.estimatedVolume.value);

      const dur = String(service.expectedDuration || "");
      assert(
        Object.values(EWarehousingDuration).includes(dur as any),
        "serviceDetails.expectedDuration is invalid",
      );

      service.primaryService = ps;
      service.expectedDuration = dur;
      break;
    }

    default:
      throw new Error("Unsupported primaryService");
  }

  // Identification/contact/final notes/attachments
  validateIdentification(input.identification);
  validateContact(input.contact);

  const finalNotes = input.finalNotes != null ? trim(String(input.finalNotes)) : undefined;
  if (finalNotes && finalNotes.length > 6000)
    throw new Error("finalNotes exceeds maximum length (6000)");

  const attachments = validateAttachments(input.attachments);

  return {
    serviceDetails: service as QuoteServiceDetails,
    identification: input.identification,
    contact: input.contact,
    finalNotes,
    attachments,
  };
}
