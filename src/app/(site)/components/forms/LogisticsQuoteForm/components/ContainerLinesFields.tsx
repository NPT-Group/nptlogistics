// src/app/(site)/components/forms/LogisticsQuoteForm/components/ContainerLinesFields.tsx
"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Container } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { EOceanContainerType } from "@/types/logisticsQuote.types";
import { OCEAN_CONTAINER_TYPE_LABEL } from "@/lib/utils/enums/logisticsLabels";

import { NumberField } from "@/components/forms/fields/NumberField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { cn } from "@/lib/cn";

type Props = {
  name: "serviceDetails.containerLines" | `serviceDetails.${string}.containerLines`;
  fieldPathAttr?: string;
  title?: string;
  description?: string;
  itemLabel?: string;
  addLabel?: string;
};

export function ContainerLinesFields({
  name,
  fieldPathAttr,
  title = "Container lines",
  description = "Add each container requirement for this shipment.",
  itemLabel = "Container",
  addLabel = "Add container",
}: Props) {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  return (
    <section className="space-y-4" data-field-path={fieldPathAttr ?? name}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600">
              <Container className="h-3.5 w-3.5" />
            </span>

            <h4 className="text-sm font-semibold text-[color:var(--color-text-light)]">{title}</h4>
          </div>

          <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">{description}</p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              quantity: 0,
              containerType: undefined,
            } as any)
          }
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

              <div className="grid gap-4 md:grid-cols-2">
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

                <SelectField<LogisticsQuoteSubmitValues, EOceanContainerType>
                  control={control}
                  name={`${base}.containerType` as any}
                  fieldPathAttr={`${base}.containerType`}
                  label="Container type"
                  required
                  ui={siteTextUi}
                  placeholder="Select container type..."
                  options={Object.values(EOceanContainerType).map((value) => ({
                    value,
                    label: OCEAN_CONTAINER_TYPE_LABEL[value],
                  }))}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
