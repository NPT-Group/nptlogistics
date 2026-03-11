// src/mongoose/schemas/logisticsQuote.schema.ts
import { Schema } from "mongoose";
import type { ILogisticsQuote } from "@/types/logisticsQuote.types";

import {
  quoteServiceDetailsBaseSchema,
  registerServiceDetailsDiscriminators,
} from "./logisticsQuote/serviceDetails.schema";
import { quoteIdentificationSchema } from "./logisticsQuote/identification.schema";
import { quoteContactSchema } from "./logisticsQuote/contact.schema";
import { fileAssetSchema } from "./sharedSchemas";

registerServiceDetailsDiscriminators();

export const logisticsQuoteSchema = new Schema<ILogisticsQuote>(
  {
    quoteId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    serviceDetails: { type: quoteServiceDetailsBaseSchema, required: true },

    identification: { type: quoteIdentificationSchema, required: true },
    contact: { type: quoteContactSchema, required: true },

    finalNotes: { type: String, required: false, trim: true, maxlength: 6000 },

    attachments: {
      type: [fileAssetSchema],
      required: false,
      default: [],
      validate: {
        validator: (v: unknown[]) => Array.isArray(v) && v.length <= 10,
        message: "attachments cannot contain more than 10 files",
      },
    },

    marketingEmailConsent: { type: Boolean, required: false, default: false },

    // Derived in backend.
    crossBorder: { type: Boolean, required: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Helpful indexes
logisticsQuoteSchema.index({ "serviceDetails.primaryService": 1, createdAt: -1 });
logisticsQuoteSchema.index({ "contact.email": 1, createdAt: -1 });
logisticsQuoteSchema.index({ "contact.company": 1 });
