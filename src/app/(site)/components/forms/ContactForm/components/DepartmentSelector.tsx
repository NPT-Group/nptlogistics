// src/app/(site)/components/forms/ContactForm/components/DepartmentSelector.tsx
"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Truck,
  ShieldAlert,
  MonitorSmartphone,
  MessageSquareText,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { CONTACT_CATEGORY_LABEL } from "@/lib/utils/enums/contactLabels";
import { EContactInquiryCategory } from "@/types/contactInquiry.types";

import type { ContactFormSubmitValues } from "../schema";
import { buildInquiryOnCategoryChange } from "../helpers";
import { toCtaSlug, trackCtaClick } from "@/lib/analytics/cta";

export type DepartmentOption = {
  value: EContactInquiryCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

type DepartmentSelectorProps = {
  onDepartmentChange?: (category: EContactInquiryCategory) => void;
};

export const DEPARTMENT_OPTIONS: readonly DepartmentOption[] = [
  {
    value: EContactInquiryCategory.CUSTOMER_SALES,
    label: CONTACT_CATEGORY_LABEL[EContactInquiryCategory.CUSTOMER_SALES],
    icon: BriefcaseBusiness,
    title: "Customer & Sales inquiry details",
    description: "Share your contact details and tell us how we can help.",
  },
  {
    value: EContactInquiryCategory.CARRIERS,
    label: CONTACT_CATEGORY_LABEL[EContactInquiryCategory.CARRIERS],
    icon: Truck,
    title: "Carrier Relations inquiry details",
    description:
      "Tell us about onboarding, load opportunities, payment questions, or carrier support.",
  },
  {
    value: EContactInquiryCategory.SAFETY,
    label: CONTACT_CATEGORY_LABEL[EContactInquiryCategory.SAFETY],
    icon: ShieldAlert,
    title: "Safety inquiry details",
    description:
      "Report incidents, raise compliance concerns, or share safety-related information.",
  },
  {
    value: EContactInquiryCategory.IT_SUPPORT,
    label: CONTACT_CATEGORY_LABEL[EContactInquiryCategory.IT_SUPPORT],
    icon: MonitorSmartphone,
    title: "IT Support inquiry details",
    description:
      "Describe portal, login, access, or technical issues so our team can assist quickly.",
  },
  {
    value: EContactInquiryCategory.GENERAL,
    label: CONTACT_CATEGORY_LABEL[EContactInquiryCategory.GENERAL],
    icon: MessageSquareText,
    title: "General inquiry details",
    description: "Send partnership, media, vendor, or general business inquiries to our team.",
  },
];

export function getDepartmentConfig(category: EContactInquiryCategory | undefined) {
  return DEPARTMENT_OPTIONS.find((option) => option.value === category) ?? DEPARTMENT_OPTIONS[0];
}

export function DepartmentSelector({ onDepartmentChange }: DepartmentSelectorProps) {
  const {
    control,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useFormContext<ContactFormSubmitValues>();

  const currentCategory = useWatch({
    control,
    name: "inquiry.category",
  });

  const categoryError = (errors.inquiry as any)?.category?.message as string | undefined;

  function selectDepartment(next: EContactInquiryCategory) {
    const prev = getValues("inquiry.category");
    if (prev === next) return;

    trackCtaClick({
      ctaId: "contact_department_selected",
      location: "contact_form_department_selector",
      label: toCtaSlug(String(next)),
    });

    const nextInquiry = buildInquiryOnCategoryChange(next);
    const allValues = getValues();

    reset(
      {
        ...allValues,
        inquiry: nextInquiry,
      },
      {
        keepErrors: false,
        keepDirty: true,
        keepTouched: true,
        keepSubmitCount: true,
      },
    );

    clearErrors("inquiry");
    onDepartmentChange?.(next);
  }

  return (
    <section
      data-field-path="inquiry.category"
      aria-invalid={Boolean(categoryError)}
      aria-describedby={categoryError ? "inquiry.category-error" : undefined}
      className="space-y-3"
    >
      <div
        role="tablist"
        aria-label="Contact department"
        className={cn(
          "overflow-hidden rounded-lg border bg-white",
          categoryError ? "border-red-300" : "border-slate-200",
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {DEPARTMENT_OPTIONS.map((option, idx) => {
            const active = currentCategory === option.value;
            const Icon = option.icon;

            return (
              <motion.button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                aria-pressed={active}
                onClick={() => selectDepartment(option.value)}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.12 }}
                className={cn(
                  "relative isolate flex h-10 w-full items-center justify-center gap-1.5 overflow-hidden px-3",
                  "text-[13px] font-medium tracking-[-0.01em]",
                  "transition-colors duration-200",
                  "hover:cursor-pointer focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)]/20",
                  "border-b border-slate-200 lg:border-b-0",
                  idx !== DEPARTMENT_OPTIONS.length - 1 && "lg:border-r lg:border-slate-200",
                  idx < 4 &&
                    "sm:[&:nth-child(-n+4)]:border-b sm:[&:nth-child(-n+4)]:border-slate-200",
                  idx % 2 === 0 &&
                    idx !== DEPARTMENT_OPTIONS.length - 1 &&
                    "sm:border-r sm:border-slate-200 lg:border-r",
                  active ? "text-white" : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="contact-department-active-tab"
                    className="absolute inset-0 z-0 bg-[color:var(--color-brand-600)]"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 36,
                      mass: 0.75,
                    }}
                  />
                ) : null}

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-white/60"
                />

                <motion.span
                  className="relative z-10 flex items-center gap-1.5"
                  animate={{
                    scale: active ? 1 : 0.992,
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.span
                    animate={{
                      scale: active ? 1.03 : 1,
                      opacity: active ? 1 : 0.92,
                    }}
                    transition={{
                      duration: 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-colors duration-200",
                        active ? "text-white" : "text-slate-500",
                      )}
                    />
                  </motion.span>

                  <span className="truncate">{option.label}</span>
                </motion.span>

                {!active ? (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 bg-slate-50/0"
                    whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.85)" }}
                    transition={{ duration: 0.16 }}
                  />
                ) : null}

                <input
                  tabIndex={-1}
                  className="sr-only"
                  type="radio"
                  name="inquiry.category"
                  checked={active}
                  readOnly
                  aria-hidden="true"
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {categoryError ? (
        <div
          id="inquiry.category-error"
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{categoryError}</div>
        </div>
      ) : null}
    </section>
  );
}
