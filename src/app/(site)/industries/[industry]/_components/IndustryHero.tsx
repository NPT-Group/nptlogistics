"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { trackCtaClick } from "@/lib/analytics/cta";
import { cn } from "@/lib/cn";
import type { IndustryPageModel, IndustryHeroTheme } from "@/config/industryPages";
import { THEME_ACCENT, THEME_BG } from "./industryTheme";

function themeGradientOverlay(theme: IndustryHeroTheme) {
  switch (theme) {
    case "green":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_500px_at_70%_40%,rgba(16,185,129,0.18),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_20%,rgba(5,150,105,0.10),transparent_55%)]" />
        </>
      );
    case "red":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_500px_at_70%_40%,rgba(220,38,38,0.16),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_20%,rgba(185,28,28,0.08),transparent_55%)]" />
        </>
      );
    case "blue":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_75%_35%,rgba(37,99,235,0.14),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_25%_25%,rgba(59,130,246,0.08),transparent_55%)]" />
        </>
      );
    case "slate":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_70%_40%,rgba(71,85,105,0.14),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_20%,rgba(51,65,85,0.08),transparent_55%)]" />
        </>
      );
    case "amber":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_500px_at_70%_40%,rgba(245,158,11,0.14),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_20%,rgba(217,119,6,0.08),transparent_55%)]" />
        </>
      );
    case "steel":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_70%_40%,rgba(100,116,139,0.12),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_20%,rgba(71,85,105,0.08),transparent_55%)]" />
        </>
      );
    default:
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_500px_at_70%_40%,rgba(220,38,38,0.14),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_20%,rgba(185,28,28,0.06),transparent_55%)]" />
        </>
      );
  }
}

/**
 * Industry-specific hero icons — each communicates operational context
 * for that vertical. Rendered as subtle, premium badges in hero.
 */
function HeroIcon({ name }: { name: string }) {
  const className = "h-7 w-7 text-white/20 sm:h-8 sm:w-8";
  switch (name) {
    case "car":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25V14.25H8.25v4.5zM5.25 14.25h13.5L17.25 9H6.75L5.25 14.25zM3.75 15.75h16.5v2.25a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75V15.75z" />
        </svg>
      );
    case "factory":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 20.25h16.5M4.5 20.25V9.75l5.25 2.25V9.75L15 12V4.5h4.5v15.75M7.5 6V3.75M10.5 6V3.75" />
        </svg>
      );
    case "gear":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "clock":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "cube-stack":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125z" />
        </svg>
      );
    case "wrench":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L18.18 21.93M12 18.75c-3.97 0-7.2-2.239-8.88-5.5a9.07 9.07 0 011.56-2.5 9.07 9.07 0 012.5-1.56C9.76 8.94 12 5.75 12 1.75M12 18.75c3.97 0 7.2-2.239 8.88-5.5a9.07 9.07 0 00-1.56-2.5 9.07 9.07 0 00-2.5-1.56C14.24 8.94 12 5.75 12 1.75" />
        </svg>
      );
    case "truck":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 21h17.25M4.5 21V9.75m15 11.25V9.75M8.25 9.75h6.75V21M4.5 3h15a1.5 1.5 0 011.5 1.5v4.5a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 15V4.5A1.5 1.5 0 014.5 3zm0 6h15v6H4.5V9z" />
        </svg>
      );
    case "rectangle-stack":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
        </svg>
      );
    case "store":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M5.25 9.75V18a2.25 2.25 0 002.25 2.25h9A2.25 2.25 0 0018.75 18V9.75M8.25 20.25v-5.25a1.5 1.5 0 011.5-1.5h4.5a1.5 1.5 0 011.5 1.5v5.25M5.25 9.75l1.5-6h10.5l1.5 6" />
        </svg>
      );
    case "snowflake":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-3 3m3-3l3 3M3 12h18M3 12l3-3m0 6l-3 3M21 12l-3 3m0-6l3-3M12 21l-3-3m3 3l3-3" />
        </svg>
      );
    case "thermometer":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 14.5V5.625a2.25 2.25 0 10-4.5 0V14.5a4.5 4.5 0 104.5 0zM12 7.5v7.5" />
        </svg>
      );
    case "document-check":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5a7.5 7.5 0 000-15h-7.5a7.5 7.5 0 000 15zm3-8.25H12m0 0l2.25 2.25M12 12l2.25-2.25" />
        </svg>
      );
    case "bolt":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
    case "route":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 18.75h4.125a2.625 2.625 0 002.625-2.625V15a2.625 2.625 0 012.625-2.625h1.5A2.625 2.625 0 0018 9.75V9a2.625 2.625 0 00-2.625-2.625H12M6 6.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm15 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      );
    case "cube":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      );
    case "coil":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <circle cx="12" cy="12" r="8.25" />
          <circle cx="12" cy="12" r="5.25" />
          <circle cx="12" cy="12" r="2.25" />
        </svg>
      );
    case "shield":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    default:
      return null;
  }
}

export function IndustryHero({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const { hero } = model;

  const theme = hero.theme ?? "red";
  const bgColor = THEME_BG[theme];
  const accentColor = THEME_ACCENT[theme];

  return (
    <Section
      variant="dark"
      id="industry-hero"
      className="relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:120px_120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_70%,rgba(0,0,0,0.2)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: `linear-gradient(to top, ${bgColor}, transparent)` }} />
        {themeGradientOverlay(theme)}
      </div>

      {/* Industry icon badges — decorative only */}
      {hero.iconKeys?.length ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
          {hero.iconKeys.slice(0, 4).map((key, idx) => {
            const slotClass =
              idx === 0
                ? "top-[18%] left-[6%]"
                : idx === 1
                  ? "top-[22%] right-[10%]"
                  : idx === 2
                    ? "bottom-[22%] left-[10%]"
                    : "bottom-[20%] right-[8%]";
            return (
              <span key={`${key}-${idx}`} className={cn("absolute", slotClass)}>
                <HeroIcon name={key} />
              </span>
            );
          })}
        </div>
      ) : null}

      <Container className="site-page-container relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-3xl py-10 text-center sm:py-12 lg:py-14"
        >
          {hero.kicker ? (
            <p className="mb-2.5 text-[10.5px] font-semibold tracking-[0.14em] uppercase" style={{ color: accentColor }}>
              {hero.kicker}
            </p>
          ) : null}
          <p className="mb-2 text-[1rem] font-semibold tracking-tight sm:text-[1.1rem]" style={{ color: accentColor }}>
            {hero.valueHeadline}
          </p>
          <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-[2.5rem] lg:text-[3rem]">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-[13.5px] leading-[1.75] text-[color:var(--color-muted)] sm:text-[15px]">
            {hero.description}
          </p>
          <div className="mt-8">
            <Link
              href={hero.cta.href}
              onClick={() =>
                trackCtaClick({
                  ctaId: hero.cta.ctaId,
                  location: "industry_hero",
                  destination: hero.cta.href,
                  label: hero.cta.label,
                })
              }
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-md border px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[2px] sm:px-6",
                "focus-ring-surface",
              )}
              style={{
                borderColor: accentColor,
                background: `linear-gradient(180deg, ${accentColor}, ${accentColor}e6)`,
                boxShadow: `0 8px 20px ${accentColor}40`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 28px ${accentColor}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 20px ${accentColor}40`;
              }}
            >
              {hero.cta.label}
            </Link>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
