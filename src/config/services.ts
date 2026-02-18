// src/config/services.ts
import type { Metadata } from "next";

export type ServiceKey = "truckload"; // add "ltl" | "intermodal" later

export type SubServiceKey = "dry-van" | "flatbed" | "rgn-oversize" | "roll-tite-conestoga";

export type ServiceHero = {
  kicker: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  overlay?: "red" | "blue" | "slate" | "dark";
  primaryCta: { label: string; href: string; ctaId: string };
  secondaryCta: { label: string; href: string; ctaId: string };
};

export type SubServiceSection = {
  key: SubServiceKey;
  label: string; // nav label
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  overlay?: "red" | "blue" | "slate" | "dark";
  highlights: Array<{ title: string; description: string }>;
  trustSnippet: { title: string; body: string }; // contextual proof (per section)
  // Enhanced content sections for premium layout
  whenToUse?: {
    intro: string;
    items: string[];
  };
  howToUse?: {
    intro: string;
    items: string[];
  };
  capabilities?: {
    intro: string;
    items: string[];
  };
  relatedServices?: Array<{ label: string; href: string; icon?: string }>;
  ctas: {
    primary: { label: string; href: string; ctaId: string };
    secondary?: { label: string; href: string; ctaId: string };
  };
};

export type ServicePageModel = {
  key: ServiceKey;
  slug: string; // URL segment
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
  hero: ServiceHero;
  subnavLabel: string; // aria-label for section nav
  sections: SubServiceSection[];
  finalCta: {
    title: string;
    description: string;
    proof: Array<{ value: string; label: string }>;
    primary: { label: string; href: string; ctaId: string };
    secondary: { label: string; href: string; ctaId: string };
  };
};

export const SERVICES: Record<ServiceKey, ServicePageModel> = {
  truckload: {
    key: "truckload",
    slug: "truckload",
    meta: {
      title: "North American Truckload Capacity | Asset-Backed & Managed | NPT Logistics",
      description:
        "Asset-backed and broker-integrated truckload solutions across CA–US–MX. 500+ fleet scale, secure trade compliance, and lane-level control from pickup through POD.",
      ogImage: "/og/services-truckload.png",
    },

    hero: {
      kicker: "Truckload",
      title: "Truckload Solutions Engineered for Supply Chain Performance.",
      description:
        "NPT moves truckload freight across Canada, the United States, and Mexico through a hybrid asset + brokerage model built for scale. Dry van, flatbed, RGN heavy haul, and Conestoga capacity delivered with appointment precision, secure trade compliance, and milestone-level visibility from dispatch through POD.",
      image: "/services/truckload/hero.png",
      imageAlt: "NPT truckload equipment moving freight on a North American highway",
      overlay: "red",
      primaryCta: {
        label: "Contact Us",
        href: "/contact?topic=truckload",
        ctaId: "service_truckload_hero_contact_us",
      },
      secondaryCta: {
        label: "Explore Equipment",
        href: "#service-subnav",
        ctaId: "service_truckload_hero_explore_equipment",
      },
    },

    subnavLabel: "Truckload equipment and service options",

    sections: [
      {
        key: "dry-van",
        label: "Dry Van",
        title:
          "Dry Van Truckload | Enclosed Capacity for Retail, Automotive & Industrial Supply Chains",
        description:
          "Dry Van is the industry-standard enclosed truckload solution for freight that does not require temperature control. It delivers full protection from weather, road exposure, and in-transit risk while supporting strict appointment compliance and OTIF performance. Designed for high-volume distribution and plant-to-plant lanes, dry van capacity is ideal for retail and CPG shipments, automotive parts, packaged goods, paper products, and general industrial freight moving across North America.",
        image: "/services/truckload/dry-van.png",
        imageAlt: "Dry van trailer in transit on a major North American corridor",
        overlay: "slate",

        highlights: [
          {
            title: "OTIF-driven execution",
            description:
              "Appointment compliance, receiver requirements, and disciplined lane governance—built for supply chain reliability.",
          },
          {
            title: "Hybrid capacity model",
            description:
              "Asset-backed stability with broker-integrated coverage to protect service when volume shifts.",
          },
          {
            title: "Milestone visibility that matters",
            description:
              "Operational updates aligned to decision points—exceptions escalated early, not discovered late.",
          },
        ],

        trustSnippet: {
          title: "Built for enterprise shipping teams",
          body: "Dry van operations are structured around dock efficiency, documentation integrity, and secure trade compliance. The result: fewer disruptions, tighter closeout, and better alignment between procurement and operations.",
        },

        whenToUse: {
          intro:
            "Choose dry van when you need enclosed truckload capacity with predictable execution across high-volume lanes.",
          items: [
            "Palletized, boxed, or floor-loaded freight without temperature control",
            "Retail replenishment and distribution moves with strict receiving windows",
            "Manufacturing and automotive freight where schedule integrity is non-negotiable",
            "Regional and long-haul lanes requiring consistent transit planning",
            "CA–US–MX moves requiring controlled documentation and compliance handoffs",
          ],
        },

        howToUse: {
          intro:
            "For the fastest, cleanest quoting and execution, provide complete lane and facility requirements upfront.",
          items: [
            "Pickup and delivery addresses, dock hours, and appointment processes",
            "Commodity description, NMFC/class (if applicable), and handling requirements",
            "Pallet count, dimensions/linear feet, and total shipment weight",
            "Target service level, delivery window, and receiver constraints",
            "Reference numbers and documentation requirements (BOL/POD/invoice)",
            "Exception protocol for detention, reconsignment, and missed appointments",
          ],
        },

        capabilities: {
          intro:
            "Dry van capabilities are designed for enterprise visibility, compliance, and lane-level cost control.",
          items: [
            "53’ dry van capacity across North America (CA–US–MX)",
            "Drop trailer and preload programs where facility design supports it",
            "Multi-stop retail and distribution routing with controlled appointment sequencing",
            "Cross-border execution aligned to secure trade and customs requirements",
            "Detention-aware planning to reduce accessorial exposure and variance",
            "Clean POD closeout and documentation workflows to support billing accuracy",
          ],
        },

        relatedServices: [
          { label: "LTL", href: "/services/ltl", icon: "●" },
          { label: "RGN / Oversize", href: "/services/truckload#section-rgn-oversize", icon: "●" },
          { label: "Automotive", href: "/#solutions", icon: "●" },
          { label: "Retail & CPG", href: "/#solutions", icon: "●" },
        ],

        ctas: {
          primary: {
            label: "Request a Dry Van Quote",
            href: "/quote?service=truckload&mode=dry-van",
            ctaId: "service_truckload_dryvan_request_pricing",
          },
          secondary: {
            label: "Speak With a Specialist",
            href: "/contact?topic=truckload&mode=dry-van",
            ctaId: "service_truckload_dryvan_speak_specialist",
          },
        },
      },

      {
        key: "flatbed",
        label: "Flatbed",
        title: "Flatbed & Open Deck Truckload | Engineered for Industrial & Project Freight",
        description:
          "Flatbed is a specialized open-deck truckload solution built for freight that exceeds standard trailer dimensions or requires crane, side-load, or top-load access. It supports industrial and project-driven shipments where securement standards, route planning, and jobsite coordination directly impact schedule integrity. Common commodities include structural steel, lumber, construction materials, heavy equipment, machinery, and oversized industrial components moving across North America.",

        image: "/services/truckload/flatbed.png",
        imageAlt: "Flatbed trailer hauling industrial freight with securement in place",
        overlay: "blue",

        highlights: [
          {
            title: "Securement governance",
            description:
              "Risk is managed through disciplined securement planning aligned to commodity profile and route conditions.",
          },
          {
            title: "Jobsite and facility coordination",
            description:
              "We plan loading method, access constraints, and on-site handling to reduce delays and detention exposure.",
          },
          {
            title: "Permit- and route-aware planning",
            description:
              "Constraints are validated early to prevent avoidable rework, missed windows, and schedule drift.",
          },
        ],

        trustSnippet: {
          title: "Engineered for industrial freight realities",
          body: "Flatbed shipments succeed when handling, securement, and site conditions are planned—not guessed. Our process reduces exceptions, protects cargo integrity, and keeps stakeholders aligned.",
        },

        whenToUse: {
          intro:
            "Choose flatbed when dimensions, handling, or site conditions require open-deck access and controlled execution.",
          items: [
            "Freight exceeds dry van interior dimensions or door constraints",
            "Crane, side-load, or top-load requirements at shipper or receiver facilities",
            "Construction and industrial project freight with jobsite delivery windows",
            "Commodities requiring securement planning beyond enclosed transport norms",
            "Loads where deck accessibility is operationally critical",
          ],
        },

        howToUse: {
          intro:
            "To reduce exceptions, confirm handling conditions and securement requirements before tendering the load.",
          items: [
            "Exact dimensions, weight, and weight distribution / center-of-gravity details",
            "Loading/unloading method, equipment availability, and access restrictions",
            "Securement requirements, protection needs, and handling constraints",
            "Appointment windows, jobsite protocols, and unloading sequence expectations",
            "Milestone update cadence and on-site delivery confirmation requirements",
            "Contingency rules for weather, delays, or access changes",
          ],
        },

        capabilities: {
          intro:
            "Flatbed operations are structured for safer handling, schedule integrity, and jobsite coordination.",
          items: [
            "Open-deck capacity for steel, lumber, machinery, and construction freight",
            "Securement planning aligned to cargo risk, route conditions, and safety standards",
            "Regional and long-haul execution for industrial and project freight",
            "Appointment-driven delivery coordination for live worksites and active facilities",
            "Detention-aware dispatch and milestone reporting for stakeholder alignment",
            "Cross-border flatbed support across CA–US–MX lanes",
          ],
        },

        ctas: {
          primary: {
            label: "Request a Flatbed Quote",
            href: "/quote?service=truckload&mode=flatbed",
            ctaId: "service_truckload_flatbed_request_pricing",
          },
          secondary: {
            label: "Talk to Open-Deck Team",
            href: "/contact?topic=truckload&mode=flatbed",
            ctaId: "service_truckload_flatbed_talk_team",
          },
        },
      },

      {
        key: "rgn-oversize",
        label: "RGN / Oversize",
        title: "RGN & Heavy Haul | Oversize, Overweight & Permit-Controlled Transport",
        description:
          "RGN and Heavy Haul services are engineered for freight that exceeds standard legal dimensions or axle weight limits and requires permit-governed execution. Designed for project-critical and high-value cargo, this mode integrates specialized trailer configurations, route feasibility analysis, axle distribution planning, and multi-jurisdiction compliance management. Typical shipments include construction and mining equipment, power generation components, transformers, and oversized industrial machinery moving across North America.",

        image: "/services/truckload/oversize.png",
        imageAlt: "Oversize load on specialized trailer with escort and route-control context",
        overlay: "red",

        highlights: [
          {
            title: "Permit and route engineering",
            description:
              "Multi-jurisdiction permits and route constraints validated up front to protect schedule accuracy.",
          },
          {
            title: "Axle and weight management",
            description:
              "Load planning aligned to axle limits, distribution requirements, and safe handling tolerances.",
          },
          {
            title: "Risk-controlled execution",
            description:
              "Equipment checks, securement standards, and escalation protocols designed for high-value freight.",
          },
        ],

        trustSnippet: {
          title: "Heavy haul managed as an operating system",
          body: "Oversize moves require compliance and execution to run as one process. We manage permits, equipment readiness, and stakeholder alignment so timelines stay real and risk stays controlled.",
        },

        whenToUse: {
          intro:
            "Use RGN or oversize services when cargo exceeds legal dimensions, standard axle limits, or handling tolerances.",
          items: [
            "Freight requires low-deck loading for tall or heavy equipment",
            "Loads exceed legal width, height, length, or axle thresholds",
            "Moves requiring permit sequencing and route restrictions",
            "Project-critical cargo where handling errors create costly delays",
            "Shipments requiring specialized loading/unloading coordination",
          ],
        },

        howToUse: {
          intro:
            "Heavy-haul success starts with accurate data. Provide engineering-grade details early in the process.",
          items: [
            "Exact dimensions, axle weights, and loading diagrams (if available)",
            "Pickup and delivery site access details for specialized equipment",
            "Jurisdictional constraints, permit timing requirements, and route limitations",
            "Escort requirements, safety protocols, and on-site coordination rules",
            "Milestone checkpoints and decision-makers for escalation",
            "Contingency protocol for permits, weather events, and schedule variance",
          ],
        },

        capabilities: {
          intro:
            "RGN and oversize execution combines compliance rigor with disciplined operational control.",
          items: [
            "Heavy-haul deck configurations for oversized and high-weight cargo",
            "Permit-aware planning with route feasibility and timing validation",
            "Risk-controlled execution for high-value and project-critical moves",
            "Multi-party coordination across shipper, jobsite, and operations stakeholders",
            "High-clarity milestone reporting and exception governance",
            "Cross-border heavy-haul support across CA–US–MX corridors",
          ],
        },

        ctas: {
          primary: {
            label: "Request a Heavy-Haul Quote",
            href: "/quote?service=truckload&mode=rgn-oversize",
            ctaId: "service_truckload_oversize_request_pricing",
          },
          secondary: {
            label: "Speak With Heavy-Haul Team",
            href: "/contact?topic=truckload&mode=rgn-oversize",
            ctaId: "service_truckload_oversize_speak_team",
          },
        },
      },

      {
        key: "roll-tite-conestoga",
        label: "Conestoga",
        title: "Conestoga & Covered Deck Truckload | Weather-Protected Open-Deck Capacity",
        description:
          "Conestoga is a covered-deck truckload solution that combines full weather protection with the loading flexibility of an open trailer. It is purpose-built for freight that cannot be exposed to the elements yet requires side or overhead access for safe handling. Ideal for high-value industrial cargo and specialized equipment, Conestoga capacity supports crated machinery, aluminum products, engineered materials, and finished industrial goods moving across North America.",

        image: "/services/truckload/conestoga.png",
        imageAlt: "Conestoga trailer transporting protected industrial freight",
        overlay: "dark",

        highlights: [
          {
            title: "Protection without compromise",
            description:
              "Covered-deck transit for sensitive freight with open-deck loading flexibility.",
          },
          {
            title: "Handling control",
            description:
              "Securement and protection requirements defined before dispatch to reduce avoidable rework.",
          },
          {
            title: "Operational predictability",
            description:
              "Milestone reporting and exception governance built for time-sensitive industrial shipments.",
          },
        ],

        trustSnippet: {
          title: "Designed for sensitive, high-value freight",
          body: "Conestoga execution is built around protection planning, securement standards, and site coordination—reducing damage exposure while preserving handling flexibility.",
        },

        whenToUse: {
          intro:
            "Use Conestoga when you need weather protection and you still require open-deck loading access.",
          items: [
            "Cargo cannot be exposed to rain, road spray, dust, or debris",
            "Side-load or top-load handling requirements at origin or destination",
            "High-value industrial freight requiring controlled handling and protection",
            "Routes with variable weather risk and tight delivery windows",
            "Freight that is difficult to load in a dry van but must be protected in transit",
          ],
        },

        howToUse: {
          intro:
            "For consistent execution, define protection priorities and handling constraints before tendering the shipment.",
          items: [
            "Commodity sensitivity, packaging profile, and protection/securement requirements",
            "Loading method and whether side-load or overhead access is required",
            "Pickup and delivery constraints, including site access and unload conditions",
            "Target timeline, appointment process, and receiver compliance requirements",
            "Status cadence expectations and POD closeout requirements",
            "Contingency rules for weather disruption and schedule variance",
          ],
        },

        capabilities: {
          intro:
            "Conestoga combines protection, flexibility, and operational control for sensitive freight programs.",
          items: [
            "Covered-deck transport with open-deck style handling flexibility",
            "Securement and protection planning aligned to commodity risk and route conditions",
            "Regional and long-haul execution across North America (CA–US–MX)",
            "Weather-risk mitigation without sacrificing jobsite compatibility",
            "Proactive milestone updates and exception governance",
            "Cross-border support for protected freight programs",
          ],
        },

        ctas: {
          primary: {
            label: "Request a Conestoga Quote",
            href: "/quote?service=truckload&mode=roll-tite-conestoga",
            ctaId: "service_truckload_conestoga_request_pricing",
          },
          secondary: {
            label: "Talk to Protected Freight Team",
            href: "/contact?topic=truckload&mode=roll-tite-conestoga",
            ctaId: "service_truckload_conestoga_talk_team",
          },
        },
      },
    ],

    finalCta: {
      title: "Talk to our experts and choose the right freight mode.",
      description:
        "Fast mode guidance for your lane, timing, and cargo profile.",
      proof: [
        { value: "500+", label: "Fleet scale across North America" },
        { value: "CA–US–MX", label: "Tri-national execution" },
        { value: "C-TPAT / FAST", label: "Secure trade certified" },
      ],
      primary: {
        label: "Call Us",
        href: "tel:+15199683632",
        ctaId: "service_truckload_final_call_us",
      },
      secondary: {
        label: "Speak to an Expert",
        href: "#live-chat",
        ctaId: "service_truckload_final_speak_expert_chat",
      },
    },
  },
};

export function getServiceBySlug(slug: string) {
  return Object.values(SERVICES).find((s) => s.slug === slug);
}

export function getServiceKeys(): ServiceKey[] {
  return Object.keys(SERVICES) as ServiceKey[];
}

export function buildServiceMetadata(model: ServicePageModel): Metadata {
  return {
    title: model.meta.title,
    description: model.meta.description,
    openGraph: {
      title: model.meta.title,
      description: model.meta.description,
      images: model.meta.ogImage ? [model.meta.ogImage] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: model.meta.title,
      description: model.meta.description,
      images: model.meta.ogImage ? [model.meta.ogImage] : undefined,
    },
  };
}
