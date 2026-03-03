// src/mongoose/models/LogisticsQuote.ts
import mongoose, { Model } from "mongoose";
import type { ILogisticsQuote } from "@/types/logisticsQuote.types";
import { logisticsQuoteSchema } from "@/mongoose/schemas/logisticsQuote.schema";

export const LogisticsQuoteModel: Model<ILogisticsQuote> =
  (mongoose.models.LogisticsQuote as Model<ILogisticsQuote>) ||
  mongoose.model<ILogisticsQuote>("LogisticsQuote", logisticsQuoteSchema);
