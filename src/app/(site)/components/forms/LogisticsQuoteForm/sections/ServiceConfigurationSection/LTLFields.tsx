// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/LTLFields.tsx
"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EDimensionUnit, EWeightUnit } from "@/types/logisticsQuote.types";

import { TextField } from "@/components/forms/fields/TextField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { SelectField } from "@/components/forms/fields/SelectField";

import { siteTextUi, siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { AddressFields } from "../../components/AddressFields";
import { CargoLinesFields } from "../../components/CargoLinesFields";
import { ShipmentDetailsBlock } from "./ShipmentDetailsSection";

export function LTLFields() {
  const { control, setValue, clearErrors } = useFormContext<LogisticsQuoteSubmitValues>();

  const cargoLines = useWatch({
    control,
    name: "serviceDetails.cargoLines" as any,
  }) as
    | Array<{
        quantity?: number;
        weightPerUnit?: number;
      }>
    | undefined;

  const safeLines = Array.isArray(cargoLines) ? cargoLines : [];

  const totalWeight = safeLines.reduce((sum, line) => {
    const q = Number(line?.quantity ?? 0);
    const w = Number(line?.weightPerUnit ?? 0);
    return sum + q * w;
  }, 0);

  useEffect(() => {
    const fieldName = "serviceDetails.approximateTotalWeight" as any;

    setValue(fieldName, totalWeight > 0 ? totalWeight : undefined, {
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

          <SelectField<LogisticsQuoteSubmitValues, EWeightUnit>
            control={control}
            name={"serviceDetails.weightUnit" as any}
            fieldPathAttr="serviceDetails.weightUnit"
            label="Weight unit"
            required
            ui={siteTextUi}
            placeholder="Select unit..."
            options={[
              { label: "LB", value: EWeightUnit.LB },
              { label: "KG", value: EWeightUnit.KG },
            ]}
          />

          <SelectField<LogisticsQuoteSubmitValues, EDimensionUnit>
            control={control}
            name={"serviceDetails.dimensionUnit" as any}
            fieldPathAttr="serviceDetails.dimensionUnit"
            label="Dimension unit"
            required
            ui={siteTextUi}
            placeholder="Select unit..."
            options={[
              { label: "IN", value: EDimensionUnit.IN },
              { label: "CM", value: EDimensionUnit.CM },
            ]}
          />
        </div>

        <div className="mt-4">
          <CheckboxField
            control={control}
            name={"serviceDetails.stackable" as any}
            fieldPathAttr="serviceDetails.stackable"
            label="Stackable"
            ui={siteCheckUi}
          />
        </div>
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock>
        <CargoLinesFields
          name="serviceDetails.cargoLines"
          fieldPathAttr="serviceDetails.cargoLines"
          title="Pallet lines"
          description="Add each pallet line with quantity, dimensions, and weight per unit. All pallet weights and dimensions use the shipment units selected above."
          itemLabel="Pallet"
          addLabel="Add pallet"
          weightUnitPath="serviceDetails.weightUnit"
          dimensionUnitPath="serviceDetails.dimensionUnit"
        />

        <div className="mt-4 max-w-md">
          <NumberField
            control={control}
            name={"serviceDetails.approximateTotalWeight" as any}
            fieldPathAttr="serviceDetails.approximateTotalWeight"
            label="Approx. total weight"
            required
            ui={siteTextUi}
            inputProps={{
              disabled: true,
              placeholder: "Calculated automatically",
              className:
                "bg-neutral-100 text-neutral-500 border-neutral-200 cursor-not-allowed hover:border-neutral-200",
            }}
            hint="Calculated automatically from pallet quantities and weights."
          />
        </div>
      </ShipmentDetailsBlock>
    </div>
  );
}
