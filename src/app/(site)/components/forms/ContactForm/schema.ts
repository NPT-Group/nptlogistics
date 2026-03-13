// src/app/(site)/components/forms/ContactForm/schema.ts
import { z } from "zod";

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
} from "@/types/contactInquiry.types";
import { EFileMimeType, type IFileAsset } from "@/types/shared.types";

/* ──────────────────────────────────────────────────────────────────────────────
  SUBMIT BODY schema (matches API expectation)
  Body shape:
    { turnstileToken, inquiry, attachments?, sourceLabel? }
────────────────────────────────────────────────────────────────────────────── */

const requiredString = (label: string) => z.string().trim().min(1, `${label} is required`);

const optionalTrimmedString = () =>
  z.preprocess((v) => {
    if (typeof v !== "string") return v;
    const trimmed = v.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().optional());

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .toLowerCase()
  .email("Please enter a valid email address")
  .max(320, "Email must be 320 characters or less");

const phoneFieldRequired = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .max(50, "Phone must be 50 characters or less")
  .refine((value) => {
    const allowedPattern = /^[+\d\s().\-xextEXT#]+$/;
    if (!allowedPattern.test(value)) return false;

    const digits = value.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }, "Please enter a valid phone number");

const phoneFieldOptional = z
  .preprocess((v) => {
    if (typeof v !== "string") return v;
    const trimmed = v.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(50, "Phone must be 50 characters or less").optional())
  .refine((value) => {
    if (!value) return true;

    const allowedPattern = /^[+\d\s().\-xextEXT#]+$/;
    if (!allowedPattern.test(value)) return false;

    const digits = value.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }, "Please enter a valid phone number");

const requiredEnumField = <T extends Record<string, string | number>>(
  enumObj: T,
  message: string,
) =>
  z.union([z.nativeEnum(enumObj), z.undefined()]).superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });

const optionalEnumField = <T extends Record<string, string | number>>(enumObj: T) =>
  z.preprocess((v) => {
    if (v === "") return undefined;
    return v;
  }, z.nativeEnum(enumObj).optional());

const isoDateFieldOptional = (label: string) =>
  z
    .preprocess(
      (v) => {
        if (v == null) return undefined;
        if (typeof v === "string") {
          const trimmed = v.trim();
          return trimmed === "" ? undefined : trimmed;
        }
        return v;
      },
      z.union([z.string(), z.date()]).optional(),
    )
    .superRefine((v, ctx) => {
      if (v == null) return;
      const d = v instanceof Date ? v : new Date(String(v));
      if (Number.isNaN(d.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} is invalid`,
        });
      }
    })
    .transform((v) => {
      if (v == null) return undefined;
      const d = v instanceof Date ? v : new Date(String(v));
      return d.toISOString();
    });

/* ───────────────────────────── Attachments ───────────────────────────── */

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

export const contactFileAssetSchema: z.ZodType<IFileAsset> = z.object({
  url: requiredString("File URL"),
  s3Key: requiredString("File key"),
  mimeType: z
    .string()
    .trim()
    .min(1, "File type is required")
    .refine((mt) => ALLOWED_CONTACT_INQUIRY_MIME_TYPES.has(mt), "Unsupported file type"),
  sizeBytes: z
    .number()
    .nonnegative("File size must be a valid number")
    .max(
      CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES,
      `Each file must be ${CONTACT_INQUIRY_MAX_FILE_SIZE_BYTES} bytes or less`,
    )
    .optional(),
  originalName: z.string().optional(),
});

/* ───────────────────────────── Customer & Sales ───────────────────────────── */

export const customerSalesInquirySchema = z.object({
  category: z.literal(EContactInquiryCategory.CUSTOMER_SALES),

  contact: z.object({
    fullName: requiredString("Full name").max(200, "Full name must be 200 characters or less"),
    email: emailField,
    phone: phoneFieldRequired,
    companyName: optionalTrimmedString().refine(
      (v) => v == null || v.length <= 200,
      "Company name must be 200 characters or less",
    ),
  }),

  details: z.object({
    inquiryType: requiredEnumField(ECustomerSalesInquiryType, "Please select an inquiry type"),
    loadOrReferenceNumber: optionalTrimmedString().refine(
      (v) => v == null || v.length <= 120,
      "Load or reference number must be 120 characters or less",
    ),
    preferredContactMethod: optionalEnumField(EInquiryPreferredContactMethod),
    message: requiredString("Message").max(6000, "Message must be 6000 characters or less"),
  }),
});

/* ───────────────────────────── Carriers ───────────────────────────── */

export const carrierInquirySchema = z.object({
  category: z.literal(EContactInquiryCategory.CARRIERS),

  contact: z.object({
    contactName: requiredString("Contact name").max(
      200,
      "Contact name must be 200 characters or less",
    ),
    email: emailField,
    phone: phoneFieldRequired,
    carrierCompanyName: optionalTrimmedString().refine(
      (v) => v == null || v.length <= 200,
      "Carrier company name must be 200 characters or less",
    ),
    dotNumber: optionalTrimmedString().refine(
      (v) => v == null || v.length <= 60,
      "DOT number must be 60 characters or less",
    ),
    mcNumber: optionalTrimmedString().refine(
      (v) => v == null || v.length <= 60,
      "MC number must be 60 characters or less",
    ),
  }),

  equipmentInformation: z
    .object({
      trailerType: optionalEnumField(ECarrierTrailerType),
    })
    .optional(),

  details: z.object({
    inquiryType: requiredEnumField(ECarrierInquiryType, "Please select an inquiry type"),
    operatingRegions: z
      .array(z.nativeEnum(ECarrierOperatingRegion))
      .max(10, "Too many operating regions selected")
      .optional(),
    message: requiredString("Message").max(6000, "Message must be 6000 characters or less"),
  }),
});

/* ───────────────────────────── Safety ───────────────────────────── */

export const safetyInquirySchema = z.object({
  category: z.literal(EContactInquiryCategory.SAFETY),

  contact: z.object({
    fullName: requiredString("Full name").max(200, "Full name must be 200 characters or less"),
    email: emailField,
    phone: phoneFieldRequired,
  }),

  incidentInformation: z
    .object({
      locationOfIncident: optionalTrimmedString().refine(
        (v) => v == null || v.length <= 300,
        "Location of incident must be 300 characters or less",
      ),
      dateOfIncident: isoDateFieldOptional("Date of incident"),
      vehicleType: optionalEnumField(ESafetyVehicleType),
      incidentType: optionalEnumField(ESafetyIncidentType),
      referenceOrLoadNumber: optionalTrimmedString().refine(
        (v) => v == null || v.length <= 120,
        "Reference or load number must be 120 characters or less",
      ),
    })
    .optional(),

  details: z.object({
    descriptionOfIncident: requiredString("Description of incident").max(
      6000,
      "Description of incident must be 6000 characters or less",
    ),
  }),
});

/* ───────────────────────────── IT Support ───────────────────────────── */

export const itSupportInquirySchema = z.object({
  category: z.literal(EContactInquiryCategory.IT_SUPPORT),

  contact: z.object({
    fullName: requiredString("Full name").max(200, "Full name must be 200 characters or less"),
    email: emailField,
    phone: phoneFieldOptional,
  }),

  systemInformation: z
    .object({
      applicationOrSystem: optionalEnumField(EITSupportApplicationSystem),
      typeOfIssue: optionalEnumField(EITSupportIssueType),
      urgencyLevel: optionalEnumField(EITSupportUrgencyLevel),
    })
    .optional(),

  details: z.object({
    message: requiredString("Message").max(6000, "Message must be 6000 characters or less"),
  }),
});

/* ───────────────────────────── General ───────────────────────────── */

export const generalInquirySchema = z.object({
  category: z.literal(EContactInquiryCategory.GENERAL),

  contact: z.object({
    fullName: requiredString("Full name").max(200, "Full name must be 200 characters or less"),
    email: emailField,
    phone: phoneFieldOptional,
    company: optionalTrimmedString().refine(
      (v) => v == null || v.length <= 200,
      "Company must be 200 characters or less",
    ),
  }),

  details: z.object({
    inquiryType: optionalEnumField(EGeneralInquiryType),
    message: requiredString("Message").max(6000, "Message must be 6000 characters or less"),
  }),
});

/* ───────────────────────────── Inquiry Union ───────────────────────────── */

export const contactInquirySchema = z.discriminatedUnion("category", [
  customerSalesInquirySchema,
  carrierInquirySchema,
  safetyInquirySchema,
  itSupportInquirySchema,
  generalInquirySchema,
]);

/* ───────────────────────────── Submit Body ───────────────────────────── */

export const contactFormSubmitSchema = z
  .object({
    turnstileToken: z.string().trim().min(1, "Please complete the verification challenge"),

    inquiry: contactInquirySchema.optional(),

    attachments: z
      .array(contactFileAssetSchema)
      .max(
        CONTACT_INQUIRY_MAX_ATTACHMENTS,
        `You can upload up to ${CONTACT_INQUIRY_MAX_ATTACHMENTS} files`,
      )
      .optional(),

    sourceLabel: z.string().optional(),

    marketingEmailConsent: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.inquiry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["inquiry", "category"],
        message: "Please select a contact category",
      });
    }
  });

export type ContactFormSubmitValues = z.infer<typeof contactFormSubmitSchema>;
