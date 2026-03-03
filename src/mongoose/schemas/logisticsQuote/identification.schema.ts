// src/mongoose/schemas/logisticsQuote/identification.schema.ts
import { Schema } from "mongoose";
import type { QuoteIdentification } from "@/types/logisticsQuote.types";
import { ECustomerIdentity, EBrokerType } from "@/types/logisticsQuote.types";

export const quoteIdentificationSchema = new Schema<QuoteIdentification>(
  {
    identity: {
      type: String,
      required: true,
      enum: Object.values(ECustomerIdentity),
    },
    brokerType: {
      type: String,
      required: false,
      enum: Object.values(EBrokerType),
    },
  },
  { _id: false },
);

quoteIdentificationSchema.pre("validate", function () {
  const id = this.identity;

  if (id === ECustomerIdentity.BROKER) {
    if (!this.brokerType) {
      throw new Error("brokerType is required when identity is BROKER.");
    }
  } else {
    if (this.brokerType) {
      throw new Error("brokerType must not be set when identity is not BROKER.");
    }
  }
});
