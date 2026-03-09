"use client";

/**
 * Operating Model — LOCKED to about-page + homepage standards.
 * - Section: py-14 sm:py-16, scroll-mt-24 sm:scroll-mt-28, id="operating-model"
 * - Container: site-page-container
 * - Header: red bar + sectionLabel + h2 scale 1.6rem → 1.95rem → 2.2rem (WhoWeAre/AboutHero)
 * - Dark variant, useReducedMotion for all animations, viewport once: true
 * - Desktop: 6-col grid, alternating up/down cards, node row with thread line
 * - Mobile: left-ruled vertical list (lg:hidden)
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";

type Step = Readonly<{
  number: string;
  title: string;
  body: string;
  tag: string;
}>;

type Data = Readonly<{
  title: string;
  subtitle: string;
  supportingLine: string;
  sectionLabel: string;
  steps: readonly Step[];
}>;

export function OperatingModel({ data }: { data: Data }) {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };

  const fadeDown: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: -14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };

  const fadeLeft: Variants = reduceMotion
    ? { hidden: { opacity: 1, x: 0 }, show: { opacity: 1, x: 0 } }
    : { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } } };

  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } } };

  const nodePop: Variants = reduceMotion
    ? { hidden: { opacity: 1, scale: 1 }, show: { opacity: 1, scale: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.5 },
        show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
      };

  const cardStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.11)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08)",
  };

  return (
    <Section
      variant="dark"
      id="operating-model"
      className="relative scroll-mt-24 overflow-hidden sm:scroll-mt-28"
      style={{ backgroundColor: "var(--color-about-operating-bg)" }}
    >
      {/* Background depth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.08),transparent_60%)]" />
        <div className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(185,28,28,0.05),transparent_65%)]" />
      </div>

      <Container className="site-page-container relative">

        {/* ── Section header ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
            <span className="text-[10.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--color-brand-500)]">
              {data.sectionLabel}
            </span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[1.6rem] font-semibold leading-tight tracking-tight text-white sm:text-[1.95rem] lg:text-[2.2rem]">
                {data.title}
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[rgba(255,255,255,0.44)]">
                {data.supportingLine}
              </p>
            </div>
            <p className="max-w-[28ch] flex-shrink-0 text-[13px] text-[rgba(255,255,255,0.28)] sm:text-right">
              {data.subtitle}
            </p>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════
            DESKTOP — single row, alternating up/down
            Structure per column:
              [card-up]  [empty]   [card-up]  …
              [stem]     [stem]    [stem]     …
              [node]─────[node]────[node]     … ← this row is the thread
              [stem]     [stem]    [stem]     …
              [empty]    [card-dn] [empty]    …
        ════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-12 hidden lg:block"
        >
          {/* Top cards row — only odd-indexed (0,2,4) show cards here */}
          <div className="grid grid-cols-6 gap-3">
            {data.steps.map((step, i) => {
              const isUp = i % 2 === 0;
              return (
                <motion.div key={`top-${step.number}`} variants={isUp ? fadeUp : { hidden: { opacity: 0 }, show: { opacity: 0 } }}>
                  {isUp ? (
                    <div
                      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-[3px] xl:p-6"
                      style={cardStyle}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                        style={{ background: "linear-gradient(90deg,#ef4444 0%,rgba(220,38,38,0.12) 70%,transparent 100%)" }}
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 bottom-0 select-none text-[4.5rem] font-black leading-none text-white opacity-[0.045]"
                      >
                        {step.number}
                      </div>
                      <div className="mb-3 inline-flex items-center rounded-full border border-[rgba(220,38,38,0.35)] bg-[rgba(220,38,38,0.14)] px-2.5 py-[3px]">
                        <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-[#f87171]">
                          {step.tag}
                        </span>
                      </div>
                      <h3 className="relative text-[0.95rem] font-bold leading-snug tracking-tight text-white">
                        {step.title}
                      </h3>
                      <p className="relative mt-2 text-[12.5px] leading-[1.72] text-[rgba(255,255,255,0.54)]">
                        {step.body}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Node row — stems + nodes + horizontal thread line */}
          <div className="relative mt-0 grid grid-cols-6 gap-3">
            {/* Thread line behind nodes */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
              style={{
                background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.13) 4%, rgba(255,255,255,0.13) 96%, transparent 100%)",
              }}
            />
            {data.steps.map((step, i) => {
              const isUp = i % 2 === 0;
              return (
                <div key={`node-${step.number}`} className="group flex flex-col items-center">
                  {/* Stem top */}
                  <div className={`w-px transition-colors duration-300 group-hover:bg-[rgba(220,38,38,0.5)] ${isUp ? "h-5 bg-[rgba(255,255,255,0.12)]" : "h-5 bg-transparent"}`} />
                  {/* Node */}
                  <motion.div variants={nodePop}>
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[rgba(220,38,38,0.55)] bg-[color:var(--color-about-operating-bg)] shadow-[0_0_0_3px_rgba(220,38,38,0.07)] transition-all duration-300 group-hover:border-[color:var(--color-brand-500)] group-hover:bg-[color:var(--color-brand-500)] group-hover:shadow-[0_0_0_5px_rgba(220,38,38,0.15)]">
                      <span className="text-[11px] font-bold tabular-nums text-[#f87171] transition-colors duration-300 group-hover:text-white">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>
                  {/* Stem bottom */}
                  <div className={`w-px transition-colors duration-300 group-hover:bg-[rgba(220,38,38,0.5)] ${!isUp ? "h-5 bg-[rgba(255,255,255,0.12)]" : "h-5 bg-transparent"}`} />
                </div>
              );
            })}
          </div>

          {/* Bottom cards row — only even-indexed (1,3,5) show cards here */}
          <div className="grid grid-cols-6 gap-3">
            {data.steps.map((step, i) => {
              const isDown = i % 2 !== 0;
              return (
                <motion.div key={`bot-${step.number}`} variants={isDown ? fadeDown : { hidden: { opacity: 0 }, show: { opacity: 0 } }}>
                  {isDown ? (
                    <div
                      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:translate-y-[3px] xl:p-6"
                      style={cardStyle}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                        style={{ background: "linear-gradient(90deg,#ef4444 0%,rgba(220,38,38,0.12) 70%,transparent 100%)" }}
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 bottom-0 select-none text-[4.5rem] font-black leading-none text-white opacity-[0.045]"
                      >
                        {step.number}
                      </div>
                      <div className="mb-3 inline-flex items-center rounded-full border border-[rgba(220,38,38,0.35)] bg-[rgba(220,38,38,0.14)] px-2.5 py-[3px]">
                        <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-[#f87171]">
                          {step.tag}
                        </span>
                      </div>
                      <h3 className="relative text-[0.95rem] font-bold leading-snug tracking-tight text-white">
                        {step.title}
                      </h3>
                      <p className="relative mt-2 text-[12.5px] leading-[1.72] text-[rgba(255,255,255,0.54)]">
                        {step.body}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            MOBILE / TABLET — left-ruled vertical
        ════════════════════════════════════════ */}
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="relative mt-12 flex flex-col lg:hidden"
        >
          <motion.div
            variants={{
              hidden: { scaleY: 0 },
              show: { scaleY: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 } },
            }}
            className="absolute top-0 bottom-0 left-[19px] w-px origin-top bg-[linear-gradient(to_bottom,rgba(220,38,38,0.65)_0%,rgba(220,38,38,0.10)_88%,transparent_100%)]"
          />
          {data.steps.map((step) => (
            <motion.li key={step.number} variants={fadeLeft} className="relative flex gap-5 pb-7 last:pb-0">
              <div className="relative z-10 flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[rgba(220,38,38,0.55)] bg-[color:var(--color-about-operating-bg)] shadow-[0_0_0_3px_rgba(220,38,38,0.07)]">
                  <span className="text-[11px] font-bold tabular-nums text-[#f87171]">
                    {step.number}
                  </span>
                </div>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-xl p-5" style={cardStyle}>
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl bg-[linear-gradient(90deg,#ef4444_0%,rgba(220,38,38,0.10)_65%,transparent_100%)]" />
                <div className="mb-2.5 inline-flex items-center rounded-full border border-[rgba(220,38,38,0.35)] bg-[rgba(220,38,38,0.14)] px-2.5 py-[3px]">
                  <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-[#f87171]">
                    {step.tag}
                  </span>
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute right-3 bottom-0 select-none text-[4rem] font-black leading-none text-white opacity-[0.045]">
                  {step.number}
                </div>
                <h3 className="relative text-[0.95rem] font-bold leading-snug tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-[13px] leading-[1.75] text-[rgba(255,255,255,0.54)]">
                  {step.body}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* ── Bottom callout ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-2.5 text-center sm:mt-12"
        >
          <div className="h-px w-12 bg-[rgba(255,255,255,0.10)]" />
          <p className="max-w-[50ch] text-[13px] leading-[1.72] text-[rgba(255,255,255,0.44)]">
            This sequence runs on every load — asset or brokerage, domestic or cross-border.
            Consistency is the product.
          </p>
        </motion.div>

      </Container>
    </Section>
  );
}
