"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import type { IndustryPageModel } from "@/config/industryPages";
import { THEME_ACCENT, THEME_LIGHT_BG } from "./industryTheme";

export function IndustryTrustProof({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const { trustProof, hero } = model;
  const theme = hero.theme;
  const sectionBg = THEME_LIGHT_BG[theme];
  const accentColor = THEME_ACCENT[theme];

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };
  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };

  return (
    <Section
      variant="light"
      id="trust-proof"
      className="relative scroll-mt-24 overflow-hidden sm:scroll-mt-28"
      style={{ backgroundColor: sectionBg }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <Container className="relative max-w-[1440px] px-4 sm:px-6 lg:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="py-14 sm:py-16"
        >
          <motion.header variants={fadeUp} className="max-w-2xl">
            <div className="mb-3 h-[2px] w-10 sm:w-14" style={{ backgroundColor: accentColor }} />
            <h2 className="text-[1.6rem] font-semibold leading-tight tracking-tight text-[color:var(--color-text-light)] sm:text-[1.95rem] lg:text-[2.2rem]">
              {trustProof.sectionTitle}
            </h2>
            {trustProof.intro ? (
              <p className="mt-2 text-sm leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[15px]">
                {trustProof.intro}
              </p>
            ) : null}
          </motion.header>

          <motion.div
            variants={stagger}
            className="mt-10 flex flex-wrap gap-8 sm:mt-12 sm:gap-10 lg:gap-14"
          >
            {trustProof.stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col"
              >
                <span className="text-[2rem] font-bold tracking-tight sm:text-[2.5rem]" style={{ color: accentColor }}>
                  {stat.value}
                </span>
                <span className="mt-1 text-[13px] font-medium text-[color:var(--color-muted-light)] sm:text-[14px]">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {trustProof.complianceItems?.length ? (
            <motion.ul
              variants={fadeUp}
              className="mt-10 space-y-2.5 sm:mt-12"
              role="list"
            >
              {trustProof.complianceItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[13.5px] leading-[1.7] text-[color:var(--color-text-light)] sm:text-[14px]"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
          ) : null}

          {trustProof.insuranceNote ? (
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-[13px] leading-[1.7] text-[color:var(--color-muted-light)] sm:mt-8 sm:text-[14px]"
            >
              {trustProof.insuranceNote}
            </motion.p>
          ) : null}
        </motion.div>
      </Container>
    </Section>
  );
}
