"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
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

type ServiceCard = {
  label: string;
  href: string;
  description: string;
  icon: keyof typeof ICONS;
  bestFor?: string;
  image?: string; // Optional image path per card
};

const SOLUTIONS_DATA: Record<
  string,
  { description: string; cards: ServiceCard[]; image?: string }
> = {
  "Core Freight Modes": {
    description: "Standard shipping methods for everyday freight needs.",
    image: "/solutions/npt-core-freight-hero.png",
    cards: [
      {
        label: "Truckload (TL)",
        href: "/services/truckload",
        description: "Dedicated capacity for your entire shipment with faster transit times.",
        icon: "truck",
        bestFor: "Full loads, expedited delivery",
        image: "/solutions/card-truckload-tl.jpg",
      },
      {
        label: "Less-Than-Truckload (LTL)",
        href: "/services/ltl",
        description: "Cost-efficient shipping by consolidating smaller shipments.",
        icon: "package",
        bestFor: "Smaller shipments, cost savings",
        image: "/solutions/card-ltl.jpg",
      },
      {
        label: "Intermodal",
        href: "/services/intermodal",
        description: "Rail efficiency for long distances with truck flexibility for delivery.",
        icon: "train",
        bestFor: "Long distances, cost optimization",
        image: "/solutions/card-intermodal.jpg",
      },
    ],
  },
  "Specialized & Time-Sensitive": {
    description: "Expert handling for urgent and specialized freight requirements.",
    image: "/solutions/solutions-specialized.jpg",
    cards: [
      {
        label: "Expedited Shipping",
        href: "/services/specialized#expedited",
        description: "Fast-track delivery for urgent shipments.",
        icon: "zap",
        bestFor: "Time-sensitive freight",
        image: "/solutions/card-expedited.jpg",
      },
      {
        label: "Specialized Vehicle Transport",
        href: "/services/specialized#vehicle-transport",
        description: "Expert handling for specialized vehicles and equipment.",
        icon: "truck",
        bestFor: "Oversized, delicate cargo",
        image: "/solutions/card-specialized-vehicle.jpg",
      },
      {
        label: "Hazardous Materials (HAZMAT)",
        href: "/services/hazmat",
        description: "Compliant hazmat movement and documentation.",
        icon: "shield",
        bestFor: "Regulated materials",
        image: "/solutions/card-hazmat.jpg",
      },
      {
        label: "Refrigerated / Temperature-Controlled",
        href: "/services/temperature-controlled",
        description: "Refrigerated and controlled-temperature freight.",
        icon: "snowflake",
        bestFor: "Perishables, pharmaceuticals",
        image: "/solutions/card-refrigerated.jpg",
      },
    ],
  },
  "Cross-Border & Global": {
    description: "Seamless international shipping across borders and oceans.",
    image: "/hero/hero-poster.png",
    cards: [
      {
        label: "Canada ↔ USA Cross-Border",
        href: "/services/cross-border#canada-us",
        description: "Seamless cross-border shipping between Canada and USA.",
        icon: "globe",
        bestFor: "North American trade",
        image: "/solutions/card-cross-border-canada-us.jpg",
      },
      {
        label: "Mexico Cross-Border",
        href: "/services/cross-border#mexico",
        description: "Reliable Mexico cross-border logistics.",
        icon: "globe",
        bestFor: "Mexico trade lanes",
        image: "/solutions/card-cross-border-mexico.jpg",
      },
      {
        label: "Ocean Freight",
        href: "/services/cross-border#ocean",
        description: "International ocean shipping solutions.",
        icon: "ship",
        bestFor: "International bulk shipping",
        image: "/solutions/card-ocean-freight.jpg",
      },
      {
        label: "Air Freight",
        href: "/services/cross-border#air",
        description: "Fast international air cargo services.",
        icon: "plane",
        bestFor: "Urgent international delivery",
        image: "/solutions/card-air-freight.jpg",
      },
    ],
  },
  "Logistics & Value-Added": {
    description: "Comprehensive logistics solutions beyond transportation.",
    image: "/solutions/solutions-logistics.jpg",
    cards: [
      {
        label: "Warehousing & Distribution",
        href: "/services/value-added#warehousing",
        description: "Strategic warehousing and distribution networks.",
        icon: "warehouse",
        bestFor: "Inventory management",
        image: "/solutions/card-warehousing-distribution.jpg",
      },
      {
        label: "Managed Capacity",
        href: "/services/value-added#managed-capacity",
        description: "Dedicated capacity solutions for consistent volume.",
        icon: "briefcase",
        bestFor: "High-volume shippers",
        image: "/solutions/card-managed-capacity.jpg",
      },
      {
        label: "Dedicated / Contract Logistics",
        href: "/services/value-added#dedicated",
        description: "Custom logistics programs tailored to your needs.",
        icon: "briefcase",
        bestFor: "Long-term partnerships",
        image: "/solutions/card-dedicated-contract.jpg",
      },
      {
        label: "Project-Specific / Oversize Programs",
        href: "/services/value-added#project-oversize",
        description: "Specialized handling for large-scale and oversize projects.",
        icon: "truck",
        bestFor: "Complex, oversized cargo",
        image: "/solutions/card-project-oversize.jpg",
      },
    ],
  },
};

const CATEGORIES = Object.keys(SOLUTIONS_DATA) as Array<keyof typeof SOLUTIONS_DATA>;

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

function ServiceCard({
  card,
  categoryImage,
  category,
  cardIndex,
}: {
  card: ServiceCard;
  categoryImage?: string;
  category: keyof typeof SOLUTIONS_DATA;
  cardIndex: number;
}) {
  const isSpecializedCategory = category === "Specialized & Time-Sensitive";
  const isLogisticsCategory = category === "Logistics & Value-Added";
  const isSpecializedThemeCategory = isSpecializedCategory || isLogisticsCategory;
  const isCrossBorderCategory = category === "Cross-Border & Global";
  const isFourGridCategory = isSpecializedThemeCategory || isCrossBorderCategory;
  const isIntermodal = card.label.toLowerCase().includes("intermodal");
  const isLtl = card.label.toLowerCase().includes("less-than-truckload");
  const isTl = card.label.toLowerCase().includes("truckload (tl)");
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
  const skewGradient = isIntermodal
    ? "linear-gradient(-16deg, rgba(7,10,18,0.98), rgba(11,16,32,0.92))"
    : isLtl
      ? "linear-gradient(-20deg, rgba(10,15,26,0.95), rgba(30,41,59,0.9))"
      : isTl
        ? "linear-gradient(-14deg, rgba(8,14,28,0.98), rgba(153,27,27,0.86))"
        : isSpecializedThemeCategory
          ? specializedGradients[cardIndex % specializedGradients.length]
          : isCrossBorderCategory
            ? coreThemeGradients[cardIndex % coreThemeGradients.length]
          : "linear-gradient(-16deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))";

  return (
    <Link
      href={card.href}
      className={cn(
        "group relative inline-block h-[360px] w-full max-w-[400px] overflow-hidden rounded-[24px] transition-all duration-500 sm:h-[390px] sm:rounded-[30px] lg:h-[400px]",
        isFourGridCategory && "lg:h-[350px] lg:max-w-none",
        "shadow-[4px_4px_24px_rgba(0,0,0,0.24)] sm:shadow-[5px_5px_30px_rgba(0,0,0,0.3)]",
        "hover:shadow-[5px_5px_40px_rgba(0,0,0,0.35)]",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:outline-none",
      )}
    >
      {/* hero-profile-img equivalent */}
      <div className="absolute top-0 left-0 h-[70%] w-full">
        <Image
          src={card.image || categoryImage || "/hero/hero-poster.png"}
          alt=""
          fill
          className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* hero-description-bk equivalent - exact skew shape */}
      <div
        className={cn(
          "absolute top-[54%] left-[-6px] h-[66%] w-[110%] rounded-[24px] sm:top-[55%] sm:left-[-5px] sm:h-[65%] sm:w-[108%] sm:rounded-[30px]",
          isFourGridCategory && "lg:top-[56%] lg:h-[63%]",
          "[transform:skew(19deg,-9deg)] transition-transform duration-500 ease-out",
          "group-hover:[transform:skew(0deg,0deg)]",
        )}
        style={{
          backgroundImage: skewGradient,
        }}
      />

      {/* hero-logo equivalent */}
      <div
        className={cn(
          "absolute top-[60%] left-5 h-12 w-12 -translate-y-1/2 overflow-hidden rounded-lg bg-white shadow-[4px_4px_22px_rgba(0,0,0,0.5)] sm:left-[30px] sm:h-14 sm:w-14 sm:rounded-xl sm:shadow-[5px_5px_30px_rgba(0,0,0,0.65)]",
          isFourGridCategory && "lg:top-[59%] lg:left-4 lg:h-10 lg:w-10 lg:rounded-lg",
        )}
      >
        <div className="flex h-full w-full items-center justify-center p-1 sm:p-1.5">
          <ServiceIcon name={card.icon} />
        </div>
      </div>

      {/* Content safety zone: everything stays inside skew region */}
      <div
        className={cn(
          "absolute top-[56%] right-5 bottom-[12%] left-5 grid grid-rows-[auto_1fr_auto] gap-y-2 text-white sm:top-[58%] sm:right-[30px] sm:bottom-[10%] sm:left-[30px] sm:gap-y-2.5",
          isFourGridCategory && "lg:top-[58%] lg:right-4 lg:bottom-[8%] lg:left-4 lg:gap-y-2",
        )}
      >
        <div
          className={cn(
            "min-h-[80px] pl-[88px] sm:min-h-[92px] sm:pl-[120px]",
            isFourGridCategory && "lg:min-h-[72px] lg:pl-[72px]",
          )}
        >
          <p
            className={cn(
              "[display:-webkit-box] overflow-hidden text-[18px] leading-tight font-extrabold text-white [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[20px]",
              isFourGridCategory && "lg:text-[16px]",
            )}
          >
            {card.label}
          </p>
          <p
            className={cn(
              "mt-1 [display:-webkit-box] overflow-hidden text-[13px] leading-snug font-semibold text-white/95 [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[14px]",
              isFourGridCategory && "lg:text-[11px] lg:leading-snug",
            )}
          >
            {card.description}
          </p>
        </div>

        <div className="grid grid-cols-1 items-end gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6 sm:gap-y-0">
          {card.bestFor && (
            <p
              className={cn(
                "truncate text-[12px] font-semibold text-white/95 sm:pr-2 sm:text-[13px]",
                isFourGridCategory && "lg:text-[10px]",
              )}
            >
              {card.bestFor}
            </p>
          )}
          <span
            className={cn(
              "inline-flex h-10 w-fit min-w-[112px] shrink-0 items-center justify-center gap-2 border border-white px-4 text-[13px] font-semibold text-white sm:ml-2 sm:h-11 sm:w-[106px] sm:min-w-0 sm:px-4 sm:text-[14px]",
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
  index,
}: {
  category: keyof typeof SOLUTIONS_DATA;
  data: { description: string; cards: ServiceCard[]; image?: string };
  index: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isSpecializedCategory = category === "Specialized & Time-Sensitive";
  const isLogisticsCategory = category === "Logistics & Value-Added";
  const isSpecializedThemeCategory = isSpecializedCategory || isLogisticsCategory;
  const isCrossBorderCategory = category === "Cross-Border & Global";
  const isFourGridCategory = isSpecializedThemeCategory || isCrossBorderCategory;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* Category header — light background with premium pill elements */}
      <div
        className={cn(
          "relative overflow-hidden border-t",
          isSpecializedThemeCategory
            ? "border-white/10 bg-[color:var(--color-footer-bg)]"
            : "border-[color:var(--color-border-light)]/30 bg-[color:var(--audience-bg)]",
        )}
      >
        {/* Subtle warmth — matches AudienceSection aesthetic */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            isSpecializedThemeCategory
              ? "bg-[radial-gradient(800px_500px_at_52%_0%,rgba(255,255,255,0.05),transparent_55%)]"
              : "bg-[radial-gradient(800px_600px_at_50%_0%,rgba(220,38,38,0.04),transparent_50%)]",
          )}
          aria-hidden="true"
        />
        {/* Premium pill elements — visible, elegant, logo-inspired */}
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
                {/* Enhanced gradients for pills — premium visibility */}
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
              {/* Pill shapes — visible, elegant, premium */}
              <g opacity="0.66">
                {/* Top right cluster — more prominent */}
                <rect x="1080" y="150" width="160" height="32" rx="16" fill="url(#pillLight1)" />
                <rect x="1130" y="195" width="120" height="28" rx="14" fill="url(#pillLight2)" />
              </g>
              <g opacity="0.56">
                {/* Center accent */}
                <rect x="640" y="170" width="110" height="26" rx="13" fill="url(#pillLight2)" />
              </g>
              <g opacity="0.52">
                {/* Top left subtle */}
                <rect x="270" y="90" width="108" height="26" rx="13" fill="url(#pillLight1)" />
              </g>
            </svg>
          )}
        </div>
        <Container className="relative max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-6 lg:py-16">
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
                "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
                isSpecializedThemeCategory ? "text-white" : "text-[color:var(--audience-text)]",
              )}
            >
              {category}
            </h3>
            <p
              className={cn(
                "mt-3 text-base leading-relaxed sm:mt-4 sm:text-lg lg:text-xl",
                isSpecializedThemeCategory ? "text-white/75" : "text-[color:var(--audience-muted)]",
              )}
            >
              {data.description}
            </p>
          </div>
        </Container>
      </div>

      {/* Cards grid */}
      <div className="bg-[color:var(--color-surface-0-light)] py-10 sm:py-14 lg:py-16">
        <Container className="max-w-[1440px] px-4 sm:px-6 lg:px-6">
          <div
            className={cn(
              "grid justify-items-center gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3",
              isFourGridCategory && "lg:grid-cols-4 lg:gap-5",
            )}
          >
            {data.cards.map((card, cardIndex) => (
              <ServiceCard
                key={card.href}
                card={card}
                category={category}
                cardIndex={cardIndex}
                categoryImage={data.image}
              />
            ))}
          </div>
        </Container>
      </div>
    </motion.div>
  );
}

export function SolutionsOverview() {
  return (
    <section id="solutions" className="relative overflow-hidden scroll-mt-16">
      {/* Dark, premium intro section — creates contrast with bright Audience Section above */}
      <div className="relative bg-[color:var(--color-footer-bg)]">
        {/* Pure, premium background — no red tints, clean and elegant */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Subtle architectural grid — neutral, professional */}
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
            {/* Clean grid texture — architectural, neutral */}
            <rect width="100%" height="100%" fill="url(#subtleGrid)" opacity="0.4" />

            {/* Neutral pill shapes — pure white/grey, no red */}
            <g opacity="0.25">
              {/* Top right cluster */}
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
              {/* Bottom left cluster */}
              <rect x="70" y="410" width="130" height="28" rx="14" fill="rgba(255,255,255,0.05)" />
              <rect x="50" y="455" width="110" height="26" rx="13" fill="rgba(255,255,255,0.04)" />
              <rect x="90" y="495" width="140" height="30" rx="15" fill="rgba(255,255,255,0.05)" />
            </g>
            <g opacity="0.15">
              {/* Center-right accent */}
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
        {/* Pure, neutral gradient — no color tints */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"
          aria-hidden="true"
        />
        <Container className="relative max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />
            <div className="text-xs font-semibold tracking-wide text-white/60">Our Services</div>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Shipping Solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Comprehensive freight and logistics services tailored to your needs, from standard
              shipping to specialized and international solutions.
            </p>
          </div>
        </Container>
      </div>

      {/* All categories stacked */}
      {CATEGORIES.map((category, index) => (
        <CategorySection
          key={category}
          category={category}
          data={SOLUTIONS_DATA[category]}
          index={index}
        />
      ))}

      {/* Guidance Strip */}
      <div className="relative border-t border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] py-10 sm:py-12">
        <Container className="max-w-[1440px] px-4 sm:px-6 lg:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/65 bg-white/82 px-5 py-6 backdrop-blur-xl shadow-[0_14px_38px_rgba(2,6,23,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-7 sm:py-7">
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
                  className={cn(
                    "inline-flex h-11 w-full items-center justify-center rounded-md px-5 text-sm font-semibold sm:w-auto",
                    "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                    "shadow-sm shadow-black/10",
                    "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:outline-none",
                  )}
                >
                  Get a Quote
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    "inline-flex h-11 w-full items-center justify-center rounded-md px-5 text-sm font-semibold sm:w-auto",
                    "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)]",
                    "hover:bg-[color:var(--color-surface-0-light)]",
                    "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:outline-none",
                  )}
                >
                  Talk to a Logistics Expert
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
