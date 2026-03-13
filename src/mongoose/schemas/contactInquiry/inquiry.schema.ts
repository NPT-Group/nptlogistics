// src/mongoose/schemas/contactInquiry/inquiry.schema.ts
import { Schema } from "mongoose";
import type { ContactInquiryDetails } from "@/types/contactInquiry.types";
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
  type CustomerSalesInquiry,
  type CarrierInquiry,
  type SafetyInquiry,
  type ITSupportInquiry,
  type GeneralInquiry,
} from "@/types/contactInquiry.types";

/**
 * Base discriminator schema for inquiry.
 * IMPORTANT: strict discriminator model keyed by `category`.
 */
export const contactInquiryDetailsBaseSchema = new Schema<ContactInquiryDetails>(
  {
    category: {
      type: String,
      required: true,
      enum: Object.values(EContactInquiryCategory),
      index: true,
    },
  },
  {
    _id: false,
    discriminatorKey: "category",
  },
);

/* ------------------------- Customer & Sales ------------------------- */

const customerSalesContactSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, required: true, trim: true, maxlength: 50 },
    companyName: { type: String, required: false, trim: true, maxlength: 200 },
  },
  { _id: false },
);

const customerSalesDetailsSchema = new Schema(
  {
    inquiryType: {
      type: String,
      required: true,
      enum: Object.values(ECustomerSalesInquiryType),
    },
    loadOrReferenceNumber: { type: String, required: false, trim: true, maxlength: 120 },
    preferredContactMethod: {
      type: String,
      required: false,
      enum: Object.values(EInquiryPreferredContactMethod),
    },
    message: { type: String, required: true, trim: true, maxlength: 6000 },
  },
  { _id: false },
);

export const customerSalesInquirySchema = new Schema<Omit<CustomerSalesInquiry, "category">>(
  {
    contact: { type: customerSalesContactSchema, required: true },
    details: { type: customerSalesDetailsSchema, required: true },
  },
  { _id: false },
);

/* ------------------------------ Carriers ------------------------------ */

const carrierContactSchema = new Schema(
  {
    contactName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, required: true, trim: true, maxlength: 50 },
    carrierCompanyName: { type: String, required: false, trim: true, maxlength: 200 },
    dotNumber: { type: String, required: false, trim: true, maxlength: 60 },
    mcNumber: { type: String, required: false, trim: true, maxlength: 60 },
  },
  { _id: false },
);

const carrierEquipmentInformationSchema = new Schema(
  {
    trailerType: {
      type: String,
      required: false,
      enum: Object.values(ECarrierTrailerType),
    },
  },
  { _id: false },
);

const carrierDetailsSchema = new Schema(
  {
    inquiryType: {
      type: String,
      required: true,
      enum: Object.values(ECarrierInquiryType),
    },
    operatingRegions: {
      type: [String],
      required: false,
      default: [],
      enum: Object.values(ECarrierOperatingRegion),
    },
    message: { type: String, required: true, trim: true, maxlength: 6000 },
  },
  { _id: false },
);

export const carrierInquirySchema = new Schema<Omit<CarrierInquiry, "category">>(
  {
    contact: { type: carrierContactSchema, required: true },
    equipmentInformation: { type: carrierEquipmentInformationSchema, required: false },
    details: { type: carrierDetailsSchema, required: true },
  },
  { _id: false },
);

carrierInquirySchema.pre("validate", function () {
  const doc = this as any;

  if (Array.isArray(doc.details?.operatingRegions)) {
    const unique = [...new Set(doc.details.operatingRegions.map((v: string) => String(v)))];
    doc.details.operatingRegions = unique;
  }
});

/* ------------------------------- Safety ------------------------------- */

const safetyContactSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, required: true, trim: true, maxlength: 50 },
  },
  { _id: false },
);

const safetyIncidentInformationSchema = new Schema(
  {
    locationOfIncident: { type: String, required: false, trim: true, maxlength: 300 },
    dateOfIncident: { type: Date, required: false },
    vehicleType: {
      type: String,
      required: false,
      enum: Object.values(ESafetyVehicleType),
    },
    incidentType: {
      type: String,
      required: false,
      enum: Object.values(ESafetyIncidentType),
    },
    referenceOrLoadNumber: { type: String, required: false, trim: true, maxlength: 120 },
  },
  { _id: false },
);

const safetyDetailsSchema = new Schema(
  {
    descriptionOfIncident: { type: String, required: true, trim: true, maxlength: 6000 },
  },
  { _id: false },
);

export const safetyInquirySchema = new Schema<Omit<SafetyInquiry, "category">>(
  {
    contact: { type: safetyContactSchema, required: true },
    incidentInformation: { type: safetyIncidentInformationSchema, required: false },
    details: { type: safetyDetailsSchema, required: true },
  },
  { _id: false },
);

/* ----------------------------- IT Support ----------------------------- */

const itSupportContactSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, required: false, trim: true, maxlength: 50 },
  },
  { _id: false },
);

const itSupportSystemInformationSchema = new Schema(
  {
    applicationOrSystem: {
      type: String,
      required: false,
      enum: Object.values(EITSupportApplicationSystem),
    },
    typeOfIssue: {
      type: String,
      required: false,
      enum: Object.values(EITSupportIssueType),
    },
    urgencyLevel: {
      type: String,
      required: false,
      enum: Object.values(EITSupportUrgencyLevel),
    },
  },
  { _id: false },
);

const itSupportDetailsSchema = new Schema(
  {
    message: { type: String, required: true, trim: true, maxlength: 6000 },
  },
  { _id: false },
);

export const itSupportInquirySchema = new Schema<Omit<ITSupportInquiry, "category">>(
  {
    contact: { type: itSupportContactSchema, required: true },
    systemInformation: { type: itSupportSystemInformationSchema, required: false },
    details: { type: itSupportDetailsSchema, required: true },
  },
  { _id: false },
);

/* ------------------------------- General ------------------------------- */

const generalContactSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, required: false, trim: true, maxlength: 50 },
    company: { type: String, required: false, trim: true, maxlength: 200 },
  },
  { _id: false },
);

const generalDetailsSchema = new Schema(
  {
    inquiryType: {
      type: String,
      required: false,
      enum: Object.values(EGeneralInquiryType),
    },
    message: { type: String, required: true, trim: true, maxlength: 6000 },
  },
  { _id: false },
);

export const generalInquirySchema = new Schema<Omit<GeneralInquiry, "category">>(
  {
    contact: { type: generalContactSchema, required: true },
    details: { type: generalDetailsSchema, required: true },
  },
  { _id: false },
);

/* ---------------------- Register inquiry discriminators ---------------------- */

export function registerContactInquiryDiscriminators() {
  const base: any = contactInquiryDetailsBaseSchema;

  if (!base.discriminators?.[EContactInquiryCategory.CUSTOMER_SALES]) {
    base.discriminator(EContactInquiryCategory.CUSTOMER_SALES, customerSalesInquirySchema);
  }

  if (!base.discriminators?.[EContactInquiryCategory.CARRIERS]) {
    base.discriminator(EContactInquiryCategory.CARRIERS, carrierInquirySchema);
  }

  if (!base.discriminators?.[EContactInquiryCategory.SAFETY]) {
    base.discriminator(EContactInquiryCategory.SAFETY, safetyInquirySchema);
  }

  if (!base.discriminators?.[EContactInquiryCategory.IT_SUPPORT]) {
    base.discriminator(EContactInquiryCategory.IT_SUPPORT, itSupportInquirySchema);
  }

  if (!base.discriminators?.[EContactInquiryCategory.GENERAL]) {
    base.discriminator(EContactInquiryCategory.GENERAL, generalInquirySchema);
  }
}
