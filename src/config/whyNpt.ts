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
    "Freight is won or lost in execution. We operate at the operational core - where precision, communication, and accountability turn risk into reliability.",
} as const;

export const WHY_NPT_CARDS: WhyNptCard[] = [
  {
    id: "compliance",
    icon: ShieldCheck,
    eyebrow: "Compliance",
    title: "Safety and documentation by design",
    value: "Audit-ready every move",
    description:
      "Disciplined SOPs and clean handoffs protect cargo, reduce claims, and prevent surprises.",
  },
  {
    id: "execution",
    icon: Clock3,
    eyebrow: "Execution",
    title: "Time is managed, not hoped for",
    value: "On-time under pressure",
    description:
      "Lane planning, proactive recovery, and clear ownership keep shipments moving to plan.",
  },
  {
    id: "visibility",
    icon: Radar,
    eyebrow: "Visibility",
    title: "Clear shipment status at every milestone",
    value: "Signal you can trust",
    description: "Real-time updates plus escalation workflows when reality shifts from plan.",
  },
  {
    id: "comms",
    icon: MessageCircleMore,
    eyebrow: "Communication",
    title: "Proactive communication, early and clear",
    value: "No chasing updates",
    description: "We flag risk early so your team can make decisions with confidence, not urgency.",
  },
  {
    id: "capacity",
    icon: Truck,
    eyebrow: "Capacity",
    title: "Equipment matched to lane and freight",
    value: "Right-fit capacity",
    description: "Asset mix aligned to service level, shipment profile, and timeline requirements.",
  },
  {
    id: "xborder",
    icon: Globe2,
    eyebrow: "Cross-border",
    title: "North America execution, end to end",
    value: "CA ↔ US + MX",
    description:
      "Structured cross-border workflows with customs-aware controls and disciplined handoffs.",
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
