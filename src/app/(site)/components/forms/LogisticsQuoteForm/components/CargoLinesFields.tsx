// src/app/(site)/components/forms/LogisticsQuoteForm/components/CargoLinesFields.tsx
"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2, Boxes } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { EDimensionUnit, EWeightUnit } from "@/types/logisticsQuote.types";
import { DIMENSION_UNIT_LABEL, WEIGHT_UNIT_LABEL } from "@/lib/utils/enums/logisticsLabels";

import { NumberField } from "@/components/forms/fields/NumberField";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { cn } from "@/lib/cn";

type Props = {
  name:
    | "serviceDetails.cargoLines"
    | `serviceDetails.${string}.cargoLines`;
  fieldPathAttr?: string;
  title: string;
  description: string;
  itemLabel: string;
  addLabel: string;
  emptyItem?: {
    quantity: number;
    length: number;
    width: number;
    height: number;
    weightPerUnit: number;
  };
  weightUnitPath: "serviceDetails.weightUnit";
  dimensionUnitPath: "serviceDetails.dimensionUnit";
};

export function CargoLinesFields({
  name,
  fieldPathAttr,
  title,
  description,
  itemLabel,
  addLabel,
  weightUnitPath,
  dimensionUnitPath,
  emptyItem = {
    quantity: 0,
    length: 0,
    width: 0,
    height: 0,
    weightPerUnit: 0,
  },
}: Props) {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  const weightUnit = useWatch({
    control,
    name: weightUnitPath as any,
  }) as EWeightUnit | undefined;

  const dimensionUnit = useWatch({
    control,
    name: dimensionUnitPath as any,
  }) as EDimensionUnit | undefined;

  const weightLabel = weightUnit ? WEIGHT_UNIT_LABEL[weightUnit] : WEIGHT_UNIT_LABEL[EWeightUnit.LB];
  const dimensionLabel = dimensionUnit
    ? DIMENSION_UNIT_LABEL[dimensionUnit]
    : DIMENSION_UNIT_LABEL[EDimensionUnit.IN];

  return (
    <section className="space-y-4" data-field-path={fieldPathAttr ?? name}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600">
              <Boxes className="h-3.5 w-3.5" />
            </span>

            <h4 className="text-sm font-semibold text-[color:var(--color-text-light)]">{title}</h4>
          </div>

          <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => append({ ...emptyItem } as any)}
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-neutral-900 transition",
            "hover:border-neutral-300 hover:bg-neutral-50",
          )}
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const base = `${name}.${index}`;

          return (
            <div key={field.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[color:var(--color-text-light)]">
                  {itemLabel} {index + 1}
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
                  name={`${base}.weightPerUnit` as any}
                  fieldPathAttr={`${base}.weightPerUnit`}
                  label={`Weight per unit (${weightLabel})`}
                  required
                  ui={siteTextUi}
                  disallowNegative
                  disallowExponent
                  inputProps={{ min: 0, step: "any" }}
                />

                <NumberField
                  control={control}
                  name={`${base}.length` as any}
                  fieldPathAttr={`${base}.length`}
                  label={`Length (${dimensionLabel})`}
                  required
                  ui={siteTextUi}
                  disallowNegative
                  disallowExponent
                  inputProps={{ min: 0, step: "any" }}
                />

                <NumberField
                  control={control}
                  name={`${base}.width` as any}
                  fieldPathAttr={`${base}.width`}
                  label={`Width (${dimensionLabel})`}
                  required
                  ui={siteTextUi}
                  disallowNegative
                  disallowExponent
                  inputProps={{ min: 0, step: "any" }}
                />

                <NumberField
                  control={control}
                  name={`${base}.height` as any}
                  fieldPathAttr={`${base}.height`}
                  label={`Height (${dimensionLabel})`}
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
