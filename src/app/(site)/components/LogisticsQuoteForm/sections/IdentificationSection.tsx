// src/app/(site)/components/LogisticsQuoteForm/sections/IdentificationSection.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { User, Briefcase, Building2 } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { EBrokerType, ECustomerIdentity } from "@/types/logisticsQuote.types";

import { RadioGroupField } from "@/components/forms/fields/RadioGroupField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { siteCheckUi, siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

export function IdentificationSection() {
  const { control, watch } = useFormContext<LogisticsQuoteSubmitValues>();

  const identity = watch("identification.identity");

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-neutral-900">Identification</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Tell us who you are so we can route your quote correctly.
        </p>
      </div>

      <div className="space-y-5">
        <RadioGroupField<LogisticsQuoteSubmitValues, ECustomerIdentity>
          control={control}
          name={"identification.identity"}
          fieldPathAttr="identification.identity"
          legend={
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer type
            </span>
          }
          required
          ui={siteCheckUi}
          options={[
            {
              label: (
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Shipper
                </span>
              ),
              value: ECustomerIdentity.SHIPPER,
              hint: "You are the shipper (the freight owner / sender).",
            },
            {
              label: (
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Broker
                </span>
              ),
              value: ECustomerIdentity.BROKER,
              hint: "You arrange shipments on behalf of a shipper.",
            },
          ]}
        />

        {identity === ECustomerIdentity.BROKER ? (
          <SelectField<LogisticsQuoteSubmitValues, EBrokerType>
            control={control}
            name={"identification.brokerType"}
            fieldPathAttr="identification.brokerType"
            label="Broker type"
            required
            ui={siteTextUi}
            placeholder="Select broker type..."
            options={[
              { label: "Freight broker", value: EBrokerType.FREIGHT_BROKER },
              { label: "Customs broker", value: EBrokerType.CUSTOMS_BROKER },
              { label: "Both", value: EBrokerType.BOTH },
            ]}
            hint="Required if you selected Broker."
          />
        ) : null}
      </div>
    </section>
  );
}
