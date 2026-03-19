"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { FAQ_CATEGORIES, type FaqCategory, type FaqItem } from "@/config/faqs";
import { cn } from "@/lib/cn";

function FaqAccordionItem({
  item,
  categoryLabel,
  isOpen,
  onToggle,
  reduceMotion,
}: {
  item: FaqItem;
  categoryLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  reduceMotion: boolean | null;
}) {
  const id = React.useId();
  const questionId = `faq-q-${id}`;
  const answerId = `faq-a-${id}`;

  return (
    <div
      className={cn(
        "relative rounded-xl border border-[color:var(--color-border-light)]/80 bg-white/98 shadow-[0_2px_12px_rgba(2,6,23,0.04)] transition-all duration-300",
        "hover:shadow-[0_4px_20px_rgba(2,6,23,0.06)]",
        isOpen &&
          "border-[color:var(--color-brand-500)]/25 shadow-[0_8px_28px_rgba(2,6,23,0.08)] ring-1 ring-[color:var(--color-brand-500)]/10",
      )}
    >
      {/* Left accent: always reserve space to avoid layout shift when opening */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors duration-200",
          isOpen ? "bg-[color:var(--color-brand-500)]" : "bg-transparent",
        )}
        aria-hidden="true"
      />
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        id={questionId}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-4 rounded-xl pl-5 pr-4 py-3 text-left sm:gap-5 sm:pl-6 sm:pr-5 sm:py-3.5",
          "text-sm font-semibold text-[color:var(--color-text-light)] sm:text-[15px]",
          "hover:bg-[color:var(--color-surface-0-light)]/60",
          "focus-ring-light",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-surface-0-light)]/90 transition-all duration-300",
            isOpen && "rotate-90 bg-[color:var(--color-brand-500)]/15",
          )}
        >
          <svg
            className={cn(
              "h-4 w-4 transition-colors duration-200",
              isOpen ? "text-[color:var(--color-brand-600)]" : "text-[color:var(--color-muted-light)]",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <span className="min-w-0 flex-1 pr-2">{item.question}</span>
        <span
          className={cn(
            "shrink-0 rounded-full border border-[color:var(--color-border-light)]/70 bg-[color:var(--color-surface-0-light)]/60 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-[color:var(--color-muted-light)]",
            isOpen && "border-[color:var(--color-brand-500)]/30 bg-[color:var(--color-brand-500)]/10 text-[color:var(--color-brand-600)]",
          )}
        >
          {categoryLabel}
        </span>
      </button>
      <div
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        className={cn(
          "grid min-h-0 overflow-hidden transition-[grid-template-rows] ease-out",
          !isOpen && "h-0",
          reduceMotion ? "duration-0" : "duration-300",
        )}
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div
          className={cn(
            "min-h-0 overflow-hidden border-t border-[color:var(--color-border-light)]/60 px-5 pb-4 pt-2 sm:px-6 sm:pb-5 sm:pt-3",
            !isOpen && "invisible",
          )}
        >
          <p className="text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FaqCategoryBlock({
  category,
  openIndex,
  onOpenIndex,
  reduceMotion,
  variants,
}: {
  category: FaqCategory;
  openIndex: number | null;
  onOpenIndex: (index: number | null) => void;
  reduceMotion: boolean | null;
  variants: Variants;
}) {
  return (
    <motion.section
      id={`category-${category.id}`}
      variants={variants}
      className="scroll-mt-[184px]"
    >
      <div className="mb-3 flex items-center gap-3 pt-1 sm:mb-3.5 sm:pt-2">
        <div className="h-[2px] w-10 shrink-0 bg-[color:var(--color-brand-500)] sm:w-12" />
        <h2 className="text-xs font-bold tracking-[0.12em] uppercase text-[color:var(--color-text-light)] sm:text-[13px]">
          {category.label}
        </h2>
      </div>
      <ul className="space-y-2 sm:space-y-2.5" role="list">
        {category.items.map((item, idx) => (
          <li key={idx}>
            <FaqAccordionItem
              item={item}
              categoryLabel={category.label}
              isOpen={openIndex === idx}
              onToggle={() => onOpenIndex(openIndex === idx ? null : idx)}
              reduceMotion={reduceMotion}
            />
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export function FaqMain() {
  const reduceMotion = useReducedMotion();
  const [openByCategory, setOpenByCategory] = React.useState<Record<string, number | null>>({});

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        // Visible-first motion: keep opacity readable, animate subtle lift + scale.
        hidden: { opacity: 1, y: 14, scale: 0.985 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
      };

  return (
    <Section
      variant="light"
      id="faqs"
      className="relative scroll-mt-16 overflow-hidden pt-0"
      style={{ backgroundColor: "var(--color-about-safety-bg)" }}
    >
      {/* Subtle texture + top soft gradient for premium feel (aligned with MissionVisionPrinciples / dark sections) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgba(11,17,32,0.12)] to-transparent"
      />

      <Container className="site-page-container relative pt-3 pb-12 sm:pt-4 sm:pb-14 lg:pt-5 lg:pb-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          className="mx-auto max-w-4xl space-y-10 sm:space-y-12"
        >
          {FAQ_CATEGORIES.map((category) => (
            <FaqCategoryBlock
              key={category.id}
              category={category}
              openIndex={openByCategory[category.id] ?? null}
              onOpenIndex={(idx) =>
                setOpenByCategory((prev) => ({ ...prev, [category.id]: idx }))
              }
              reduceMotion={reduceMotion}
              variants={fadeUp}
            />
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
