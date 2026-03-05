// src/mongoose/schemas/logisticsQuote/address.schema.ts
import { Schema } from "mongoose";
import type { LogisticsAddress } from "@/types/logisticsQuote.types";

export const logisticsAddressSchema = new Schema<LogisticsAddress>(
  {
    street1: { type: String, required: true, trim: true, maxlength: 200 },
    street2: { type: String, required: false, trim: true, maxlength: 200 },

    city: { type: String, required: true, trim: true, maxlength: 120 },
    region: { type: String, required: true, trim: true, maxlength: 120 }, // State/Province
    postalCode: { type: String, required: true, trim: true, maxlength: 40 },

    // ISO-2 (CA/US/MX/etc). Service-specific validation is enforced in service schemas.
    countryCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
    },
  },
  { _id: false },
);
