// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/AddonsSection.tsx
"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";

import {
  EFTLEquipmentType,
  ELTLAddon,
  ELogisticsPrimaryService,
  type EFTLAddon,
} from "@/types/logisticsQuote.types";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { getAllowedFtlAddons } from "../../helpers";

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
        "group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition",
        "hover:cursor-pointer hover:border-neutral-300 hover:bg-neutral-50",
        checked ? "border-black bg-neutral-50 ring-1 ring-black/10" : "border-neutral-200 bg-white",
        invalid && "border-red-300",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)]",
          checked && "opacity-100",
        )}
      />

      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-5 w-5 items-center justify-center rounded-md border transition",
          checked
            ? "border-black bg-black text-white shadow-sm"
            : "border-[color:var(--color-border-light)] bg-white text-transparent",
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>

      <span className="relative font-medium text-[color:var(--color-text-light)]">{label}</span>
    </button>
  );
}

export function AddonsSection() {
  const { control, setValue, formState } = useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({ control, name: "serviceDetails.primaryService" });

  const equipment = useWatch({
    control,
    name: "serviceDetails.equipment",
  }) as EFTLEquipmentType | undefined;

  const addons = useWatch({
    control,
    name: "serviceDetails.addons",
  }) as string[] | undefined;

  const error = (formState.errors.serviceDetails as any)?.addons?.message as string | undefined;

  const ftlAllowed = React.useMemo<readonly EFTLAddon[]>(() => {
    if (primaryService !== ELogisticsPrimaryService.FTL) return [];
    if (!equipment) return [];
    return getAllowedFtlAddons(equipment) as readonly EFTLAddon[];
  }, [primaryService, equipment]);

  const ftlAllowedSet = React.useMemo(() => new Set<string>(ftlAllowed), [ftlAllowed]);

  React.useEffect(() => {
    if (primaryService !== ELogisticsPrimaryService.FTL) return;
    if (!equipment) return;

    const cur = Array.isArray(addons) ? addons : [];
    const filtered = cur.filter((a) => ftlAllowedSet.has(a));

    if (filtered.length !== cur.length) {
      setValue("serviceDetails.addons" as any, filtered as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [primaryService, equipment, addons, ftlAllowedSet, setValue]);

  if (primaryService === ELogisticsPrimaryService.FTL) {
    if (!equipment) return null;

    return (
      <motion.section
        key={`ftl-addons-${equipment}`}
        data-field-path="serviceDetails.addons"
        aria-invalid={Boolean(error)}
        aria-describedby="serviceDetails.addons-error"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">Add-ons</h3>
          <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
            Select any optional services needed for this equipment.
          </p>

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
          key={`ftl-addons-list-${equipment}`}
          variants={pillsContainerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {ftlAllowed.map((addon) => {
            const checked = Array.isArray(addons) ? addons.includes(addon) : false;
            const label = (FTL_ADDON_LABEL as any)?.[addon] ?? addon.replaceAll("_", " ");

            return (
              <motion.div key={`${equipment}-${addon}`} variants={pillVariants}>
                <PillCheckbox
                  label={label}
                  checked={checked}
                  invalid={Boolean(error)}
                  onToggle={() => {
                    const nextArr = toggleInArray(
                      addons as EFTLAddon[] | undefined,
                      addon,
                      !checked,
                    );
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

  if (primaryService === ELogisticsPrimaryService.LTL) {
    const options = Object.values(ELTLAddon);

    return (
      <motion.section
        key="ltl-addons"
        data-field-path="serviceDetails.addons"
        aria-invalid={Boolean(error)}
        aria-describedby="serviceDetails.addons-error"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">Add-ons</h3>
          <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
            Optional handling and delivery requirements.
          </p>

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
          key="ltl-addons-list"
          variants={pillsContainerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {options.map((addon) => {
            const checked = Array.isArray(addons) ? addons.includes(addon) : false;
            const label = (LTL_ADDON_LABEL as any)?.[addon] ?? addon.replaceAll("_", " ");

            return (
              <motion.div key={`ltl-${addon}`} variants={pillVariants}>
                <PillCheckbox
                  label={label}
                  checked={checked}
                  invalid={Boolean(error)}
                  onToggle={() => {
                    const nextArr = toggleInArray(
                      addons as ELTLAddon[] | undefined,
                      addon,
                      !checked,
                    );
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

  return null;
}
