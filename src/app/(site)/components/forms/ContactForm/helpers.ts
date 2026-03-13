// src/app/(site)/components/forms/ContactForm/helpers.ts
import { EContactInquiryCategory } from "@/types/contactInquiry.types";
import type { ContactFormSubmitValues } from "./schema";
import { makeInquiryDefaults } from "./defaults";
import { NAV_OFFSET } from "@/constants/ui";

export {
  focusFieldPath,
  focusFirstError,
  getFirstRenderableErrorPath,
  pulseFieldHighlight,
  scrollToFieldPath,
} from "@/components/forms/rhf/errorFocus";

/* ───────────────────────── Build / reset helpers ───────────────────────── */

export function buildInquiryOnCategoryChange(category: EContactInquiryCategory) {
  return makeInquiryDefaults(category);
}

/* ───────────────────────── Shared config for this form ───────────────────────── */

export const CONTACT_FORM_ERROR_FOCUS_OPTIONS = {
  scrollOffset: NAV_OFFSET + 50,
  fieldPathAttr: "data-field-path",
  focusDelayMs: 300,
  pulseDurationMs: 2000,
  pulseClassName: "npt-field-error-pulse",
  scrollBehavior: "smooth" as const,
};

/* ───────────────────────── Normalization ───────────────────────── */

function trim<T>(v: T): T {
  return (typeof v === "string" ? v.trim() : v) as T;
}

function lowerTrim<T>(v: T): T {
  return (typeof v === "string" ? v.trim().toLowerCase() : v) as T;
}

function normalizePhone<T>(v: T): T {
  if (typeof v !== "string") return v;

  const trimmed = v.trim();
  if (!trimmed) return "" as T;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return `${hasPlus ? "+" : ""}${digits}` as T;
}

function normalizeAttachments(attachments: any[] | undefined) {
  if (!Array.isArray(attachments)) return attachments;

  return attachments.map((file) => ({
    ...file,
    url: trim(file.url),
    s3Key: trim(file.s3Key),
    mimeType: trim(file.mimeType),
    originalName: file.originalName != null ? trim(file.originalName) : file.originalName,
  }));
}

export function normalizeBeforeSubmit(values: ContactFormSubmitValues): ContactFormSubmitValues {
  const v: any = structuredClone(values);

  v.turnstileToken = trim(v.turnstileToken);
  if (v.sourceLabel != null) v.sourceLabel = trim(v.sourceLabel);
  v.attachments = normalizeAttachments(v.attachments);

  if (v.marketingEmailConsent != null) {
    v.marketingEmailConsent = Boolean(v.marketingEmailConsent);
  }

  const inquiry = v.inquiry;
  if (!inquiry) return v as ContactFormSubmitValues;

  inquiry.category = trim(inquiry.category);

  switch (inquiry.category) {
    case EContactInquiryCategory.CUSTOMER_SALES: {
      inquiry.contact.fullName = trim(inquiry.contact.fullName);
      inquiry.contact.email = lowerTrim(inquiry.contact.email);
      inquiry.contact.phone = normalizePhone(inquiry.contact.phone);

      if (inquiry.contact.companyName != null) {
        inquiry.contact.companyName = trim(inquiry.contact.companyName);
      }

      if (inquiry.details.inquiryType != null) {
        inquiry.details.inquiryType = trim(inquiry.details.inquiryType);
      }
      if (inquiry.details.loadOrReferenceNumber != null) {
        inquiry.details.loadOrReferenceNumber = trim(inquiry.details.loadOrReferenceNumber);
      }
      if (inquiry.details.preferredContactMethod != null) {
        inquiry.details.preferredContactMethod = trim(inquiry.details.preferredContactMethod);
      }
      inquiry.details.message = trim(inquiry.details.message);
      break;
    }

    case EContactInquiryCategory.CARRIERS: {
      inquiry.contact.contactName = trim(inquiry.contact.contactName);
      inquiry.contact.email = lowerTrim(inquiry.contact.email);
      inquiry.contact.phone = normalizePhone(inquiry.contact.phone);

      if (inquiry.contact.carrierCompanyName != null) {
        inquiry.contact.carrierCompanyName = trim(inquiry.contact.carrierCompanyName);
      }
      if (inquiry.contact.dotNumber != null) {
        inquiry.contact.dotNumber = trim(inquiry.contact.dotNumber);
      }
      if (inquiry.contact.mcNumber != null) {
        inquiry.contact.mcNumber = trim(inquiry.contact.mcNumber);
      }

      if (inquiry.equipmentInformation?.trailerType != null) {
        inquiry.equipmentInformation.trailerType = trim(inquiry.equipmentInformation.trailerType);
      }

      if (inquiry.details.inquiryType != null) {
        inquiry.details.inquiryType = trim(inquiry.details.inquiryType);
      }
      if (Array.isArray(inquiry.details.operatingRegions)) {
        inquiry.details.operatingRegions = Array.from(
          new Set(inquiry.details.operatingRegions.map((x: any) => trim(x))),
        );
      }
      inquiry.details.message = trim(inquiry.details.message);
      break;
    }

    case EContactInquiryCategory.SAFETY: {
      inquiry.contact.fullName = trim(inquiry.contact.fullName);
      inquiry.contact.email = lowerTrim(inquiry.contact.email);
      inquiry.contact.phone = normalizePhone(inquiry.contact.phone);

      if (inquiry.incidentInformation) {
        if (inquiry.incidentInformation.locationOfIncident != null) {
          inquiry.incidentInformation.locationOfIncident = trim(
            inquiry.incidentInformation.locationOfIncident,
          );
        }
        if (inquiry.incidentInformation.dateOfIncident != null) {
          inquiry.incidentInformation.dateOfIncident =
            inquiry.incidentInformation.dateOfIncident instanceof Date
              ? inquiry.incidentInformation.dateOfIncident.toISOString()
              : trim(inquiry.incidentInformation.dateOfIncident);
        }
        if (inquiry.incidentInformation.vehicleType != null) {
          inquiry.incidentInformation.vehicleType = trim(inquiry.incidentInformation.vehicleType);
        }
        if (inquiry.incidentInformation.incidentType != null) {
          inquiry.incidentInformation.incidentType = trim(inquiry.incidentInformation.incidentType);
        }
        if (inquiry.incidentInformation.referenceOrLoadNumber != null) {
          inquiry.incidentInformation.referenceOrLoadNumber = trim(
            inquiry.incidentInformation.referenceOrLoadNumber,
          );
        }
      }

      inquiry.details.descriptionOfIncident = trim(inquiry.details.descriptionOfIncident);
      break;
    }

    case EContactInquiryCategory.IT_SUPPORT: {
      inquiry.contact.fullName = trim(inquiry.contact.fullName);
      inquiry.contact.email = lowerTrim(inquiry.contact.email);
      if (inquiry.contact.phone != null) {
        inquiry.contact.phone = normalizePhone(inquiry.contact.phone);
      }

      if (inquiry.systemInformation) {
        if (inquiry.systemInformation.applicationOrSystem != null) {
          inquiry.systemInformation.applicationOrSystem = trim(
            inquiry.systemInformation.applicationOrSystem,
          );
        }
        if (inquiry.systemInformation.typeOfIssue != null) {
          inquiry.systemInformation.typeOfIssue = trim(inquiry.systemInformation.typeOfIssue);
        }
        if (inquiry.systemInformation.urgencyLevel != null) {
          inquiry.systemInformation.urgencyLevel = trim(inquiry.systemInformation.urgencyLevel);
        }
      }

      inquiry.details.message = trim(inquiry.details.message);
      break;
    }

    case EContactInquiryCategory.GENERAL: {
      inquiry.contact.fullName = trim(inquiry.contact.fullName);
      inquiry.contact.email = lowerTrim(inquiry.contact.email);
      if (inquiry.contact.phone != null) {
        inquiry.contact.phone = normalizePhone(inquiry.contact.phone);
      }
      if (inquiry.contact.company != null) {
        inquiry.contact.company = trim(inquiry.contact.company);
      }

      if (inquiry.details.inquiryType != null) {
        inquiry.details.inquiryType = trim(inquiry.details.inquiryType);
      }
      inquiry.details.message = trim(inquiry.details.message);
      break;
    }

    default:
      break;
  }

  return v as ContactFormSubmitValues;
}

export function toApiSubmitBody(values: ContactFormSubmitValues) {
  const v = normalizeBeforeSubmit(values);

  return {
    turnstileToken: v.turnstileToken,
    inquiry: v.inquiry,
    attachments: v.attachments,
    sourceLabel: v.sourceLabel,
    marketingEmailConsent: v.marketingEmailConsent,
  };
}
