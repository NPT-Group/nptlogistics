// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/AddonsSection.tsx
"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";

import {
  EFTLEquipmentType,
  ELTLEquipmentType,
  ELogisticsPrimaryService,
} from "@/types/logisticsQuote.types";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { getAllowedFtlAddons, getAllowedLtlAddons } from "../../helpers";

import { FTL_ADDON_LABEL, LTL_ADDON_LABEL } from "@/lib/utils/enums/logisticsLabels";
import MultiSelectPillsField from "@/components/forms/fields/MultiSelectPillsField";
import { sitePillGroupUi } from "../../../presets/siteFieldUi";

export function AddonsSection() {
  const { control, setValue } = useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({ control, name: "serviceDetails.primaryService" });
  const equipment = useWatch({ control, name: "serviceDetails.equipment" });
  const addons = useWatch({
    control,
    name: "serviceDetails.addons",
  }) as string[] | undefined;

  const allowedOptions = React.useMemo(() => {
    if (primaryService === ELogisticsPrimaryService.FTL) {
      if (!equipment) return [];
      return getAllowedFtlAddons(equipment as EFTLEquipmentType);
    }

    if (primaryService === ELogisticsPrimaryService.LTL) {
      if (!equipment) return [];
      return getAllowedLtlAddons(equipment as ELTLEquipmentType);
    }

    return [];
  }, [primaryService, equipment]);

  const allowedSet = React.useMemo(() => new Set<string>(allowedOptions), [allowedOptions]);

  React.useEffect(() => {
    if (
      primaryService !== ELogisticsPrimaryService.FTL &&
      primaryService !== ELogisticsPrimaryService.LTL
    ) {
      return;
    }

    if (!equipment) return;

    const cur = Array.isArray(addons) ? addons : [];
    const filtered = cur.filter((a) => allowedSet.has(a));

    if (filtered.length !== cur.length) {
      setValue("serviceDetails.addons", filtered as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [primaryService, equipment, addons, allowedSet, setValue]);

  if (
    primaryService !== ELogisticsPrimaryService.FTL &&
    primaryService !== ELogisticsPrimaryService.LTL
  ) {
    return null;
  }

  if (!equipment) return null;

  const title = "Add-ons";
  const description =
    primaryService === ELogisticsPrimaryService.FTL
      ? "Select any optional services needed for this equipment."
      : "Select any optional handling and delivery requirements available for this equipment.";

  const options = allowedOptions.map((addon) => ({
    value: addon,
    label:
      primaryService === ELogisticsPrimaryService.FTL
        ? ((FTL_ADDON_LABEL as any)?.[addon] ?? String(addon).replaceAll("_", " "))
        : ((LTL_ADDON_LABEL as any)?.[addon] ?? String(addon).replaceAll("_", " ")),
  }));

  return (
    <motion.section
      key={`${primaryService.toLowerCase()}-addons-${String(equipment)}`}
      // Visible-first: keep add-ons section readable at first paint.
      initial={{ opacity: 1, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <MultiSelectPillsField
        control={control}
        name="serviceDetails.addons"
        label={title}
        hint={description}
        options={options}
        ui={sitePillGroupUi}
        fieldPathAttr="serviceDetails.addons"
      />
    </motion.section>
  );
}
