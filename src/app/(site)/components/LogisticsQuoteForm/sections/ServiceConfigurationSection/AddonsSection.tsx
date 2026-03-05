// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/AddonsSection.tsx
"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  EFTLEquipmentType,
  ELTLAddon,
  ELogisticsPrimaryService,
  type EFTLAddon,
} from "@/types/logisticsQuote.types";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { getAllowedFtlAddons } from "../../helpers";

import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

function toggleInArray<T extends string>(
  arr: T[] | undefined,
  value: T,
  nextChecked: boolean,
): T[] {
  const current = Array.isArray(arr) ? arr : [];
  if (nextChecked) return current.includes(value) ? current : [...current, value];
  return current.filter((x) => x !== value);
}

export function AddonsSection() {
  const { control, setValue } = useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({ control, name: "serviceDetails.primaryService" });

  const equipment = useWatch({
    control,
    name: "serviceDetails.equipment",
  }) as EFTLEquipmentType | undefined;

  const addons = useWatch({
    control,
    name: "serviceDetails.addons",
  }) as string[] | undefined;

  // Hooks MUST be unconditional
  const ftlAllowed = React.useMemo<readonly EFTLAddon[]>(() => {
    if (primaryService !== ELogisticsPrimaryService.FTL) return [];
    if (!equipment) return [];
    return getAllowedFtlAddons(equipment) as readonly EFTLAddon[];
  }, [primaryService, equipment]);

  const ftlAllowedSet = React.useMemo(() => new Set<string>(ftlAllowed), [ftlAllowed]);

  // Filter out incompatible FTL addons whenever equipment/allowed/addons changes
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

  // ---- Render branches (branching here is fine) ----

  if (primaryService === ELogisticsPrimaryService.FTL) {
    if (!equipment) return null;

    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-neutral-900">Add-ons</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Select any optional services needed for this equipment.
          </p>
        </div>

        <div className="space-y-2" data-field-path="serviceDetails.addons">
          {ftlAllowed.map((addon) => {
            const checked = Array.isArray(addons) ? addons.includes(addon) : false;

            return (
              <CheckboxField
                key={addon}
                ui={siteCheckUi}
                label={addon.replaceAll("_", " ")}
                checked={checked}
                onCheckedChange={(next) => {
                  const nextArr = toggleInArray(addons as EFTLAddon[] | undefined, addon, next);
                  setValue("serviceDetails.addons" as any, nextArr as any, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                fieldPathAttr="serviceDetails.addons"
              />
            );
          })}
        </div>
      </section>
    );
  }

  if (primaryService === ELogisticsPrimaryService.LTL) {
    const options = Object.values(ELTLAddon);

    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-neutral-900">Add-ons</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Optional handling and delivery requirements.
          </p>
        </div>

        <div className="space-y-2" data-field-path="serviceDetails.addons">
          {options.map((addon) => {
            const checked = Array.isArray(addons) ? addons.includes(addon) : false;

            return (
              <CheckboxField
                key={addon}
                ui={siteCheckUi}
                label={addon.replaceAll("_", " ")}
                checked={checked}
                onCheckedChange={(next) => {
                  const nextArr = toggleInArray(addons as ELTLAddon[] | undefined, addon, next);
                  setValue("serviceDetails.addons" as any, nextArr as any, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                fieldPathAttr="serviceDetails.addons"
              />
            );
          })}
        </div>
      </section>
    );
  }

  return null;
}
