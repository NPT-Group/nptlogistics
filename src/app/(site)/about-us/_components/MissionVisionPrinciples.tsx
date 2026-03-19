"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";

type Principle = Readonly<{ title: string; body: string }>;

type Data = Readonly<{
  sectionTitle: string;
  sectionSubtitle: string;
  missionLabel: string;
  mission: string;
  missionTitle: string;
  visionLabel: string;
  vision: string;
  visionTitle: string;
  principles: readonly Principle[];
  valuesTitle: string;
  valuesSubtitle: string;
}>;

export function MissionVisionPrinciples({ data }: { data: Data }) {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        // Critical content must not be hidden if whileInView never triggers.
        // Visible-first motion: animate small lift + scale, but keep opacity readable.
        hidden: { opacity: 1, y: 14, scale: 0.985 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
      };

  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };

  return (
    <Section
      variant="light"
      id="mission-vision"
      className="relative scroll-mt-24 overflow-hidden sm:scroll-mt-28"
      style={{ backgroundColor: "var(--color-about-safety-bg)" }}
    >
      {/* Ultra-faint dot texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Container className="site-page-container relative">

        {/* ── Section header ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          className="max-w-2xl"
        >
          <div className="mb-3 h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
          <h2 className="text-[1.6rem] font-semibold leading-tight tracking-tight text-[color:var(--color-text-light)] sm:text-[1.95rem] lg:text-[2.2rem]">
            {data.sectionTitle}
          </h2>
          <p className="mt-2 max-w-[56ch] text-sm leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[15px]">
            {data.sectionSubtitle}
          </p>
        </motion.div>

        {/* ── Mission + Vision — split treatment ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5"
        >
          {/* ── MISSION — dark filled card ── */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-[3px] sm:p-9 lg:p-11"
            style={{
              backgroundColor: "#1a1f2e",
              boxShadow: "0 2px 0 rgba(0,0,0,0.22), 0 20px 56px rgba(0,0,0,0.20)",
            }}
          >
            {/* Subtle red glow top-left */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(ellipse at 15% 0%, rgba(220,38,38,0.16) 0%, transparent 55%)",
              }}
            />
            {/* Top red accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{
                background: "linear-gradient(90deg, #ef4444 0%, rgba(220,38,38,0.15) 60%, transparent 100%)",
              }}
            />
            {/* Decorative quote mark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-6 bottom-3 select-none font-serif text-[8rem] leading-none text-white opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.09]"
            >
              &ldquo;
            </div>

            <span className="relative inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--color-brand-500)]">
              <span className="inline-block h-[2px] w-5 rounded-full bg-[color:var(--color-brand-500)]" />
              {data.missionLabel}
            </span>
            <h3 className="relative mt-5 text-[1.35rem] font-bold leading-snug tracking-tight text-white sm:text-[1.5rem] lg:text-[1.65rem]">
              {data.missionTitle}
            </h3>
            <p className="relative mt-4 text-[14.5px] leading-[1.85] text-[rgba(255,255,255,0.60)] sm:text-[15px]">
              {data.mission}
            </p>
            <div aria-hidden="true" className="relative mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-[rgba(255,255,255,0.08)]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)] opacity-70" />
            </div>
          </motion.div>

          {/* ── VISION — white elevated card ── */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 transition-all duration-500 hover:-translate-y-[3px] sm:p-9 lg:p-11"
            style={{
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 2px 0 rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06), 0 20px 56px rgba(0,0,0,0.05)",
            }}
          >
            {/* Top red accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{
                background: "linear-gradient(90deg, #ef4444 0%, rgba(220,38,38,0.15) 60%, transparent 100%)",
              }}
            />
            {/* Decorative quote mark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-6 bottom-3 select-none font-serif text-[8rem] leading-none opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.09]"
              style={{ color: "#0f172a" }}
            >
              &ldquo;
            </div>

            <span className="relative inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--color-brand-600)]">
              <span className="inline-block h-[2px] w-5 rounded-full bg-[color:var(--color-brand-600)]" />
              {data.visionLabel}
            </span>
            <h3 className="relative mt-5 text-[1.35rem] font-bold leading-snug tracking-tight text-[color:var(--color-text-light)] sm:text-[1.5rem] lg:text-[1.65rem]">
              {data.visionTitle}
            </h3>
            <p className="relative mt-4 text-[14.5px] leading-[1.85] text-[color:var(--color-muted-light)] sm:text-[15px]">
              {data.vision}
            </p>
            <div aria-hidden="true" className="relative mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-[rgba(0,0,0,0.07)]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)] opacity-50" />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Divider into Values ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mt-14 sm:mt-16"
        >
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[rgba(0,0,0,0.10)]" />
            <div className="h-[2px] w-8 bg-[color:var(--color-brand-500)]" />
            <div className="h-px flex-1 bg-[rgba(0,0,0,0.10)]" />
          </div>
          <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-[1.25rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.4rem]">
              {data.valuesTitle}
            </h3>
            <p className="text-[13px] text-[color:var(--color-subtle-light)] sm:text-right sm:text-[13.5px]">
              {data.valuesSubtitle}
            </p>
          </div>
        </motion.div>

        {/* ── Principles grid ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-7 grid overflow-hidden rounded-2xl bg-white sm:grid-cols-2 lg:grid-cols-4"
          style={{
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 2px 0 rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          {data.principles.map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="group relative flex flex-col gap-4 border-b border-r p-6 transition-colors duration-300 last:border-r-0 hover:bg-[rgba(0,0,0,0.015)] sm:p-7 [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(4)]:border-r-0"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <span className="select-none text-[2.8rem] font-bold leading-none tracking-tight text-[color:var(--color-brand-500)] opacity-[0.22] transition-opacity duration-300 group-hover:opacity-40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="-mt-2">
                <h4 className="text-[0.95rem] font-semibold leading-snug tracking-tight text-[color:var(--color-text-light)]">
                  {p.title}
                </h4>
                <p className="mt-2.5 text-[13.5px] leading-[1.78] text-[color:var(--color-muted-light)]">
                  {p.body}
                </p>
              </div>
              <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-[color:var(--color-brand-500)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>

      </Container>
    </Section>
  );
}
