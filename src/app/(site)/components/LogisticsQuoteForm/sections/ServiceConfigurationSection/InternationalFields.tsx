// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/InternationalFields.tsx
"use client";

import { useFormContext } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EInternationalShipmentSize, EWeightUnit } from "@/types/logisticsQuote.types";

import { SelectField } from "@/components/forms/fields/SelectField";
import { TextField } from "@/components/forms/fields/TextField";
import { NumberField } from "@/components/forms/fields/NumberField";

import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { AddressFields } from "../../components/AddressFields";
import { ShipmentDetailsBlock } from "./ShipmentDetailsSection";

export function InternationalFields() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
    <div className="space-y-4">
      <ShipmentDetailsBlock
        title="Locations"
        description="Tell us where the shipment is moving from and to."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="min-w-0">
            <AddressFields title="Origin" basePath="serviceDetails.origin" />
          </div>

          <div className="min-w-0">
            <AddressFields title="Destination" basePath="serviceDetails.destination" />
          </div>
        </div>
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock
        title="Shipment information"
        description="Provide the cargo details needed to route and quote the shipment."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField<LogisticsQuoteSubmitValues, EInternationalShipmentSize>
            control={control}
            name={"serviceDetails.shipmentSize" as any}
            fieldPathAttr="serviceDetails.shipmentSize"
            label="Shipment size (optional)"
            ui={siteTextUi}
            placeholder="Select size..."
            options={[
              { label: "Small", value: EInternationalShipmentSize.SMALL },
              { label: "Medium", value: EInternationalShipmentSize.MEDIUM },
              { label: "Large", value: EInternationalShipmentSize.LARGE },
            ]}
          />

          <TextField
            control={control}
            name={"serviceDetails.pickupDate" as any}
            fieldPathAttr="serviceDetails.pickupDate"
            label="Pickup date"
            required
            ui={siteTextUi}
            inputProps={{ type: "date" }}
          />

          <TextField
            control={control}
            name={"serviceDetails.commodityDescription" as any}
            fieldPathAttr="serviceDetails.commodityDescription"
            label="Commodity description"
            required
            ui={siteTextUi}
            inputProps={{ placeholder: "Describe the goods being shipped" }}
          />

          <NumberField
            control={control}
            name={"serviceDetails.estimatedWeight.value" as any}
            fieldPathAttr="serviceDetails.estimatedWeight.value"
            label="Estimated weight"
            required
            disallowNegative
            disallowExponent
            ui={siteTextUi}
          />

          <SelectField<LogisticsQuoteSubmitValues, EWeightUnit>
            control={control}
            name={"serviceDetails.estimatedWeight.unit" as any}
            fieldPathAttr="serviceDetails.estimatedWeight.unit"
            label="Weight unit"
            required
            ui={siteTextUi}
            placeholder="Select unit..."
            options={[
              { label: "LB", value: EWeightUnit.LB },
              { label: "KG", value: EWeightUnit.KG },
            ]}
          />
        </div>
      </ShipmentDetailsBlock>
    </div>
  );
}