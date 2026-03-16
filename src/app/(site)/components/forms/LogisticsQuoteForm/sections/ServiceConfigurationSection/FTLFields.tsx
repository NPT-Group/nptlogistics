// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/FTLFields.tsx
"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EDimensionUnit, EWeightUnit } from "@/types/logisticsQuote.types";

import { TextField } from "@/components/forms/fields/TextField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";

import { siteTextUi, siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { AddressFields } from "../../components/AddressFields";
import { ShipmentDetailsBlock } from "./ShipmentDetailsSection";

export function FTLFields() {
  const { control, setValue, clearErrors } = useFormContext<LogisticsQuoteSubmitValues>();

  const dimensions = useWatch({
    control,
    name: "serviceDetails.dimensions" as any,
  }) as
    | {
        length?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
      }
    | undefined;

  const dimensionUnit = useWatch({
    control,
    name: "serviceDetails.dimensionUnit" as any,
  }) as EDimensionUnit | undefined;

  const dimensionsEnabled = Boolean(dimensions || dimensionUnit);

  const handleDimensionsToggle = React.useCallback(
    (next: boolean) => {
      if (next) {
        setValue(
          "serviceDetails.dimensions" as any,
          {
            length: undefined,
            width: undefined,
            height: undefined,
          },
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: false,
          },
        );

        setValue("serviceDetails.dimensionUnit" as any, undefined, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: false,
        });

        clearErrors([
          "serviceDetails.dimensions",
          "serviceDetails.dimensions.length",
          "serviceDetails.dimensions.width",
          "serviceDetails.dimensions.height",
          "serviceDetails.dimensionUnit",
        ] as any);
        return;
      }

      setValue("serviceDetails.dimensions" as any, undefined, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });

      setValue("serviceDetails.dimensionUnit" as any, undefined, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });

      clearErrors([
        "serviceDetails.dimensions",
        "serviceDetails.dimensions.length",
        "serviceDetails.dimensions.width",
        "serviceDetails.dimensions.height",
        "serviceDetails.dimensionUnit",
      ] as any);
    },
    [setValue, clearErrors],
  );

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

          <TextField
            control={control}
            name={"serviceDetails.pickupDate" as any}
            fieldPathAttr="serviceDetails.pickupDate"
            label="Pickup date"
            required
            ui={siteTextUi}
            inputProps={{ type: "date" }}
          />

          <NumberField
            control={control}
            name={"serviceDetails.approximateTotalWeight" as any}
            fieldPathAttr="serviceDetails.approximateTotalWeight"
            label="Approx. total weight"
            required
            ui={siteTextUi}
            disallowNegative
            disallowExponent
            inputProps={{ placeholder: "e.g., 38000" }}
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

          <NumberField
            control={control}
            name={"serviceDetails.estimatedPalletCount" as any}
            fieldPathAttr="serviceDetails.estimatedPalletCount"
            label="Estimated pallet count"
            ui={siteTextUi}
            disallowNegative
            disallowExponent
            inputProps={{ placeholder: "Optional", min: 1, step: 1 }}
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
        <div className="space-y-4">
          <CheckboxField
            checked={dimensionsEnabled}
            onCheckedChange={handleDimensionsToggle}
            label="Include shipment dimensions"
            hint="Enable this if you want to provide overall shipment dimensions for quoting."
            ui={siteCheckUi}
          />

          {dimensionsEnabled ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <NumberField
                control={control}
                name={"serviceDetails.dimensions.length" as any}
                fieldPathAttr="serviceDetails.dimensions.length"
                label="Length"
                required
                disallowNegative
                disallowExponent
                ui={siteTextUi}
                inputProps={{ min: 0, step: "any" }}
              />

              <NumberField
                control={control}
                name={"serviceDetails.dimensions.width" as any}
                fieldPathAttr="serviceDetails.dimensions.width"
                label="Width"
                required
                disallowNegative
                disallowExponent
                ui={siteTextUi}
                inputProps={{ min: 0, step: "any" }}
              />

              <NumberField
                control={control}
                name={"serviceDetails.dimensions.height" as any}
                fieldPathAttr="serviceDetails.dimensions.height"
                label="Height"
                required
                disallowNegative
                disallowExponent
                ui={siteTextUi}
                inputProps={{ min: 0, step: "any" }}
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
          ) : null}
        </div>
      </ShipmentDetailsBlock>
    </div>
  );
}
