// src/config/solutions.ts

export type SolutionIcon =
  | "truck"
  | "package"
  | "train"
  | "zap"
  | "shield"
  | "snowflake"
  | "globe"
  | "warehouse"
  | "briefcase"
  | "plane"
  | "ship";

/**
 * Controls the skew gradient look of a card (presentation-only).
 * Optional — if not provided, component fallback keeps your current look.
 */
export type CardTheme = "navy" | "red" | "slate" | "blue" | "ltl";

/**
 * Controls category presentation (presentation-only).
 * Optional — component fallback keeps your current look.
 */
export type SolutionsTheme = "default" | "dark";
export type SolutionsLayout = "auto" | "three" | "four";

export type ServiceCard = {
  label: string;
  href: string;
  description: string;
  icon: SolutionIcon;
  bestFor?: string;
  image?: string;

  /** Optional: explicitly choose gradient without relying on label parsing. */
  cardTheme?: CardTheme;
};

export type SolutionsCategory = {
  description: string;
  cards: ServiceCard[];
  image?: string;

  /** Optional: controls header styling; default keeps existing category checks behavior. */
  theme?: SolutionsTheme;

  /** Optional: controls grid columns; default keeps existing category checks behavior. */
  layout?: SolutionsLayout;
};

export const SOLUTIONS_DATA = {
  "Core Freight Modes": {
    description: "Standard shipping methods for everyday freight needs.",
    image: "/solutions/npt-core-freight-hero.png",
    layout: "three",
    theme: "default",
    cards: [
      {
        label: "Truckload (TL)",
        href: "/services/truckload",
        description: "Dedicated capacity for your entire shipment with faster transit times.",
        icon: "truck",
        bestFor: "Full loads, expedited delivery",
        image: "/solutions/card-truckload-tl.jpg",
        cardTheme: "red",
      },
      {
        label: "Less-Than-Truckload (LTL)",
        href: "/services/ltl",
        description: "Cost-efficient shipping by consolidating smaller shipments.",
        icon: "package",
        bestFor: "Smaller shipments, cost savings",
        image: "/solutions/card-ltl.jpg",
        cardTheme: "ltl",
      },
      {
        label: "Intermodal",
        href: "/services/intermodal",
        description: "Rail efficiency for long distances with truck flexibility for delivery.",
        icon: "train",
        bestFor: "Long distances, cost optimization",
        image: "/solutions/card-intermodal.jpg",
        cardTheme: "navy",
      },
    ],
  },
  "Specialized & Time-Sensitive": {
    description: "Expert handling for urgent and specialized freight requirements.",
    image: "/solutions/solutions-specialized.jpg",
    layout: "four",
    theme: "dark",
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
    layout: "four",
    theme: "default",
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
    layout: "four",
    theme: "dark",
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
} satisfies Record<string, SolutionsCategory>;

export const SOLUTIONS_CATEGORIES = Object.keys(SOLUTIONS_DATA) as Array<
  keyof typeof SOLUTIONS_DATA
>;
