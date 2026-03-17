// src/config/whyNpt.ts

import {
  ClipboardCheck,
  Clock3,
  Globe2,
  MapPinned,
  MessageCircleMore,
  Plane,
  Radar,
  ShieldCheck,
  Ship,
  TrainFront,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type WhyNptCardId =
  | "compliance"
  | "execution"
  | "visibility"
  | "comms"
  | "capacity"
  | "xborder"
  | "network"
  | "ownership";

export type WhyNptCard = {
  id: WhyNptCardId;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  value: string;
  description: string;
};

export type WhyNptOrbitMarker = {
  icon: LucideIcon;
  angleDeg: number;
  ringScale: number;
};

export const WHY_NPT_SECTION = {
  id: "why-npt",
  kicker: "Why NPT",
  title: "Built at the Center of the Supply Chain",
  description:
    "We operate with precision, communication, accountability and discipline to turn risk into reliability.",
} as const;

export const WHY_NPT_CARDS: WhyNptCard[] = [
  {
    id: "compliance",
    icon: ShieldCheck,
    eyebrow: "Compliance",
    title: "Safety and documentation by design",
    value: "Audit-ready every move",
    description:
      "Standardized procedures and documented handoffs protect cargo, reduce claims, and ensure every shipment meets regulatory and audit requirements. We build compliance into the process—so you never have to chase paperwork or explain surprises.",
  },
  {
    id: "execution",
    icon: Clock3,
    eyebrow: "Execution",
    title: "Time is managed, not hoped for",
    value: "On-time under pressure",
    description:
      "Lane-level planning, proactive recovery protocols, and clear ownership keep shipments on plan. When timelines slip, we act before it becomes your problem. Our teams are trained to anticipate and resolve issues before they impact your operations.",
  },
  {
    id: "visibility",
    icon: Radar,
    eyebrow: "Visibility",
    title: "Clear shipment status at every milestone",
    value: "Signal you can trust",
    description:
      "Real-time updates at pickup, in-transit, and delivery. When reality diverges from plan, escalation workflows ensure your team is informed and can respond. No black holes—you always know where your freight is and what it needs.",
  },
  {
    id: "comms",
    icon: MessageCircleMore,
    eyebrow: "Communication",
    title: "Proactive communication, early and clear",
    value: "No chasing updates",
    description:
      "We surface risk early so your team can make decisions with full context—not under pressure. No surprises, no last-minute scrambles. Our communication is proactive and transparent because your time is too valuable to spend chasing status.",
  },
  {
    id: "capacity",
    icon: Truck,
    eyebrow: "Capacity",
    title: "Equipment matched to lane and freight",
    value: "Right-fit capacity",
    description:
      "Asset mix is matched to service level, shipment profile, and timeline. The right equipment on the right lane—no over-spec or under-spec. We align capacity to your actual needs so you get reliability without paying for what you don't need.",
  },
  {
    id: "xborder",
    icon: Globe2,
    eyebrow: "Cross-border",
    title: "North America execution, end to end",
    value: "CA ↔ US + MX",
    description:
      "Structured workflows with customs-aware controls and disciplined handoffs across Canada, the US, and Mexico. One team, one process, end to end. We handle the complexity so you get predictable cross-border execution.",
  },
  {
    id: "network",
    icon: MapPinned,
    eyebrow: "Network",
    title: "Lane intelligence that improves outcomes",
    value: "Smarter routing decisions",
    description: "Planning grounded in route behavior, constraints, and service priorities.",
  },
  {
    id: "ownership",
    icon: ClipboardCheck,
    eyebrow: "Accountability",
    title: "One accountable team from start to finish",
    value: "Pickup through POD",
    description: "Clear ownership from dispatch to delivery with no blind handoff moments.",
  },
];

export const WHY_NPT_DESKTOP_CARD_IDS: WhyNptCardId[] = [
  "capacity",
  "execution",
  "compliance",
  "visibility",
  "comms",
  "xborder",
];

export const WHY_NPT_MOBILE_CARD_IDS: WhyNptCardId[] = [
  "execution",
  "visibility",
  "xborder",
];

export const WHY_NPT_LOGISTICS_ORBIT_MARKERS: WhyNptOrbitMarker[] = [
  { icon: Truck, angleDeg: -18, ringScale: 1.02 },
  { icon: TrainFront, angleDeg: 46, ringScale: 1.0 },
  { icon: Plane, angleDeg: 108, ringScale: 0.8 },
  { icon: Ship, angleDeg: 164, ringScale: 1.04 },
  { icon: Truck, angleDeg: 232, ringScale: 0.78 },
  { icon: Plane, angleDeg: 292, ringScale: 1.0 },
];

export const WHY_NPT_TOKENS = {
  section: {
    containerClass: "relative max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-6 lg:py-14",
    headingClass: "mt-2 text-3xl font-semibold text-white sm:text-4xl lg:text-[2.45rem]",
    descriptionClass: "mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/72 sm:text-base",
  },
  solar: {
    coreImageSrc: "/_optimized/brand/nptLogo-glow.webp",
    desktopStageHeight: 560,
    mobileLogoWidth: 190,
    centerLogoWidth: 300,
    coreShellWidth: 340,
    coreShellHeight: 340,
    coreImageScale: 1.1,
    coreImageDarkenOpacity: 0.22,
    centerCoreSize: 220,
    centerRingSize: 330,
    centerGlowOpacity: 0.46,
  },
  orbit: {
    rotationSec: 46,
    radiusXDesktop: 430,
    radiusXLg: 380,
    radiusXMd: 320,
    radiusYDesktop: 186,
    radiusYLg: 164,
    radiusYMd: 142,
    cardW: 258,
    cardH: 164,
    tiltDeg: -14,
    planetDotSize: 5,
    planetDotOpacity: 0.3,
    logisticsMarkerSize: 16,
    logisticsMarkerOpacity: 0.72,
    cardGlassOpacityMin: 0.72,
    cardGlassOpacityRange: 0.22,
    scaleMin: 0.9,
    scaleMax: 1.08,
  },
} as const;
