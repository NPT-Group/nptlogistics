// src/lib/utils/enums/contactLabels.ts
import {
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
} from "@/types/contactInquiry.types";

/** Fallback: "ACCOUNT_ACCESS_ISSUE" -> "Account access issue" */
export function humanizeEnumFallback(v: string) {
  return v
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/** Prefer label map; fallback to humanized enum */
export function labelFromMap<T extends string>(value: T | undefined, map: Record<T, string>) {
  if (!value) return "—";
  return map[value] ?? humanizeEnumFallback(String(value));
}

/** Convert enum array to label list */
export function labelsFromMap<T extends string>(
  values: readonly T[] | undefined,
  map: Record<T, string>,
) {
  if (!values?.length) return [];
  return values.map((v) => map[v] ?? humanizeEnumFallback(String(v)));
}

/* ───────────────────────── Label Maps (Source of Truth) ───────────────────────── */

export const CONTACT_CATEGORY_LABEL: Record<EContactInquiryCategory, string> = {
  [EContactInquiryCategory.CUSTOMER_SALES]: "Customer & Sales",
  [EContactInquiryCategory.CARRIERS]: "Carriers",
  [EContactInquiryCategory.SAFETY]: "Safety",
  [EContactInquiryCategory.IT_SUPPORT]: "IT Support",
  [EContactInquiryCategory.GENERAL]: "General",
};

export const PREF_CONTACT_LABEL: Record<EInquiryPreferredContactMethod, string> = {
  [EInquiryPreferredContactMethod.EMAIL]: "Email",
  [EInquiryPreferredContactMethod.PHONE]: "Phone",
  [EInquiryPreferredContactMethod.EITHER]: "Either",
  [EInquiryPreferredContactMethod.OTHER]: "Other",
};

/* ------------------------- Customer & Sales ------------------------- */

export const CUSTOMER_SALES_INQUIRY_TYPE_LABEL: Record<ECustomerSalesInquiryType, string> = {
  [ECustomerSalesInquiryType.SHIPMENT_STATUS]: "Shipment status",
  [ECustomerSalesInquiryType.BILLING_INVOICE_QUESTION]: "Billing / invoice question",
  [ECustomerSalesInquiryType.DOCUMENTATION_REQUEST]: "Documentation request (BOL, POD, etc.)",
  [ECustomerSalesInquiryType.SERVICE_QUESTION]: "Service question",
  [ECustomerSalesInquiryType.OTHER]: "Other",
};

/* ------------------------------ Carriers ------------------------------ */

export const CARRIER_TRAILER_TYPE_LABEL: Record<ECarrierTrailerType, string> = {
  [ECarrierTrailerType.DRY_VAN]: "Dry van",
  [ECarrierTrailerType.REEFER]: "Reefer",
  [ECarrierTrailerType.FLATBED]: "Flatbed",
  [ECarrierTrailerType.STEP_DECK]: "Step deck",
  [ECarrierTrailerType.RGN_LOWBOY]: "RGN / Lowboy",
  [ECarrierTrailerType.CONESTOGA]: "Conestoga",
  [ECarrierTrailerType.OTHER]: "Other",
};

export const CARRIER_INQUIRY_TYPE_LABEL: Record<ECarrierInquiryType, string> = {
  [ECarrierInquiryType.LOAD_OPPORTUNITIES]: "Load opportunities",
  [ECarrierInquiryType.CARRIER_SETUP_ONBOARDING]: "Carrier setup / onboarding",
  [ECarrierInquiryType.PAYMENT_INVOICE_QUESTION]: "Payment / invoice question",
  [ECarrierInquiryType.SAFETY_CONCERN]: "Safety concern",
  [ECarrierInquiryType.OTHER]: "Other",
};

export const CARRIER_REGION_LABEL: Record<ECarrierOperatingRegion, string> = {
  [ECarrierOperatingRegion.CANADA]: "Canada",
  [ECarrierOperatingRegion.UNITED_STATES]: "United States",
  [ECarrierOperatingRegion.MEXICO]: "Mexico",
  [ECarrierOperatingRegion.OTHER]: "Other",
};

/* ------------------------------- Safety ------------------------------- */

export const SAFETY_VEHICLE_TYPE_LABEL: Record<ESafetyVehicleType, string> = {
  [ESafetyVehicleType.TRACTOR]: "Tractor",
  [ESafetyVehicleType.TRAILER]: "Trailer",
  [ESafetyVehicleType.PERSONAL_VEHICLE]: "Personal vehicle",
  [ESafetyVehicleType.OTHER]: "Other",
};

export const SAFETY_INCIDENT_TYPE_LABEL: Record<ESafetyIncidentType, string> = {
  [ESafetyIncidentType.ACCIDENT]: "Accident",
  [ESafetyIncidentType.ROAD_SAFETY_CONCERN]: "Road safety concern",
  [ESafetyIncidentType.CARGO_ISSUE]: "Cargo issue",
  [ESafetyIncidentType.COMPLIANCE_CONCERN]: "Compliance concern",
  [ESafetyIncidentType.OTHER]: "Other",
};

/* ----------------------------- IT Support ----------------------------- */

export const IT_SUPPORT_APPLICATION_LABEL: Record<EITSupportApplicationSystem, string> = {
  [EITSupportApplicationSystem.CUSTOMER_PORTAL]: "Customer portal",
  [EITSupportApplicationSystem.CARRIER_PORTAL]: "Carrier portal",
  [EITSupportApplicationSystem.WEBSITE]: "Website",
  [EITSupportApplicationSystem.OTHER]: "Other",
};

export const IT_SUPPORT_ISSUE_TYPE_LABEL: Record<EITSupportIssueType, string> = {
  [EITSupportIssueType.LOGIN_PROBLEM]: "Login problem",
  [EITSupportIssueType.ACCOUNT_ACCESS_ISSUE]: "Account access issue",
  [EITSupportIssueType.SYSTEM_ERROR]: "System error",
  [EITSupportIssueType.FEATURE_REQUEST]: "Feature request",
  [EITSupportIssueType.OTHER]: "Other",
};

export const IT_SUPPORT_URGENCY_LABEL: Record<EITSupportUrgencyLevel, string> = {
  [EITSupportUrgencyLevel.LOW]: "Low",
  [EITSupportUrgencyLevel.MEDIUM]: "Medium",
  [EITSupportUrgencyLevel.HIGH]: "High",
  [EITSupportUrgencyLevel.OTHER]: "Other",
};

/* ------------------------------- General ------------------------------- */

export const GENERAL_INQUIRY_TYPE_LABEL: Record<EGeneralInquiryType, string> = {
  [EGeneralInquiryType.BUSINESS_PARTNERSHIP]: "Business partnership",
  [EGeneralInquiryType.VENDOR_SUPPLIER_INQUIRY]: "Vendor or supplier inquiry",
  [EGeneralInquiryType.MEDIA_PRESS]: "Media or press",
  [EGeneralInquiryType.GENERAL_QUESTION]: "General question",
  [EGeneralInquiryType.OTHER]: "Other",
};
