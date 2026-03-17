// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/EquipmentSelector.tsx
"use client";

import { useController, useFormContext, useWatch } from "react-hook-form";
import {
  Truck,
  Snowflake,
  RectangleHorizontal,
  Construction,
  Tent,
  AlertTriangle,
  Layers,
} from "lucide-react";

import {
  EFTLEquipmentType,
  ELTLEquipmentType,
  ELogisticsPrimaryService,
} from "@/types/logisticsQuote.types";
import type { LogisticsQuoteSubmitValues } from "../../schema";
import { FTL_EQUIPMENT_LABEL, LTL_EQUIPMENT_LABEL } from "@/lib/utils/enums/logisticsLabels";
import { IconCardSelector, type IconCardOption } from "../../components/IconCardSelector";
import { toCtaSlug, trackCtaClick } from "@/lib/analytics/cta";

const FTL_EQUIPMENT_CARDS: readonly IconCardOption<EFTLEquipmentType>[] = [
  {
    value: EFTLEquipmentType.DRY_VAN,
    label: FTL_EQUIPMENT_LABEL[EFTLEquipmentType.DRY_VAN],
    icon: Truck,
  },
  {
    value: EFTLEquipmentType.REEFER,
    label: FTL_EQUIPMENT_LABEL[EFTLEquipmentType.REEFER],
    icon: Snowflake,
  },
  {
    value: EFTLEquipmentType.FLATBED,
    label: FTL_EQUIPMENT_LABEL[EFTLEquipmentType.FLATBED],
    icon: RectangleHorizontal,
  },
  {
    value: EFTLEquipmentType.STEP_DECK,
    label: FTL_EQUIPMENT_LABEL[EFTLEquipmentType.STEP_DECK],
    icon: RectangleHorizontal,
  },
  {
    value: EFTLEquipmentType.RGN_LOWBOY,
    label: FTL_EQUIPMENT_LABEL[EFTLEquipmentType.RGN_LOWBOY],
    icon: Construction,
  },
  {
    value: EFTLEquipmentType.CONESTOGA,
    label: FTL_EQUIPMENT_LABEL[EFTLEquipmentType.CONESTOGA],
    icon: Tent,
  },
];

const LTL_EQUIPMENT_CARDS: readonly IconCardOption<ELTLEquipmentType>[] = [
  {
    value: ELTLEquipmentType.DRY_VAN,
    label: LTL_EQUIPMENT_LABEL[ELTLEquipmentType.DRY_VAN],
    icon: Truck,
  },
  {
    value: ELTLEquipmentType.FLATBED,
    label: LTL_EQUIPMENT_LABEL[ELTLEquipmentType.FLATBED],
    icon: RectangleHorizontal,
  },
  {
    value: ELTLEquipmentType.STEP_DECK,
    label: LTL_EQUIPMENT_LABEL[ELTLEquipmentType.STEP_DECK],
    icon: Layers,
  },
  {
    value: ELTLEquipmentType.CONESTOGA,
    label: LTL_EQUIPMENT_LABEL[ELTLEquipmentType.CONESTOGA],
    icon: Tent,
  },
];

export function EquipmentSelector() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({
    control,
    name: "serviceDetails.primaryService",
  });

  const { field, fieldState } = useController({
    control,
    name: "serviceDetails.equipment" as any,
  });

  const selected = field.value as EFTLEquipmentType | ELTLEquipmentType | undefined;
  const error = fieldState.error?.message;

  if (
    primaryService !== ELogisticsPrimaryService.FTL &&
    primaryService !== ELogisticsPrimaryService.LTL
  ) {
    return null;
  }

  function choose(next: EFTLEquipmentType | ELTLEquipmentType) {
    if (field.value === next) return;

    trackCtaClick({
      ctaId: "quote_equipment_selected",
      location:
        primaryService === ELogisticsPrimaryService.FTL
          ? "logistics_quote_form_ftl_equipment"
          : "logistics_quote_form_ltl_equipment",
      label: toCtaSlug(String(next)),
    });

    field.onChange(next);
    field.onBlur();
  }

  const options =
    primaryService === ELogisticsPrimaryService.FTL ? FTL_EQUIPMENT_CARDS : LTL_EQUIPMENT_CARDS;

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
          Select the equipment required for this shipment.
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

      <IconCardSelector<any>
        options={options as any}
        value={selected as any}
        onChange={choose as any}
        onBlur={field.onBlur}
        invalid={Boolean(error)}
        errorId="serviceDetails.equipment-error"
        name={field.name}
        variant="secondary"
        columnsClassName="grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5"
        animateItems
        staggerDelay={0.04}
      />
    </section>
  );
}
