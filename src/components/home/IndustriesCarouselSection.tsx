"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
import { INDUSTRIES_SECTION, INDUSTRY_SLIDES, type IndustrySlide } from "@/config/industries";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-0)]";

const TOKENS = {
  section: cn(
    "relative overflow-hidden",
    "bg-[linear-gradient(180deg,#f3ebe1_0%,#e6dacb_32%,#2a3b54_66%,#111c2f_100%)]",
  ),
  container: "relative max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-6 lg:py-12",
  headerWrap: "mx-auto max-w-3xl text-center",
  kicker: "text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]",
  heading:
    "mt-2 text-3xl font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-4xl lg:text-[2.4rem]",
  desc: "mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base",
  shell: cn(
    "relative mx-auto mt-5 overflow-hidden rounded-3xl",
    "border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]",
    "shadow-[0_22px_56px_rgba(2,6,23,0.38),inset_0_1px_0_rgba(255,255,255,0.16)]",
  ),
  stage:
    "relative aspect-[16/9] w-full min-h-[330px] sm:aspect-[16/6.8] sm:min-h-[300px] lg:aspect-[16/6.2] lg:min-h-[320px]",
  overlay:
    "absolute inset-0 bg-[linear-gradient(90deg,rgba(7,15,29,0.86)_0%,rgba(7,15,29,0.68)_48%,rgba(7,15,29,0.28)_100%)] sm:bg-[linear-gradient(90deg,rgba(7,15,29,0.72)_0%,rgba(7,15,29,0.5)_42%,rgba(7,15,29,0.2)_100%)]",
  bottomFadeToLight:
    "pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#f2e9df] sm:h-14",
  content: "relative z-10 flex h-full items-end",
  left: "w-full max-w-2xl px-5 pb-6 sm:px-8 sm:pb-6 lg:px-9 lg:pb-7",
  title:
    "text-[20px] leading-[1.1] font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-[30px] lg:text-[34px]",
  subtitle:
    "mt-1.5 max-w-xl text-[13px] leading-relaxed text-white/88 drop-shadow-[0_2px_8px_rgba(0,0,0,0.42)] sm:text-[14px]",
  ctaRow: "mt-3 flex flex-wrap items-center gap-3",
  ctaPrimary: cn(
    "inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-semibold",
    "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
    "shadow-sm shadow-black/18",
  ),
  ctaSecondary: cn(
    "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold",
    "border border-white/18 bg-white/6 text-white hover:bg-white/10",
    "backdrop-blur",
  ),
  navBar: cn(
    "relative z-20 border-t border-white/12 bg-[linear-gradient(180deg,rgba(7,12,22,0.62),rgba(23,32,45,0.52))]",
    "backdrop-blur-sm",
  ),
  navInner:
    "flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10",
  pills: "hidden flex-wrap gap-2 sm:flex",
  pillBtn:
    "inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-xs font-semibold transition",
  arrows: "flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-end",
  arrowBtn: cn(
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/18 text-white",
    "bg-white/7 hover:bg-white/12 hover:border-white/28 transition",
    "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-white/7 disabled:hover:border-white/18",
  ),
} as const;

function accentGlow(accent: IndustrySlide["accent"]) {
  if (accent === "blue")
    return "radial-gradient(900px 520px at 22% 30%, rgba(37,99,235,0.18), transparent 55%)";
  if (accent === "slate")
    return "radial-gradient(900px 520px at 22% 30%, rgba(148,163,184,0.14), transparent 55%)";
  return "radial-gradient(900px 520px at 22% 30%, rgba(220,38,38,0.18), transparent 55%)";
}

function bottomIndustryTint(key: IndustrySlide["key"]) {
  // Keep tones muted and low-opacity to feel premium, not playful.
  switch (key) {
    case "automotive":
      return "linear-gradient(180deg, transparent 0%, rgba(127,29,29,0.34) 50%, rgba(13,28,49,0.9) 100%)";
    case "manufacturing":
      return "linear-gradient(180deg, transparent 0%, rgba(161,123,84,0.3) 50%, rgba(13,28,49,0.9) 100%)";
    case "retail":
      return "linear-gradient(180deg, transparent 0%, rgba(100,116,139,0.32) 50%, rgba(13,28,49,0.9) 100%)";
    case "food":
      return "linear-gradient(180deg, transparent 0%, rgba(161,98,7,0.32) 50%, rgba(13,28,49,0.9) 100%)";
    case "industrial-energy":
      return "linear-gradient(180deg, transparent 0%, rgba(37,99,235,0.3) 50%, rgba(13,28,49,0.9) 100%)";
    case "steel-aluminum":
      return "linear-gradient(180deg, transparent 0%, rgba(161,98,7,0.3) 50%, rgba(13,28,49,0.9) 100%)";
    default:
      return "linear-gradient(180deg, transparent 0%, rgba(30,41,59,0.3) 50%, rgba(13,28,49,0.9) 100%)";
  }
}

export function IndustriesCarouselSection() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const total = INDUSTRY_SLIDES.length;
  const hasMultiple = total > 1;
  const active = INDUSTRY_SLIDES[index];
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const go = React.useCallback(
    (next: number) => {
      if (total <= 0) return;
      setIndex((next + total) % total);
    },
    [total],
  );

  const goPrev = React.useCallback(() => go(index - 1), [go, index]);
  const goNext = React.useCallback(() => go(index + 1), [go, index]);
  const activeSlideAnnouncement = `${active.label}, slide ${index + 1} of ${total}`;
  const shellId = `${INDUSTRIES_SECTION.id}-carousel`;

  // keyboard: left/right
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev],
  );
  const onTabKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "Home") {
        e.preventDefault();
        setIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        if (total <= 0) return;
        setIndex(total - 1);
      }
    },
    [goNext, goPrev, total],
  );
  const onTouchStart = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.changedTouches[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, []);
  const onTouchEnd = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;
      const start = touchStartRef.current;
      const t = e.changedTouches[0];
      touchStartRef.current = null;
      if (!start || !t) return;

      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const minSwipe = 44;

      // Only trigger on intentional horizontal swipes.
      if (Math.abs(dx) < minSwipe || Math.abs(dx) <= Math.abs(dy)) return;

      if (dx > 0) goPrev();
      else goNext();
    },
    [goNext, goPrev, hasMultiple],
  );

  return (
    <section id={INDUSTRIES_SECTION.id} className={TOKENS.section}>
      <div className="absolute inset-0" aria-hidden="true">
        {/* Soft light entry at top, then deepen toward bottom */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f7f1e8] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(880px_460px_at_14%_12%,rgba(220,38,38,0.12),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(980px_520px_at_86%_112%,rgba(37,99,235,0.1),transparent_64%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(7,12,22,0.24))]" />
        {/* Dynamic bottom tint by industry for subtle premium color matching */}
        <div
          className="absolute inset-x-0 bottom-0 h-[44%]"
          style={{ background: bottomIndustryTint(active.key) }}
        />
      </div>

      <Container className={TOKENS.container}>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {activeSlideAnnouncement}
        </p>
        {/* Header */}
        <div className={TOKENS.headerWrap}>
          <div className="mx-auto mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />
          <div className={TOKENS.kicker}>{INDUSTRIES_SECTION.kicker}</div>
          <h2 className={TOKENS.heading}>{INDUSTRIES_SECTION.heading}</h2>
          <p className={TOKENS.desc}>{INDUSTRIES_SECTION.description}</p>
        </div>

        {/* Carousel */}
        <div
          className={cn(TOKENS.shell, focusRing)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Industries carousel"
          aria-describedby={`${shellId}-status`}
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <p id={`${shellId}-status`} className="sr-only">
            {activeSlideAnnouncement}
          </p>
          <div className={TOKENS.stage} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.key}
                className="absolute inset-0"
                id={`${shellId}-panel`}
                role="tabpanel"
                aria-labelledby={`industry-tab-${active.key}`}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0.0, scale: 1.01 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
              >
                <Image
                  src={active.image}
                  // Decorative: the visible heading/subtitle already conveys meaning.
                  alt=""
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1440px"
                />
              </motion.div>
            </AnimatePresence>

            {/* overlays */}
            <div className={TOKENS.overlay} aria-hidden="true" />
            <div
              className="absolute inset-0"
              style={{ background: accentGlow(active.accent) }}
              aria-hidden="true"
            />
            <div className={TOKENS.bottomFadeToLight} aria-hidden="true" />

            {/* content */}
            <div className={TOKENS.content}>
              {/* Dedicated mobile composition to avoid real-device text metric drift */}
              <div className="w-full px-5 pb-6 sm:hidden">
                <div className="max-w-[20rem] rounded-2xl border border-white/14 bg-black/32 p-3.5 shadow-[0_10px_28px_rgba(2,6,23,0.34)] backdrop-blur-[1.5px]">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[11px] font-semibold text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)]" />
                    <span className="truncate">{active.label}</span>
                  </div>
                  <h3 className="mt-2 text-[19px] leading-[1.1] font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                    {active.mobileTitle ?? active.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/88 drop-shadow-[0_2px_8px_rgba(0,0,0,0.42)]">
                    {active.mobileSubtitle ?? active.subtitle}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link href={active.href} className={cn(TOKENS.ctaPrimary, focusRing)}>
                      Explore {active.label}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Desktop/tablet composition */}
              <div className="hidden w-full sm:block">
                <div className={TOKENS.left}>
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/6 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)]" />
                    <span className="truncate">{active.label}</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${active.key}-copy`}
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
                    >
                      <h3 className={TOKENS.title}>{active.title}</h3>
                      <p className={TOKENS.subtitle}>{active.subtitle}</p>

                      <div className={TOKENS.ctaRow}>
                        <Link href={active.href} className={cn(TOKENS.ctaPrimary, focusRing)}>
                          Explore {active.label}
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* nav */}
          <div className={TOKENS.navBar}>
            <div className={TOKENS.navInner}>
              <div className={TOKENS.pills} role="tablist" aria-label="Select an industry">
                {INDUSTRY_SLIDES.map((s, i) => {
                  const isActive = i === index;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setIndex(i)}
                      onKeyDown={onTabKeyDown}
                      role="tab"
                      id={`industry-tab-${s.key}`}
                      aria-selected={isActive}
                      aria-controls={`${shellId}-panel`}
                      tabIndex={isActive ? 0 : -1}
                      className={cn(
                        TOKENS.pillBtn,
                        focusRing,
                        isActive
                          ? "border-white/24 bg-white/12 text-white"
                          : "border-white/10 bg-white/6 text-white/72 hover:bg-white/10 hover:text-white",
                      )}
                      aria-label={`Show ${s.label}`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <div className={TOKENS.arrows}>
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!hasMultiple}
                  className={cn(TOKENS.arrowBtn, focusRing)}
                  aria-label="Previous industry"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!hasMultiple}
                  className={cn(TOKENS.arrowBtn, focusRing)}
                  aria-label="Next industry"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
