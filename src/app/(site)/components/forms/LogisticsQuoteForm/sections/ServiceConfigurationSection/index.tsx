// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceConfigurationSection/index.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";

import { ELogisticsPrimaryService } from "@/types/logisticsQuote.types";
import type { LogisticsQuoteSubmitValues } from "../../schema";

import { Divider } from "../../../components/Divider";

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

  if (!primaryService) {
    return (
      <div className="mb-10">
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-600">
          Select a service above to configure your shipment.
        </div>
      </div>
    );
  }

  if (primaryService === ELogisticsPrimaryService.FTL) {
    return (
      <div className="mb-10" key="ftl-config">
        <motion.div
          key="ftl"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <EquipmentSelector />
          <AddonsSection />
          <Divider />
          <ShipmentDetailsSection>
            <FTLFields />
          </ShipmentDetailsSection>
        </motion.div>
      </div>
    );
  }

  if (primaryService === ELogisticsPrimaryService.LTL) {
    return (
      <div className="mb-10" key="ltl-config">
        <motion.div
          key="ltl"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <EquipmentSelector />
          <AddonsSection />
          <Divider />
          <ShipmentDetailsSection>
            <LTLFields />
          </ShipmentDetailsSection>
        </motion.div>
      </div>
    );
  }

  if (primaryService === ELogisticsPrimaryService.INTERNATIONAL) {
    return (
      <div className="mb-10" key="international-config">
        <motion.div
          key="international"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <InternationalFields />
        </motion.div>
      </div>
    );
  }

  if (primaryService === ELogisticsPrimaryService.WAREHOUSING) {
    return (
      <div className="mb-10" key="warehousing-config">
        <motion.div
          key="warehousing"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <ShipmentDetailsSection
            title="Warehousing details"
            description="Tell us where storage is needed and the basic requirements."
          >
            <WarehousingFields />
          </ShipmentDetailsSection>
        </motion.div>
      </div>
    );
  }

  return null;
}
