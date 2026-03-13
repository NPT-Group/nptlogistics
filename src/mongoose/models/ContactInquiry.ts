// src/mongoose/models/ContactInquiry.ts
import mongoose, { Model } from "mongoose";
import type { IContactInquiry } from "@/types/contactInquiry.types";
import { contactInquirySchema } from "@/mongoose/schemas/contactInquiry.schema";

export const ContactInquiryModel: Model<IContactInquiry> =
  (mongoose.models.ContactInquiry as Model<IContactInquiry>) ||
  mongoose.model<IContactInquiry>("ContactInquiry", contactInquirySchema);
