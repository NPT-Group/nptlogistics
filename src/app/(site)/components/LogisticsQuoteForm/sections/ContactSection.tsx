// src/app/(site)/components/LogisticsQuoteForm/sections/ContactSection.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Mail } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";

import { TextField } from "@/components/forms/fields/TextField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { SelectField } from "@/components/forms/fields/SelectField";

import { EPreferredContactMethod } from "@/types/logisticsQuote.types";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

export function ContactSection() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)]">
          <Mail className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-semibold text-[color:var(--color-text-light)]">Contact</h2>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          control={control}
          name="contact.company"
          label="Company"
          required
          ui={siteTextUi}
          inputProps={{ placeholder: "Company name" }}
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

      <TextField
        control={control}
        name="contact.companyAddress"
        label="Company address"
        ui={siteTextUi}
        inputProps={{
          placeholder: "Street, City, Region, Postal, Country (optional)",
          autoComplete: "organization",
        }}
      />
    </section>
  );
}
