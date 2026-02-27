"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import type { IndustryPageModel } from "@/config/industryPages";
import { THEME_ACCENT, THEME_LIGHT_BG } from "./industryTheme";
import { IndustrySectionWidget } from "./widgets";

export function IndustryWhatMatters({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const { whatMatters, hero } = model;
  const theme = hero.theme;
  const sectionBg = THEME_LIGHT_BG[theme];
  const accentColor = THEME_ACCENT[theme];

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };
  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };

  const SECTION_HEADING_ID = "what-matters-heading";

  return (
    <Section
      variant="light"
      id="what-matters"
      aria-labelledby={SECTION_HEADING_ID}
      className="relative scroll-mt-24 overflow-hidden pt-10 pb-10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14 sm:scroll-mt-28"
      style={{ backgroundColor: sectionBg }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <Container className="relative max-w-[1440px] px-4 sm:px-6 lg:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className=""
        >
          <motion.header variants={fadeUp} className="max-w-2xl">
            <div className="mb-3 h-[2px] w-10 sm:w-14" style={{ backgroundColor: accentColor }} aria-hidden />
            <h2 id={SECTION_HEADING_ID} className="text-[1.6rem] font-semibold leading-tight tracking-tight text-[color:var(--color-text-light)] sm:text-[1.95rem] lg:text-[2.2rem]">
              {whatMatters.sectionTitle}
            </h2>
            <p className="mt-2 text-sm leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[15px]">
              {whatMatters.intro}
            </p>
          </motion.header>

          <motion.div
            variants={stagger}
            className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {whatMatters.items.map((item, i) => (
              <motion.article
                key={i}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-light)]/70 bg-white p-6 shadow-[0_2px_16px_rgba(2,6,23,0.06)] transition-all duration-300 hover:border-[color:var(--color-border-light)] hover:shadow-[0_8px_32px_rgba(2,6,23,0.1)] sm:p-7"
                style={{
                  borderLeftWidth: "3px",
                  borderLeftColor: accentColor,
                }}
              >
                <div
                  className="absolute top-0 right-0 h-24 w-24 opacity-[0.04] transition-opacity duration-300 group-hover:opacity-[0.07]"
                  style={{ background: `radial-gradient(circle at 100% 0%, ${accentColor}, transparent 70%)` }}
                  aria-hidden
                />
                <h3 className="relative text-[1.125rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]" style={{ color: "var(--color-text-light)" }}>
                  {item.title}
                </h3>
                <p className="relative mt-3.5 text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">
                  {item.body}
                </p>
              </motion.article>
            ))}
          </motion.div>

          {whatMatters.interactiveWidget ? (
            <motion.div variants={fadeUp} className="mt-10 sm:mt-12">
              <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
                <div className="lg:col-span-6 h-full">
                  <IndustrySectionWidget widgetType={whatMatters.interactiveWidget} accentColor={accentColor} />
                </div>
                {(whatMatters.widgetSupportTitle != null || whatMatters.widgetSupportBody != null || (whatMatters.widgetSupportBullets?.length ?? 0) > 0) ? (
                  <div className="lg:col-span-6 h-full flex flex-col">
                    <div className="rounded-2xl border border-[color:var(--color-border-light)]/80 bg-white/95 flex h-full min-h-0 flex-col overflow-hidden shadow-[0_2px_12px_rgba(2,6,23,0.04)] sm:shadow-[0_4px_20px_rgba(2,6,23,0.06)]">
                      <div className="flex-1 min-h-0 p-6 sm:p-7 flex flex-col gap-4">
                        {whatMatters.widgetSupportTitle != null ? (
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden />
                            <h4 className="text-[1.05rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.1rem]" style={{ color: accentColor }}>
                              {whatMatters.widgetSupportTitle}
                            </h4>
                          </div>
                        ) : null}
                        {whatMatters.widgetSupportBody != null ? (
                          <p className="text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">
                            {whatMatters.widgetSupportBody}
                          </p>
                        ) : null}
                        {whatMatters.widgetSupportBullets != null && whatMatters.widgetSupportBullets.length > 0 ? (
                          <ul className="space-y-3 sm:space-y-3.5">
                            {whatMatters.widgetSupportBullets.map((bullet, idx) => (
                              <li key={idx} className="flex gap-3 rounded-lg bg-[color:var(--color-surface-0-light)]/50 px-3 py-2.5 text-[13.5px] leading-[1.6] text-[color:var(--color-muted-light)] sm:text-[14px]">
                                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                      {whatMatters.widgetSupportFooter != null ? (
                        <p className="shrink-0 border-t border-[color:var(--color-border-light)]/50 bg-[color:var(--color-surface-0-light)]/30 px-4 min-h-[2.75rem] flex items-center pb-2.5 pt-2.5 text-[12px] font-medium uppercase tracking-wider text-[color:var(--color-muted-light)] sm:px-5">
                          {whatMatters.widgetSupportFooter}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </motion.div>
      </Container>
    </Section>
  );
}
