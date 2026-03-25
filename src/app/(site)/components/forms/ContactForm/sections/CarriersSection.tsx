// src/app/(site)/components/forms/ContactForm/sections/CarriersSection.tsx
"use client";

import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/forms/fields/TextField";
import { SelectField, type SelectOption } from "@/components/forms/fields/SelectField";
import { TextAreaField } from "@/components/forms/fields/TextAreaField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import MultiSelectPillsField, {
  type MultiSelectPillOption,
} from "@/components/forms/fields/MultiSelectPillsField";

import {
  CARRIER_INQUIRY_TYPE_LABEL,
  CARRIER_REGION_LABEL,
  CARRIER_TRAILER_TYPE_LABEL,
} from "@/lib/utils/enums/contactLabels";
import {
  ECarrierInquiryType,
  ECarrierOperatingRegion,
  ECarrierTrailerType,
} from "@/types/contactInquiry.types";

import type { ContactFormSubmitValues } from "../schema";
import { sitePillGroupUi, siteTextUi, siteTextareaUi } from "../../presets/siteFieldUi";
import { Divider } from "../../components/Divider";

const carrierInquiryTypeOptions: ReadonlyArray<SelectOption<ECarrierInquiryType>> = [
  {
    label: CARRIER_INQUIRY_TYPE_LABEL[ECarrierInquiryType.LOAD_OPPORTUNITIES],
    value: ECarrierInquiryType.LOAD_OPPORTUNITIES,
  },
  {
    label: CARRIER_INQUIRY_TYPE_LABEL[ECarrierInquiryType.CARRIER_SETUP_ONBOARDING],
    value: ECarrierInquiryType.CARRIER_SETUP_ONBOARDING,
  },
  {
    label: CARRIER_INQUIRY_TYPE_LABEL[ECarrierInquiryType.PAYMENT_INVOICE_QUESTION],
    value: ECarrierInquiryType.PAYMENT_INVOICE_QUESTION,
  },
  {
    label: CARRIER_INQUIRY_TYPE_LABEL[ECarrierInquiryType.SAFETY_CONCERN],
    value: ECarrierInquiryType.SAFETY_CONCERN,
  },
  {
    label: CARRIER_INQUIRY_TYPE_LABEL[ECarrierInquiryType.OTHER],
    value: ECarrierInquiryType.OTHER,
  },
];

const trailerTypeOptions: ReadonlyArray<SelectOption<ECarrierTrailerType>> = [
  {
    label: CARRIER_TRAILER_TYPE_LABEL[ECarrierTrailerType.DRY_VAN],
    value: ECarrierTrailerType.DRY_VAN,
  },
  {
    label: CARRIER_TRAILER_TYPE_LABEL[ECarrierTrailerType.REEFER],
    value: ECarrierTrailerType.REEFER,
  },
  {
    label: CARRIER_TRAILER_TYPE_LABEL[ECarrierTrailerType.FLATBED],
    value: ECarrierTrailerType.FLATBED,
  },
  {
    label: CARRIER_TRAILER_TYPE_LABEL[ECarrierTrailerType.STEP_DECK],
    value: ECarrierTrailerType.STEP_DECK,
  },
  {
    label: CARRIER_TRAILER_TYPE_LABEL[ECarrierTrailerType.RGN_LOWBOY],
    value: ECarrierTrailerType.RGN_LOWBOY,
  },
  {
    label: CARRIER_TRAILER_TYPE_LABEL[ECarrierTrailerType.CONESTOGA],
    value: ECarrierTrailerType.CONESTOGA,
  },
  {
    label: CARRIER_TRAILER_TYPE_LABEL[ECarrierTrailerType.OTHER],
    value: ECarrierTrailerType.OTHER,
  },
];

const operatingRegionOptions: MultiSelectPillOption<ECarrierOperatingRegion>[] = [
  {
    label: CARRIER_REGION_LABEL[ECarrierOperatingRegion.CANADA],
    value: ECarrierOperatingRegion.CANADA,
  },
  {
    label: CARRIER_REGION_LABEL[ECarrierOperatingRegion.UNITED_STATES],
    value: ECarrierOperatingRegion.UNITED_STATES,
  },
  {
    label: CARRIER_REGION_LABEL[ECarrierOperatingRegion.MEXICO],
    value: ECarrierOperatingRegion.MEXICO,
  },
  {
    label: CARRIER_REGION_LABEL[ECarrierOperatingRegion.OTHER],
    value: ECarrierOperatingRegion.OTHER,
  },
];

export function CarriersSection() {
  const { control } = useFormContext<ContactFormSubmitValues>();

  return (
    <section className="space-y-6" aria-labelledby="contact-carriers-section-heading">
      <div className="space-y-1">
        <h3
          id="contact-carriers-section-heading"
          className="text-lg font-semibold tracking-[-0.02em] text-slate-950"
        >
          Carrier inquiry details
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          Share your carrier information and tell us what you need help with. Already registered?{" "}
          <a
            href="https://nptlogisticscarriers.rmissecure.com/_s/reg/GeneralRequirementsV2.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-900 underline hover:text-slate-700"
          >
            Log in to the carrier portal
          </a>
          .
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.contactName"
          label="Contact name"
          required
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.contactName"
          inputProps={{
            autoComplete: "name",
            placeholder: "Jane Doe",
            maxLength: 200,
          }}
        />

        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.email"
          label="Email"
          required
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.email"
          inputProps={{
            type: "email",
            inputMode: "email",
            autoComplete: "email",
            placeholder: "dispatch@carrier.com",
            maxLength: 320,
          }}
        />

        <PhoneField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.phone"
          label="Phone"
          required
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.phone"
          inputProps={{
            maxLength: 50,
          }}
        />

        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.carrierCompanyName"
          label="Carrier company name"
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.carrierCompanyName"
          inputProps={{
            autoComplete: "organization",
            placeholder: "ABC Transport Ltd.",
            maxLength: 200,
          }}
        />

        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.dotNumber"
          label="DOT number"
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.dotNumber"
          inputProps={{
            placeholder: "DOT number",
            maxLength: 60,
          }}
        />

        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.mcNumber"
          label="MC number"
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.mcNumber"
          inputProps={{
            placeholder: "MC number",
            maxLength: 60,
          }}
        />
      </div>

      <Divider className="py-1" lineClassName="w-full" />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField<ContactFormSubmitValues, ECarrierInquiryType>
          control={control}
          name="inquiry.details.inquiryType"
          label="Inquiry type"
          required
          ui={siteTextUi}
          fieldPathAttr="inquiry.details.inquiryType"
          options={carrierInquiryTypeOptions}
          placeholder="Select inquiry type"
        />

        <SelectField<ContactFormSubmitValues, ECarrierTrailerType>
          control={control}
          name="inquiry.equipmentInformation.trailerType"
          label="Trailer type"
          ui={siteTextUi}
          fieldPathAttr="inquiry.equipmentInformation.trailerType"
          options={trailerTypeOptions}
          placeholder="Select trailer type"
        />

        <div className="md:col-span-2">
          <MultiSelectPillsField<ContactFormSubmitValues, ECarrierOperatingRegion>
            control={control}
            name="inquiry.details.operatingRegions"
            label="Operating regions"
            hint="Select all regions that apply."
            options={operatingRegionOptions}
            ui={sitePillGroupUi}
            fieldPathAttr="inquiry.details.operatingRegions"
            animateItems={false}
          />
        </div>

        <div className="md:col-span-2">
          <TextAreaField<ContactFormSubmitValues>
            control={control}
            name="inquiry.details.message"
            label="Message"
            required
            hint="Include any onboarding, lane, equipment, payment, or capacity details that will help the team route your request."
            ui={siteTextareaUi}
            fieldPathAttr="inquiry.details.message"
            textareaProps={{
              placeholder:
                "Tell us about your request, preferred lanes, equipment, payment question, onboarding need, or any other carrier-related details.",
              rows: 6,
              maxLength: 6000,
            }}
          />
        </div>
      </div>
    </section>
  );
}
