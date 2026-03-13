// src/app/(site)/components/forms/ContactForm/components/InquirySectionRouter.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { BriefcaseBusiness } from "lucide-react";

import { EContactInquiryCategory } from "@/types/contactInquiry.types";

import type { ContactFormSubmitValues } from "../schema";
import { CustomerSalesSection } from "../sections/CustomerSalesSection";
import { CarriersSection } from "../sections/CarriersSection";
import { SafetySection } from "../sections/SafetySection";
import { ITSupportSection } from "../sections/ITSupportSection";
import { GeneralSection } from "../sections/GeneralSection";

function SectionTransition({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={sectionKey}
        initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
        transition={{
          duration: 0.24,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function InquirySectionRouter() {
  const { control } = useFormContext<ContactFormSubmitValues>();

  const category = useWatch({
    control,
    name: "inquiry.category",
  });

  const sectionKey = category ?? "none";

  return (
    <SectionTransition sectionKey={sectionKey}>
      {category === EContactInquiryCategory.CUSTOMER_SALES ? (
        <CustomerSalesSection />
      ) : category === EContactInquiryCategory.CARRIERS ? (
        <CarriersSection />
      ) : category === EContactInquiryCategory.SAFETY ? (
        <SafetySection />
      ) : category === EContactInquiryCategory.IT_SUPPORT ? (
        <ITSupportSection />
      ) : category === EContactInquiryCategory.GENERAL ? (
        <GeneralSection />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 sm:px-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Select a department to continue
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Once a department is selected, the matching inquiry section will appear here.
              </p>
            </div>
          </div>
        </section>
      )}
    </SectionTransition>
  );
}
