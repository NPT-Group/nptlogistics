// src/app/(site)/components/forms/ContactForm/sections/CustomerSalesSection.tsx
"use client";

import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/forms/fields/TextField";
import { SelectField, type SelectOption } from "@/components/forms/fields/SelectField";
import { TextAreaField } from "@/components/forms/fields/TextAreaField";
import { PhoneField } from "@/components/forms/fields/PhoneField";

import {
  CUSTOMER_SALES_INQUIRY_TYPE_LABEL,
  PREF_CONTACT_LABEL,
} from "@/lib/utils/enums/contactLabels";
import {
  ECustomerSalesInquiryType,
  EInquiryPreferredContactMethod,
} from "@/types/contactInquiry.types";

import type { ContactFormSubmitValues } from "../schema";
import { siteTextUi, siteTextareaUi } from "../../presets/siteFieldUi";
import { Divider } from "../../components/Divider";

const customerSalesInquiryTypeOptions: ReadonlyArray<SelectOption<ECustomerSalesInquiryType>> = [
  {
    label: CUSTOMER_SALES_INQUIRY_TYPE_LABEL[ECustomerSalesInquiryType.SHIPMENT_STATUS],
    value: ECustomerSalesInquiryType.SHIPMENT_STATUS,
  },
  {
    label: CUSTOMER_SALES_INQUIRY_TYPE_LABEL[ECustomerSalesInquiryType.BILLING_INVOICE_QUESTION],
    value: ECustomerSalesInquiryType.BILLING_INVOICE_QUESTION,
  },
  {
    label: CUSTOMER_SALES_INQUIRY_TYPE_LABEL[ECustomerSalesInquiryType.DOCUMENTATION_REQUEST],
    value: ECustomerSalesInquiryType.DOCUMENTATION_REQUEST,
  },
  {
    label: CUSTOMER_SALES_INQUIRY_TYPE_LABEL[ECustomerSalesInquiryType.SERVICE_QUESTION],
    value: ECustomerSalesInquiryType.SERVICE_QUESTION,
  },
  {
    label: CUSTOMER_SALES_INQUIRY_TYPE_LABEL[ECustomerSalesInquiryType.OTHER],
    value: ECustomerSalesInquiryType.OTHER,
  },
];

const preferredContactMethodOptions: ReadonlyArray<SelectOption<EInquiryPreferredContactMethod>> = [
  {
    label: PREF_CONTACT_LABEL[EInquiryPreferredContactMethod.EMAIL],
    value: EInquiryPreferredContactMethod.EMAIL,
  },
  {
    label: PREF_CONTACT_LABEL[EInquiryPreferredContactMethod.PHONE],
    value: EInquiryPreferredContactMethod.PHONE,
  },
  {
    label: PREF_CONTACT_LABEL[EInquiryPreferredContactMethod.EITHER],
    value: EInquiryPreferredContactMethod.EITHER,
  },
  {
    label: PREF_CONTACT_LABEL[EInquiryPreferredContactMethod.OTHER],
    value: EInquiryPreferredContactMethod.OTHER,
  },
];

export function CustomerSalesSection() {
  const { control } = useFormContext<ContactFormSubmitValues>();

  return (
    <section className="space-y-6" aria-labelledby="contact-customer-sales-section-heading">
      <div className="space-y-1">
        <h3
          id="contact-customer-sales-section-heading"
          className="text-lg font-semibold tracking-[-0.02em] text-slate-950"
        >
          Customer &amp; Sales inquiry details
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          Share your contact details and tell us how we can help.
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
          required
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.phone"
          inputProps={{
            maxLength: 50,
          }}
        />

        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.contact.companyName"
          label="Company name"
          ui={siteTextUi}
          fieldPathAttr="inquiry.contact.companyName"
          inputProps={{
            autoComplete: "organization",
            placeholder: "Company name",
            maxLength: 200,
          }}
        />

        <div className="md:col-span-2">
          <SelectField<ContactFormSubmitValues, EInquiryPreferredContactMethod>
            control={control}
            name="inquiry.details.preferredContactMethod"
            label="Preferred contact method"
            ui={siteTextUi}
            fieldPathAttr="inquiry.details.preferredContactMethod"
            options={preferredContactMethodOptions}
            placeholder="Select preferred contact method"
          />
        </div>
      </div>

      <Divider className="py-1" lineClassName="w-full" />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField<ContactFormSubmitValues, ECustomerSalesInquiryType>
          control={control}
          name="inquiry.details.inquiryType"
          label="Inquiry type"
          required
          ui={siteTextUi}
          fieldPathAttr="inquiry.details.inquiryType"
          options={customerSalesInquiryTypeOptions}
          placeholder="Select inquiry type"
        />

        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.details.loadOrReferenceNumber"
          label="Load or reference number"
          ui={siteTextUi}
          fieldPathAttr="inquiry.details.loadOrReferenceNumber"
          inputProps={{
            placeholder: "Load #, reference #, invoice #, etc.",
            maxLength: 120,
          }}
        />

        <div className="md:col-span-2">
          <TextAreaField<ContactFormSubmitValues>
            control={control}
            name="inquiry.details.message"
            label="Message"
            required
            hint="Provide as much detail as possible so the right team can respond quickly."
            ui={siteTextareaUi}
            fieldPathAttr="inquiry.details.message"
            textareaProps={{
              placeholder:
                "Tell us what you need help with, including any shipment, billing, service, or documentation details.",
              rows: 6,
              maxLength: 6000,
            }}
          />
        </div>
      </div>
    </section>
  );
}
