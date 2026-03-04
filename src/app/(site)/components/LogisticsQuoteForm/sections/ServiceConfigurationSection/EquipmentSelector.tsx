// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/EquipmentSelector.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { EFTLEquipmentType, ELogisticsPrimaryService } from "@/types/logisticsQuote.types";
import type { LogisticsQuoteSubmitValues } from "../../schema";

import { SelectField } from "@/components/forms/fields/SelectField";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

export function EquipmentSelector() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({ control, name: "serviceDetails.primaryService" });
  if (primaryService !== ELogisticsPrimaryService.FTL) return null;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-neutral-900">Equipment type</h3>
        <p className="mt-1 text-sm text-neutral-600">Select the truck equipment required.</p>
      </div>

      <SelectField<LogisticsQuoteSubmitValues, EFTLEquipmentType>
        control={control}
        name={"serviceDetails.equipment" as any}
        fieldPathAttr="serviceDetails.equipment"
        label="Equipment"
        required
        ui={siteTextUi}
        placeholder="Select equipment..."
        options={Object.values(EFTLEquipmentType).map((eq) => ({
          label: eq.replaceAll("_", " "),
          value: eq,
        }))}
      />
    </section>
  );
}
