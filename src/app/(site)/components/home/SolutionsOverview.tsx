// src/components/home/SolutionsOverview.tsx
"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { CardImage } from "@/components/media/CardImage";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";
import {
  SOLUTIONS_CATEGORIES,
  SOLUTIONS_DATA,
  type ServiceCard as SolutionServiceCard,
  type CardTheme,
  type SolutionsCategory,
} from "@/config/solutions";
import {
  Truck,
  Package,
  TrainFront,
  Zap,
  Shield,
  Snowflake,
  Globe,
  Warehouse,
  Briefcase,
  Plane,
  Ship,
} from "lucide-react";

const ICONS = {
  truck: Truck,
  package: Package,
  train: TrainFront,
  zap: Zap,
  shield: Shield,
  snowflake: Snowflake,
  globe: Globe,
  warehouse: Warehouse,
  briefcase: Briefcase,
  plane: Plane,
  ship: Ship,
} as const;

const SOLUTIONS_OVERVIEW_TOKENS = {
  autoplayIntervalMs: 8000,
  autoplayDesktopMediaQuery: "(min-width: 1024px)",
  tabProgressTransitionDuration: 0.34,
  tabProgressTransitionEase: "easeInOut" as const,
  panelTransitionDuration: 0.52,
  panelTransitionEase: [0.22, 0.61, 0.36, 1] as const,
  classes: {
    categoryHeaderContainer: "relative max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-6 lg:py-10",
    categoryHeading: "text-3xl font-bold tracking-tight sm:text-[2.15rem] lg:text-[2.6rem]",
    categoryDescription: "mt-2.5 text-base leading-relaxed sm:mt-3 sm:text-lg lg:text-[1.1rem]",
    categoryCardsSection: "bg-[color:var(--color-surface-0-light)] py-7 sm:py-9 lg:py-10",
    introContainer: "relative max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-6 lg:py-10",
    introHeading: "mt-2 text-3xl font-semibold text-white sm:text-4xl lg:text-[2.7rem]",
    introDescription: "mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base",
    tabNavContainer: "max-w-[1440px] px-4 py-3 sm:px-6 sm:py-4 lg:px-6",
    tabNavShell:
      "relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(2,6,23,0.42),inset_0_1px_0_rgba(255,255,255,0.24)]",
    tabButton:
      "group relative rounded-xl border px-3.5 py-2.5 text-left transition-all duration-300",
  },
} as const;

// Deterministic gradients.
const CARD_GRADIENTS: Record<CardTheme | "fallback", string> = {
  navy: "linear-gradient(-16deg, rgba(7,10,18,0.98), rgba(11,16,32,0.92))",
  red: "linear-gradient(-14deg, rgba(8,14,28,0.98), rgba(153,27,27,0.86))",
  slate: "linear-gradient(-16deg, rgba(32,36,43,0.95), rgba(71,85,105,0.9))",
  blue: "linear-gradient(-16deg, rgba(7,18,33,0.96), rgba(30,58,138,0.88))",
  ltl: "linear-gradient(-20deg, rgba(10,15,26,0.95), rgba(30,41,59,0.9))",
  fallback: "linear-gradient(-16deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))",
};

function ServiceIcon({ name }: { name: keyof typeof ICONS }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;

  return (
    <div
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-md",
        "border border-[color:var(--color-brand-600)]/20",
        "bg-[color:var(--color-brand-600)]/8",
      )}
      aria-hidden="true"
    >
      <Cmp className="h-4 w-4 text-[color:var(--color-brand-600)]" />
    </div>
  );
}

function resolveCategoryPresentation(
  category: keyof typeof SOLUTIONS_DATA,
  data: SolutionsCategory,
) {
  // Prefer config if present, otherwise fall back to prior behavior.
  const theme =
    data.theme ??
    (category === "Specialized & Time-Sensitive" || category === "Logistics & Value-Added"
      ? "dark"
      : "default");

  const layout =
    data.layout ??
    (category === "Specialized & Time-Sensitive" ||
    category === "Logistics & Value-Added" ||
    category === "Cross-Border & Global"
      ? "four"
      : "three");

  return {
    isSpecializedThemeCategory: theme === "dark",
    isFourGridCategory: layout === "four",
  };
}

function ServiceCard({
  card,
  categoryKey,
  categoryImage,
  isFourGridCategory,
  isSpecializedThemeCategory,
  cardIndex,
}: {
  card: SolutionServiceCard;
  categoryKey: keyof typeof SOLUTIONS_DATA;
  categoryImage?: string;
  isFourGridCategory: boolean;
  isSpecializedThemeCategory: boolean;
  cardIndex: number;
}) {
  // Preserve prior variety if cardTheme isn’t specified.
  const specializedGradients = [
    "linear-gradient(-16deg, rgba(8,14,28,0.98), rgba(30,41,59,0.9))",
    "linear-gradient(-14deg, rgba(38,8,12,0.98), rgba(153,27,27,0.86))",
    "linear-gradient(-16deg, rgba(32,36,43,0.95), rgba(71,85,105,0.9))",
    "linear-gradient(-16deg, rgba(7,18,33,0.96), rgba(30,58,138,0.88))",
  ] as const;

  const coreThemeGradients = [
    "linear-gradient(-16deg, rgba(8,14,28,0.98), rgba(30,41,59,0.9))",
    "linear-gradient(-14deg, rgba(38,8,12,0.98), rgba(153,27,27,0.86))",
    "linear-gradient(-16deg, rgba(32,36,43,0.95), rgba(71,85,105,0.9))",
    "linear-gradient(-16deg, rgba(7,10,18,0.98), rgba(11,16,32,0.92))",
  ] as const;

  const skewGradient = card.cardTheme
    ? (CARD_GRADIENTS[card.cardTheme] ?? CARD_GRADIENTS.fallback)
    : isSpecializedThemeCategory
      ? specializedGradients[cardIndex % specializedGradients.length]
      : isFourGridCategory
        ? coreThemeGradients[cardIndex % coreThemeGradients.length]
        : CARD_GRADIENTS.fallback;

  const analyticsId =
    card.analyticsId ??
    card.label
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  return (
    <Link
      href={card.href}
      onClick={() =>
        trackCtaClick({
          ctaId: `solutions_card_${analyticsId}`,
          location: `solutions_overview:${String(categoryKey)}`,
          destination: card.href,
          label: card.label,
        })
      }
      className={cn(
        "group relative inline-block h-[360px] w-full max-w-[400px] overflow-hidden rounded-[24px] transition-all duration-500 min-[680px]:h-[372px] sm:h-[390px] sm:rounded-[30px] md:h-[372px] lg:h-[400px]",
        isFourGridCategory && "lg:h-[350px] lg:max-w-none",
        "shadow-[4px_4px_24px_rgba(0,0,0,0.24)] sm:shadow-[5px_5px_30px_rgba(0,0,0,0.3)]",
        "hover:shadow-[5px_5px_40px_rgba(0,0,0,0.35)]",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:outline-none",
      )}
    >
      <div className="absolute top-0 left-0 h-[70%] w-full">
        <CardImage
          src={card.image || categoryImage || "/_optimized/hero/hero-poster.webp"}
          alt={card.label}
          fill
          className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 400px"
        />
      </div>

      <div
        className={cn(
          "absolute top-[54%] left-[-6px] h-[66%] w-[110%] rounded-[24px] min-[680px]:top-[56%] min-[680px]:h-[63%] sm:top-[55%] sm:left-[-5px] sm:h-[65%] sm:w-[108%] sm:rounded-[30px] md:top-[56%] md:h-[63%]",
          isFourGridCategory && "lg:top-[56%] lg:h-[63%]",
          "[transform:skew(19deg,-9deg)] transition-transform duration-500 ease-out",
          "group-hover:[transform:skew(0deg,0deg)]",
        )}
        style={{ backgroundImage: skewGradient }}
      />

      <div
        className={cn(
          "absolute top-[60%] left-5 h-12 w-12 -translate-y-1/2 overflow-hidden rounded-lg bg-white shadow-[4px_4px_22px_rgba(0,0,0,0.5)] min-[680px]:top-[59%] min-[680px]:left-4 min-[680px]:h-11 min-[680px]:w-11 min-[680px]:rounded-lg sm:left-[30px] sm:h-14 sm:w-14 sm:rounded-xl sm:shadow-[5px_5px_30px_rgba(0,0,0,0.65)] md:top-[59%] md:left-4 md:h-11 md:w-11 md:rounded-lg",
          isFourGridCategory && "lg:top-[59%] lg:left-4 lg:h-10 lg:w-10 lg:rounded-lg",
        )}
      >
        <div className="flex h-full w-full items-center justify-center p-1 sm:p-1.5">
          <ServiceIcon name={card.icon} />
        </div>
      </div>

      <div
        className={cn(
          "absolute top-[56%] right-5 bottom-[14%] left-5 grid grid-rows-[auto_1fr_auto] gap-y-2 text-white min-[680px]:top-[58%] min-[680px]:right-4 min-[680px]:bottom-[9%] min-[680px]:left-4 min-[680px]:gap-y-2 sm:top-[58%] sm:right-[30px] sm:bottom-[10%] sm:left-[30px] sm:gap-y-2.5 md:top-[58%] md:right-4 md:bottom-[8%] md:left-4 md:gap-y-2",
          isFourGridCategory && "lg:top-[58%] lg:right-4 lg:bottom-[8%] lg:left-4 lg:gap-y-2",
        )}
      >
        <div
          className={cn(
            "min-h-[80px] pl-[88px] min-[680px]:min-h-[72px] min-[680px]:pl-[72px] sm:min-h-[92px] sm:pl-[120px] md:min-h-[72px] md:pl-[72px]",
            isFourGridCategory && "lg:min-h-[72px] lg:pl-[72px]",
          )}
        >
          <p
            className={cn(
              "[display:-webkit-box] overflow-hidden text-[18px] leading-tight font-extrabold text-white [-webkit-box-orient:vertical] [-webkit-line-clamp:2] min-[680px]:text-[16px] sm:text-[20px] md:text-[16px]",
              isFourGridCategory && "lg:text-[16px]",
            )}
          >
            {card.label}
          </p>
          <p
            className={cn(
              "mt-1 [display:-webkit-box] overflow-hidden text-[13px] leading-snug font-semibold text-white/95 [-webkit-box-orient:vertical] [-webkit-line-clamp:2] min-[680px]:text-[11px] min-[680px]:leading-snug sm:text-[14px] md:text-[11px] md:leading-snug",
              isFourGridCategory && "lg:text-[11px] lg:leading-snug",
            )}
          >
            {card.description}
          </p>
        </div>

        <div className="-translate-y-3 grid grid-cols-1 items-end gap-y-2 pb-4 sm:translate-y-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6 sm:gap-y-0 sm:pb-0">
          {card.bestFor && (
            <p
              className={cn(
                "truncate text-[12px] font-semibold text-white/95 min-[680px]:text-[10px] sm:pr-2 sm:text-[13px] md:text-[10px]",
                isFourGridCategory && "lg:text-[10px]",
              )}
            >
              {card.bestFor}
            </p>
          )}
          <span
            className={cn(
              "mb-2 inline-flex h-10 w-fit min-w-[112px] shrink-0 items-center justify-center gap-2 rounded-md border border-white px-4 text-[13px] font-semibold text-white min-[680px]:mb-1 min-[680px]:h-9 min-[680px]:w-[84px] min-[680px]:px-2.5 min-[680px]:text-[12px] sm:mb-0 sm:ml-2 sm:h-11 sm:w-[106px] sm:min-w-0 sm:px-4 sm:text-[14px] md:h-9 md:w-[84px] md:px-2.5 md:text-[12px]",
              isFourGridCategory && "lg:h-9 lg:w-[84px] lg:px-2.5 lg:text-[12px]",
              "transition-all duration-300 group-hover:gap-2.5 hover:bg-white/10",
              "[&>.arrow]:inline-block [&>.arrow]:transition-all [&>.arrow]:duration-300 [&>.arrow]:ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              "[&:hover>.arrow]:translate-x-1.5 [&:hover>.arrow]:scale-110 [&:hover>.arrow]:opacity-100 [&>.arrow]:opacity-90",
            )}
          >
            Explore
            <span aria-hidden className="arrow">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  data,
}: {
  category: keyof typeof SOLUTIONS_DATA;
  data: { description: string; cards: SolutionServiceCard[]; image?: string } & SolutionsCategory;
}) {
  const { isSpecializedThemeCategory, isFourGridCategory } = resolveCategoryPresentation(
    category,
    data,
  );

  return (
    <div className="relative">
      <div
        className={cn(
          "relative overflow-hidden border-t",
          isSpecializedThemeCategory
            ? "border-white/10 bg-[color:var(--color-footer-bg)]"
            : "border-[color:var(--color-border-light)]/30 bg-[color:var(--audience-bg)]",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            isSpecializedThemeCategory
              ? "bg-[radial-gradient(800px_500px_at_52%_0%,rgba(255,255,255,0.05),transparent_55%)]"
              : "bg-[radial-gradient(800px_600px_at_50%_0%,rgba(220,38,38,0.04),transparent_50%)]",
          )}
          aria-hidden="true"
        />

        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {isSpecializedThemeCategory ? (
            <svg
              className="hidden h-full w-full sm:block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 400"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="pillDark1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
                </linearGradient>
                <linearGradient id="pillDark2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(220,38,38,0.2)" />
                  <stop offset="100%" stopColor="rgba(220,38,38,0.1)" />
                </linearGradient>
              </defs>
              <g opacity="0.78">
                <rect x="1085" y="52" width="172" height="34" rx="17" fill="url(#pillDark2)" />
                <rect x="1020" y="142" width="116" height="26" rx="13" fill="url(#pillDark1)" />
                <rect x="1180" y="208" width="130" height="28" rx="14" fill="url(#pillDark1)" />
                <rect x="690" y="58" width="132" height="28" rx="14" fill="url(#pillDark1)" />
                <rect x="316" y="232" width="148" height="30" rx="15" fill="url(#pillDark2)" />
              </g>
            </svg>
          ) : (
            <svg
              className="hidden h-full w-full sm:block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 400"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="pillLight1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(220,38,38,0.14)" />
                  <stop offset="50%" stopColor="rgba(220,38,38,0.2)" />
                  <stop offset="100%" stopColor="rgba(220,38,38,0.14)" />
                </linearGradient>
                <linearGradient id="pillLight2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(15,23,42,0.08)" />
                  <stop offset="50%" stopColor="rgba(15,23,42,0.12)" />
                  <stop offset="100%" stopColor="rgba(15,23,42,0.08)" />
                </linearGradient>
              </defs>
              <g opacity="0.66">
                <rect x="1080" y="150" width="160" height="32" rx="16" fill="url(#pillLight1)" />
                <rect x="1130" y="195" width="120" height="28" rx="14" fill="url(#pillLight2)" />
              </g>
              <g opacity="0.56">
                <rect x="640" y="170" width="110" height="26" rx="13" fill="url(#pillLight2)" />
              </g>
              <g opacity="0.52">
                <rect x="270" y="90" width="108" height="26" rx="13" fill="url(#pillLight1)" />
              </g>
            </svg>
          )}
        </div>

        <Container className={SOLUTIONS_OVERVIEW_TOKENS.classes.categoryHeaderContainer}>
          <div className="max-w-3xl">
            <div
              className={cn(
                "mb-3 h-[2px] w-14",
                isSpecializedThemeCategory
                  ? "bg-[color:var(--color-brand-500)]"
                  : "bg-[color:var(--color-brand-600)]/90",
              )}
            />
            <h3
              className={cn(
                SOLUTIONS_OVERVIEW_TOKENS.classes.categoryHeading,
                isSpecializedThemeCategory ? "text-white" : "text-[color:var(--audience-text)]",
              )}
            >
              {category}
            </h3>
            <p
              className={cn(
                SOLUTIONS_OVERVIEW_TOKENS.classes.categoryDescription,
                isSpecializedThemeCategory ? "text-white/75" : "text-[color:var(--audience-muted)]",
              )}
            >
              {data.description}
            </p>
          </div>
        </Container>
      </div>

      <div className={SOLUTIONS_OVERVIEW_TOKENS.classes.categoryCardsSection}>
        <Container className="site-page-container">
          <div
            className={cn(
              "grid justify-items-center gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3",
              isFourGridCategory && "lg:grid-cols-4 lg:gap-5",
              "min-[680px]:grid-cols-2 min-[680px]:gap-6",
            )}
          >
            {data.cards.map((card, cardIndex) => (
              <ServiceCard
                key={card.href}
                card={card}
                categoryKey={category}
                cardIndex={cardIndex}
                categoryImage={data.image}
                isFourGridCategory={isFourGridCategory}
                isSpecializedThemeCategory={isSpecializedThemeCategory}
              />
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}

export function SolutionsOverview() {
  const [activeCategory, setActiveCategory] = React.useState<keyof typeof SOLUTIONS_DATA>(
    SOLUTIONS_CATEGORIES[0],
  );
  const [isAutoPaused, setIsAutoPaused] = React.useState(false);
  const [isDesktopAutoplayViewport, setIsDesktopAutoplayViewport] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = React.useMemo(
    () => SOLUTIONS_CATEGORIES.indexOf(activeCategory),
    [activeCategory],
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(SOLUTIONS_OVERVIEW_TOKENS.autoplayDesktopMediaQuery);
    const syncViewport = () => setIsDesktopAutoplayViewport(mediaQuery.matches);

    syncViewport();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }

    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  const pauseAutoRotation = React.useCallback(() => setIsAutoPaused(true), []);
  const resumeAutoRotation = React.useCallback(() => setIsAutoPaused(false), []);

  const handleInteractiveAreaBlur = React.useCallback((event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsAutoPaused(false);
    }
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion || isAutoPaused || !isDesktopAutoplayViewport) return;

    const timer = window.setInterval(() => {
      setActiveCategory((current) => {
        const currentIndex = SOLUTIONS_CATEGORIES.indexOf(current);
        const nextIndex = (currentIndex + 1) % SOLUTIONS_CATEGORIES.length;
        return SOLUTIONS_CATEGORIES[nextIndex];
      });
    }, SOLUTIONS_OVERVIEW_TOKENS.autoplayIntervalMs);

    return () => window.clearInterval(timer);
  }, [isAutoPaused, isDesktopAutoplayViewport, prefersReducedMotion]);

  const handleTabKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex = currentIndex;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = (currentIndex + 1) % SOLUTIONS_CATEGORIES.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex =
            (currentIndex - 1 + SOLUTIONS_CATEGORIES.length) % SOLUTIONS_CATEGORIES.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = SOLUTIONS_CATEGORIES.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const nextCategory = SOLUTIONS_CATEGORIES[nextIndex];
      setActiveCategory(nextCategory);
      tabRefs.current[nextIndex]?.focus();
    },
    [],
  );

  const activeCategoryData = SOLUTIONS_DATA[activeCategory];

  return (
    <section id="solutions" className="relative scroll-mt-16 overflow-hidden">
      {/* Intro */}
      <div className="relative bg-[color:var(--color-footer-bg)]">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="subtleGrid"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="rgba(255,255,255,0.015)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#subtleGrid)" opacity="0.4" />
            <g opacity="0.25">
              <rect x="1100" y="60" width="150" height="30" rx="15" fill="rgba(255,255,255,0.05)" />
              <rect
                x="1140"
                y="105"
                width="110"
                height="26"
                rx="13"
                fill="rgba(255,255,255,0.04)"
              />
              <rect
                x="1170"
                y="145"
                width="130"
                height="28"
                rx="14"
                fill="rgba(255,255,255,0.05)"
              />
            </g>
            <g opacity="0.2">
              <rect x="70" y="410" width="130" height="28" rx="14" fill="rgba(255,255,255,0.05)" />
              <rect x="50" y="455" width="110" height="26" rx="13" fill="rgba(255,255,255,0.04)" />
              <rect x="90" y="495" width="140" height="30" rx="15" fill="rgba(255,255,255,0.05)" />
            </g>
            <g opacity="0.15">
              <rect x="990" y="245" width="100" height="24" rx="12" fill="rgba(255,255,255,0.04)" />
              <rect
                x="1010"
                y="280"
                width="120"
                height="26"
                rx="13"
                fill="rgba(255,255,255,0.05)"
              />
            </g>
          </svg>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"
          aria-hidden="true"
        />
        <Container className={SOLUTIONS_OVERVIEW_TOKENS.classes.introContainer}>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />
            <div className="text-xs font-semibold tracking-wide text-white/60">Our Services</div>
            <h2 className={SOLUTIONS_OVERVIEW_TOKENS.classes.introHeading}>Shipping Solutions</h2>
            <p className={SOLUTIONS_OVERVIEW_TOKENS.classes.introDescription}>
              Choose the mode that matches your lane, timeline, and requirements — with proactive
              updates and compliance-first execution.
            </p>
          </div>
        </Container>
      </div>

      {/* Tabs */}
      <div className="relative border-y border-white/10 bg-[color:var(--color-footer-bg)]/95 backdrop-blur">
        <Container className={SOLUTIONS_OVERVIEW_TOKENS.classes.tabNavContainer}>
          <div
            className={SOLUTIONS_OVERVIEW_TOKENS.classes.tabNavShell}
            onMouseEnter={pauseAutoRotation}
            onMouseLeave={resumeAutoRotation}
            onFocusCapture={pauseAutoRotation}
            onBlurCapture={handleInteractiveAreaBlur}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_130px_at_50%_-20%,rgba(220,38,38,0.24),transparent_65%)]"
              aria-hidden="true"
            />
            <div
              className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
              role="tablist"
              aria-label="Shipping solution categories"
            >
              {SOLUTIONS_CATEGORIES.map((category, index) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    id={`solutions-tab-${index}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls="solutions-panel"
                    tabIndex={isActive ? 0 : -1}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    onClick={() => {
                      setActiveCategory(category);
                      pauseAutoRotation();
                      trackCtaClick({
                        ctaId: `solutions_tab_${index + 1}`,
                        location: "solutions_overview_tabs",
                        destination: `category:${String(category)}`,
                        label: String(category),
                      });
                    }}
                    className={cn(
                      SOLUTIONS_OVERVIEW_TOKENS.classes.tabButton,
                      "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer-bg)] focus-visible:outline-none",
                      isActive
                        ? "border-[color:var(--color-brand-500)]/60 bg-white/[0.14] shadow-[0_10px_34px_rgba(2,6,23,0.35)]"
                        : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-semibold tracking-tight transition-colors sm:text-[15px]",
                          isActive ? "text-white" : "text-white/82 group-hover:text-white",
                        )}
                      >
                        {category}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] font-medium tracking-wide uppercase",
                          isActive ? "text-white/85" : "text-white/50",
                        )}
                      >
                        {isActive ? "Active" : `0${index + 1}`}
                      </span>
                    </div>
                    <div className="mt-2 h-[2px] w-full rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-[color:var(--color-brand-500)]"
                        initial={false}
                        animate={{ width: isActive ? "100%" : "0%", opacity: isActive ? 1 : 0.5 }}
                        transition={{
                          duration: SOLUTIONS_OVERVIEW_TOKENS.tabProgressTransitionDuration,
                          ease: SOLUTIONS_OVERVIEW_TOKENS.tabProgressTransitionEase,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </div>

      {/* Panel */}
      <div className="relative">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeCategory}
            id="solutions-panel"
            role="tabpanel"
            aria-labelledby={`solutions-tab-${activeIndex}`}
            onMouseEnter={pauseAutoRotation}
            onMouseLeave={resumeAutoRotation}
            onFocusCapture={pauseAutoRotation}
            onBlurCapture={handleInteractiveAreaBlur}
            className="relative"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: 12, scale: 0.995, filter: "blur(2.5px)" }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: {
                      duration: SOLUTIONS_OVERVIEW_TOKENS.panelTransitionDuration,
                      ease: SOLUTIONS_OVERVIEW_TOKENS.panelTransitionEase,
                    },
                  }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -8,
                    scale: 1.005,
                    filter: "blur(1.8px)",
                    position: "absolute",
                    inset: 0,
                    transition: {
                      duration: 0.34,
                      ease: [0.4, 0, 1, 1],
                    },
                  }
            }
            style={{
              transformOrigin: "50% 50%",
              willChange: "opacity, transform, filter",
            }}
          >
            <CategorySection category={activeCategory} data={activeCategoryData} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Guidance Strip */}
      <div className="relative border-t border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] py-10 sm:py-12">
        <Container className="site-page-container">
          <div className="relative overflow-hidden rounded-2xl border border-white/65 bg-white/82 px-5 py-6 shadow-[0_14px_38px_rgba(2,6,23,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl sm:px-7 sm:py-7">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_260px_at_96%_100%,rgba(220,38,38,0.09),transparent_55%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute top-0 left-1/2 h-14 w-[86%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(15,23,42,0.34),rgba(30,41,59,0.14),transparent_74%)] blur-lg"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute top-0 left-1/2 h-10 w-[56%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(2,8,24,0.36),rgba(2,8,24,0.14),transparent_72%)] blur-md"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(2,8,24,0.98)] to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute top-0 left-1/2 h-px w-[94%] -translate-x-1/2 bg-gradient-to-r from-[rgba(30,41,59,0.08)] via-transparent to-[rgba(30,41,59,0.08)]"
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[color:var(--color-muted-light)] uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)]" />
                  Need guidance?
                </div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-2xl">
                  Not sure which solution fits your shipment?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
                  Get fast recommendations from our logistics team based on your load type, route,
                  and delivery urgency.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Link
                  href="/quote"
                  onClick={() =>
                    trackCtaClick({
                      ctaId: "solutions_guidance_primary_request_quote",
                      location: "solutions_guidance_strip",
                      destination: "/quote",
                      label: "Request a Quote",
                    })
                  }
                  className={cn(
                    "inline-flex h-11 w-full items-center justify-center rounded-md px-5 text-sm font-semibold sm:w-auto",
                    "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                    "shadow-sm shadow-black/10",
                    "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:outline-none",
                  )}
                >
                  Request a Quote
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    trackCtaClick({
                      ctaId: "solutions_guidance_secondary_speak_live_agent",
                      location: "solutions_guidance_strip",
                      destination: "#live-chat",
                      label: "Speak with a live agent",
                    });
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("npt:open-live-chat"));
                    }
                  }}
                  className={cn(
                    "inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md px-5 text-sm font-semibold sm:w-auto",
                    "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)]",
                    "hover:bg-[color:var(--color-surface-0-light)]",
                    "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:outline-none",
                  )}
                >
                  Speak with a live agent
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
