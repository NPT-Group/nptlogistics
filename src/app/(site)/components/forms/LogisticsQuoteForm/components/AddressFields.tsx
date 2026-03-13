// src/app/(site)/components/forms/LogisticsQuoteForm/components/AddressFields.tsx
"use client";

import type { ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MapPin } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { TextField } from "@/components/forms/fields/TextField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { ALL_COUNTRIES, NORTH_AMERICAN_COUNTRIES } from "@/config/countries";
import { ELogisticsPrimaryService } from "@/types/logisticsQuote.types";

type Props = {
  title: ReactNode;
  basePath:
    | "serviceDetails.origin"
    | "serviceDetails.destination"
    | "serviceDetails.requiredLocation";
};

export function AddressFields({ title, basePath }: Props) {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({
    control,
    name: "serviceDetails.primaryService",
  });

  const countryOptions =
    primaryService === ELogisticsPrimaryService.INTERNATIONAL
      ? ALL_COUNTRIES
      : NORTH_AMERICAN_COUNTRIES;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600">
          <MapPin className="h-3.5 w-3.5" />
        </span>

        <div>
          <h4 className="text-sm font-semibold text-[color:var(--color-text-light)]">{title}</h4>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name={`${basePath}.street1` as any}
            fieldPathAttr={`${basePath}.street1`}
            label="Street address"
            required
            ui={siteTextUi}
            inputProps={{ placeholder: "Street address" }}
          />

          <TextField
            control={control}
            name={`${basePath}.street2` as any}
            fieldPathAttr={`${basePath}.street2`}
            label="Address line 2"
            ui={siteTextUi}
            inputProps={{ placeholder: "Suite, unit, dock, etc. (optional)" }}
          />

          <TextField
            control={control}
            name={`${basePath}.city` as any}
            fieldPathAttr={`${basePath}.city`}
            label="City"
            required
            ui={siteTextUi}
          />

          <TextField
            control={control}
            name={`${basePath}.region` as any}
            fieldPathAttr={`${basePath}.region`}
            label="State / province"
            required
            ui={siteTextUi}
          />

          <TextField
            control={control}
            name={`${basePath}.postalCode` as any}
            fieldPathAttr={`${basePath}.postalCode`}
            label="Postal / ZIP code"
            required
            ui={siteTextUi}
          />

          <SelectField<LogisticsQuoteSubmitValues>
            control={control}
            name={`${basePath}.countryCode` as any}
            fieldPathAttr={`${basePath}.countryCode`}
            label="Country"
            required
            ui={siteTextUi}
            placeholder="Select country..."
            options={countryOptions.map((country) => ({
              label: country.name,
              value: country.code,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
