// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/AddonsSection.tsx
"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";

import {
  EFTLEquipmentType,
  ELTLEquipmentType,
  ELogisticsPrimaryService,
} from "@/types/logisticsQuote.types";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { getAllowedFtlAddons, getAllowedLtlAddons } from "../../helpers";

import { cn } from "@/lib/cn";
import { FTL_ADDON_LABEL, LTL_ADDON_LABEL } from "@/lib/utils/enums/logisticsLabels";

function toggleInArray<T extends string>(
  arr: T[] | undefined,
  value: T,
  nextChecked: boolean,
): T[] {
  const current = Array.isArray(arr) ? arr : [];
  if (nextChecked) return current.includes(value) ? current : [...current, value];
  return current.filter((x) => x !== value);
}

const pillsContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.015,
    },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
} satisfies Variants;

function PillCheckbox({
  label,
  checked,
  onToggle,
  invalid,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  invalid?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border px-3.5 py-2 text-sm transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
        "hover:cursor-pointer",
        checked
          ? cn(
              "border-neutral-200 bg-neutral-50/60",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
            )
          : cn("border-neutral-200 bg-white", "hover:border-neutral-300 hover:bg-neutral-50/80"),
        invalid && !checked && "border-red-300",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
          checked
            ? "border-[color:var(--color-brand-600)] text-white"
            : "border-neutral-200 bg-white text-transparent group-hover:border-neutral-300",
        )}
        style={
          checked
            ? {
                background: "linear-gradient(180deg, rgba(239,68,68,1) 0%, rgba(220,38,38,1) 100%)",
              }
            : undefined
        }
      >
        <Check className="h-3 w-3" strokeWidth={2.75} />
      </span>

      <span className="relative font-medium text-[color:var(--color-text-light)]">{label}</span>
    </button>
  );
}

export function AddonsSection() {
  const { control, setValue, formState } = useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({ control, name: "serviceDetails.primaryService" });
  const equipment = useWatch({ control, name: "serviceDetails.equipment" });
  const addons = useWatch({
    control,
    name: "serviceDetails.addons",
  }) as string[] | undefined;

  const error = (formState.errors.serviceDetails as any)?.addons?.message as string | undefined;

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
      setValue("serviceDetails.addons" as any, filtered as any, {
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

  return (
    <motion.section
      key={`${primaryService.toLowerCase()}-addons-${String(equipment)}`}
      data-field-path="serviceDetails.addons"
      aria-invalid={Boolean(error)}
      aria-describedby="serviceDetails.addons-error"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">{title}</h3>
        <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">{description}</p>

        {error ? (
          <div
            id="serviceDetails.addons-error"
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>{error}</div>
          </div>
        ) : null}
      </div>

      <motion.div
        key={`${primaryService.toLowerCase()}-addons-list-${String(equipment)}`}
        variants={pillsContainerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2"
      >
        {allowedOptions.map((addon) => {
          const checked = Array.isArray(addons) ? addons.includes(addon) : false;
          const label =
            primaryService === ELogisticsPrimaryService.FTL
              ? ((FTL_ADDON_LABEL as any)?.[addon] ?? String(addon).replaceAll("_", " "))
              : ((LTL_ADDON_LABEL as any)?.[addon] ?? String(addon).replaceAll("_", " "));

          return (
            <motion.div key={`${primaryService}-${equipment}-${addon}`} variants={pillVariants}>
              <PillCheckbox
                label={label}
                checked={checked}
                invalid={Boolean(error)}
                onToggle={() => {
                  const nextArr = toggleInArray(addons as any[] | undefined, addon, !checked);
                  setValue("serviceDetails.addons" as any, nextArr as any, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
