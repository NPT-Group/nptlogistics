// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/FTLFields.tsx
"use client";

import { useFormContext } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EWeightUnit } from "@/types/logisticsQuote.types";

import { TextField } from "@/components/forms/fields/TextField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";

import { siteTextUi, siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { AddressFields } from "../../components/AddressFields";
import { ShipmentDetailsBlock } from "./ShipmentDetailsSection";

export function FTLFields() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
    <div className="space-y-4">
      <ShipmentDetailsBlock
        title="Locations"
        description="Tell us where the shipment is picking up and delivering."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="min-w-0">
            <AddressFields title="Origin" basePath="serviceDetails.origin" />
          </div>

          <div className="min-w-0">
            <AddressFields title="Destination" basePath="serviceDetails.destination" />
          </div>
        </div>
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock
        title="Shipment information"
        description="Share the main cargo details needed for pricing and planning."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            control={control}
            name={"serviceDetails.commodityDescription" as any}
            fieldPathAttr="serviceDetails.commodityDescription"
            label="Commodity description"
            required
            ui={siteTextUi}
            inputProps={{ placeholder: "e.g., steel coils, packaged goods..." }}
          />

          <NumberField
            control={control}
            name={"serviceDetails.approximateTotalWeight.value" as any}
            fieldPathAttr="serviceDetails.approximateTotalWeight.value"
            label="Approx. total weight"
            required
            ui={siteTextUi}
            disallowNegative
            disallowExponent
            inputProps={{ placeholder: "e.g., 38000" }}
          />

          <SelectField<LogisticsQuoteSubmitValues, EWeightUnit>
            control={control}
            name={"serviceDetails.approximateTotalWeight.unit" as any}
            fieldPathAttr="serviceDetails.approximateTotalWeight.unit"
            label="Weight unit"
            required
            ui={siteTextUi}
            placeholder="Select unit..."
            options={[
              { label: "LB", value: EWeightUnit.LB },
              { label: "KG", value: EWeightUnit.KG },
            ]}
          />

          <NumberField
            control={control}
            name={"serviceDetails.estimatedPalletCount" as any}
            fieldPathAttr="serviceDetails.estimatedPalletCount"
            label="Estimated pallet count"
            ui={siteTextUi}
            disallowNegative
            disallowExponent
            inputProps={{ placeholder: "Optional" }}
          />
        </div>
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock
        title="Scheduling"
        description="Tell us when the shipment is ready for pickup."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            control={control}
            name={"serviceDetails.pickupDate" as any}
            fieldPathAttr="serviceDetails.pickupDate"
            label="Pickup date"
            required
            ui={siteTextUi}
            inputProps={{ type: "date" }}
          />

          <div className="md:pt-[1.625rem]">
            <CheckboxField
              control={control}
              name={"serviceDetails.pickupDateFlexible" as any}
              fieldPathAttr="serviceDetails.pickupDateFlexible"
              label="Pickup date is flexible"
              ui={siteCheckUi}
            />
          </div>
        </div>
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock
        title="Shipment dimensions"
        description="Optional. Add overall shipment dimensions if available."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <NumberField
            control={control}
            name={"serviceDetails.dimensions.length" as any}
            fieldPathAttr="serviceDetails.dimensions.length"
            label="Length"
            disallowNegative
            disallowExponent
            ui={siteTextUi}
          />

          <NumberField
            control={control}
            name={"serviceDetails.dimensions.width" as any}
            fieldPathAttr="serviceDetails.dimensions.width"
            label="Width"
            disallowNegative
            disallowExponent
            ui={siteTextUi}
          />

          <NumberField
            control={control}
            name={"serviceDetails.dimensions.height" as any}
            fieldPathAttr="serviceDetails.dimensions.height"
            label="Height"
            disallowNegative
            disallowExponent
            ui={siteTextUi}
          />
        </div>
      </ShipmentDetailsBlock>
    </div>
  );
}
