// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/EquipmentSelector.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import {
  Truck,
  Snowflake,
  RectangleHorizontal,
  Construction,
  Tent,
  AlertTriangle,
} from "lucide-react";

import { EFTLEquipmentType, ELogisticsPrimaryService } from "@/types/logisticsQuote.types";
import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EQUIPMENT_LABEL } from "@/lib/utils/enums/logisticsLabels";
import { IconCardSelector, type IconCardOption } from "../../components/IconCardSelector";

const EQUIPMENT_CARDS: readonly IconCardOption<EFTLEquipmentType>[] = [
  {
    value: EFTLEquipmentType.DRY_VAN,
    label: EQUIPMENT_LABEL[EFTLEquipmentType.DRY_VAN],
    icon: Truck,
  },
  {
    value: EFTLEquipmentType.REEFER,
    label: EQUIPMENT_LABEL[EFTLEquipmentType.REEFER],
    icon: Snowflake,
  },
  {
    value: EFTLEquipmentType.FLATBED,
    label: EQUIPMENT_LABEL[EFTLEquipmentType.FLATBED],
    icon: RectangleHorizontal,
  },
  {
    value: EFTLEquipmentType.RGN_LOWBOY,
    label: EQUIPMENT_LABEL[EFTLEquipmentType.RGN_LOWBOY],
    icon: Construction,
  },
  {
    value: EFTLEquipmentType.CONESTOGA,
    label: EQUIPMENT_LABEL[EFTLEquipmentType.CONESTOGA],
    icon: Tent,
  },
];

export function EquipmentSelector() {
  const { control, setValue, getValues, clearErrors, formState } =
    useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({ control, name: "serviceDetails.primaryService" });

  const selected = useWatch({
    control,
    name: "serviceDetails.equipment",
  }) as EFTLEquipmentType | undefined;

  const error = (formState.errors.serviceDetails as any)?.equipment?.message as string | undefined;

  if (primaryService !== ELogisticsPrimaryService.FTL) return null;

  function choose(next: EFTLEquipmentType) {
    const prev = getValues("serviceDetails.equipment" as any) as EFTLEquipmentType | undefined;
    if (prev === next) return;

    setValue("serviceDetails.equipment" as any, next as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    clearErrors("serviceDetails.equipment" as any);
  }

  return (
    <section
      data-field-path="serviceDetails.equipment"
      aria-invalid={Boolean(error)}
      aria-describedby="serviceDetails.equipment-error"
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">
          Equipment type
        </h3>
        <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
          Select the truck equipment required.
        </p>

        {error ? (
          <div
            id="serviceDetails.equipment-error"
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>{error}</div>
          </div>
        ) : null}
      </div>

      <IconCardSelector<EFTLEquipmentType>
        options={EQUIPMENT_CARDS}
        value={selected}
        onChange={choose}
        invalid={Boolean(error)}
        errorId="serviceDetails.equipment-error"
        name="serviceDetails.equipment"
        variant="secondary"
        columnsClassName="grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5"
        animateItems
        staggerDelay={0.04}
      />
    </section>
  );
}
