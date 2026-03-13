// src/app/(site)/components/forms/ContactForm/sections/GeneralSection.tsx
"use client";

import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/forms/fields/TextField";
import { SelectField, type SelectOption } from "@/components/forms/fields/SelectField";
import { TextAreaField } from "@/components/forms/fields/TextAreaField";
import { PhoneField } from "@/components/forms/fields/PhoneField";

import { GENERAL_INQUIRY_TYPE_LABEL } from "@/lib/utils/enums/contactLabels";
import { EGeneralInquiryType } from "@/types/contactInquiry.types";

import type { ContactFormSubmitValues } from "../schema";
import { siteTextUi, siteTextareaUi } from "../../presets/siteFieldUi";
import { Divider } from "../../components/Divider";

const generalInquiryTypeOptions: ReadonlyArray<SelectOption<EGeneralInquiryType>> = [
  {
    label: GENERAL_INQUIRY_TYPE_LABEL[EGeneralInquiryType.BUSINESS_PARTNERSHIP],
    value: EGeneralInquiryType.BUSINESS_PARTNERSHIP,
  },
  {
    label: GENERAL_INQUIRY_TYPE_LABEL[EGeneralInquiryType.VENDOR_SUPPLIER_INQUIRY],
    value: EGeneralInquiryType.VENDOR_SUPPLIER_INQUIRY,
  },
  {
    label: GENERAL_INQUIRY_TYPE_LABEL[EGeneralInquiryType.MEDIA_PRESS],
    value: EGeneralInquiryType.MEDIA_PRESS,
  },
  {
    label: GENERAL_INQUIRY_TYPE_LABEL[EGeneralInquiryType.GENERAL_QUESTION],
    value: EGeneralInquiryType.GENERAL_QUESTION,
  },
  {
    label: GENERAL_INQUIRY_TYPE_LABEL[EGeneralInquiryType.OTHER],
    value: EGeneralInquiryType.OTHER,
  },
];

export function GeneralSection() {
  const { control } = useFormContext<ContactFormSubmitValues>();

  return (
    <section className="space-y-6" aria-labelledby="contact-general-section-heading">
      <div className="space-y-1">
        <h3
          id="contact-general-section-heading"
          className="text-lg font-semibold tracking-[-0.02em] text-slate-950"
        >
          General inquiry details
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          Send partnership, media, vendor, or other general business inquiries to the team.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.fullName"
          label="Full name"
          required
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.fullName"
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
            placeholder: "jane@company.com",
            maxLength: 320,
          }}
        />

        <PhoneField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.phone"
          label="Phone"
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.phone"
          inputProps={{
            maxLength: 50,
          }}
        />

        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.company"
          label="Company"
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.company"
          inputProps={{
            autoComplete: "organization",
            placeholder: "Company name",
            maxLength: 200,
          }}
        />
      </div>

      <Divider className="py-1" lineClassName="w-full" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <SelectField<ContactFormSubmitValues, EGeneralInquiryType>
            control={control}
            name="inquiry.details.inquiryType"
            label="Inquiry type"
            ui={siteTextUi}
            fieldPathAttr="inquiry.details.inquiryType"
            options={generalInquiryTypeOptions}
            placeholder="Select inquiry type"
          />
        </div>

        <div className="md:col-span-2">
          <TextAreaField<ContactFormSubmitValues>
            control={control}
            name="inquiry.details.message"
            label="Message"
            required
            hint="Share the details of your request so the right team can route and respond appropriately."
            ui={siteTextareaUi}
            fieldPathAttr="inquiry.details.message"
            textareaProps={{
              placeholder: "Tell us about your inquiry, request, or business matter.",
              rows: 7,
              maxLength: 6000,
            }}
          />
        </div>
      </div>
    </section>
  );
}
