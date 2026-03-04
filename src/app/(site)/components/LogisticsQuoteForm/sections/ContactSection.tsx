// src/app/(site)/components/LogisticsQuoteForm/sections/ContactSection.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Mail, MapPin, Building2 } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { EMPTY_ADDRESS } from "../defaults";

import { TextField } from "@/components/forms/fields/TextField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";

import { EPreferredContactMethod } from "@/types/logisticsQuote.types";
import { siteTextUi, siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

export function ContactSection() {
  const { control, setValue, getValues, clearErrors } =
    useFormContext<LogisticsQuoteSubmitValues>();

  const companyAddress = useWatch({ control, name: "contact.companyAddress" });
  const hasCompanyAddress = !!companyAddress;

  function toggleCompanyAddress(next: boolean) {
    if (next) {
      const existing = getValues("contact.companyAddress");
      setValue("contact.companyAddress", existing ?? { ...EMPTY_ADDRESS }, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } else {
      setValue("contact.companyAddress", undefined, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      clearErrors("contact.companyAddress");
    }
  }

  return (
    <section className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Mail className="h-5 w-5 text-neutral-700" />
        <h2 className="text-lg font-semibold text-neutral-900">Contact</h2>
      </div>

      {/* Name */}
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          control={control}
          name="contact.firstName"
          label="First name"
          required
          ui={siteTextUi}
        />
        <TextField
          control={control}
          name="contact.lastName"
          label="Last name"
          required
          ui={siteTextUi}
        />
      </div>

      {/* Email / Phone */}
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          control={control}
          name="contact.email"
          label="Email"
          required
          ui={siteTextUi}
          inputProps={{
            type: "email",
            autoComplete: "email",
            placeholder: "you@company.com",
          }}
        />
        <PhoneField control={control} name="contact.phone" label="Phone" ui={siteTextUi} />
      </div>

      {/* Company */}
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          control={control}
          name="contact.company"
          label="Company"
          required
          ui={siteTextUi}
          inputProps={{
            placeholder: "Company name",
          }}
        />

        <SelectField
          control={control}
          name="contact.preferredContactMethod"
          label="Preferred contact method"
          ui={siteTextUi}
          options={[
            { label: "Email", value: EPreferredContactMethod.EMAIL },
            { label: "Phone", value: EPreferredContactMethod.PHONE },
          ]}
        />
      </div>

      {/* Toggle: Company Address */}
      <div
        className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
        data-field-path="contact.companyAddress"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
              <Building2 className="h-4 w-4 text-neutral-700" />
              Company address (optional)
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              Provide your company address if you’d like it included in the quote details.
            </p>
          </div>

          {/* We intentionally do NOT bind this checkbox to contact.companyAddress (object).
              It’s a UI toggle that materializes/removes the optional object. */}
          <CheckboxField
            checked={hasCompanyAddress}
            onCheckedChange={toggleCompanyAddress}
            label="Include company address"
            hint="Optional. Helps us prepare accurate quotes."
            ui={siteCheckUi}
            fieldPathAttr="contact.companyAddress"
          />
        </div>
      </div>

      {/* Address block */}
      {hasCompanyAddress ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
            <MapPin className="h-4 w-4" />
            Company Address
          </div>

          <TextField
            control={control}
            name="contact.companyAddress.street1"
            label="Street address"
            ui={siteTextUi}
          />
          <TextField
            control={control}
            name="contact.companyAddress.street2"
            label="Address line 2"
            ui={siteTextUi}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              control={control}
              name="contact.companyAddress.city"
              label="City"
              ui={siteTextUi}
            />
            <TextField
              control={control}
              name="contact.companyAddress.region"
              label="State / Province"
              ui={siteTextUi}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              control={control}
              name="contact.companyAddress.postalCode"
              label="Postal / ZIP code"
              ui={siteTextUi}
            />
            <TextField
              control={control}
              name="contact.companyAddress.countryCode"
              label="Country code"
              ui={siteTextUi}
              inputProps={{ placeholder: "CA", maxLength: 2 }}
            />
          </div>
        </div>
      ) : null}

      {/* NOTE:
          The CheckboxField component is RHF-controlled by design.
          For UI-only toggles like this, the cleanest approach is either:
          1) Use a plain <input type="checkbox" ...> (recommended),
          OR
          2) Create a dedicated Toggle component that doesn’t require RHF control.

          If you want, I can provide a tiny `UiCheckbox` component that matches styling
          (siteCheckUi) but does not bind to RHF, to avoid the `as any` hack above.
      */}
    </section>
  );
}
