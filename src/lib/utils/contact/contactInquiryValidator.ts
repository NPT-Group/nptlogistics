// src/lib/utils/contact/contactInquiryValidator.ts
import {
  CONTACT_INQUIRY_MAX_ATTACHMENTS,
  CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES,
  EContactInquiryCategory,
  EInquiryPreferredContactMethod,
  ECustomerSalesInquiryType,
  ECarrierTrailerType,
  ECarrierInquiryType,
  ECarrierOperatingRegion,
  ESafetyVehicleType,
  ESafetyIncidentType,
  EITSupportApplicationSystem,
  EITSupportIssueType,
  EITSupportUrgencyLevel,
  EGeneralInquiryType,
  type ContactInquiryDetails,
} from "@/types/contactInquiry.types";
import { EFileMimeType, type IFileAsset } from "@/types/shared.types";
import { trim, lowerTrim, optionalString } from "@/lib/utils/stringUtils";

const ALLOWED_CONTACT_INQUIRY_MIME_TYPES = new Set<string>([
  EFileMimeType.JPEG,
  EFileMimeType.JPG,
  EFileMimeType.PNG,
  EFileMimeType.WEBP,
  EFileMimeType.PDF,
  EFileMimeType.DOC,
  EFileMimeType.DOCX,
  EFileMimeType.XLS,
  EFileMimeType.XLSX,
  EFileMimeType.CSV,
  EFileMimeType.ODS,
]);

function validateOptionalBoolean(value: unknown, label: string): boolean | undefined {
  if (value == null) return undefined;
  assert(typeof value === "boolean", `${label} must be a boolean`);
  return value;
}

function isObj(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === "object" && !Array.isArray(v));
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function validateEnumValue<T extends string>(
  value: unknown,
  allowed: Record<string, T> | readonly T[],
  msg: string,
): T {
  const str = typeof value === "string" ? value : "";
  const values = Array.isArray(allowed) ? allowed : Object.values(allowed);
  assert(values.includes(str as T), msg);
  return str as T;
}

function validateOptionalEnumValue<T extends string>(
  value: unknown,
  allowed: Record<string, T> | readonly T[],
  msg: string,
): T | undefined {
  if (value == null || value === "") return undefined;
  return validateEnumValue(value, allowed, msg);
}

function validateDate(value: unknown, label: string): Date {
  const d = value instanceof Date ? value : new Date(String(value));
  assert(!Number.isNaN(d.getTime()), `${label} must be a valid date`);
  return d;
}

function validateStringRequired(value: unknown, label: string, maxLength: number): string {
  const out = trim(optionalString(value));
  assert(out, `${label} is required`);
  assert(out.length <= maxLength, `${label} exceeds maximum length (${maxLength})`);
  return out;
}

function validateStringOptional(
  value: unknown,
  label: string,
  maxLength: number,
): string | undefined {
  const out = trim(optionalString(value));
  if (!out) return undefined;
  assert(out.length <= maxLength, `${label} exceeds maximum length (${maxLength})`);
  return out;
}

function validateEmail(value: unknown, label: string): string {
  const out = lowerTrim(optionalString(value));
  assert(out, `${label} is required`);
  assert(out.length <= 320, `${label} exceeds maximum length (320)`);
  assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out), `${label} must be a valid email`);
  return out;
}

function validatePhoneRequired(value: unknown, label: string): string {
  const out = trim(optionalString(value));
  assert(out, `${label} is required`);
  assert(out.length <= 50, `${label} exceeds maximum length (50)`);
  return out;
}

function validatePhoneOptional(value: unknown, label: string): string | undefined {
  const out = trim(optionalString(value));
  if (!out) return undefined;
  assert(out.length <= 50, `${label} exceeds maximum length (50)`);
  return out;
}

function validateAttachments(arr: unknown): IFileAsset[] {
  if (arr == null) return [];
  assert(Array.isArray(arr), "attachments must be an array");
  assert(
    arr.length <= CONTACT_INQUIRY_MAX_ATTACHMENTS,
    `attachments must contain at most ${CONTACT_INQUIRY_MAX_ATTACHMENTS} files`,
  );

  const out: IFileAsset[] = [];

  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    assert(isObj(a), `attachments[${i}] must be an object`);

    const url = validateStringRequired(a.url, `attachments[${i}].url`, 4000);
    const s3Key = validateStringRequired(a.s3Key, `attachments[${i}].s3Key`, 2000);
    const mimeType = validateStringRequired(a.mimeType, `attachments[${i}].mimeType`, 200);
    const originalName = validateStringOptional(
      a.originalName,
      `attachments[${i}].originalName`,
      300,
    );

    const sizeBytes = a.sizeBytes == null ? undefined : Number(a.sizeBytes);

    assert(
      ALLOWED_CONTACT_INQUIRY_MIME_TYPES.has(mimeType),
      `attachments[${i}].mimeType is unsupported`,
    );

    if (sizeBytes != null) {
      assert(
        Number.isFinite(sizeBytes) && sizeBytes >= 0,
        `attachments[${i}].sizeBytes must be a valid number`,
      );
      assert(
        sizeBytes <= CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES,
        `attachments[${i}] exceeds maximum size of ${CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES} bytes`,
      );
    }

    out.push({
      url,
      s3Key,
      mimeType: mimeType as EFileMimeType,
      sizeBytes,
      originalName,
    });
  }

  return out;
}

function validateCustomerSalesInquiry(input: Record<string, unknown>): ContactInquiryDetails {
  assert(isObj(input.contact), "inquiry.contact is required");
  assert(isObj(input.details), "inquiry.details is required");

  const fullName = validateStringRequired(input.contact.fullName, "inquiry.contact.fullName", 200);
  const email = validateEmail(input.contact.email, "inquiry.contact.email");
  const phone = validatePhoneRequired(input.contact.phone, "inquiry.contact.phone");
  const companyName = validateStringOptional(
    input.contact.companyName,
    "inquiry.contact.companyName",
    200,
  );

  const inquiryType = validateEnumValue(
    input.details.inquiryType,
    ECustomerSalesInquiryType,
    "inquiry.details.inquiryType is invalid",
  );
  const loadOrReferenceNumber = validateStringOptional(
    input.details.loadOrReferenceNumber,
    "inquiry.details.loadOrReferenceNumber",
    120,
  );
  const preferredContactMethod = validateOptionalEnumValue(
    input.details.preferredContactMethod,
    EInquiryPreferredContactMethod,
    "inquiry.details.preferredContactMethod is invalid",
  );
  const message = validateStringRequired(input.details.message, "inquiry.details.message", 6000);

  return {
    category: EContactInquiryCategory.CUSTOMER_SALES,
    contact: {
      fullName,
      email,
      phone,
      ...(companyName ? { companyName } : {}),
    },
    details: {
      inquiryType,
      ...(loadOrReferenceNumber ? { loadOrReferenceNumber } : {}),
      ...(preferredContactMethod ? { preferredContactMethod } : {}),
      message,
    },
  };
}

function validateCarrierInquiry(input: Record<string, unknown>): ContactInquiryDetails {
  assert(isObj(input.contact), "inquiry.contact is required");
  assert(isObj(input.details), "inquiry.details is required");

  const contactName = validateStringRequired(
    input.contact.contactName,
    "inquiry.contact.contactName",
    200,
  );
  const email = validateEmail(input.contact.email, "inquiry.contact.email");
  const phone = validatePhoneRequired(input.contact.phone, "inquiry.contact.phone");
  const carrierCompanyName = validateStringOptional(
    input.contact.carrierCompanyName,
    "inquiry.contact.carrierCompanyName",
    200,
  );
  const dotNumber = validateStringOptional(
    input.contact.dotNumber,
    "inquiry.contact.dotNumber",
    60,
  );
  const mcNumber = validateStringOptional(input.contact.mcNumber, "inquiry.contact.mcNumber", 60);

  const inquiryType = validateEnumValue(
    input.details.inquiryType,
    ECarrierInquiryType,
    "inquiry.details.inquiryType is invalid",
  );

  let operatingRegions: ECarrierOperatingRegion[] | undefined;
  if (input.details.operatingRegions != null) {
    assert(
      Array.isArray(input.details.operatingRegions),
      "inquiry.details.operatingRegions must be an array",
    );

    const mapped: ECarrierOperatingRegion[] = input.details.operatingRegions.map((v) =>
      validateEnumValue(
        v,
        ECarrierOperatingRegion,
        "inquiry.details.operatingRegions contains invalid value",
      ),
    );

    operatingRegions = [...new Set(mapped)];
  }

  const message = validateStringRequired(input.details.message, "inquiry.details.message", 6000);

  let trailerType: ECarrierTrailerType | undefined;
  if (input.equipmentInformation != null) {
    assert(isObj(input.equipmentInformation), "inquiry.equipmentInformation must be an object");

    trailerType = validateOptionalEnumValue(
      input.equipmentInformation.trailerType,
      ECarrierTrailerType,
      "inquiry.equipmentInformation.trailerType is invalid",
    );
  }

  return {
    category: EContactInquiryCategory.CARRIERS,
    contact: {
      contactName,
      email,
      phone,
      ...(carrierCompanyName ? { carrierCompanyName } : {}),
      ...(dotNumber ? { dotNumber } : {}),
      ...(mcNumber ? { mcNumber } : {}),
    },
    ...(trailerType
      ? {
          equipmentInformation: {
            trailerType,
          },
        }
      : {}),
    details: {
      inquiryType,
      ...(operatingRegions ? { operatingRegions } : {}),
      message,
    },
  };
}

function validateSafetyInquiry(input: Record<string, unknown>): ContactInquiryDetails {
  assert(isObj(input.contact), "inquiry.contact is required");
  assert(isObj(input.details), "inquiry.details is required");

  const fullName = validateStringRequired(input.contact.fullName, "inquiry.contact.fullName", 200);
  const email = validateEmail(input.contact.email, "inquiry.contact.email");
  const phone = validatePhoneRequired(input.contact.phone, "inquiry.contact.phone");

  const descriptionOfIncident = validateStringRequired(
    input.details.descriptionOfIncident,
    "inquiry.details.descriptionOfIncident",
    6000,
  );

  let incidentInformation:
    | {
        locationOfIncident?: string;
        dateOfIncident?: Date;
        vehicleType?: ESafetyVehicleType;
        incidentType?: ESafetyIncidentType;
        referenceOrLoadNumber?: string;
      }
    | undefined;

  if (input.incidentInformation != null) {
    assert(isObj(input.incidentInformation), "inquiry.incidentInformation must be an object");

    const locationOfIncident = validateStringOptional(
      input.incidentInformation.locationOfIncident,
      "inquiry.incidentInformation.locationOfIncident",
      300,
    );
    const dateOfIncident =
      input.incidentInformation.dateOfIncident != null
        ? validateDate(
            input.incidentInformation.dateOfIncident,
            "inquiry.incidentInformation.dateOfIncident",
          )
        : undefined;
    const vehicleType = validateOptionalEnumValue(
      input.incidentInformation.vehicleType,
      ESafetyVehicleType,
      "inquiry.incidentInformation.vehicleType is invalid",
    );
    const incidentType = validateOptionalEnumValue(
      input.incidentInformation.incidentType,
      ESafetyIncidentType,
      "inquiry.incidentInformation.incidentType is invalid",
    );
    const referenceOrLoadNumber = validateStringOptional(
      input.incidentInformation.referenceOrLoadNumber,
      "inquiry.incidentInformation.referenceOrLoadNumber",
      120,
    );

    if (
      locationOfIncident ||
      dateOfIncident ||
      vehicleType ||
      incidentType ||
      referenceOrLoadNumber
    ) {
      incidentInformation = {
        ...(locationOfIncident ? { locationOfIncident } : {}),
        ...(dateOfIncident ? { dateOfIncident } : {}),
        ...(vehicleType ? { vehicleType } : {}),
        ...(incidentType ? { incidentType } : {}),
        ...(referenceOrLoadNumber ? { referenceOrLoadNumber } : {}),
      };
    }
  }

  return {
    category: EContactInquiryCategory.SAFETY,
    contact: {
      fullName,
      email,
      phone,
    },
    ...(incidentInformation ? { incidentInformation } : {}),
    details: {
      descriptionOfIncident,
    },
  };
}

function validateITSupportInquiry(input: Record<string, unknown>): ContactInquiryDetails {
  assert(isObj(input.contact), "inquiry.contact is required");
  assert(isObj(input.details), "inquiry.details is required");

  const fullName = validateStringRequired(input.contact.fullName, "inquiry.contact.fullName", 200);
  const email = validateEmail(input.contact.email, "inquiry.contact.email");
  const phone = validatePhoneOptional(input.contact.phone, "inquiry.contact.phone");

  const message = validateStringRequired(input.details.message, "inquiry.details.message", 6000);

  let systemInformation:
    | {
        applicationOrSystem?: EITSupportApplicationSystem;
        typeOfIssue?: EITSupportIssueType;
        urgencyLevel?: EITSupportUrgencyLevel;
      }
    | undefined;

  if (input.systemInformation != null) {
    assert(isObj(input.systemInformation), "inquiry.systemInformation must be an object");

    const applicationOrSystem = validateOptionalEnumValue(
      input.systemInformation.applicationOrSystem,
      EITSupportApplicationSystem,
      "inquiry.systemInformation.applicationOrSystem is invalid",
    );
    const typeOfIssue = validateOptionalEnumValue(
      input.systemInformation.typeOfIssue,
      EITSupportIssueType,
      "inquiry.systemInformation.typeOfIssue is invalid",
    );
    const urgencyLevel = validateOptionalEnumValue(
      input.systemInformation.urgencyLevel,
      EITSupportUrgencyLevel,
      "inquiry.systemInformation.urgencyLevel is invalid",
    );

    if (applicationOrSystem || typeOfIssue || urgencyLevel) {
      systemInformation = {
        ...(applicationOrSystem ? { applicationOrSystem } : {}),
        ...(typeOfIssue ? { typeOfIssue } : {}),
        ...(urgencyLevel ? { urgencyLevel } : {}),
      };
    }
  }

  return {
    category: EContactInquiryCategory.IT_SUPPORT,
    contact: {
      fullName,
      email,
      ...(phone ? { phone } : {}),
    },
    ...(systemInformation ? { systemInformation } : {}),
    details: {
      message,
    },
  };
}

function validateGeneralInquiry(input: Record<string, unknown>): ContactInquiryDetails {
  assert(isObj(input.contact), "inquiry.contact is required");
  assert(isObj(input.details), "inquiry.details is required");

  const fullName = validateStringRequired(input.contact.fullName, "inquiry.contact.fullName", 200);
  const email = validateEmail(input.contact.email, "inquiry.contact.email");
  const phone = validatePhoneOptional(input.contact.phone, "inquiry.contact.phone");
  const company = validateStringOptional(input.contact.company, "inquiry.contact.company", 200);

  const inquiryType = validateOptionalEnumValue(
    input.details.inquiryType,
    EGeneralInquiryType,
    "inquiry.details.inquiryType is invalid",
  );
  const message = validateStringRequired(input.details.message, "inquiry.details.message", 6000);

  return {
    category: EContactInquiryCategory.GENERAL,
    contact: {
      fullName,
      email,
      ...(phone ? { phone } : {}),
      ...(company ? { company } : {}),
    },
    details: {
      ...(inquiryType ? { inquiryType } : {}),
      message,
    },
  };
}

export function validateContactInquiryRequest(input: {
  inquiry: unknown;
  attachments?: unknown;
  marketingEmailConsent?: unknown;
}): {
  inquiry: ContactInquiryDetails;
  attachments: IFileAsset[];
  marketingEmailConsent?: boolean;
} {
  assert(isObj(input), "Invalid body");
  assert(isObj(input.inquiry), "inquiry is required");

  const inquiry = input.inquiry;
  const category = validateEnumValue(
    inquiry.category,
    EContactInquiryCategory,
    "inquiry.category is invalid",
  );

  let validatedInquiry: ContactInquiryDetails;

  switch (category) {
    case EContactInquiryCategory.CUSTOMER_SALES:
      validatedInquiry = validateCustomerSalesInquiry(inquiry);
      break;

    case EContactInquiryCategory.CARRIERS:
      validatedInquiry = validateCarrierInquiry(inquiry);
      break;

    case EContactInquiryCategory.SAFETY:
      validatedInquiry = validateSafetyInquiry(inquiry);
      break;

    case EContactInquiryCategory.IT_SUPPORT:
      validatedInquiry = validateITSupportInquiry(inquiry);
      break;

    case EContactInquiryCategory.GENERAL:
      validatedInquiry = validateGeneralInquiry(inquiry);
      break;

    default:
      throw new Error("Unsupported inquiry category");
  }

  const attachments = validateAttachments(input.attachments);
  const marketingEmailConsent = validateOptionalBoolean(
    input.marketingEmailConsent,
    "marketingEmailConsent",
  );

  return {
    inquiry: validatedInquiry,
    attachments,
    ...(marketingEmailConsent != null ? { marketingEmailConsent } : {}),
  };
}
