// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/LTLFields.tsx
"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EWeightUnit } from "@/types/logisticsQuote.types";

import { TextField } from "@/components/forms/fields/TextField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { SelectField } from "@/components/forms/fields/SelectField";

import { siteTextUi, siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { AddressFields } from "../../components/AddressFields";
import { LtlPalletLinesSection } from "./LtlPalletLinesSection";
import { ShipmentDetailsBlock } from "./ShipmentDetailsSection";

export function LTLFields() {
  const { control, setValue, clearErrors } = useFormContext<LogisticsQuoteSubmitValues>();

  const palletLines = useWatch({
    control,
    name: "serviceDetails.palletLines" as any,
  }) as any[];

  const safeLines = Array.isArray(palletLines) ? palletLines : [];

  const totalWeight = safeLines.reduce((sum, line) => {
    const q = Number(line?.quantity ?? 0);
    const w = Number(line?.weightValue ?? 0);
    return sum + q * w;
  }, 0);

  useEffect(() => {
    const fieldName = "serviceDetails.approximateTotalWeight.value" as any;

    setValue(fieldName, totalWeight, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });

    if (totalWeight > 0) {
      clearErrors(fieldName);
    }
  }, [setValue, clearErrors, totalWeight]);

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
        description="Provide the core freight details before listing pallets."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            control={control}
            name={"serviceDetails.commodityDescription" as any}
            fieldPathAttr="serviceDetails.commodityDescription"
            label="Commodity description"
            required
            ui={siteTextUi}
            inputProps={{ placeholder: "e.g., cartons, machinery parts..." }}
          />

          <TextField
            control={control}
            name={"serviceDetails.pickupDate" as any}
            fieldPathAttr="serviceDetails.pickupDate"
            label="Pickup date"
            required
            ui={siteTextUi}
            inputProps={{ type: "date" }}
          />
        </div>
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock
        title="Pallet details"
        description="Add each pallet type, quantity, dimensions, and weight."
      >
        <LtlPalletLinesSection />
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock
        title="Handling"
        description="Help us understand how the shipment should be quoted and loaded."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <NumberField
            control={control}
            name={"serviceDetails.approximateTotalWeight.value" as any}
            fieldPathAttr="serviceDetails.approximateTotalWeight.value"
            label="Approx. total weight"
            required
            ui={siteTextUi}
            inputProps={{
              disabled: true,
              placeholder: "Calculated automatically",
              className:
                "bg-neutral-100 text-neutral-500 border-neutral-200 cursor-not-allowed hover:border-neutral-200",
            }}
            hint="Calculated automatically from pallet quantities and pallet weights."
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

          <CheckboxField
            control={control}
            name={"serviceDetails.stackable" as any}
            fieldPathAttr="serviceDetails.stackable"
            label="Stackable"
            hint="Check if pallets can be safely stacked."
            ui={siteCheckUi}
          />

          <div className="grid gap-4"></div>
        </div>
      </ShipmentDetailsBlock>
    </div>
  );
}
