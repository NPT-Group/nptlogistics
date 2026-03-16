// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/InternationalFields.tsx
"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { Plane, Ship, Boxes, Container, AlertTriangle } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import {
  EDimensionUnit,
  EInternationalMode,
  EOceanLoadType,
  EWeightUnit,
} from "@/types/logisticsQuote.types";
import { INTL_MODE_LABEL, OCEAN_LOAD_TYPE_LABEL } from "@/lib/utils/enums/logisticsLabels";

import { IconCardSelector, type IconCardOption } from "../../components/IconCardSelector";
import { SelectField } from "@/components/forms/fields/SelectField";
import { TextField } from "@/components/forms/fields/TextField";
import { NumberField } from "@/components/forms/fields/NumberField";

import { siteTextUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { AddressFields } from "../../components/AddressFields";
import { CargoLinesFields } from "../../components/CargoLinesFields";
import { ContainerLinesFields } from "../../components/ContainerLinesFields";
import { ShipmentDetailsBlock } from "./ShipmentDetailsSection";

const MODE_OPTIONS: readonly IconCardOption<EInternationalMode>[] = [
  {
    value: EInternationalMode.AIR,
    label: INTL_MODE_LABEL[EInternationalMode.AIR],
    icon: Plane,
  },
  {
    value: EInternationalMode.OCEAN,
    label: INTL_MODE_LABEL[EInternationalMode.OCEAN],
    icon: Ship,
  },
];

const OCEAN_LOAD_TYPE_OPTIONS: readonly IconCardOption<EOceanLoadType>[] = [
  {
    value: EOceanLoadType.LCL,
    label: OCEAN_LOAD_TYPE_LABEL[EOceanLoadType.LCL],
    icon: Boxes,
  },
  {
    value: EOceanLoadType.FCL,
    label: OCEAN_LOAD_TYPE_LABEL[EOceanLoadType.FCL],
    icon: Container,
  },
];

const revealMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.18, ease: "easeOut" as const },
};

export function InternationalFields() {
  const { control, setValue, clearErrors } = useFormContext<LogisticsQuoteSubmitValues>();

  const { field: modeField, fieldState: modeState } = useController({
    control,
    name: "serviceDetails.mode" as any,
  });

  const { field: oceanLoadTypeField, fieldState: oceanLoadTypeState } = useController({
    control,
    name: "serviceDetails.oceanLoadType" as any,
  });

  const mode = modeField.value as EInternationalMode | undefined;
  const oceanLoadType = oceanLoadTypeField.value as EOceanLoadType | undefined;

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

  const modeError = modeState.error?.message;
  const oceanLoadTypeError = oceanLoadTypeState.error?.message;

  function resetInternationalBranchFields() {
    setValue("serviceDetails.weightUnit" as any, undefined, {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });

    setValue("serviceDetails.dimensionUnit" as any, undefined, {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });

    setValue("serviceDetails.cargoLines" as any, undefined, {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });

    setValue("serviceDetails.containerLines" as any, undefined, {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });

    setValue("serviceDetails.approximateTotalWeight" as any, undefined, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });

    clearErrors([
      "serviceDetails.weightUnit",
      "serviceDetails.dimensionUnit",
      "serviceDetails.cargoLines",
      "serviceDetails.containerLines",
      "serviceDetails.approximateTotalWeight",
    ] as any);
  }

  function handleModeChange(next: EInternationalMode) {
    if (next === mode) return;

    modeField.onChange(next);
    modeField.onBlur();

    setValue("serviceDetails.oceanLoadType" as any, undefined, {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });

    clearErrors(["serviceDetails.mode", "serviceDetails.oceanLoadType"] as any);

    resetInternationalBranchFields();
  }

  function handleOceanLoadTypeChange(next: EOceanLoadType) {
    if (next === oceanLoadType) return;

    oceanLoadTypeField.onChange(next);
    oceanLoadTypeField.onBlur();

    clearErrors("serviceDetails.oceanLoadType" as any);

    resetInternationalBranchFields();
  }

  useEffect(() => {
    const fieldName = "serviceDetails.approximateTotalWeight" as any;

    if (!needsCargoWeight) {
      setValue(fieldName, undefined, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      return;
    }

    setValue(fieldName, totalWeight > 0 ? totalWeight : undefined, {
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
      <section
        data-field-path="serviceDetails.mode"
        aria-invalid={Boolean(modeError)}
        aria-describedby="serviceDetails.mode-error"
      >
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">Mode</h3>
          <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
            Select how this international shipment will move.
          </p>

          {modeError ? (
            <div
              id="serviceDetails.mode-error"
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>{modeError}</div>
            </div>
          ) : null}
        </div>

        <IconCardSelector<EInternationalMode>
          options={MODE_OPTIONS}
          value={mode}
          onChange={handleModeChange}
          onBlur={modeField.onBlur}
          name={modeField.name}
          invalid={Boolean(modeError)}
          errorId="serviceDetails.mode-error"
          variant="detailed"
          align="left"
          columnsClassName="grid gap-2 sm:grid-cols-2"
          animateItems
          staggerDelay={0.03}
        />
      </section>

      <AnimatePresence initial={false} mode="wait">
        {mode === EInternationalMode.OCEAN ? (
          <motion.section
            key="ocean-load-type-selector"
            data-field-path="serviceDetails.oceanLoadType"
            aria-invalid={Boolean(oceanLoadTypeError)}
            aria-describedby="serviceDetails.oceanLoadType-error"
            {...revealMotion}
          >
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">
                Ocean load type
              </h3>
              <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
                Choose whether this shipment is moving as shared cargo or full container load.
              </p>

              {oceanLoadTypeError ? (
                <div
                  id="serviceDetails.oceanLoadType-error"
                  role="alert"
                  className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>{oceanLoadTypeError}</div>
                </div>
              ) : null}
            </div>

            <IconCardSelector<EOceanLoadType>
              options={OCEAN_LOAD_TYPE_OPTIONS}
              value={oceanLoadType}
              onChange={handleOceanLoadTypeChange}
              onBlur={oceanLoadTypeField.onBlur}
              name={oceanLoadTypeField.name}
              invalid={Boolean(oceanLoadTypeError)}
              errorId="serviceDetails.oceanLoadType-error"
              variant="detailed"
              align="left"
              columnsClassName="grid gap-2 sm:grid-cols-2"
              animateItems
              staggerDelay={0.03}
            />
          </motion.section>
        ) : null}
      </AnimatePresence>

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
          <TextField
            control={control}
            name={"serviceDetails.commodityDescription" as any}
            fieldPathAttr="serviceDetails.commodityDescription"
            label="Commodity description"
            required
            ui={siteTextUi}
            inputProps={{ placeholder: "Describe the goods being shipped" }}
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

          <AnimatePresence initial={false}>
            {needsCargoWeight ? (
              <>
                <motion.div key="intl-weight-unit" {...revealMotion}>
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
                </motion.div>

                <motion.div key="intl-dimension-unit" {...revealMotion}>
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
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </div>
      </ShipmentDetailsBlock>

      <AnimatePresence initial={false} mode="wait">
        {mode === EInternationalMode.AIR ? (
          <motion.div key="intl-air-cargo-block" {...revealMotion}>
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

              <div className="mt-4 max-w-md">
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
              </div>
            </ShipmentDetailsBlock>
          </motion.div>
        ) : null}

        {mode === EInternationalMode.OCEAN && oceanLoadType === EOceanLoadType.LCL ? (
          <motion.div key="intl-ocean-lcl-cargo-block" {...revealMotion}>
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

              <div className="mt-4 max-w-md">
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
              </div>
            </ShipmentDetailsBlock>
          </motion.div>
        ) : null}

        {mode === EInternationalMode.OCEAN && oceanLoadType === EOceanLoadType.FCL ? (
          <motion.div key="intl-ocean-fcl-container-block" {...revealMotion}>
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
