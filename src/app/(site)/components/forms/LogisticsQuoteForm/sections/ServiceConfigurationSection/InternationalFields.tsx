// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/InternationalFields
"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import {
  EDimensionUnit,
  EInternationalMode,
  EOceanLoadType,
  EWeightUnit,
} from "@/types/logisticsQuote.types";
import { INTL_MODE_LABEL, OCEAN_LOAD_TYPE_LABEL } from "@/lib/utils/enums/logisticsLabels";

import { SelectField } from "@/components/forms/fields/SelectField";
import { TextField } from "@/components/forms/fields/TextField";
import { NumberField } from "@/components/forms/fields/NumberField";

import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { AddressFields } from "../../components/AddressFields";
import { CargoLinesFields } from "../../components/CargoLinesFields";
import { ContainerLinesFields } from "../../components/ContainerLinesFields";
import { ShipmentDetailsBlock } from "./ShipmentDetailsSection";

export function InternationalFields() {
  const { control, setValue, clearErrors } = useFormContext<LogisticsQuoteSubmitValues>();

  const mode = useWatch({
    control,
    name: "serviceDetails.mode" as any,
  }) as EInternationalMode | undefined;

  const oceanLoadType = useWatch({
    control,
    name: "serviceDetails.oceanLoadType" as any,
  }) as EOceanLoadType | undefined;

  const cargoLines = useWatch({
    control,
    name: "serviceDetails.cargoLines" as any,
  }) as
    | Array<{
        quantity?: number;
        weightPerUnit?: number;
      }>
    | undefined;

  const safeLines = Array.isArray(cargoLines) ? cargoLines : [];

  const totalWeight = safeLines.reduce((sum, line) => {
    const q = Number(line?.quantity ?? 0);
    const w = Number(line?.weightPerUnit ?? 0);
    return sum + q * w;
  }, 0);

  const needsCargoWeight =
    mode === EInternationalMode.AIR ||
    (mode === EInternationalMode.OCEAN && oceanLoadType === EOceanLoadType.LCL);

  useEffect(() => {
    if (!needsCargoWeight) return;

    const fieldName = "serviceDetails.approximateTotalWeight" as any;

    setValue(fieldName, totalWeight, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });

    if (totalWeight > 0) {
      clearErrors(fieldName);
    }
  }, [needsCargoWeight, totalWeight, setValue, clearErrors]);

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
        title="Routing"
        description="Choose the international transport mode and load structure."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField<LogisticsQuoteSubmitValues, EInternationalMode>
            control={control}
            name={"serviceDetails.mode" as any}
            fieldPathAttr="serviceDetails.mode"
            label="Mode"
            required
            ui={siteTextUi}
            placeholder="Select mode..."
            options={[
              {
                label: INTL_MODE_LABEL[EInternationalMode.AIR],
                value: EInternationalMode.AIR,
              },
              {
                label: INTL_MODE_LABEL[EInternationalMode.OCEAN],
                value: EInternationalMode.OCEAN,
              },
            ]}
          />

          {mode === EInternationalMode.OCEAN ? (
            <SelectField<LogisticsQuoteSubmitValues, EOceanLoadType>
              control={control}
              name={"serviceDetails.oceanLoadType" as any}
              fieldPathAttr="serviceDetails.oceanLoadType"
              label="Ocean load type"
              required
              ui={siteTextUi}
              placeholder="Select load type..."
              options={[
                {
                  label: OCEAN_LOAD_TYPE_LABEL[EOceanLoadType.LCL],
                  value: EOceanLoadType.LCL,
                },
                {
                  label: OCEAN_LOAD_TYPE_LABEL[EOceanLoadType.FCL],
                  value: EOceanLoadType.FCL,
                },
              ]}
            />
          ) : null}
        </div>
      </ShipmentDetailsBlock>

      <ShipmentDetailsBlock
        title="Shipment information"
        description="Provide the cargo details needed to route and quote the shipment."
      >
        <div className="grid gap-4 md:grid-cols-2">
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

          {needsCargoWeight ? (
            <>
              <SelectField<LogisticsQuoteSubmitValues, EWeightUnit>
                control={control}
                name={"serviceDetails.weightUnit" as any}
                fieldPathAttr="serviceDetails.weightUnit"
                label="Weight unit"
                required
                ui={siteTextUi}
                placeholder="Select unit..."
                options={[
                  { label: "LB", value: EWeightUnit.LB },
                  { label: "KG", value: EWeightUnit.KG },
                ]}
              />

              <SelectField<LogisticsQuoteSubmitValues, EDimensionUnit>
                control={control}
                name={"serviceDetails.dimensionUnit" as any}
                fieldPathAttr="serviceDetails.dimensionUnit"
                label="Dimension unit"
                required
                ui={siteTextUi}
                placeholder="Select unit..."
                options={[
                  { label: "IN", value: EDimensionUnit.IN },
                  { label: "CM", value: EDimensionUnit.CM },
                ]}
              />
            </>
          ) : null}
        </div>
      </ShipmentDetailsBlock>

      {mode === EInternationalMode.AIR ? (
        <>
          <ShipmentDetailsBlock>
            <CargoLinesFields
              name="serviceDetails.cargoLines"
              fieldPathAttr="serviceDetails.cargoLines"
              title="Cargo lines"
              description="Add each cargo line with quantity, dimensions, and weight per unit."
              itemLabel="Cargo line"
              addLabel="Add cargo line"
              weightUnitPath="serviceDetails.weightUnit"
              dimensionUnitPath="serviceDetails.dimensionUnit"
            />
          </ShipmentDetailsBlock>

          <ShipmentDetailsBlock
            title="Calculated total"
            description="This total is derived automatically from the cargo lines above."
          >
            <NumberField
              control={control}
              name={"serviceDetails.approximateTotalWeight" as any}
              fieldPathAttr="serviceDetails.approximateTotalWeight"
              label="Approx. total weight"
              required
              ui={siteTextUi}
              inputProps={{
                disabled: true,
                placeholder: "Calculated automatically",
                className:
                  "bg-neutral-100 text-neutral-500 border-neutral-200 cursor-not-allowed hover:border-neutral-200",
              }}
              hint="Calculated automatically from cargo quantities and weights."
            />
          </ShipmentDetailsBlock>
        </>
      ) : null}

      {mode === EInternationalMode.OCEAN && oceanLoadType === EOceanLoadType.LCL ? (
        <>
          <ShipmentDetailsBlock>
            <CargoLinesFields
              name="serviceDetails.cargoLines"
              fieldPathAttr="serviceDetails.cargoLines"
              title="Cargo lines"
              description="Add each cargo line with quantity, dimensions, and weight per unit."
              itemLabel="Cargo line"
              addLabel="Add cargo line"
              weightUnitPath="serviceDetails.weightUnit"
              dimensionUnitPath="serviceDetails.dimensionUnit"
            />
          </ShipmentDetailsBlock>

          <ShipmentDetailsBlock
            title="Calculated total"
            description="This total is derived automatically from the cargo lines above."
          >
            <NumberField
              control={control}
              name={"serviceDetails.approximateTotalWeight" as any}
              fieldPathAttr="serviceDetails.approximateTotalWeight"
              label="Approx. total weight"
              required
              ui={siteTextUi}
              inputProps={{
                disabled: true,
                placeholder: "Calculated automatically",
                className:
                  "bg-neutral-100 text-neutral-500 border-neutral-200 cursor-not-allowed hover:border-neutral-200",
              }}
              hint="Calculated automatically from cargo quantities and weights."
            />
          </ShipmentDetailsBlock>
        </>
      ) : null}

      {mode === EInternationalMode.OCEAN && oceanLoadType === EOceanLoadType.FCL ? (
        <ShipmentDetailsBlock>
          <ContainerLinesFields
            name="serviceDetails.containerLines"
            fieldPathAttr="serviceDetails.containerLines"
            title="Container lines"
            description="Add each container requirement for this ocean FCL shipment."
            itemLabel="Container"
            addLabel="Add container"
          />
        </ShipmentDetailsBlock>
      ) : null}
    </div>
  );
}
