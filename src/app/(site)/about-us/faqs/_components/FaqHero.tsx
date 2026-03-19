"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { FAQ_HERO } from "@/config/faqs";

export function FaqHero() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      variant="dark"
      id="faq-hero"
      className="relative scroll-mt-16 overflow-hidden bg-[color:var(--color-surface-0)] py-8 sm:py-10"
    >
      {/* Background: gradient + grid for premium feel */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_400px_at_70%_30%,rgba(220,38,38,0.12),transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(2,6,23,0.6)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070a12] to-transparent" />
      </div>

      <Container className="site-page-container relative">
        <motion.div
          // Critical hero text must remain visible even if whileInView fails.
          // Visible-first motion: keep opacity readable, animate small lift + scale.
          initial={reduceMotion ? false : { opacity: 1, y: 12, scale: 0.985 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="py-6 sm:py-8 lg:py-10"
        >
          <div className="mb-2.5 h-[2px] w-12 bg-[color:var(--color-brand-500)] sm:w-14" />
          <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[color:var(--color-brand-500)]">
            Help & Resources
          </p>
          <h1 className="mt-2.5 max-w-3xl text-[1.75rem] font-semibold leading-tight tracking-tight text-white sm:text-[2rem] lg:text-[2.35rem]">
            {FAQ_HERO.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-[1.65] text-[color:var(--color-muted)] sm:text-[14px]">
            {FAQ_HERO.subtitle}
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
