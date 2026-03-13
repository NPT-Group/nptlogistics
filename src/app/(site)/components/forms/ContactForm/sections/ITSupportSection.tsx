// src/app/(site)/components/forms/ContactForm/sections/ITSupportSection.tsx
"use client";

import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/forms/fields/TextField";
import { SelectField, type SelectOption } from "@/components/forms/fields/SelectField";
import { TextAreaField } from "@/components/forms/fields/TextAreaField";
import { PhoneField } from "@/components/forms/fields/PhoneField";

import {
  IT_SUPPORT_APPLICATION_LABEL,
  IT_SUPPORT_ISSUE_TYPE_LABEL,
  IT_SUPPORT_URGENCY_LABEL,
} from "@/lib/utils/enums/contactLabels";
import {
  EITSupportApplicationSystem,
  EITSupportIssueType,
  EITSupportUrgencyLevel,
} from "@/types/contactInquiry.types";

import type { ContactFormSubmitValues } from "../schema";
import { siteTextUi, siteTextareaUi } from "../../presets/siteFieldUi";
import { Divider } from "../../components/Divider";

const applicationOptions: ReadonlyArray<SelectOption<EITSupportApplicationSystem>> = [
  {
    label: IT_SUPPORT_APPLICATION_LABEL[EITSupportApplicationSystem.CUSTOMER_PORTAL],
    value: EITSupportApplicationSystem.CUSTOMER_PORTAL,
  },
  {
    label: IT_SUPPORT_APPLICATION_LABEL[EITSupportApplicationSystem.CARRIER_PORTAL],
    value: EITSupportApplicationSystem.CARRIER_PORTAL,
  },
  {
    label: IT_SUPPORT_APPLICATION_LABEL[EITSupportApplicationSystem.WEBSITE],
    value: EITSupportApplicationSystem.WEBSITE,
  },
  {
    label: IT_SUPPORT_APPLICATION_LABEL[EITSupportApplicationSystem.OTHER],
    value: EITSupportApplicationSystem.OTHER,
  },
];

const issueTypeOptions: ReadonlyArray<SelectOption<EITSupportIssueType>> = [
  {
    label: IT_SUPPORT_ISSUE_TYPE_LABEL[EITSupportIssueType.LOGIN_PROBLEM],
    value: EITSupportIssueType.LOGIN_PROBLEM,
  },
  {
    label: IT_SUPPORT_ISSUE_TYPE_LABEL[EITSupportIssueType.ACCOUNT_ACCESS_ISSUE],
    value: EITSupportIssueType.ACCOUNT_ACCESS_ISSUE,
  },
  {
    label: IT_SUPPORT_ISSUE_TYPE_LABEL[EITSupportIssueType.SYSTEM_ERROR],
    value: EITSupportIssueType.SYSTEM_ERROR,
  },
  {
    label: IT_SUPPORT_ISSUE_TYPE_LABEL[EITSupportIssueType.FEATURE_REQUEST],
    value: EITSupportIssueType.FEATURE_REQUEST,
  },
  {
    label: IT_SUPPORT_ISSUE_TYPE_LABEL[EITSupportIssueType.OTHER],
    value: EITSupportIssueType.OTHER,
  },
];

const urgencyOptions: ReadonlyArray<SelectOption<EITSupportUrgencyLevel>> = [
  {
    label: IT_SUPPORT_URGENCY_LABEL[EITSupportUrgencyLevel.LOW],
    value: EITSupportUrgencyLevel.LOW,
  },
  {
    label: IT_SUPPORT_URGENCY_LABEL[EITSupportUrgencyLevel.MEDIUM],
    value: EITSupportUrgencyLevel.MEDIUM,
  },
  {
    label: IT_SUPPORT_URGENCY_LABEL[EITSupportUrgencyLevel.HIGH],
    value: EITSupportUrgencyLevel.HIGH,
  },
  {
    label: IT_SUPPORT_URGENCY_LABEL[EITSupportUrgencyLevel.OTHER],
    value: EITSupportUrgencyLevel.OTHER,
  },
];

export function ITSupportSection() {
  const { control } = useFormContext<ContactFormSubmitValues>();

  return (
    <section className="space-y-6" aria-labelledby="contact-it-support-section-heading">
      <div className="space-y-1">
        <h3
          id="contact-it-support-section-heading"
          className="text-lg font-semibold tracking-[-0.02em] text-slate-950"
        >
          IT support inquiry details
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          Get help with login issues, account access, system errors, or technical requests.
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
      </div>

      <Divider className="py-1" lineClassName="w-full" />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField<ContactFormSubmitValues, EITSupportApplicationSystem>
          control={control}
          name="inquiry.systemInformation.applicationOrSystem"
          label="Application or system"
          ui={siteTextUi}
          fieldPathAttr="inquiry.systemInformation.applicationOrSystem"
          options={applicationOptions}
          placeholder="Select application or system"
        />

        <SelectField<ContactFormSubmitValues, EITSupportIssueType>
          control={control}
          name="inquiry.systemInformation.typeOfIssue"
          label="Issue type"
          ui={siteTextUi}
          fieldPathAttr="inquiry.systemInformation.typeOfIssue"
          options={issueTypeOptions}
          placeholder="Select issue type"
        />

        <div className="md:col-span-2">
          <SelectField<ContactFormSubmitValues, EITSupportUrgencyLevel>
            control={control}
            name="inquiry.systemInformation.urgencyLevel"
            label="Urgency level"
            ui={siteTextUi}
            fieldPathAttr="inquiry.systemInformation.urgencyLevel"
            options={urgencyOptions}
            placeholder="Select urgency level"
          />
        </div>

        <div className="md:col-span-2">
          <TextAreaField<ContactFormSubmitValues>
            control={control}
            name="inquiry.details.message"
            label="Message"
            required
            hint="Describe the issue, what you expected, and any error messages or steps to reproduce it."
            ui={siteTextareaUi}
            fieldPathAttr="inquiry.details.message"
            textareaProps={{
              placeholder:
                "Tell us what is happening, where it happens, and any details that may help troubleshoot the issue.",
              rows: 7,
              maxLength: 6000,
            }}
          />
        </div>
      </div>
    </section>
  );
}
