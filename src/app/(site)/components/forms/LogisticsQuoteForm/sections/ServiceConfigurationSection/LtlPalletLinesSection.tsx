// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/LtlPalletLinesSection.tsx
"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EWeightUnit } from "@/types/logisticsQuote.types";

import { NumberField } from "@/components/forms/fields/NumberField";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { cn } from "@/lib/cn";

export function LtlPalletLinesSection() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceDetails.palletLines" as any,
  });

  const weightUnit = useWatch({
    control,
    name: "serviceDetails.approximateTotalWeight.unit" as any,
  }) as EWeightUnit | undefined;

  const unitLabel = weightUnit || EWeightUnit.LB;

  return (
    <section className="space-y-4" data-field-path="serviceDetails.palletLines">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-[color:var(--color-text-light)]">
            Pallet lines
          </h4>

          <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
            Add each pallet line with quantity, dimensions, and weight. All pallet weights use the
            selected shipment unit ({unitLabel}).
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              quantity: 0,
              dimensions: { length: 0, width: 0, height: 0 },
              weightValue: 0,
            } as any)
          }
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-neutral-900 transition",
            "hover:border-neutral-300 hover:bg-neutral-50",
          )}
        >
          <Plus className="h-4 w-4" />
          Add pallet
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const base = `serviceDetails.palletLines.${index}`;

          return (
            <div key={field.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[color:var(--color-text-light)]">
                  Pallet {index + 1}
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium whitespace-nowrap text-neutral-900 transition",
                      "hover:border-neutral-300 hover:bg-neutral-50",
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <NumberField
                  control={control}
                  name={`${base}.quantity` as any}
                  fieldPathAttr={`${base}.quantity`}
                  label="Quantity"
                  required
                  ui={siteTextUi}
                  disallowNegative
                  disallowExponent
                  inputProps={{ min: 0, step: 1 }}
                />

                <NumberField
                  control={control}
                  name={`${base}.weightValue` as any}
                  fieldPathAttr={`${base}.weightValue`}
                  label={`Weight (${unitLabel})`}
                  required
                  ui={siteTextUi}
                  disallowNegative
                  disallowExponent
                  inputProps={{ min: 0, step: "any" }}
                />

                <NumberField
                  control={control}
                  name={`${base}.dimensions.length` as any}
                  fieldPathAttr={`${base}.dimensions.length`}
                  label="Length"
                  required
                  ui={siteTextUi}
                  disallowNegative
                  disallowExponent
                  inputProps={{ min: 0, step: "any" }}
                />

                <NumberField
                  control={control}
                  name={`${base}.dimensions.width` as any}
                  fieldPathAttr={`${base}.dimensions.width`}
                  label="Width"
                  required
                  ui={siteTextUi}
                  disallowNegative
                  disallowExponent
                  inputProps={{ min: 0, step: "any" }}
                />

                <NumberField
                  control={control}
                  name={`${base}.dimensions.height` as any}
                  fieldPathAttr={`${base}.dimensions.height`}
                  label="Height"
                  required
                  ui={siteTextUi}
                  disallowNegative
                  disallowExponent
                  inputProps={{ min: 0, step: "any" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
