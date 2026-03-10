export type NavLink = {
  label: string;
  href: string;
  description?: string;
  icon?:
    | "truck"
    | "package"
    | "train"
    | "zap"
    | "shield"
    | "snowflake"
    | "globe"
    | "warehouse"
    | "briefcase"
    | "building"
    | "map"
    | "phone";
  children?: readonly NavLink[];
};

export type NavSection = {
  label: string;
  intro: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  links: readonly NavLink[];
};

export const NAV = {
  solutions: {
    label: "Solutions",
    intro: {
      title: "Shipping Solutions",
      description:
        "Freight services built for compliance, visibility, and consistent execution across North America.",
      ctaLabel: "View all solutions",
      ctaHref: "/#solutions",
    },
    categories: [
      {
        title: "Core Freight Modes",
        links: [
          {
            label: "Truckload (TL)",
            href: "/services/truckload",
            description: "Full truckload shipping for time-critical freight.",
            icon: "truck",
            children: [
              { label: "Dry Van", href: "/services/truckload#section-dry-van" },
              { label: "Flatbed / Step Deck (Oversize)", href: "/services/truckload#section-flatbed" },
              { label: "RGN (Oversize)", href: "/services/truckload#section-rgn-oversize" },
              {
                label: "Roll-Tite / Conestoga",
                href: "/services/truckload#section-roll-tite-conestoga",
              },
            ],
          },
          {
            label: "Less-Than-Truckload (LTL)",
            href: "/services/ltl",
            description: "Cost-efficient LTL shipping across lanes.",
            icon: "package",
          },
          {
            label: "Intermodal",
            href: "/services/intermodal",
            description: "Rail + truck for balanced cost and capacity.",
            icon: "train",
          },
        ],
      },
      {
        title: "Specialized & Time-Sensitive",
        links: [
          {
            label: "Expedited & Specialized (ES)",
            href: "/services/expedited-specialized",
            description: "Priority freight and specialized vehicle execution.",
            icon: "zap",
            children: [
              { label: "Expedited", href: "/services/expedited-specialized#section-expedited" },
              {
                label: "Specialized Vehicle Programs",
                href: "/services/expedited-specialized#section-specialized-vehicle-programs",
              },
            ],
          },
          {
            label: "Hazardous Materials (HAZMAT)",
            href: "/services/hazmat",
            description: "Compliant hazmat movement and documentation.",
            icon: "shield",
          },
          {
            label: "Temperature-Controlled",
            href: "/services/temperature-controlled",
            description: "Refrigerated and controlled-temperature freight.",
            icon: "snowflake",
          },
        ],
      },
      {
        title: "Cross-Border & Global",
        links: [
          {
            label: "Cross-Border & Global",
            href: "/services/cross-border",
            description: "Cross-border execution + global modes as needed.",
            icon: "globe",
            children: [
              { label: "Canada ↔ USA", href: "/services/cross-border#section-canada-us" },
              {
                label: "Mexico Cross-Border",
                href: "/services/cross-border#section-mexico-cross-border",
              },
              { label: "Ocean Freight", href: "/services/cross-border#section-ocean-freight" },
              { label: "Air Freight", href: "/services/cross-border#section-air-freight" },
            ],
          },
        ],
      },
      {
        title: "Logistics & Value-Added",
        links: [
          {
            label: "Logistics & Value-Added",
            href: "/services/value-added",
            description: "Warehousing, managed capacity, dedicated, and projects.",
            icon: "warehouse",
            children: [
              {
                label: "Warehousing & Distribution",
                href: "/services/value-added#section-warehousing-distribution",
              },
              { label: "Managed Capacity", href: "/services/value-added#section-managed-capacity" },
              {
                label: "Dedicated / Contract",
                href: "/services/value-added#section-dedicated-contract",
              },
              {
                label: "Project-Specific (Oversize)",
                href: "/services/value-added#section-project-oversize-programs",
              },
            ],
          },
        ],
      },
    ],
  },

  industries: {
    label: "Industries",
    intro: {
      title: "Industry Solutions",
      description:
        "Industry-specific freight execution built around compliance, risk control, and operational reliability.",
      ctaLabel: "View all industries",
      ctaHref: "/#industries",
    },
    links: [
      {
        label: "Automotive",
        href: "/industries/automotive",
        description: "Exotic and specialty vehicle hauling, plus disciplined vehicle-unit and component-lane execution.",
        icon: "truck",
      },
      {
        label: "Manufacturing & Materials",
        href: "/industries/manufacturing-materials",
        description: "Production-critical freight managed for throughput stability and schedule protection.",
        icon: "package",
      },
      {
        label: "Retail & Consumer Goods",
        href: "/industries/retail-consumer-goods",
        description: "Store and DC replenishment lanes operated with service-level discipline.",
        icon: "warehouse",
      },
      {
        label: "Food & Beverage",
        href: "/industries/food-beverage",
        description: "Cold-chain freight executed with temperature governance and freshness-window control.",
        icon: "snowflake",
      },
      {
        label: "Industrial & Energy",
        href: "/industries/industrial-energy",
        description: "Project and specialized freight coordinated with permit-aware execution controls.",
        icon: "globe",
      },
      {
        label: "Steel and Aluminum",
        href: "/industries/steel-aluminum",
        description: "Heavy metal freight moved with engineered load control and compliance rigor.",
        icon: "shield",
      },
    ],
  } satisfies NavSection,

  company: {
    label: "Company",
    intro: {
      title: "Company",
      description:
        "How NPT is built: disciplined operations, accountable execution, and compliance-led standards.",
      ctaLabel: "Contact us",
      ctaHref: "/contact",
    },
    links: [
      {
        label: "About us",
        href: "/about-us",
        description: "Our operating philosophy, standards, and leadership approach.",
        icon: "building",
      },
      {
        label: "Locations & Network",
        href: "/about-us#locations-network",
        description: "North America network reach across core freight corridors.",
        icon: "map",
      },
      {
        label: "Safety & Compliance",
        href: "/about-us#safety-compliance",
        description: "Safety governance, training discipline, and compliance controls.",
        icon: "shield",
      },
      {
        label: "Blog / Insights",
        href: "/blog",
        description: "Operational perspectives, market shifts, and shipping intelligence.",
        icon: "package",
      },
      {
        label: "Shipping Guides",
        href: "/about-us/faqs#shipping-guides",
        description: "Practical guidance for planning, documentation, and execution.",
        icon: "briefcase",
      },
      {
        label: "FAQs",
        href: "/about-us/faqs",
        description: "Clear answers on process, timelines, and freight requirements.",
        icon: "phone",
      },
      { label: "Contact", href: "/contact", description: "Connect with our team on your freight priorities.", icon: "phone" },
    ],
  } satisfies NavSection,

  careers: {
    label: "Careers",
    intro: {
      title: "Careers",
      description: "Build your career in a safety-led operation focused on execution excellence.",
      ctaLabel: "View job listings",
      ctaHref: "/careers#jobs",
    },
    links: [
      {
        label: "Careers Overview",
        href: "/careers",
        description: "Our culture, operating standards, and employee value proposition.",
        icon: "briefcase",
      },
      {
        label: "Driver Opportunities",
        href: "/careers#drive",
        description: "Driving roles, qualification standards, and growth pathways.",
        icon: "truck",
      },
      {
        label: "Job Listings",
        href: "/careers#jobs",
        description: "Current openings across operations, corporate, and support functions.",
        icon: "briefcase",
      },
    ],
  } satisfies NavSection,
} as const;
