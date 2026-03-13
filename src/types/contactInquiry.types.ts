// src/types/contactInquiry.types.ts
import type { ObjectId } from "mongoose";
import type { IFileAsset } from "@/types/shared.types";

/* ──────────────────────────────────────────────────────────────────────────────
BUSINESS RULE SUMMARY

1. Inquiry routing model:
   - Contact inquiries are SINGLE-SELECT by department/category.
   - One submission belongs to exactly one primary inquiry category.

2. Categories:
   - CUSTOMER_SALES
   - CARRIERS
   - SAFETY
   - IT_SUPPORT
   - GENERAL

3. UX / conversion rule:
   - Every user-facing select/radio option list should include an OTHER option.
   - This prevents drop-off when predefined options do not apply.

4. Attachments:
   - Optional across all categories.
   - Multiple files allowed.
   - Maximum files: 10
   - Maximum size per file: 10MB
   - Accepted formats:
     images, PDFs, and common office documents.
   - Validation should be enforced in schema / upload layer, not only UI.

5. Contact info:
   - Name and email are broadly required across all categories.
   - Phone requirement varies by category:
     CUSTOMER_SALES → required
     CARRIERS → required
     SAFETY → required
     IT_SUPPORT → optional
     GENERAL → optional

6. Flexible routing:
   - The form should remain usable even when the user is unsure of the exact type.
   - "Other" inquiry types allow internal team reclassification after submission.

7. Friendly customer-facing identifier:
   - inquiryId is backend-generated and unique.
   - Intended for customer follow-up and internal reference.
   - Example: NPT-CI-260312-7G4K2

8. Incident / support / operational details:
   - Category-specific fields should only exist on the matching discriminator shape.
   - Shared root model stores common metadata and attachments.

9. Dates:
   - incidentDate may be stored as Date or ISO string.
   - createdAt / updatedAt may be stored as Date or ISO string.

10. Internal ownership:
   - Department routing, notifications, reassignment, status, and SLA logic
     are backend / service-layer concerns and are intentionally not modeled
     as user-editable fields in this type file.
────────────────────────────────────────────────────────────────────────────── */

/* ───────────────────────────── Upload Rules ───────────────────────────── */

export const CONTACT_INQUIRY_MAX_ATTACHMENTS = 10;
export const CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/* ───────────────────────────── Primary Category ───────────────────────────── */

export enum EContactInquiryCategory {
  CUSTOMER_SALES = "CUSTOMER_SALES",
  CARRIERS = "CARRIERS",
  SAFETY = "SAFETY",
  IT_SUPPORT = "IT_SUPPORT",
  GENERAL = "GENERAL",
}

/* ───────────────────────────── Shared Enums ───────────────────────────── */

export enum EInquiryPreferredContactMethod {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  EITHER = "EITHER",
  OTHER = "OTHER",
}

/* ───────────────────────────── Customer & Sales ───────────────────────────── */

export enum ECustomerSalesInquiryType {
  SHIPMENT_STATUS = "SHIPMENT_STATUS",
  BILLING_INVOICE_QUESTION = "BILLING_INVOICE_QUESTION",
  DOCUMENTATION_REQUEST = "DOCUMENTATION_REQUEST",
  SERVICE_QUESTION = "SERVICE_QUESTION",
  OTHER = "OTHER",
}

export type CustomerSalesContact = {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
};

export type CustomerSalesDetails = {
  inquiryType: ECustomerSalesInquiryType;
  loadOrReferenceNumber?: string;
  preferredContactMethod?: EInquiryPreferredContactMethod;
  message: string;
};

export type CustomerSalesInquiry = {
  category: EContactInquiryCategory.CUSTOMER_SALES;
  contact: CustomerSalesContact;
  details: CustomerSalesDetails;
};

/* ───────────────────────────── Carriers ───────────────────────────── */

export enum ECarrierTrailerType {
  DRY_VAN = "DRY_VAN",
  REEFER = "REEFER",
  FLATBED = "FLATBED",
  STEP_DECK = "STEP_DECK",
  RGN_LOWBOY = "RGN_LOWBOY",
  CONESTOGA = "CONESTOGA",
  OTHER = "OTHER",
}

export enum ECarrierInquiryType {
  LOAD_OPPORTUNITIES = "LOAD_OPPORTUNITIES",
  CARRIER_SETUP_ONBOARDING = "CARRIER_SETUP_ONBOARDING",
  PAYMENT_INVOICE_QUESTION = "PAYMENT_INVOICE_QUESTION",
  SAFETY_CONCERN = "SAFETY_CONCERN",
  OTHER = "OTHER",
}

export enum ECarrierOperatingRegion {
  CANADA = "CANADA",
  UNITED_STATES = "UNITED_STATES",
  MEXICO = "MEXICO",
  OTHER = "OTHER",
}

export type CarrierContact = {
  contactName: string;
  email: string;
  phone: string;
  carrierCompanyName?: string;
  dotNumber?: string;
  mcNumber?: string;
};

export type CarrierEquipmentInformation = {
  trailerType?: ECarrierTrailerType;
};

export type CarrierDetails = {
  inquiryType: ECarrierInquiryType;
  operatingRegions?: ECarrierOperatingRegion[];
  message: string;
};

export type CarrierInquiry = {
  category: EContactInquiryCategory.CARRIERS;
  contact: CarrierContact;
  equipmentInformation?: CarrierEquipmentInformation;
  details: CarrierDetails;
};

/* ───────────────────────────── Safety ───────────────────────────── */

export enum ESafetyVehicleType {
  TRACTOR = "TRACTOR",
  TRAILER = "TRAILER",
  PERSONAL_VEHICLE = "PERSONAL_VEHICLE",
  OTHER = "OTHER",
}

export enum ESafetyIncidentType {
  ACCIDENT = "ACCIDENT",
  ROAD_SAFETY_CONCERN = "ROAD_SAFETY_CONCERN",
  CARGO_ISSUE = "CARGO_ISSUE",
  COMPLIANCE_CONCERN = "COMPLIANCE_CONCERN",
  OTHER = "OTHER",
}

export type SafetyContact = {
  fullName: string;
  email: string;
  phone: string;
};

export type SafetyIncidentInformation = {
  locationOfIncident?: string;
  dateOfIncident?: Date | string;
  vehicleType?: ESafetyVehicleType;
  incidentType?: ESafetyIncidentType;
  referenceOrLoadNumber?: string;
};

export type SafetyDetails = {
  descriptionOfIncident: string;
};

export type SafetyInquiry = {
  category: EContactInquiryCategory.SAFETY;
  contact: SafetyContact;
  incidentInformation?: SafetyIncidentInformation;
  details: SafetyDetails;
};

/* ───────────────────────────── IT Support ───────────────────────────── */

export enum EITSupportApplicationSystem {
  CUSTOMER_PORTAL = "CUSTOMER_PORTAL",
  CARRIER_PORTAL = "CARRIER_PORTAL",
  WEBSITE = "WEBSITE",
  OTHER = "OTHER",
}

export enum EITSupportIssueType {
  LOGIN_PROBLEM = "LOGIN_PROBLEM",
  ACCOUNT_ACCESS_ISSUE = "ACCOUNT_ACCESS_ISSUE",
  SYSTEM_ERROR = "SYSTEM_ERROR",
  FEATURE_REQUEST = "FEATURE_REQUEST",
  OTHER = "OTHER",
}

export enum EITSupportUrgencyLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  OTHER = "OTHER",
}

export type ITSupportContact = {
  fullName: string;
  email: string;
  phone?: string;
};

export type ITSupportSystemInformation = {
  applicationOrSystem?: EITSupportApplicationSystem;
  typeOfIssue?: EITSupportIssueType;
  urgencyLevel?: EITSupportUrgencyLevel;
};

export type ITSupportDetails = {
  message: string;
};

export type ITSupportInquiry = {
  category: EContactInquiryCategory.IT_SUPPORT;
  contact: ITSupportContact;
  systemInformation?: ITSupportSystemInformation;
  details: ITSupportDetails;
};

/* ───────────────────────────── General ───────────────────────────── */

export enum EGeneralInquiryType {
  BUSINESS_PARTNERSHIP = "BUSINESS_PARTNERSHIP",
  VENDOR_SUPPLIER_INQUIRY = "VENDOR_SUPPLIER_INQUIRY",
  MEDIA_PRESS = "MEDIA_PRESS",
  GENERAL_QUESTION = "GENERAL_QUESTION",
  OTHER = "OTHER",
}

export type GeneralContact = {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
};

export type GeneralDetails = {
  inquiryType?: EGeneralInquiryType;
  message: string;
};

export type GeneralInquiry = {
  category: EContactInquiryCategory.GENERAL;
  contact: GeneralContact;
  details: GeneralDetails;
};

/* ───────────────────────────── Union Type ───────────────────────────── */

export type ContactInquiryDetails =
  | CustomerSalesInquiry
  | CarrierInquiry
  | SafetyInquiry
  | ITSupportInquiry
  | GeneralInquiry;

/* ───────────────────────────── Root Model ───────────────────────────── */

export interface IContactInquiry {
  _id: ObjectId | string;

  /**
   * Friendly customer-facing reference ID.
   * Backend-generated and unique.
   * Example: NPT-CI-260312-7G4K2
   */
  inquiryId: string;

  inquiry: ContactInquiryDetails;

  attachments?: IFileAsset[];

  marketingEmailConsent?: boolean;

  createdAt: Date | string;
  updatedAt: Date | string;
}

/* ───────────────────────────── Draft Helper ───────────────────────────── */

export type ContactInquiryDraft = Partial<
  Omit<IContactInquiry, "_id" | "inquiryId" | "createdAt" | "updatedAt">
>;
