// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/WarehousingFields.tsx
"use client";

import { useFormContext } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EWarehousingDuration, EWarehousingVolumeType } from "@/types/logisticsQuote.types";

import { SelectField } from "@/components/forms/fields/SelectField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { AddressFields } from "../../components/AddressFields";
import { ShipmentDetailsBlock } from "./ShipmentDetailsSection";

export function WarehousingFields() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
    <div className="space-y-4">
      <ShipmentDetailsBlock
        title="Required location"
        description="Tell us where warehousing support is needed."
      >
        <AddressFields
          title="Required warehouse location"
          basePath="serviceDetails.requiredLocation"
        />
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock
        title="Storage requirements"
        description="Provide the expected volume and duration."
      >
        <div className="grid gap-4 md:grid-cols-3">
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
            disallowNegative
            disallowExponent
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
      </ShipmentDetailsBlock>
    </div>
  );
}
