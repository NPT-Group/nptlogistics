"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import type { IndustryPageModel } from "@/config/industryPages";
import { cn } from "@/lib/cn";
import { THEME_ACCENT, THEME_BG, THEME_LIGHT_BG } from "./industryTheme";
import { IndustrySectionWidget } from "./widgets";

export function IndustryWhatMatters({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const { whatMatters, hero } = model;
  const variant = whatMatters.variant ?? "ops-grid";
  const industry = model.key;
  const theme = hero.theme;
  const sectionBg = THEME_LIGHT_BG[theme];
  const accentColor = THEME_ACCENT[theme];
  const boardSurface = THEME_BG[theme];

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };
  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };

  const SECTION_HEADING_ID = "what-matters-heading";
  const first = whatMatters.items[0];
  const second = whatMatters.items[1];
  const third = whatMatters.items[2];

  return (
    <Section
      variant="light"
      id="what-matters"
      aria-labelledby={SECTION_HEADING_ID}
      className="relative scroll-mt-24 overflow-hidden sm:scroll-mt-28"
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
      <Container className="site-page-container relative">
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
            className={cn(
              "mt-10 sm:mt-12",
              variant === "timeline"
                ? "relative grid gap-4 lg:grid-cols-12 lg:gap-6 lg:pt-8"
                : variant === "control-board"
                  ? "grid gap-4 lg:grid-cols-12 lg:gap-6"
                  : "grid gap-4 lg:grid-cols-12 lg:gap-6",
            )}
          >
            {variant === "timeline" ? (
              <>
                {first ? (
                  <motion.article
                    variants={fadeUp}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-light)]/80 bg-white/95 p-6 shadow-[0_4px_20px_rgba(2,6,23,0.07)] transition-all duration-300 hover:shadow-[0_10px_26px_rgba(2,6,23,0.12)] sm:p-7",
                      industry === "automotive" ? "lg:col-span-6" : "lg:col-span-3",
                    )}
                    style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                  >
                    <h3 className="text-[1.13rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                      {first.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">{first.body}</p>
                  </motion.article>
                ) : null}
                {second ? (
                  <motion.article
                    variants={fadeUp}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-light)]/80 bg-white/95 p-6 shadow-[0_4px_20px_rgba(2,6,23,0.07)] transition-all duration-300 hover:shadow-[0_10px_26px_rgba(2,6,23,0.12)] sm:p-7",
                      industry === "automotive" ? "lg:col-span-3" : "lg:col-span-6",
                    )}
                    style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                  >
                    <h3 className="text-[1.06rem] font-semibold tracking-tight text-[color:var(--color-text-light)]">
                      {second.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">{second.body}</p>
                  </motion.article>
                ) : null}
                {third ? (
                  <motion.article
                    variants={fadeUp}
                    className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-light)]/80 bg-white/95 p-6 shadow-[0_4px_20px_rgba(2,6,23,0.07)] transition-all duration-300 hover:shadow-[0_10px_26px_rgba(2,6,23,0.12)] sm:p-7 lg:col-span-3"
                    style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                  >
                    <h3 className="text-[1.06rem] font-semibold tracking-tight text-[color:var(--color-text-light)]">
                      {third.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">{third.body}</p>
                  </motion.article>
                ) : null}
              </>
            ) : null}

            {variant === "control-board" ? (
              <>
                <div
                  className="rounded-2xl border border-[color:var(--color-border-light)]/80 p-4 shadow-[0_10px_28px_rgba(2,6,23,0.12)] lg:col-span-12"
                  style={{
                    backgroundColor: boardSurface,
                    backgroundImage:
                      "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01) 45%, rgba(0,0,0,0.08))",
                  }}
                >
                  <div className={cn("grid gap-4", industry === "food" ? "lg:grid-cols-12" : "lg:grid-cols-12")}>
                    {industry === "food" ? (
                      <>
                        {first ? (
                          <motion.article
                            variants={fadeUp}
                            className="relative overflow-hidden rounded-xl border border-white/20 bg-white/[0.06] p-6 lg:col-span-7"
                            style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                          >
                            <h3 className="text-[1.14rem] font-semibold tracking-tight text-white sm:text-[1.2rem]">{first.title}</h3>
                            <p className="mt-3 text-[13.5px] leading-[1.75] text-white/80 sm:text-[14px]">{first.body}</p>
                          </motion.article>
                        ) : null}
                        <div className="grid gap-4 lg:col-span-5">
                          {second ? (
                            <motion.article
                              variants={fadeUp}
                              className="relative overflow-hidden rounded-xl border border-white/20 bg-white/[0.06] p-5"
                              style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                            >
                              <h3 className="text-[1.06rem] font-semibold tracking-tight text-white">{second.title}</h3>
                              <p className="mt-3 text-[13.5px] leading-[1.72] text-white/80 sm:text-[14px]">{second.body}</p>
                            </motion.article>
                          ) : null}
                          {third ? (
                            <motion.article
                              variants={fadeUp}
                              className="relative overflow-hidden rounded-xl border border-white/20 bg-white/[0.06] p-5"
                              style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                            >
                              <h3 className="text-[1.06rem] font-semibold tracking-tight text-white">{third.title}</h3>
                              <p className="mt-3 text-[13.5px] leading-[1.72] text-white/80 sm:text-[14px]">{third.body}</p>
                            </motion.article>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid gap-4 lg:col-span-5">
                          {first ? (
                            <motion.article
                              variants={fadeUp}
                              className="relative overflow-hidden rounded-xl border border-white/20 bg-white/[0.06] p-5"
                              style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                            >
                              <h3 className="text-[1.06rem] font-semibold tracking-tight text-white">{first.title}</h3>
                              <p className="mt-3 text-[13.5px] leading-[1.72] text-white/80 sm:text-[14px]">{first.body}</p>
                            </motion.article>
                          ) : null}
                          {second ? (
                            <motion.article
                              variants={fadeUp}
                              className="relative overflow-hidden rounded-xl border border-white/20 bg-white/[0.06] p-5"
                              style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                            >
                              <h3 className="text-[1.06rem] font-semibold tracking-tight text-white">{second.title}</h3>
                              <p className="mt-3 text-[13.5px] leading-[1.72] text-white/80 sm:text-[14px]">{second.body}</p>
                            </motion.article>
                          ) : null}
                        </div>
                        {third ? (
                          <motion.article
                            variants={fadeUp}
                            className="relative overflow-hidden rounded-xl border border-white/20 bg-white/[0.06] p-6 lg:col-span-7"
                            style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                          >
                            <h3 className="text-[1.14rem] font-semibold tracking-tight text-white sm:text-[1.2rem]">{third.title}</h3>
                            <p className="mt-3 text-[13.5px] leading-[1.75] text-white/80 sm:text-[14px]">{third.body}</p>
                          </motion.article>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : null}

            {variant === "ops-grid" ? (
              <>
                {industry === "retail" ? (
                  <>
                    {[first, second, third].map((item) =>
                      item ? (
                        <motion.article
                          key={item.title}
                          variants={fadeUp}
                          className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-light)]/75 bg-white p-6 shadow-[0_2px_16px_rgba(2,6,23,0.06)] transition-all duration-300 hover:border-[color:var(--color-border-light)] hover:shadow-[0_8px_32px_rgba(2,6,23,0.1)] sm:p-7 lg:col-span-4"
                          style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                        >
                          <h3 className="relative text-[1.125rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                            {item.title}
                          </h3>
                          <p className="relative mt-3.5 text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">{item.body}</p>
                        </motion.article>
                      ) : null,
                    )}
                  </>
                ) : (
                  <>
                    {first ? (
                      <motion.article
                        variants={fadeUp}
                        className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-light)]/75 bg-white p-6 shadow-[0_2px_16px_rgba(2,6,23,0.06)] transition-all duration-300 hover:border-[color:var(--color-border-light)] hover:shadow-[0_8px_32px_rgba(2,6,23,0.1)] sm:p-7 lg:col-span-4 lg:row-span-2"
                        style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                      >
                        <h3 className="relative text-[1.125rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                          {first.title}
                        </h3>
                        <p className="relative mt-3.5 text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">{first.body}</p>
                      </motion.article>
                    ) : null}
                    {second ? (
                      <motion.article
                        variants={fadeUp}
                        className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-light)]/75 bg-white p-6 shadow-[0_2px_16px_rgba(2,6,23,0.06)] transition-all duration-300 hover:border-[color:var(--color-border-light)] hover:shadow-[0_8px_32px_rgba(2,6,23,0.1)] sm:p-7 lg:col-span-8"
                        style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                      >
                        <h3 className="relative text-[1.125rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                          {second.title}
                        </h3>
                        <p className="relative mt-3.5 text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">{second.body}</p>
                      </motion.article>
                    ) : null}
                    {third ? (
                      <motion.article
                        variants={fadeUp}
                        className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-light)]/75 bg-white p-6 shadow-[0_2px_16px_rgba(2,6,23,0.06)] transition-all duration-300 hover:border-[color:var(--color-border-light)] hover:shadow-[0_8px_32px_rgba(2,6,23,0.1)] sm:p-7 lg:col-span-8"
                        style={{ borderLeftWidth: "3px", borderLeftColor: accentColor }}
                      >
                        <h3 className="relative text-[1.125rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                          {third.title}
                        </h3>
                        <p className="relative mt-3.5 text-[13.5px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[14px]">{third.body}</p>
                      </motion.article>
                    ) : null}
                  </>
                )}
              </>
            ) : null}
          </motion.div>

          {whatMatters.interactiveWidget ? (
            <motion.div variants={fadeUp} className="mt-10 sm:mt-12">
              <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
                <div className={cn("h-full", industry === "industrial-energy" || industry === "steel-aluminum" ? "lg:col-span-7 lg:order-2" : "lg:col-span-6")}>
                  <IndustrySectionWidget widgetType={whatMatters.interactiveWidget} accentColor={accentColor} />
                </div>
                {(whatMatters.widgetSupportTitle != null || whatMatters.widgetSupportBody != null || (whatMatters.widgetSupportBullets?.length ?? 0) > 0) ? (
                  <div className={cn("h-full flex flex-col", industry === "industrial-energy" || industry === "steel-aluminum" ? "lg:col-span-5 lg:order-1" : "lg:col-span-6")}>
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
