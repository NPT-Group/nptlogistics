"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import type { IndustryPageModel } from "@/config/industryPages";
import type { IndustryKey } from "@/config/industries";
import { THEME_ACCENT, THEME_PROOF_BG } from "./industryTheme";

function clampScore(value: number): number {
  return Math.max(10, Math.min(100, value));
}

function getChartStyle(industry: IndustryKey, accentColor: string) {
  switch (industry) {
    case "manufacturing":
      return {
        panelBg: "rgba(248,250,252,0.92)",
        marketColor: "#9ca3af",
        gridColor: "rgba(148,163,184,0.22)",
        borderColor: "rgba(148,163,184,0.35)",
        barWidth: "16px",
        barRadius: "4px 4px 0 0",
        gap: "10px",
        nptFill: accentColor,
      };
    case "retail":
      return {
        panelBg: "rgba(255,255,255,0.9)",
        marketColor: "#c7cdd6",
        gridColor: "rgba(148,163,184,0.18)",
        borderColor: "rgba(147,197,253,0.35)",
        barWidth: "16px",
        barRadius: "8px 8px 0 0",
        gap: "10px",
        nptFill: accentColor,
      };
    case "food":
      return {
        panelBg: "rgba(247,250,247,0.92)",
        marketColor: "#c5ccd4",
        gridColor: "rgba(34,197,94,0.16)",
        borderColor: "rgba(52,211,153,0.34)",
        barWidth: "14px",
        barRadius: "999px 999px 0 0",
        gap: "10px",
        nptFill: `linear-gradient(180deg, ${accentColor} 0%, rgba(16,185,129,0.95) 100%)`,
      };
    case "industrial-energy":
      return {
        panelBg: "rgba(249,250,251,0.92)",
        marketColor: "#9aa3b2",
        gridColor: "rgba(120,113,108,0.22)",
        borderColor: "rgba(180,83,9,0.34)",
        barWidth: "18px",
        barRadius: "5px 5px 0 0",
        gap: "10px",
        nptFill: accentColor,
      };
    case "steel-aluminum":
      return {
        panelBg: "rgba(248,250,252,0.94)",
        marketColor: "#a8b0bd",
        gridColor: "rgba(100,116,139,0.22)",
        borderColor: "rgba(100,116,139,0.4)",
        barWidth: "16px",
        barRadius: "4px 4px 0 0",
        gap: "10px",
        nptFill: `repeating-linear-gradient(180deg, ${accentColor} 0 10px, rgba(100,116,139,0.94) 10px 12px)`,
      };
    case "automotive":
    default:
      return {
        panelBg: "rgba(248,250,252,0.92)",
        marketColor: "#d1d5db",
        gridColor: "rgba(148,163,184,0.2)",
        borderColor: "rgba(148,163,184,0.32)",
        barWidth: "16px",
        barRadius: "4px 4px 0 0",
        gap: "10px",
        nptFill: accentColor,
      };
  }
}

function renderChartByIndustry(
  industry: IndustryKey,
  pillars: IndustryPageModel["trustProof"]["pillars"],
  accentColor: string,
) {
  const style = getChartStyle(industry, accentColor);

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: style.panelBg,
        borderColor: style.borderColor,
      }}
    >
      <div className="relative grid min-h-[170px] grid-cols-3 items-end gap-4">
        <div className="pointer-events-none absolute inset-x-0 top-3 bottom-8">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute left-0 right-0 border-t"
              style={{ bottom: `calc(${mark}% - 1px)`, borderColor: style.gridColor }}
              aria-hidden
            />
          ))}
        </div>

        {pillars.map((pillar) => (
          <div key={pillar.title} className="relative z-10 flex flex-col items-center">
            <div className="flex h-32 items-end" style={{ gap: style.gap }}>
              <div
                className="shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                style={{
                  width: style.barWidth,
                  borderRadius: style.barRadius,
                  height: `${clampScore(pillar.industryScore)}%`,
                  backgroundColor: style.marketColor,
                }}
                aria-hidden
              />
              <div
                className="shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_3px_8px_rgba(2,6,23,0.09)]"
                style={{
                  width: style.barWidth,
                  borderRadius: style.barRadius,
                  height: `${clampScore(pillar.nptScore)}%`,
                  background: style.nptFill,
                }}
                aria-hidden
              />
            </div>
            <p className="mt-2 line-clamp-2 text-center text-[11px] leading-[1.35] text-[color:var(--color-muted-light)]">
              {pillar.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[color:var(--color-border-light)]/70 pt-3 text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-[color:var(--color-muted-light)]">
          <span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: style.marketColor }} aria-hidden />
          Typical market
        </span>
        <span className="inline-flex items-center gap-1.5 text-[color:var(--color-muted-light)]">
          <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: style.nptFill }} aria-hidden />
          NPT standard
        </span>
      </div>
    </div>
  );
}

export function IndustryTrustProof({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const { trustProof, hero } = model;
  const theme = hero.theme;
  const sectionBg = THEME_PROOF_BG[theme];
  const accentColor = THEME_ACCENT[theme];

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };
  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };
  const chartPillars = trustProof.pillars.slice(0, 3);

  return (
    <Section
      variant="light"
      id="trust-proof"
      className="relative scroll-mt-24 overflow-hidden sm:scroll-mt-28"
      style={{ backgroundColor: sectionBg }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <Container className="site-page-container relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
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

          <motion.div variants={stagger} className="mt-6 grid gap-5 sm:mt-8 lg:grid-cols-12 lg:gap-6">
            <motion.article
              variants={fadeUp}
              className="rounded-2xl border border-[color:var(--color-border-light)]/85 bg-white p-5 shadow-[0_8px_24px_rgba(2,6,23,0.07)] lg:col-span-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[1rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.08rem]">
                  {trustProof.comparisonHeading ?? "NPT relative to typical market practice"}
                </h3>
              </div>
              <div className="mt-5">{renderChartByIndustry(model.key, chartPillars, accentColor)}</div>
            </motion.article>

            <motion.div variants={stagger} className="space-y-3 lg:col-span-7">
              {trustProof.pillars.map((pillar) => (
                <motion.article
                  key={pillar.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-[color:var(--color-border-light)]/85 bg-white p-4.5 shadow-[0_5px_18px_rgba(2,6,23,0.06)]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold tracking-[0.08em] text-white"
                      style={{ backgroundColor: accentColor }}
                      aria-hidden
                    >
                      {pillar.icon}
                    </span>
                    <div>
                      <h4 className="text-[1rem] font-semibold tracking-tight text-[color:var(--color-text-light)]">{pillar.title}</h4>
                      <p className="mt-1 text-[13px] leading-[1.65] text-[color:var(--color-muted-light)]">
                        <span className="font-semibold text-[color:var(--color-text-light)]">Typical market: </span>
                        {pillar.industryBaseline}
                      </p>
                      <p className="mt-1.5 text-[13px] leading-[1.65] text-[color:var(--color-muted-light)]">
                        <span className="font-semibold text-[color:var(--color-text-light)]">NPT: </span>
                        {pillar.nptStandard}
                      </p>
                      <p className="mt-2 rounded-lg bg-[color:var(--color-surface-0-light)]/70 px-3 py-2 text-[12.5px] leading-[1.6] text-[color:var(--color-text-light)]">
                        <span className="font-semibold">Evidence: </span>
                        {pillar.evidence}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>

          {trustProof.evidenceNote ? (
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-3xl text-[13px] leading-[1.7] text-[color:var(--color-muted-light)] sm:mt-6 sm:text-[14px]"
            >
              {trustProof.evidenceNote}
            </motion.p>
          ) : null}
        </motion.div>
      </Container>
    </Section>
  );
}
