// src/mongoose/schemas/logisticsQuote/warehousingVolume.schema.ts
import { Schema } from "mongoose";
import type { WarehousingVolume } from "@/types/logisticsQuote.types";
import { EWarehousingVolumeType } from "@/types/logisticsQuote.types";

export const warehousingVolumeSchema = new Schema<WarehousingVolume>(
  {
    volumeType: {
      type: String,
      required: true,
      enum: Object.values(EWarehousingVolumeType),
    },
    value: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  },
);
