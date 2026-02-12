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
              { label: "Dry Van", href: "/services/truckload#dry-van" },
              { label: "Flatbed", href: "/services/truckload#flatbed" },
              { label: "RGN / Oversize", href: "/services/truckload#rgn-oversize" },
              { label: "Roll-Tite / Conestoga", href: "/services/truckload#conestoga" },
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
            label: "Specialized & Time-Sensitive",
            href: "/services/specialized",
            description: "Expedited and specialized vehicle programs.",
            icon: "zap",
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
              { label: "Canada ↔ USA", href: "/services/cross-border#canada-us" },
              { label: "Mexico Cross-Border", href: "/services/cross-border#mexico" },
              { label: "Ocean Freight", href: "/services/cross-border#ocean" },
              { label: "Air Freight", href: "/services/cross-border#air" },
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
              { label: "Warehousing & Distribution", href: "/services/value-added#warehousing" },
              { label: "Managed Capacity", href: "/services/value-added#managed-capacity" },
              { label: "Dedicated / Contract", href: "/services/value-added#dedicated" },
              { label: "Project-Specific / Oversize", href: "/services/value-added#projects" },
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
      ctaHref: "/industries",
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
        href: "/industries/manufacturing",
        description: "Reliable movement for industrial supply chains.",
        icon: "package",
      },
      {
        label: "Retail & Consumer Goods",
        href: "/industries/retail",
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
        "Learn who we are, how we operate, and what we stand for — safety, compliance, and execution.",
      ctaLabel: "Contact us",
      ctaHref: "/contact",
    },
    links: [
      {
        label: "About NPT",
        href: "/company/about",
        description: "Our story, mission, and values.",
        icon: "building",
      },
      {
        label: "Locations & Network",
        href: "/company/locations",
        description: "Coverage across North America.",
        icon: "map",
      },
      {
        label: "Safety & Compliance",
        href: "/company/safety",
        description: "Standards, training, and compliance focus.",
        icon: "shield",
      },
      {
        label: "Blog / Insights",
        href: "/resources/blog",
        description: "Industry updates and practical insights.",
        icon: "package",
      },
      {
        label: "Shipping Guides",
        href: "/resources/guides",
        description: "Helpful guides for shippers.",
        icon: "briefcase",
      },
      {
        label: "FAQs",
        href: "/resources/faqs",
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
      ctaHref: "/careers/jobs",
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
        href: "/careers/drivers",
        description: "Driver roles and requirements.",
        icon: "truck",
      },
      {
        label: "Job Listings",
        href: "/careers/jobs",
        description: "Open corporate and operations roles.",
        icon: "briefcase",
      },
    ],
  } satisfies NavSection,
} as const;
