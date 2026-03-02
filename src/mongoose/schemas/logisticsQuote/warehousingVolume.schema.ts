// src/mongoose/schemas/logisticsQuote/warehousingVolume.schema.ts
import { Schema } from "mongoose";
import type { WarehousingVolume } from "@/types/logisticsQuote.types";

type AnyWarehousingVolume = WarehousingVolume;

export const warehousingVolumeBaseSchema = new Schema<AnyWarehousingVolume>(
  {
    type: { type: String, required: true, enum: ["PALLET_COUNT", "SQUARE_FOOTAGE"] },
  },
  {
    _id: false,
    discriminatorKey: "type",
    strict: "throw",
  },
);

export const warehousingVolumePalletCountSchema = new Schema<AnyWarehousingVolume>(
  {
    type: { type: String, required: true, enum: ["PALLET_COUNT"] },
    palletCount: { type: Number, required: true, min: 1 },
  },
  {
    _id: false,
    strict: "throw",
  },
);

export const warehousingVolumeSquareFootageSchema = new Schema<AnyWarehousingVolume>(
  {
    type: { type: String, required: true, enum: ["SQUARE_FOOTAGE"] },
    squareFeet: { type: Number, required: true, min: 1 },
  },
  {
    _id: false,
    strict: "throw",
  },
);
