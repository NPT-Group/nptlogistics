"use client";

// src/app/(site)/services/[service]/_components/ServiceSection.tsx
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";
import type { ServiceKey, SubServiceSection } from "@/config/services";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function overlayClass(overlay?: SubServiceSection["overlay"]) {
  switch (overlay) {
    case "red":
      return "bg-[linear-gradient(180deg,rgba(127,29,29,0.18),rgba(2,6,23,0.06))]";
    case "blue":
      return "bg-[linear-gradient(180deg,rgba(30,58,138,0.16),rgba(2,6,23,0.06))]";
    case "slate":
      return "bg-[linear-gradient(180deg,rgba(30,41,59,0.14),rgba(2,6,23,0.05))]";
    default:
      return "bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.05))]";
  }
}

const scrollMarginTopStyle = {
  scrollMarginTop:
    "calc(var(--service-header-h) + var(--service-subnav-h) + var(--service-anchor-gap))",
} as React.CSSProperties;

const CONTEXTUAL_RELATED_BY_TYPE: Record<
  SubServiceSection["key"],
  Array<{ label: string; href: string; reason: string }>
> = {
  "dry-van": [
    {
      label: "LTL Consolidation",
      href: "/services/ltl",
      reason: "Use when shipment volume does not justify dedicated trailer space.",
    },
    {
      label: "Intermodal",
      href: "/services/intermodal",
      reason: "Best fit for predictable lanes where cost stability matters.",
    },
    {
      label: "Cross-border Solutions",
      href: "/services/cross-border",
      reason: "For CA-USA-MX customs handoff and compliance coordination.",
    },
  ],
  flatbed: [
    {
      label: "RGN / Oversize",
      href: "/services/truckload#section-rgn-oversize",
      reason: "When dimensions, axle weights, or permits exceed flatbed thresholds.",
    },
    {
      label: "Conestoga",
      href: "/services/truckload#section-roll-tite-conestoga",
      reason: "When you need weather protection without losing side-load access.",
    },
    {
      label: "Cross-border Solutions",
      href: "/services/cross-border",
      reason: "For project freight moving across national compliance regimes.",
    },
  ],
  "rgn-oversize": [
    {
      label: "Flatbed",
      href: "/services/truckload#section-flatbed",
      reason: "For open-deck freight that does not require heavy-haul configuration.",
    },
    {
      label: "Conestoga",
      href: "/services/truckload#section-roll-tite-conestoga",
      reason: "For high-value freight requiring covered-deck protection.",
    },
    {
      label: "Cross-border Solutions",
      href: "/services/cross-border",
      reason: "For permit, routing, and border process coordination.",
    },
  ],
  "roll-tite-conestoga": [
    {
      label: "Flatbed",
      href: "/services/truckload#section-flatbed",
      reason: "For open-deck freight where weather exposure is acceptable.",
    },
    {
      label: "Dry Van",
      href: "/services/truckload#section-dry-van",
      reason: "For fully enclosed dock-to-dock freight protection and control.",
    },
    {
      label: "LTL Consolidation",
      href: "/services/ltl",
      reason: "For split shipments, multi-stop deliveries, and smaller payloads.",
    },
  ],
};

const CONVERSION_SIGNALS_BY_TYPE: Record<SubServiceSection["key"], string[]> = {
  "dry-van": [
    "Dedicated capacity options on primary lanes",
    "Appointment and POD workflow alignment",
    "Response target within one business cycle",
  ],
  flatbed: [
    "Securement planning before dispatch release",
    "Site access and loading window coordination",
    "Escalation path for weather and route exceptions",
  ],
  "rgn-oversize": [
    "Permit and route sequencing support",
    "Pre-move risk review with compliance controls",
    "Milestone communication for every critical handoff",
  ],
  "roll-tite-conestoga": [
    "Covered-deck protection for weather-sensitive freight",
    "Load access flexibility with operational control",
    "Status cadence tailored to shipper requirements",
  ],
};

const SHIPPER_FAQS_BY_TYPE: Record<
  SubServiceSection["key"],
  {
    title: string;
    items: Array<{ q: string; a: string }>;
  }
> = {
  "dry-van": {
    title: "Dry Van shipper FAQs",
    items: [
      {
        q: "When is dry van the right mode?",
        a: "Best for enclosed, non-temperature freight where dock scheduling, OTIF performance, and documentation quality drive outcomes.",
      },
      {
        q: "Can you support cross-border dry van?",
        a: "Yes. We support Canada-USA cross-border moves with coordinated document handoff and exception visibility.",
      },
      {
        q: "What helps quoting move faster?",
        a: "Provide lane, dimensions, pallet profile, delivery window, and facility constraints so we can return an execution-ready quote.",
      },
    ],
  },
  flatbed: {
    title: "Flatbed shipper FAQs",
    items: [
      {
        q: "When should flatbed be selected?",
        a: "Use flatbed when freight requires side or top loading, exceeds van dimensions, or needs open-deck securement controls.",
      },
      {
        q: "How do you reduce on-site delays?",
        a: "We confirm site readiness, loading method, securement requirements, and appointment windows before dispatch release.",
      },
      {
        q: "Can flatbed run cross-border?",
        a: "Yes. We coordinate mode-specific handling and compliance requirements for cross-border project and industrial freight.",
      },
    ],
  },
  "rgn-oversize": {
    title: "RGN / Oversize shipper FAQs",
    items: [
      {
        q: "What shipments need RGN or oversize handling?",
        a: "Freight exceeding legal dimensions, axle limits, or loading tolerances that require specialized deck and permit planning.",
      },
      {
        q: "How do permits and routing get managed?",
        a: "Permit sequencing and route validation are integrated into pre-move planning to protect timeline and compliance.",
      },
      {
        q: "How do you control heavy-haul risk?",
        a: "Execution is governed through milestone checkpoints, stakeholder alignment, and proactive exception escalation.",
      },
    ],
  },
  "roll-tite-conestoga": {
    title: "Conestoga shipper FAQs",
    items: [
      {
        q: "Why choose Conestoga over flatbed?",
        a: "Conestoga keeps open-deck loading flexibility while adding weather protection for freight sensitive to exposure.",
      },
      {
        q: "Is it suitable for high-value shipments?",
        a: "Yes. It is a strong fit where handling control and in-transit protection are both operational requirements.",
      },
      {
        q: "What details are needed before dispatch?",
        a: "Commodity sensitivity, loading method, site constraints, timeline requirements, and status cadence expectations.",
      },
    ],
  },
};

const PILL_ACCENTS_BY_TYPE: Record<SubServiceSection["key"], string[]> = {
  "dry-van": [
    // Requested: grey outline pill near top-left around intro start.
    "left-[9%] top-[2.4%] h-9 w-36 border border-slate-300/55 bg-transparent",
    // Soft brand fills for luxury depth.
    "right-[10%] top-[20%] h-8 w-32 border border-transparent bg-[rgba(220,38,38,0.10)]",
    "left-[15%] top-[25%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
    // Neutral outline near lower right.
    "right-[11%] bottom-[2.5%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
  ],
  flatbed: [
    "left-[9%] top-[2.5%] h-9 w-34 border border-slate-300/50 bg-transparent",
    "right-[10%] top-[20%] h-8 w-36 border border-transparent bg-[rgba(217,119,6,0.11)]",
    "left-[18%] top-[23.5%] h-8 w-30 border border-transparent bg-[rgba(15,23,42,0.05)]",
   "right-[11%] bottom-[2.5%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
  ],
  "rgn-oversize": [
    "left-[9%] top-[2.5%] h-9 w-34 border border-slate-300/50 bg-transparent",
    "right-[11%] top-[20%] h-8 w-34 border border-transparent bg-[rgba(185,28,28,0.11)]",
    "left-[15%] top-[25%] h-8 w-30 border border-transparent bg-[rgba(2,6,23,0.06)]",
    "right-[11%] bottom-[2.5%] h-9 w-42 border border-slate-300/44 bg-transparent",
  ],
  "roll-tite-conestoga": [
    "left-[9%] top-[2.5%] h-9 w-34 border border-slate-300/50 bg-transparent",
    "right-[10%] top-[20%] h-8 w-35 border border-transparent bg-[rgba(37,99,235,0.10)]",
   "left-[18%] top-[23.5%]  h-8 w-30 border border-transparent bg-[rgba(15,23,42,0.05)]",
    "right-[11%] bottom-[2.5%] h-9 w-40 border border-slate-300/42 bg-transparent",
  ],
};

const SECTION_THEME: Record<
  SubServiceSection["key"],
  {
    accent: string;
    glow: string;
    sectionBase: string;
    sectionVeil: string;
    auraA: string;
    auraB: string;
    gridStroke: string;
    gridOpacity: number;
    panelBg: string;
    imageWash: string;
  }
> = {
  "dry-van": {
    accent: "#dc2626",
    glow: "rgba(220,38,38,0.1)",
    sectionBase:
      "bg-[linear-gradient(180deg,rgba(248,250,252,0.985),rgba(244,247,251,0.97))]",
    sectionVeil: "bg-[radial-gradient(960px_460px_at_52%_-10%,rgba(220,38,38,0.04),transparent_66%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_14%_12%,rgba(220,38,38,0.082),transparent_60%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_92%_86%,rgba(37,99,235,0.044),transparent_66%)]",
    gridStroke: "rgba(15,23,42,0.018)",
    gridOpacity: 0.4,
    panelBg: "bg-white/80",
    imageWash: "bg-[linear-gradient(120deg,rgba(220,38,38,0.16),rgba(2,6,23,0.10))]",
  },
  flatbed: {
    accent: "#d97706",
    glow: "rgba(217,119,6,0.1)",
    sectionBase:
      "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    sectionVeil: "bg-[radial-gradient(980px_480px_at_42%_-12%,rgba(217,119,6,0.043),transparent_68%)]",
    auraA: "bg-[radial-gradient(940px_560px_at_18%_8%,rgba(217,119,6,0.082),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_520px_at_88%_86%,rgba(2,132,199,0.04),transparent_67%)]",
    gridStroke: "rgba(120,53,15,0.02)",
    gridOpacity: 0.38,
    panelBg: "bg-[rgba(255,255,255,0.8)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(217,119,6,0.15),rgba(2,6,23,0.10))]",
  },
  "rgn-oversize": {
    accent: "#b91c1c",
    glow: "rgba(185,28,28,0.11)",
    sectionBase:
      "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    sectionVeil: "bg-[radial-gradient(980px_500px_at_55%_-14%,rgba(185,28,28,0.047),transparent_68%)]",
    auraA: "bg-[radial-gradient(940px_560px_at_18%_8%,rgba(185,28,28,0.086),transparent_62%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_90%_84%,rgba(15,23,42,0.06),transparent_68%)]",
    gridStroke: "rgba(127,29,29,0.02)",
    gridOpacity: 0.38,
    panelBg: "bg-[rgba(255,255,255,0.8)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(185,28,28,0.18),rgba(2,6,23,0.12))]",
  },
  "roll-tite-conestoga": {
    accent: "#2563eb",
    glow: "rgba(37,99,235,0.1)",
    sectionBase:
      "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    sectionVeil: "bg-[radial-gradient(980px_500px_at_48%_-10%,rgba(37,99,235,0.043),transparent_68%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_10%,rgba(37,99,235,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_88%_86%,rgba(220,38,38,0.038),transparent_68%)]",
    gridStroke: "rgba(30,64,175,0.019)",
    gridOpacity: 0.38,
    panelBg: "bg-[rgba(255,255,255,0.8)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(37,99,235,0.16),rgba(2,6,23,0.12))]",
  },
};

function ContentSection({
  title,
  intro,
  items,
  accent,
}: {
  title: string;
  intro: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="mt-8">
      <h3 className="text-[1.18rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.28rem]">
        {title}
      </h3>
      <p className="mt-2.5 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
        {intro}
      </p>
      <ul className="mt-4.5 space-y-2.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            <span className="text-[14px] leading-[1.65] text-[color:var(--color-muted-light)] sm:text-[14.5px]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceSection({
  section,
  serviceKey,
  index: _index,
}: {
  section: SubServiceSection;
  serviceKey: ServiceKey;
  index: number;
}) {
  const sectionId = `section-${section.key}`;
  const theme = SECTION_THEME[section.key];
  const contextualRelated = CONTEXTUAL_RELATED_BY_TYPE[section.key];
  const conversionSignals = CONVERSION_SIGNALS_BY_TYPE[section.key];
  const shipperFaqs = SHIPPER_FAQS_BY_TYPE[section.key];
  const pillAccents = PILL_ACCENTS_BY_TYPE[section.key];

  return (
    <section
      id={sectionId}
      className={cn(
        "relative overflow-hidden transition-colors duration-500",
        theme.sectionBase,
      )}
      style={scrollMarginTopStyle}
    >
      {/* Premium background with section-specific light language */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className={cn("absolute inset-0", theme.sectionVeil)} />
        <div className={cn("absolute inset-0", theme.auraA)} />
        <div className={cn("absolute inset-0", theme.auraB)} />

        {/* Decorative pill accents: balanced filled + outline */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {pillAccents.map((pillClass, idx) => (
            <div key={`${section.key}-pill-${idx}`} className={cn("absolute rounded-full", pillClass)} />
          ))}
        </div>

        {/* Subtle engineering line texture */}
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1600 1000"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={`grid-pattern-${section.key}`}
              x="0"
              y="0"
              width="96"
              height="96"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 96 0 L 0 0 0 96"
                fill="none"
                stroke={theme.gridStroke}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-pattern-${section.key})`} opacity={theme.gridOpacity} />
        </svg>
      </div>

      <Container className="relative z-10 max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-6 lg:py-16">
        <div className="relative">
          {/* Intro row */}
          <div className="grid gap-0 border-y border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-stretch">
            <div className={cn(theme.panelBg, "px-6 py-7 sm:px-8 sm:py-8 lg:col-span-6 lg:px-9 lg:py-10")}>
              <div className="mb-3 h-[2px] w-14" style={{ backgroundColor: theme.accent }} />
              <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                {section.label}
              </div>
              <h2 className="mt-2.5 text-[1.78rem] leading-[1.14] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[2.08rem]">
                {section.title}
              </h2>
              <p className="mt-4 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                {section.description}
              </p>
            </div>

            <div className="relative border-t border-[color:var(--color-border-light)]/65 bg-white/60 lg:col-span-6 lg:border-t-0 lg:border-l">
              <div className="relative h-[260px] w-full sm:h-[300px] lg:h-full">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={cn("absolute inset-0", overlayClass(section.overlay))} />
                <div className={cn("absolute inset-0", theme.imageWash)} />
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(560px 320px at 50% 50%, ${theme.glow}, transparent 72%)` }}
                />
              </div>
            </div>
          </div>

          {/* Content + conversion row */}
          <div className="grid gap-0 border-b border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-start">
            <div className="bg-white/64 px-6 py-7 sm:px-8 sm:py-8 lg:col-span-7 lg:px-9 lg:py-10">
              {section.whenToUse && (
                <ContentSection
                  title="When to use this Service"
                  intro={section.whenToUse.intro}
                  items={section.whenToUse.items}
                  accent={theme.accent}
                />
              )}

              {section.howToUse && (
                <ContentSection
                  title="How to use this Service"
                  intro={section.howToUse.intro}
                  items={section.howToUse.items}
                  accent={theme.accent}
                />
              )}

              {section.capabilities && (
                <ContentSection
                  title="Capabilities and Options"
                  intro={section.capabilities.intro}
                  items={section.capabilities.items}
                  accent={theme.accent}
                />
              )}
            </div>

            <div className="border-t border-[color:var(--color-border-light)]/65 bg-white/60 px-6 py-7 sm:px-8 sm:py-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:px-9 lg:py-10">
              <div className="space-y-4">
                {/* CTA */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-lg",
                    "border border-[color:var(--color-border-light)]",
                    "bg-white/82",
                    "p-5 sm:p-6",
                  )}
                >
                  <div className="relative">
                    <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                      Get pricing and capacity for this mode
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-muted-light)]">
                      Share your lane requirements and we will return a structured quote with equipment fit, timing expectations, and operating assumptions.
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {conversionSignals.map((signal) => (
                        <li
                          key={signal}
                          className="flex items-center gap-2 text-xs text-[color:var(--color-muted-light)]"
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                          {signal}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 grid gap-3">
                      <Link
                        href={section.ctas.primary.href}
                        onClick={() =>
                          trackCtaClick({
                            ctaId: section.ctas.primary.ctaId,
                            location: `service_section:${serviceKey}:${section.key}`,
                            destination: section.ctas.primary.href,
                            label: section.ctas.primary.label,
                          })
                        }
                        className={cn(
                          "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold text-white",
                          "shadow-[0_8px_22px_rgba(2,6,23,0.18)]",
                          focusRing,
                        )}
                        style={{ backgroundColor: theme.accent }}
                      >
                        {section.ctas.primary.label}
                      </Link>

                      {section.ctas.secondary ? (
                        <Link
                          href={section.ctas.secondary.href}
                          onClick={() =>
                            trackCtaClick({
                              ctaId: section.ctas.secondary!.ctaId,
                              location: `service_section:${serviceKey}:${section.key}`,
                              destination: section.ctas.secondary!.href,
                              label: section.ctas.secondary!.label,
                            })
                          }
                          className={cn(
                            "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold",
                            "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                            focusRing,
                          )}
                        >
                          {section.ctas.secondary.label}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Why shippers trust this mode */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-lg",
                    "border border-[color:var(--color-border-light)]",
                    "bg-white/78",
                    "p-5 sm:p-6",
                  )}
                >
                  <div className="relative">
                    <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                      {section.trustSnippet.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-muted-light)]">
                      {section.trustSnippet.body}
                    </p>
                  </div>
                </div>

                {/* Practical Q&A card (non-redundant decision support) */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-lg",
                    "border border-[color:var(--color-border-light)]",
                    "bg-white/78",
                    "p-5 sm:p-6",
                  )}
                >
                  <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                    {shipperFaqs.title}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {shipperFaqs.items.map((item) => (
                      <div
                        key={item.q}
                        className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3"
                      >
                        <div className="text-[13px] font-semibold text-[color:var(--color-text-light)]">
                          {item.q}
                        </div>
                        <div className="mt-1 text-[12px] leading-[1.58] text-[color:var(--color-muted-light)]">
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Utility row (balanced lower closure) */}
          <div className="grid gap-0 border-b border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-stretch">
            <div className="bg-white/62 px-6 py-7 sm:px-8 sm:py-8 lg:col-span-6 lg:px-9 lg:py-9">
              <div
                className={cn(
                  "h-full rounded-lg border border-[color:var(--color-border-light)] bg-white/82 p-5 sm:p-6",
                )}
              >
                <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                  Execution standards included
                </div>
                <ul className="mt-4 space-y-3">
                  {section.highlights.map((h) => (
                    <li
                      key={h.title}
                      className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3"
                    >
                      <div className="text-[14px] font-semibold text-[color:var(--color-text-light)]">
                        {h.title}
                      </div>
                      <div className="mt-1 text-[13.5px] leading-relaxed text-[color:var(--color-muted-light)]">
                        {h.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-[color:var(--color-border-light)]/65 bg-white/60 px-6 py-7 sm:px-8 sm:py-8 lg:col-span-6 lg:border-t-0 lg:border-l lg:px-9 lg:py-9">
              <div
                className={cn(
                  "h-full rounded-lg border border-[color:var(--color-border-light)] bg-white/80 p-5 sm:p-6",
                )}
              >
                <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                  Related for {section.label}
                </h3>
                <p className="mt-1 text-xs text-[color:var(--color-muted-light)]">
                  Suggestions based on equipment fit, risk profile, and shipment constraints.
                </p>
                <div className="mt-4 grid gap-2.5">
                  {contextualRelated.map((service, idx) => {
                    const colors = [
                      "bg-pink-500/10 text-pink-600",
                      "bg-red-500/10 text-red-600",
                      "bg-blue-500/10 text-blue-600",
                      "bg-green-500/10 text-green-600",
                    ];
                    const colorClass = colors[idx % colors.length];

                    return (
                      <Link
                        key={service.href}
                        href={service.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl border border-[color:var(--color-border-light)]",
                          "bg-white px-4 py-3 transition-all",
                          "hover:border-[color:var(--color-brand-500)]/40 hover:bg-[color:var(--color-surface-0-light)]",
                          "hover:shadow-[0_4px_12px_rgba(2,6,23,0.06)]",
                          focusRing,
                        )}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 shrink-0 rounded-lg",
                            colorClass,
                            "flex items-center justify-center font-semibold",
                          )}
                        >
                          <span className="text-xs">●</span>
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[color:var(--color-text-light)] group-hover:text-[color:var(--color-brand-600)]">
                            {service.label}
                          </div>
                          <div className="mt-0.5 text-[11.5px] leading-relaxed text-[color:var(--color-muted-light)]">
                            {service.reason}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
