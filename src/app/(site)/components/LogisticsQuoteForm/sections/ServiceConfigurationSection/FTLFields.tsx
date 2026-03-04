// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/FTLFields.tsx
"use client";

import { useFormContext } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EWeightUnit } from "@/types/logisticsQuote.types";

import { TextField } from "@/components/forms/fields/TextField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";

import { siteTextUi, siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

export function FTLFields() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
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
        name={"serviceDetails.readyDate" as any}
        fieldPathAttr="serviceDetails.readyDate"
        label="Ready date"
        required
        ui={siteTextUi}
        inputProps={{ type: "date" }}
      />

      <NumberField
        control={control}
        name={"serviceDetails.approximateTotalWeight.value" as any}
        fieldPathAttr="serviceDetails.approximateTotalWeight.value"
        label="Approx. total weight"
        required
        ui={siteTextUi}
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
        inputProps={{ placeholder: "Optional" }}
      />

      <CheckboxField
        control={control}
        name={"serviceDetails.readyDateFlexible" as any}
        fieldPathAttr="serviceDetails.readyDateFlexible"
        label="Ready date is flexible"
        hint="Check if pickup date can move by 1–2 days."
        ui={siteCheckUi}
      />
    </div>
  );
}
