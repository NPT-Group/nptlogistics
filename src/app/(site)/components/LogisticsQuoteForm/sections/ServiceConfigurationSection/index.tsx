// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/index.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

import { ELogisticsPrimaryService } from "@/types/logisticsQuote.types";
import type { LogisticsQuoteSubmitValues } from "../../schema";

import { EquipmentSelector } from "./EquipmentSelector";
import { AddonsSection } from "./AddonsSection";
import { ShipmentDetailsSection } from "./ShipmentDetailsSection";
import { FTLFields } from "./FTLFields";
import { LTLFields } from "./LTLFields";
import { InternationalFields } from "./InternationalFields";
import { WarehousingFields } from "./WarehousingFields";

export function ServiceConfigurationSection() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  const primaryService = useWatch({
    control,
    name: "serviceDetails.primaryService",
  });

  return (
    <div className="mb-10">
      <AnimatePresence mode="wait">
        {!primaryService ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-600"
          >
            Select a service above to configure your shipment.
          </motion.div>
        ) : null}

        {primaryService === ELogisticsPrimaryService.FTL ? (
          <motion.div
            key="ftl"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <EquipmentSelector />
            <AddonsSection />
            <ShipmentDetailsSection>
              <FTLFields />
            </ShipmentDetailsSection>
          </motion.div>
        ) : null}

        {primaryService === ELogisticsPrimaryService.LTL ? (
          <motion.div
            key="ltl"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <AddonsSection />
            <ShipmentDetailsSection>
              <LTLFields />
            </ShipmentDetailsSection>
          </motion.div>
        ) : null}

        {primaryService === ELogisticsPrimaryService.INTERNATIONAL ? (
          <motion.div
            key="international"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <ShipmentDetailsSection>
              <InternationalFields />
            </ShipmentDetailsSection>
          </motion.div>
        ) : null}

        {primaryService === ELogisticsPrimaryService.WAREHOUSING ? (
          <motion.div
            key="warehousing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <ShipmentDetailsSection>
              <WarehousingFields />
            </ShipmentDetailsSection>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
