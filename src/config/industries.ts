// src/config/industries.ts

export type IndustryKey =
  | "automotive"
  | "manufacturing"
  | "retail"
  | "food"
  | "industrial-energy"
  | "steel-aluminum";

export type IndustrySlide = {
  key: IndustryKey;
  label: string; // short nav label
  title: string; // big headline
  subtitle: string; // 1–2 lines
  href: string; // dedicated page
  image: string; // background image
  accent?: "red" | "blue" | "slate"; // subtle styling variations
};

export const INDUSTRIES_SECTION = {
  id: "industries",
  kicker: "Industries",
  heading: "Industries We Serve",
  description:
    "Specialized execution across industries where timing, compliance, and communication decide outcomes.",
} as const;

export const INDUSTRY_SLIDES: IndustrySlide[] = [
  {
    key: "automotive",
    label: "Automotive",
    title: "Automotive freight that stays on schedule.",
    subtitle:
      "Inbound parts, finished vehicles, and time-sensitive lanes — executed with disciplined handoffs and proactive updates.",
    href: "/industries/automotive",
    image: "/industries/Automotives.png",
    accent: "red",
  },
  {
    key: "manufacturing",
    label: "Manufacturing & Materials",
    title: "Manufacturing supply chains require control.",
    subtitle:
      "Raw materials and production-critical freight moved with consistency, visibility, and recovery when conditions shift.",
    href: "/industries/manufacturing-materials",
    image: "/industries/Manufacturing.png",
    accent: "slate",
  },
  {
    key: "retail",
    label: "Retail & Consumer Goods",
    title: "Retail freight delivered with zero drama.",
    subtitle:
      "Store replenishment and DC lanes with predictable execution, clear updates, and service-level discipline.",
    href: "/industries/retail-consumer-goods",
    image: "/industries/Retail.png",
    accent: "blue",
  },
  {
    key: "food",
    label: "Food & Beverage",
    title: "Food & beverage moves on precision.",
    subtitle:
      "Temperature-aware handling, clean documentation, and on-time execution to protect shelf life and brand trust.",
    href: "/industries/food-beverage",
    image: "/industries/food.png",
    accent: "red",
  },
  {
    key: "industrial-energy",
    label: "Industrial & Energy",
    title: "Industrial & energy lanes need reliability.",
    subtitle:
      "Equipment and site-critical freight moved with safety-first execution, clear ownership, and accurate status.",
    href: "/industries/industrial-energy",
    image: "/industries/Industry&Energy.png",
    accent: "slate",
  },
  {
    key: "steel-aluminum",
    label: "Steel & Aluminum",
    title: "Heavy freight handled with discipline.",
    subtitle:
      "Metal coils, plate, and high-density loads moved with the right equipment, securement, and accountable execution.",
    href: "/industries/steel-aluminum",
    image: "/industries/Steel.png",
    accent: "blue",
  },
];
