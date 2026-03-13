// src/app/(site)/components/forms/ContactForm/sections/SafetySection.tsx
"use client";

import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/forms/fields/TextField";
import { SelectField, type SelectOption } from "@/components/forms/fields/SelectField";
import { TextAreaField } from "@/components/forms/fields/TextAreaField";
import { PhoneField } from "@/components/forms/fields/PhoneField";

import {
  SAFETY_INCIDENT_TYPE_LABEL,
  SAFETY_VEHICLE_TYPE_LABEL,
} from "@/lib/utils/enums/contactLabels";
import { ESafetyIncidentType, ESafetyVehicleType } from "@/types/contactInquiry.types";

import type { ContactFormSubmitValues } from "../schema";
import { siteTextUi, siteTextareaUi } from "../../presets/siteFieldUi";
import { Divider } from "../../components/Divider";

const safetyVehicleTypeOptions: ReadonlyArray<SelectOption<ESafetyVehicleType>> = [
  {
    label: SAFETY_VEHICLE_TYPE_LABEL[ESafetyVehicleType.TRACTOR],
    value: ESafetyVehicleType.TRACTOR,
  },
  {
    label: SAFETY_VEHICLE_TYPE_LABEL[ESafetyVehicleType.TRAILER],
    value: ESafetyVehicleType.TRAILER,
  },
  {
    label: SAFETY_VEHICLE_TYPE_LABEL[ESafetyVehicleType.PERSONAL_VEHICLE],
    value: ESafetyVehicleType.PERSONAL_VEHICLE,
  },
  {
    label: SAFETY_VEHICLE_TYPE_LABEL[ESafetyVehicleType.OTHER],
    value: ESafetyVehicleType.OTHER,
  },
];

const safetyIncidentTypeOptions: ReadonlyArray<SelectOption<ESafetyIncidentType>> = [
  {
    label: SAFETY_INCIDENT_TYPE_LABEL[ESafetyIncidentType.ACCIDENT],
    value: ESafetyIncidentType.ACCIDENT,
  },
  {
    label: SAFETY_INCIDENT_TYPE_LABEL[ESafetyIncidentType.ROAD_SAFETY_CONCERN],
    value: ESafetyIncidentType.ROAD_SAFETY_CONCERN,
  },
  {
    label: SAFETY_INCIDENT_TYPE_LABEL[ESafetyIncidentType.CARGO_ISSUE],
    value: ESafetyIncidentType.CARGO_ISSUE,
  },
  {
    label: SAFETY_INCIDENT_TYPE_LABEL[ESafetyIncidentType.COMPLIANCE_CONCERN],
    value: ESafetyIncidentType.COMPLIANCE_CONCERN,
  },
  {
    label: SAFETY_INCIDENT_TYPE_LABEL[ESafetyIncidentType.OTHER],
    value: ESafetyIncidentType.OTHER,
  },
];

export function SafetySection() {
  const { control } = useFormContext<ContactFormSubmitValues>();

  return (
    <section className="space-y-6" aria-labelledby="contact-safety-section-heading">
      <div className="space-y-1">
        <h3
          id="contact-safety-section-heading"
          className="text-lg font-semibold tracking-[-0.02em] text-slate-950"
        >
          Safety inquiry details
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          Report an incident, compliance concern, cargo issue, or other safety-related matter.
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
      </div>

      <Divider className="py-1" lineClassName="w-full" />

      <div className="grid gap-4 md:grid-cols-2">
        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.incidentInformation.locationOfIncident"
          label="Location of incident"
          hint="Optional, but helpful for faster internal review."
          ui={siteTextUi}
          fieldPathAttr="inquiry.incidentInformation.locationOfIncident"
          inputProps={{
            placeholder: "City, highway, site, terminal, or general location",
            maxLength: 300,
          }}
        />

        <TextField<ContactFormSubmitValues>
          control={control}
          name="inquiry.incidentInformation.dateOfIncident"
          label="Date of incident"
          ui={siteTextUi}
          fieldPathAttr="inquiry.incidentInformation.dateOfIncident"
          inputProps={{
            type: "date",
          }}
        />

        <SelectField<ContactFormSubmitValues, ESafetyVehicleType>
          control={control}
          name="inquiry.incidentInformation.vehicleType"
          label="Vehicle type"
          ui={siteTextUi}
          fieldPathAttr="inquiry.incidentInformation.vehicleType"
          options={safetyVehicleTypeOptions}
          placeholder="Select vehicle type"
        />

        <SelectField<ContactFormSubmitValues, ESafetyIncidentType>
          control={control}
          name="inquiry.incidentInformation.incidentType"
          label="Incident type"
          ui={siteTextUi}
          fieldPathAttr="inquiry.incidentInformation.incidentType"
          options={safetyIncidentTypeOptions}
          placeholder="Select incident type"
        />

        <div className="md:col-span-2">
          <TextField<ContactFormSubmitValues>
            control={control}
            name="inquiry.incidentInformation.referenceOrLoadNumber"
            label="Reference or load number"
            ui={siteTextUi}
            fieldPathAttr="inquiry.incidentInformation.referenceOrLoadNumber"
            inputProps={{
              placeholder: "Optional reference, load, or related tracking number",
              maxLength: 120,
            }}
          />
        </div>

        <div className="md:col-span-2">
          <TextAreaField<ContactFormSubmitValues>
            control={control}
            name="inquiry.details.descriptionOfIncident"
            label="Description of incident"
            required
            hint="Include what happened, when it occurred, and any details that may help the safety team review it."
            ui={siteTextareaUi}
            fieldPathAttr="inquiry.details.descriptionOfIncident"
            textareaProps={{
              placeholder: "Describe the incident or concern in as much detail as possible.",
              rows: 7,
              maxLength: 6000,
            }}
          />
        </div>
      </div>
    </section>
  );
}
