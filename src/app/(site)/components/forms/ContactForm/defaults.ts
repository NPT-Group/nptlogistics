// src/app/(site)/components/forms/ContactForm/defaults.ts
import { EContactInquiryCategory } from "@/types/contactInquiry.types";
import type { ContactFormSubmitValues } from "./schema";

type InquiryValues = NonNullable<ContactFormSubmitValues["inquiry"]>;

export function makeInquiryDefaults(category: EContactInquiryCategory): InquiryValues {
  switch (category) {
    case EContactInquiryCategory.CUSTOMER_SALES:
      return {
        category,
        contact: {
          fullName: "",
          email: "",
          phone: "",
          companyName: "",
        },
        details: {
          inquiryType: undefined,
          loadOrReferenceNumber: "",
          preferredContactMethod: undefined,
          message: "",
        },
      };

    case EContactInquiryCategory.CARRIERS:
      return {
        category,
        contact: {
          contactName: "",
          email: "",
          phone: "",
          carrierCompanyName: "",
          dotNumber: "",
          mcNumber: "",
        },
        equipmentInformation: {
          trailerType: undefined,
        },
        details: {
          inquiryType: undefined,
          operatingRegions: [],
          message: "",
        },
      };

    case EContactInquiryCategory.SAFETY:
      return {
        category,
        contact: {
          fullName: "",
          email: "",
          phone: "",
        },
        incidentInformation: {
          locationOfIncident: "",
          dateOfIncident: undefined,
          vehicleType: undefined,
          incidentType: undefined,
          referenceOrLoadNumber: "",
        },
        details: {
          descriptionOfIncident: "",
        },
      };

    case EContactInquiryCategory.IT_SUPPORT:
      return {
        category,
        contact: {
          fullName: "",
          email: "",
          phone: "",
        },
        systemInformation: {
          applicationOrSystem: undefined,
          typeOfIssue: undefined,
          urgencyLevel: undefined,
        },
        details: {
          message: "",
        },
      };

    case EContactInquiryCategory.GENERAL:
      return {
        category,
        contact: {
          fullName: "",
          email: "",
          phone: "",
          company: "",
        },
        details: {
          inquiryType: undefined,
          message: "",
        },
      };

    default: {
      const _x: never = category;
      throw new Error(`Unsupported inquiry category: ${_x}`);
    }
  }
}

/**
 * RHF defaults for submit-body schema.
 * - inquiry starts with customer_sales
 */
export const CONTACT_FORM_SUBMIT_DEFAULTS: ContactFormSubmitValues = {
  turnstileToken: "",
  sourceLabel: "NPT Logistics Contact Form",
  inquiry: makeInquiryDefaults(EContactInquiryCategory.CUSTOMER_SALES),
  attachments: [],
  marketingEmailConsent: false,
};
