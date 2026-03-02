// src/mongoose/schemas/logisticsQuote/weight.schema.ts
import { Schema } from "mongoose";
import type { LogisticsWeight } from "@/types/logisticsQuote.types";
import { EWeightUnit } from "@/types/logisticsQuote.types";

export const logisticsWeightSchema = new Schema<LogisticsWeight>(
  {
    value: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, enum: Object.values(EWeightUnit) },
  },
  { _id: false },
);
