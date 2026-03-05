// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/LTLFields.tsx
"use client";

import { useFormContext } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EWeightUnit } from "@/types/logisticsQuote.types";

import { TextField } from "@/components/forms/fields/TextField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { SelectField } from "@/components/forms/fields/SelectField";

import { siteTextUi, siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

export function LTLFields() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
    <div className="space-y-6">
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
          name={"serviceDetails.readyDate" as any}
          fieldPathAttr="serviceDetails.readyDate"
          label="Ready date"
          required
          ui={siteTextUi}
          inputProps={{ type: "date" }}
        />
      </div>

      <CheckboxField
        control={control}
        name={"serviceDetails.stackable" as any}
        fieldPathAttr="serviceDetails.stackable"
        label="Stackable"
        hint="Check if pallets can be safely stacked."
        ui={siteCheckUi}
      />

      {/* Optional total weight (LTL) */}
      <div className="grid gap-4 md:grid-cols-2">
        <NumberField
          control={control}
          name={"serviceDetails.approximateTotalWeight.value" as any}
          fieldPathAttr="serviceDetails.approximateTotalWeight.value"
          label="Approx. total weight (optional)"
          ui={siteTextUi}
        />

        <SelectField<LogisticsQuoteSubmitValues, EWeightUnit>
          control={control}
          name={"serviceDetails.approximateTotalWeight.unit" as any}
          fieldPathAttr="serviceDetails.approximateTotalWeight.unit"
          label="Weight unit"
          ui={siteTextUi}
          placeholder="Select unit..."
          options={[
            { label: "LB", value: EWeightUnit.LB },
            { label: "KG", value: EWeightUnit.KG },
          ]}
        />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
        Pallet lines UI (quantity + dimensions + optional weight per line) is best handled with a
        dedicated FieldArray component. If you want, I’ll drop that next.
      </div>
    </div>
  );
}
