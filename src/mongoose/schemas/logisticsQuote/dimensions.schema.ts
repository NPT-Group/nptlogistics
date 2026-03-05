// src/mongoose/schemas/logisticsQuote/dimensions.schema.ts
import { Schema } from "mongoose";
import type { LogisticsDimensions } from "@/types/logisticsQuote.types";

export const logisticsDimensionsSchema = new Schema<LogisticsDimensions>(
  {
    length: { type: Number, required: true, min: 0.01 },
    width: { type: Number, required: true, min: 0.01 },
    height: { type: Number, required: true, min: 0.01 },
  },
  { _id: false },
);
