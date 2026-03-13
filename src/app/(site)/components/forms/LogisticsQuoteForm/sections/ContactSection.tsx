// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ContactSection.tsx
"use client";

import { useFormContext } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../schema";

import { TextField } from "@/components/forms/fields/TextField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { SelectField } from "@/components/forms/fields/SelectField";

import { EPreferredContactMethod } from "@/types/logisticsQuote.types";
import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { cn } from "@/lib/cn";

export function ContactSection() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">Contact</h3>
        <p className="text-sm text-[color:var(--color-muted-light)]">
          Share the best details for quote follow-up and coordination.
        </p>
      </div>

      {/* Card */}
      <div
        className={cn(
          "rounded-2xl border border-[color:var(--color-border-light)] bg-white p-4 sm:p-5",
          "space-y-6",
        )}
      >
        {/* Contact fields */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              control={control}
              name="contact.firstName"
              fieldPathAttr="contact.firstName"
              label="First name"
              required
              ui={siteTextUi}
              inputProps={{ autoComplete: "given-name" }}
            />

            <TextField
              control={control}
              name="contact.lastName"
              fieldPathAttr="contact.lastName"
              label="Last name"
              required
              ui={siteTextUi}
              inputProps={{ autoComplete: "family-name" }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              control={control}
              name="contact.email"
              fieldPathAttr="contact.email"
              label="Email"
              required
              ui={siteTextUi}
              inputProps={{
                type: "email",
                autoComplete: "email",
                placeholder: "you@company.com",
              }}
            />

            <PhoneField
              control={control}
              name="contact.phone"
              fieldPathAttr="contact.phone"
              label="Phone"
              ui={siteTextUi}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              control={control}
              name="contact.company"
              fieldPathAttr="contact.company"
              label="Company"
              required
              ui={siteTextUi}
              inputProps={{
                placeholder: "Company name",
                autoComplete: "organization",
              }}
            />

            <SelectField
              control={control}
              name="contact.preferredContactMethod"
              fieldPathAttr="contact.preferredContactMethod"
              label="Preferred contact method"
              ui={siteTextUi}
              placeholder="Select..."
              options={[
                { label: "Email", value: EPreferredContactMethod.EMAIL },
                { label: "Phone", value: EPreferredContactMethod.PHONE },
              ]}
            />
          </div>
        </div>

        <TextField
          control={control}
          name="contact.companyAddress"
          fieldPathAttr="contact.companyAddress"
          label="Business address"
          ui={siteTextUi}
          inputProps={{
            placeholder: "Street, City, Region, Postal, Country (optional)",
            autoComplete: "street-address",
          }}
        />
      </div>
    </section>
  );
}
