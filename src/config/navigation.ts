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
              { label: "Flatbed", href: "/services/truckload#section-flatbed" },
              { label: "RGN / Oversize", href: "/services/truckload#section-rgn-oversize" },
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
                label: "Project-Specific / Oversize",
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
        "Specialized logistics support for industries with unique requirements and compliance needs.",
      ctaLabel: "View all industries",
      ctaHref: "/#industries",
    },
    links: [
      {
        label: "Automotive",
        href: "/industries/automotive",
        description: "Inbound and outbound automotive freight.",
        icon: "truck",
      },
      {
        label: "Manufacturing & Materials",
        href: "/industries/manufacturing-materials",
        description: "Reliable movement for industrial supply chains.",
        icon: "package",
      },
      {
        label: "Retail & Consumer Goods",
        href: "/industries/retail-consumer-goods",
        description: "Store replenishment and distribution support.",
        icon: "warehouse",
      },
      {
        label: "Food & Beverage",
        href: "/industries/food-beverage",
        description: "Cold chain and time-sensitive deliveries.",
        icon: "snowflake",
      },
      {
        label: "Industrial & Energy",
        href: "/industries/industrial-energy",
        description: "Oversize, specialized, and project freight.",
        icon: "globe",
      },
      {
        label: "Steel and Aluminum",
        href: "/industries/steel-aluminum",
        description: "Heavy freight with safety-first execution.",
        icon: "shield",
      },
    ],
  } satisfies NavSection,

  company: {
    label: "Company",
    intro: {
      title: "Company",
      description:
        "Learn who we are, how we operate, and what we stand for — discipline, compliance, and execution.",
      ctaLabel: "Contact us",
      ctaHref: "/contact",
    },
    links: [
      {
        label: "About us",
        href: "/about-us",
        description: "Who we are, how we operate, and what we stand for.",
        icon: "building",
      },
      {
        label: "Locations & Network",
        href: "/about-us#locations-network",
        description: "Coverage across North America.",
        icon: "map",
      },
      {
        label: "Safety & Compliance",
        href: "/about-us#safety-compliance",
        description: "Standards, training, and compliance focus.",
        icon: "shield",
      },
      {
        label: "Blog / Insights",
        href: "/blog",
        description: "Industry updates and practical insights.",
        icon: "package",
      },
      {
        label: "Shipping Guides",
        href: "/about-us/faqs#shipping-guides",
        description: "Helpful guides for shippers.",
        icon: "briefcase",
      },
      {
        label: "FAQs",
        href: "/about-us/faqs",
        description: "Fast answers to common questions.",
        icon: "phone",
      },
      { label: "Contact", href: "/contact", description: "Talk to our team.", icon: "phone" },
    ],
  } satisfies NavSection,

  careers: {
    label: "Careers",
    intro: {
      title: "Careers",
      description: "Join a team that values discipline, safety, and operational excellence.",
      ctaLabel: "View job listings",
      ctaHref: "/careers#jobs",
    },
    links: [
      {
        label: "Careers Overview",
        href: "/careers",
        description: "Culture, benefits, and why NPT.",
        icon: "briefcase",
      },
      {
        label: "Driver Opportunities",
        href: "/careers#drive",
        description: "Driver roles and requirements.",
        icon: "truck",
      },
      {
        label: "Job Listings",
        href: "/careers#jobs",
        description: "Open corporate and operations roles.",
        icon: "briefcase",
      },
    ],
  } satisfies NavSection,
} as const;
