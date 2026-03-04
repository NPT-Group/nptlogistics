// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/WarehousingFields.tsx
"use client";

import { useFormContext } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EWarehousingDuration, EWarehousingVolumeType } from "@/types/logisticsQuote.types";

import { SelectField } from "@/components/forms/fields/SelectField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

export function WarehousingFields() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SelectField<LogisticsQuoteSubmitValues, EWarehousingVolumeType>
        control={control}
        name={"serviceDetails.estimatedVolume.volumeType" as any}
        fieldPathAttr="serviceDetails.estimatedVolume.volumeType"
        label="Volume type"
        required
        ui={siteTextUi}
        placeholder="Select volume type..."
        options={[
          { label: "Pallet count", value: EWarehousingVolumeType.PALLET_COUNT },
          { label: "Square footage", value: EWarehousingVolumeType.SQUARE_FOOTAGE },
        ]}
      />

      <NumberField
        control={control}
        name={"serviceDetails.estimatedVolume.value" as any}
        fieldPathAttr="serviceDetails.estimatedVolume.value"
        label="Estimated volume"
        required
        ui={siteTextUi}
      />

      <SelectField<LogisticsQuoteSubmitValues, EWarehousingDuration>
        control={control}
        name={"serviceDetails.expectedDuration" as any}
        fieldPathAttr="serviceDetails.expectedDuration"
        label="Expected duration"
        required
        ui={siteTextUi}
        placeholder="Select duration..."
        options={[
          { label: "Short term", value: EWarehousingDuration.SHORT_TERM },
          { label: "Long term / ongoing", value: EWarehousingDuration.LONG_TERM_ONGOING },
        ]}
      />
    </div>
  );
}
