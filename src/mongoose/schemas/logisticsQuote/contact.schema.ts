// src/mongoose/schemas/logisticsQuote/contact.schema.ts
import { Schema } from "mongoose";
import type { QuoteContact } from "@/types/logisticsQuote.types";
import { EPreferredContactMethod } from "@/types/logisticsQuote.types";

export const quoteContactSchema = new Schema<QuoteContact>(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 120 },
    lastName: { type: String, required: true, trim: true, maxlength: 120 },

    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    company: { type: String, required: true, trim: true, maxlength: 200 },

    phone: { type: String, required: false, trim: true, maxlength: 40 },
    preferredContactMethod: {
      type: String,
      required: false,
      enum: Object.values(EPreferredContactMethod),
    },

    companyAddress: { type: String, required: false, trim: true, maxlength: 400 },
  },
  { _id: false },
);
