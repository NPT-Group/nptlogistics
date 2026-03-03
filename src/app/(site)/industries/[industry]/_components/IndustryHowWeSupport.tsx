"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { SectionImage } from "@/components/media/SectionImage";
import type { IndustryPageModel } from "@/config/industryPages";
import { cn } from "@/lib/cn";
import { THEME_ACCENT, THEME_BG, getThemeBarGradient, getThemeOrbs } from "./industryTheme";

// Desktop trailer-bed tuning controls (px). Keep X at 0 or negative to avoid cab overlap.
const DESKTOP_CARD_OFFSET_X = 80;
const DESKTOP_CARD_OFFSET_Y = 10;
const DESKTOP_CARD_BED_BASE = 130;
const DESKTOP_CARD_SAFE_RIGHT = "34%";

export function IndustryHowWeSupport({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { howWeSupport, hero } = model;
  const theme = hero.theme;
  const accentColor = THEME_ACCENT[theme];
  const sectionBg = THEME_BG[theme];
  const orbs = getThemeOrbs(theme);
  const barGradient = getThemeBarGradient(theme);

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
      };
  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };

  const sectionHeadingId = "how-we-support-heading";
  const desktopExpandedCardIndex = hoveredCard ?? activeCard ?? 0;

  return (
    <Section
      id="how-we-support"
      variant="dark"
      aria-labelledby={sectionHeadingId}
      className="relative scroll-mt-24 overflow-hidden sm:scroll-mt-28"
      style={{ backgroundColor: sectionBg }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-6 -left-24 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: orbs.main }}
        />
        <div
          className="absolute -right-24 bottom-10 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: orbs.secondary }}
        />
      </div>
      <Container className="site-page-container relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
        >
          <motion.header variants={fadeUp} className="max-w-3xl">
            <div
              className="mb-3 h-[2px] w-10 sm:w-14"
              style={{ backgroundColor: accentColor }}
              aria-hidden
            />
            <h2
              id={sectionHeadingId}
              className="text-[1.6rem] leading-tight font-semibold tracking-tight text-[color:var(--color-text)] sm:text-[1.95rem] lg:text-[2.2rem]"
            >
              {howWeSupport.sectionTitle}
            </h2>
            <p className="mt-2 text-sm leading-[1.75] text-[color:var(--color-muted)] sm:text-[15px]">
              {howWeSupport.intro}
            </p>
          </motion.header>

          <motion.div variants={fadeUp} className="relative mt-8 sm:mt-10">
            <div className="grid gap-4 sm:grid-cols-2 2xl:hidden">
              {howWeSupport.cards.map((card) => (
                <article
                  key={`${card.title}-stacked`}
                  className="group relative min-h-[224px] rounded-2xl border border-white/18 bg-white/[0.06] p-5 text-left shadow-[0_8px_22px_rgba(2,6,23,0.24)] backdrop-blur-sm"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[2px] opacity-90"
                    style={{ background: barGradient }}
                    aria-hidden
                  />
                  {card.metric ? (
                    <span
                      className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
                      style={{ color: accentColor }}
                    >
                      {card.metric}
                    </span>
                  ) : null}
                  {card.eyebrow ? (
                    <p className="mt-2.5 text-[10px] font-semibold tracking-[0.12em] text-white/70 uppercase">
                      {card.eyebrow}
                    </p>
                  ) : null}
                  <h3 className="mt-1 text-[1.05rem] leading-tight font-semibold tracking-tight text-white sm:text-[1.1rem]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.6] text-white/85 sm:text-[13.5px]">{card.summary}</p>
                  <p className="mt-2 text-[12.5px] leading-[1.65] text-white/75 sm:text-[13px]">{card.details}</p>
                </article>
              ))}
            </div>

            <div className="relative left-1/2 z-10 mt-4 hidden w-screen -translate-x-1/2 2xl:block">
              <div className="mx-auto w-full px-0">
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 bottom-7 h-[2px] bg-[length:140px_2px] bg-repeat-x opacity-55",
                    !reduceMotion && "animate-industry-road-flow",
                  )}
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(255,255,255,0.55) 0, rgba(255,255,255,0.55) 46%, transparent 46%, transparent 100%)",
                  }}
                />
                <div className="relative overflow-visible">
                  <div
                    className="absolute left-0 z-20 hidden items-end gap-4 pb-2 2xl:flex"
                    style={{
                      right: DESKTOP_CARD_SAFE_RIGHT,
                      bottom: `${DESKTOP_CARD_BED_BASE}px`,
                      transform: `translate(${DESKTOP_CARD_OFFSET_X}px, ${DESKTOP_CARD_OFFSET_Y}px)`,
                    }}
                  >
                    {howWeSupport.cards.map((card, index) => {
                      const expanded = desktopExpandedCardIndex === index;
                      const collapsedCount = Math.max(1, howWeSupport.cards.length - 1);
                      const expandedBasis = 42;
                      const collapsedBasis = (100 - expandedBasis) / collapsedCount;
                      return (
                        <button
                          key={`${card.title}-desktop`}
                          type="button"
                          onMouseEnter={() => setHoveredCard(index)}
                          onMouseLeave={() =>
                            setHoveredCard((current) => (current === index ? null : current))
                          }
                          onFocus={() => setActiveCard(index)}
                          onBlur={() =>
                            setActiveCard((current) => (current === index ? 0 : current))
                          }
                          onClick={() =>
                            setActiveCard((current) => (current === index ? 0 : index))
                          }
                          className={cn(
                            "group relative h-[220px] w-auto shrink-0 overflow-hidden rounded-2xl border border-white/18 bg-white/[0.06] p-4 text-left shadow-[0_8px_22px_rgba(2,6,23,0.24)] backdrop-blur-sm transition-[flex-basis,border-color,transform,box-shadow,background-color] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] xl:h-[226px] xl:p-5",
                            expanded && "border-white/30 bg-white/[0.09] shadow-[0_14px_30px_rgba(2,6,23,0.35)]",
                            "focus-ring-surface",
                          )}
                          style={{ flexBasis: `${expanded ? expandedBasis : collapsedBasis}%` }}
                          aria-expanded={expanded}
                          aria-label={`${card.title}. ${expanded ? "Collapse details" : "Expand details"}`}
                        >
                          <div
                            className="absolute inset-x-0 top-0 h-[2px] opacity-90"
                            style={{ background: barGradient }}
                            aria-hidden
                          />
                          {card.metric ? (
                            <span
                              className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
                              style={{ color: accentColor }}
                            >
                              {card.metric}
                            </span>
                          ) : null}
                          {card.eyebrow ? (
                            <p className="mt-2.5 text-[10px] font-semibold tracking-[0.12em] text-white/70 uppercase">
                              {card.eyebrow}
                            </p>
                          ) : null}
                          <h3
                            className={cn(
                              "mt-1 text-[1.05rem] leading-tight font-semibold tracking-tight text-white sm:text-[1.1rem]",
                              expanded ? "line-clamp-none" : "line-clamp-2",
                            )}
                          >
                            {card.title}
                          </h3>
                          <p
                            className={cn(
                              "mt-2 text-[13px] leading-[1.6] text-white/80 transition-opacity duration-300 sm:text-[13.5px]",
                              expanded ? "line-clamp-4 opacity-100" : "line-clamp-2 opacity-95",
                            )}
                          >
                            {card.summary}
                          </p>
                          <p
                            className={cn(
                              "text-[12.5px] leading-[1.65] text-white/70 transition-all duration-500 sm:text-[13px]",
                              expanded
                                ? "mt-2 line-clamp-3 opacity-100"
                                : "mt-0 max-h-0 overflow-hidden opacity-0",
                            )}
                          >
                            {card.details}
                          </p>
                          <span className="mt-1.5 inline-flex items-center text-[11px] font-medium text-white/80">
                            {expanded ? "Read less" : "Read more"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className={cn("relative", !reduceMotion && "animate-industry-truck-move")}>
                    <SectionImage
                      src="/industries/movingTruck_Img.png"
                      alt="NPT truck illustration"
                      width={2000}
                      height={614}
                      className="h-[250px] w-[102vw] max-w-none -translate-x-[1vw] object-contain object-bottom select-none sm:h-[305px] lg:h-[370px]"
                      sizes="(min-width: 1536px) 1440px, (min-width: 1024px) calc(100vw - 3rem), calc(100vw - 2rem)"
                    />
                  </div>
                </div>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 z-20 hidden h-2 w-[74%] -translate-x-1/2 rounded-full bg-black/25 blur-sm 2xl:block"
                style={{ bottom: `${DESKTOP_CARD_BED_BASE + DESKTOP_CARD_OFFSET_Y - 2}px` }}
              />
              <div className="mx-auto mt-2 hidden h-[1px] w-[98vw] bg-gradient-to-r from-transparent via-white/30 to-transparent sm:mt-3 2xl:block" />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
