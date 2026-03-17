// src/app/(site)/components/forms/LogisticsQuoteForm/sections/IdentificationSection.tsx
"use client";

import { useController, useFormContext } from "react-hook-form";
import { User, Briefcase, Building2, ShieldCheck } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { EBrokerType, ECustomerIdentity } from "@/types/logisticsQuote.types";
import { IconCardSelector, type IconCardOption } from "../components/IconCardSelector";
import { toCtaSlug, trackCtaClick } from "@/lib/analytics/cta";

const CUSTOMER_TYPE_OPTIONS: readonly IconCardOption<ECustomerIdentity>[] = [
  {
    value: ECustomerIdentity.SHIPPER,
    label: "Shipper",
    icon: Briefcase,
  },
  {
    value: ECustomerIdentity.BROKER,
    label: "Broker",
    icon: Building2,
  },
];

const BROKER_TYPE_OPTIONS: readonly IconCardOption<EBrokerType>[] = [
  {
    value: EBrokerType.FREIGHT_BROKER,
    label: "Freight broker",
    icon: Building2,
  },
  {
    value: EBrokerType.CUSTOMS_BROKER,
    label: "Customs broker",
    icon: ShieldCheck,
  },
  {
    value: EBrokerType.BOTH,
    label: "Both",
    icon: User,
  },
];

type SelectorFieldProps<T extends string> = {
  label: string;
  fieldPath: string;
  value?: T;
  onChange: (next: T) => void;
  onBlur: () => void;
  options: readonly IconCardOption<T>[];
  invalid?: boolean;
  error?: string;
  columnsClassName?: string;
  animateItems?: boolean;
  staggerDelay?: number;
  selectorKey?: string;
};

function SelectorField<T extends string>({
  label,
  fieldPath,
  value,
  onChange,
  onBlur,
  options,
  invalid,
  error,
  columnsClassName = "grid gap-2 sm:grid-cols-2",
  animateItems = false,
  staggerDelay = 0.045,
  selectorKey,
}: SelectorFieldProps<T>) {
  return (
    <section
      data-field-path={fieldPath}
      aria-invalid={invalid}
      aria-describedby={`${fieldPath}-error`}
      className="space-y-3"
    >
      <div>
        <h4 className="text-sm font-semibold text-[color:var(--color-text-light)]">{label}</h4>
      </div>

      <IconCardSelector<T>
        key={selectorKey}
        options={options}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={fieldPath}
        invalid={invalid}
        errorId={`${fieldPath}-error`}
        variant="detailed"
        align="left"
        columnsClassName={columnsClassName}
        animateItems={animateItems}
        staggerDelay={staggerDelay}
      />

      {error ? (
        <p id={`${fieldPath}-error`} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}

export function IdentificationSection() {
  const { control, setValue, clearErrors } = useFormContext<LogisticsQuoteSubmitValues>();

  const { field: identityField, fieldState: identityState } = useController({
    control,
    name: "identification.identity",
  });

  const { field: brokerTypeField, fieldState: brokerTypeState } = useController({
    control,
    name: "identification.brokerType",
  });

  const identity = identityField.value as ECustomerIdentity | undefined;
  const identityError = identityState.error?.message;
  const brokerTypeError = brokerTypeState.error?.message;

  function handleIdentityChange(next: ECustomerIdentity) {
    if (identity !== next) {
      trackCtaClick({
        ctaId: "quote_customer_type_selected",
        location: "logistics_quote_form_identification",
        label: toCtaSlug(String(next)),
      });
    }

    identityField.onChange(next);
    identityField.onBlur();

    if (next !== ECustomerIdentity.BROKER) {
      setValue("identification.brokerType", undefined, {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: true,
      });

      clearErrors("identification.brokerType");
    }
  }

  function handleBrokerTypeChange(next: EBrokerType) {
    if (brokerTypeField.value !== next) {
      trackCtaClick({
        ctaId: "quote_broker_type_selected",
        location: "logistics_quote_form_identification",
        label: toCtaSlug(String(next)),
      });
    }
    brokerTypeField.onChange(next);
    brokerTypeField.onBlur();
  }

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">
          Identification
        </h3>
        <p className="text-sm text-[color:var(--color-muted-light)]">
          Tell us who you are so we can route your quote correctly.
        </p>
      </div>

      <div className="space-y-4">
        <SelectorField<ECustomerIdentity>
          value={identity}
          onChange={handleIdentityChange}
          onBlur={identityField.onBlur}
          options={CUSTOMER_TYPE_OPTIONS}
          invalid={Boolean(identityError)}
          fieldPath="identification.identity"
          label="Customer type"
          error={identityError}
        />

        {identity === ECustomerIdentity.BROKER ? (
          <SelectorField<EBrokerType>
            value={brokerTypeField.value as EBrokerType | undefined}
            onChange={handleBrokerTypeChange}
            onBlur={brokerTypeField.onBlur}
            options={BROKER_TYPE_OPTIONS}
            invalid={Boolean(brokerTypeError)}
            fieldPath="identification.brokerType"
            label="Broker type"
            error={brokerTypeError}
            columnsClassName="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
            animateItems
            staggerDelay={0.03}
            selectorKey="broker-type-selector"
          />
        ) : null}
      </div>
    </section>
  );
}
