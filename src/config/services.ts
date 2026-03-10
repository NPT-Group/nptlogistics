// src/config/services.ts
import type { Metadata } from "next";

export type ServiceKey =
  | "truckload"
  | "expedited-specialized"
  | "cross-border"
  | "value-added"
  | "ltl"
  | "intermodal"
  | "hazmat"
  | "temperature-controlled";

export type SubServiceKey =
  | "dry-van"
  | "flatbed"
  | "rgn-oversize"
  | "roll-tite-conestoga"
  | "expedited"
  | "specialized-vehicle-programs"
  | "canada-us"
  | "mexico-cross-border"
  | "ocean-freight"
  | "air-freight"
  | "warehousing-distribution"
  | "managed-capacity"
  | "dedicated-contract"
  | "project-oversize-programs";

export type ServiceHero = {
  kicker: string;
  title: string;
  description: string;
  microNote?: string;
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
  detailParagraph?: string; // optional second paragraph (e.g. equipment relation)
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
  freightFit?: {
    title: string;
    intro: string;
    diagram: string;
    diagramAlt: string;
    specs: {
      length: string;
      width: string;
      height: string;
      weight: string;
      pallets?: string;
    };
    rules: Array<{
      condition: string;
      recommendation: string;
      serviceSlug?: string;
      description: string;
    }>;
    disclaimer?: string;
  };
  showRelated?: boolean;
  ctas: {
    primary: { label: string; href: string; ctaId: string };
    secondary?: { label: string; href: string; ctaId: string };
  };
};

export type SingleServiceFreightFit = {
  title: string;
  intro: string;
  diagram: string;
  diagramAlt: string;
  specs: {
    length: string;
    width: string;
    height: string;
    weight: string;
    pallets?: string;
  };
  rules: Array<{
    condition: string;
    recommendation: string;
    serviceSlug?: string;
    description: string;
  }>;
  disclaimer?: string;
};

export type SingleServiceLayout = {
  whenToUse: { title: string; intro: string; items: string[] };
  howItWorks: {
    title: string;
    intro: string;
    steps: Array<{ title: string; description: string }>;
  };
  capabilities: { title: string; intro: string; items: string[] };
  riskAndCompliance: { title: string; intro: string; items: string[] };
  conversion: { title: string; body: string; signals: string[] };
  relatedServices: Array<{ label: string; href: string; reason: string }>;
  /** Fortune 500 pattern: Freight Fit Guide + How to use + merged Execution block */
  freightFit?: SingleServiceFreightFit;
  howToUse?: { intro: string; items: string[] };
  highlights?: Array<{ title: string; description: string }>;
  trustSnippet?: { title: string; body: string };
  showRelated?: boolean;
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
  sections?: SubServiceSection[];
  singleLayout?: SingleServiceLayout;
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
      ogImage: "/_optimized/brand/nptLogo-glow.webp",
    },

    hero: {
      kicker: "Truckload",
      title: "Truckload Solutions Engineered for Supply Chain Performance.",
      description:
        "NPT moves truckload freight across Canada, the United States, and Mexico through a hybrid asset + brokerage model built for scale. Dry van, flatbed, RGN heavy haul, and Conestoga capacity delivered with appointment precision, secure trade compliance, and milestone-level visibility from dispatch through POD.",
      microNote: "Built for lane consistency, clean handoffs, and faster exception recovery.",
      image: "/_optimized/services/truckload/hero.webp",
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
        image: "/_optimized/services/truckload/dry-van.webp",
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
          title: "Compliance and execution controls that reduce variance",
          body: "Dry van execution is governed by appointment discipline, clean documentation handoff, and proactive exception management to protect OTIF performance.",
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
          intro: "Here’s how to use NPT’s Dry Van service from quote to delivery.",
          items: [
            "Share pickup and delivery addresses, dock hours, and appointment process so we can plan the lane.",
            "Provide commodity description, NMFC/class if known, and any handling requirements.",
            "Give pallet count, dimensions or linear feet, and total weight so we can confirm trailer fit.",
            "Specify target service level, delivery window, and receiver constraints (e.g. appointment-only).",
            "Include reference numbers and documentation needs (BOL, POD, invoice) for clean handoff.",
            "Confirm exception protocol for detention, reconsignment, or missed appointments so we can respond consistently.",
          ],
        },

        capabilities: {
          intro:
            "Operational coverage is structured to keep enclosed freight moving with consistent service standards.",
          items: [
            "53' dry van lane coverage across North America (CA-US-MX)",
            "Drop trailer and preload support where facility flow allows",
            "Appointment-sequenced retail and distribution routing",
            "Cross-border handoff coordination aligned to customs workflows",
            "Detention-aware planning and exception escalation protocol",
            "POD and documentation closeout discipline for clean billing",
          ],
        },

        freightFit: {
          title: "Dry Van Freight Fit Guide",
          intro:
            "Dry van trailers are the most widely used enclosed freight solution in North America. This guide helps determine if a standard dry van is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/dry-van.svg",
          diagramAlt: "Dry van trailer equipment diagram with dimensions and payload guidance",
          specs: {
            length: "53 ft trailer",
            width: "8.5 ft (102 inches)",
            height: "~9 ft interior clearance",
            weight: "~43,000-45,000 lbs typical legal payload",
            pallets: "Typically up to 26 standard pallets",
          },
          rules: [
            {
              condition: "Small palletized shipments",
              description:
                "If your freight is under 12 pallets or under 15,000 lbs, booking an entire truck may not be the most efficient option.",
              recommendation: "LTL Freight",
              serviceSlug: "ltl",
            },
            {
              condition: "Freight taller than enclosed dry van limits or oversized",
              description:
                "If your freight exceeds enclosed trailer height constraints or requires top/side loading for safe handling.",
              recommendation: "Flatbed / Step Deck (Oversize)",
              serviceSlug: "flatbed",
            },
            {
              condition: "Freight requiring temperature control",
              description:
                "If your cargo must remain within a controlled temperature range, such as food, pharmaceuticals, or perishables.",
              recommendation: "Refrigerated Truckload",
              serviceSlug: "reefer",
            },
            {
              condition: "Freight requiring hazardous materials handling",
              description:
                "If your shipment is classified as hazardous under transport regulations and requires placarding, documentation, or carrier credentials.",
              recommendation: "HAZMAT",
              serviceSlug: "hazmat",
            },
          ],
          disclaimer:
            "Planning values only. Final legal fit depends on route, axle configuration, equipment, and applicable regulations; confirm at dispatch.",
        },
        showRelated: false,
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
        label: "Flatbed / Step Deck (Oversize)",
        title:
          "Flatbed / Step Deck (Oversize) | Open Deck Truckload for Industrial & Project Freight",
        description:
          "Flatbed and step deck are open-deck truckload solutions built for freight that exceeds standard trailer dimensions or requires crane, side-load, or top-load access. They support industrial and project-driven shipments where securement standards, route planning, and jobsite coordination directly impact schedule integrity. Common commodities include structural steel, lumber, construction materials, heavy equipment, machinery, and oversized industrial components moving across North America.",
        detailParagraph:
          'Flatbed trailers have a single-level deck and are the standard choice for most open-deck freight. Step deck (also called step-deck or drop-deck) trailers have a lower forward section—a "step down"—that reduces overall load height and allows taller cargo to stay within legal height limits. We match your load dimensions and route to the right equipment: flatbed when a single deck is sufficient, step deck when extra vertical clearance is needed.',

        image: "/_optimized/services/truckload/flatbed.webp",
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
            "Here’s how to use NPT’s Flatbed / Step Deck (Oversize) service from quote to delivery.",
          items: [
            "Share exact dimensions, weight, and weight distribution or center-of-gravity so we can confirm deck fit and securement approach.",
            "Provide loading and unloading method, equipment on site (crane, forklift), and any access or height restrictions.",
            "Specify securement requirements, protection needs (tarps, blocking), and handling constraints for the commodity.",
            "Give appointment windows, jobsite protocols, and unloading sequence so we can plan driver and equipment timing.",
            "Confirm milestone update cadence and on-site delivery confirmation (sign-off, photos) so stakeholders stay aligned.",
            "Clarify contingency rules for weather, delays, or access changes so we can respond without rework.",
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

        freightFit: {
          title: "Flatbed / Step Deck (Oversize) Freight Fit Guide",
          intro:
            "Flatbed and step deck trailers are built for freight that needs top, side, or crane access, or exceeds enclosed trailer dimensions. This guide helps determine if flatbed or step deck is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/flatbed.webp",
          diagramAlt: "Flatbed trailer equipment diagram with dimensions and payload guidance",
          specs: {
            length: "48 ft or 53 ft deck (typical)",
            width: "8.5 ft (102 in) deck width",
            height: "Open; no enclosed height limit",
            weight: "Varies by axle configuration; typical legal payload ~43,000–48,000 lbs",
            pallets: "N/A — deck-loaded, not pallet-count driven",
          },
          rules: [
            {
              condition: "Small or palletized shipments that fit enclosed",
              description:
                "If your freight fits inside a dry van and does not require crane or top-load access, enclosed transport is usually more efficient and weather-protected.",
              recommendation: "Dry Van Truckload",
              serviceSlug: "dry-van",
            },
            {
              condition: "Oversize, overweight, or permit-required",
              description:
                "If your load exceeds standard legal dimensions or axle limits and requires permits or specialized low-bed equipment.",
              recommendation: "RGN (Oversize)",
              serviceSlug: "rgn-oversize",
            },
            {
              condition: "Shipments under deck capacity",
              description:
                "If your shipment is under roughly 12 linear feet or 15,000 lbs and does not need open-deck access, LTL may be more cost-effective.",
              recommendation: "LTL Freight",
              serviceSlug: "ltl",
            },
            {
              condition: "Freight requiring temperature control",
              description:
                "If your cargo must remain within a controlled temperature range, open deck is not suitable.",
              recommendation: "Refrigerated Truckload",
              serviceSlug: "reefer",
            },
          ],
          disclaimer:
            "Planning values only. Final legal fit depends on route, axle configuration, equipment, and applicable regulations; confirm at dispatch.",
        },
        showRelated: false,

        ctas: {
          primary: {
            label: "Request a Flatbed / Step Deck Quote",
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
        label: "RGN (Oversize)",
        title: "RGN (Oversize) & Heavy Haul | Oversize, Overweight & Permit-Controlled Transport",
        description:
          "RGN and Heavy Haul services are engineered for freight that exceeds standard legal dimensions or axle weight limits and requires permit-governed execution. Designed for project-critical and high-value cargo, this mode integrates specialized trailer configurations, route feasibility analysis, axle distribution planning, and multi-jurisdiction compliance management. Typical shipments include construction and mining equipment, power generation components, transformers, and oversized industrial machinery moving across North America.",

        image: "/_optimized/services/truckload/oversize.webp",
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
          intro: "Here’s how to use NPT’s RGN and Oversize service from quote to delivery.",
          items: [
            "Share exact dimensions, axle weights, and loading diagrams (if available) so we can confirm equipment fit and permit scope.",
            "Provide pickup and delivery site access details for low-bed and specialized equipment so we can plan moves and staging.",
            "Specify jurisdictional constraints, permit timing requirements, and route limitations so we can sequence permits and avoid rework.",
            "Give escort requirements, safety protocols, and on-site coordination rules so we can align carriers and jobsite expectations.",
            "Confirm milestone checkpoints and decision-makers for escalation so we can keep the project on track.",
            "Clarify contingency protocol for permits, weather, and schedule variance so we can respond without delay.",
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

        freightFit: {
          title: "RGN (Oversize) Freight Fit Guide",
          intro:
            "RGN and heavy-haul equipment are built for freight that exceeds standard legal dimensions or axle weight limits and requires permit-governed execution. This guide helps determine if RGN or oversize is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/RGN_oversize.webp",
          diagramAlt: "RGN and oversize equipment diagram with dimensions and payload guidance",
          specs: {
            length: "Variable; low-bed and detachable configurations to suit load",
            width: "Deck width varies; legal width and permit dimensions apply",
            height: "Low deck for tall cargo; height clearance is route- and permit-dependent",
            weight: "Axle- and configuration-dependent; often 80,000+ lbs gross with permits",
            pallets: "N/A — project and dimension-driven, not pallet-count",
          },
          rules: [
            {
              condition: "Standard legal freight that fits enclosed",
              description:
                "If your freight fits within dry van dimensions and legal weight, enclosed transport is typically more efficient.",
              recommendation: "Dry Van Truckload",
              serviceSlug: "dry-van",
            },
            {
              condition: "Freight that fits on standard flatbed",
              description:
                "If your load fits on a 48–53 ft flatbed within legal dimensions and weight without permits or specialized equipment.",
              recommendation: "Flatbed / Step Deck (Oversize)",
              serviceSlug: "flatbed",
            },
            {
              condition: "Shipments under truckload scope",
              description:
                "If your shipment is under roughly 12 linear feet or 15,000 lbs and does not require specialized handling.",
              recommendation: "LTL Freight",
              serviceSlug: "ltl",
            },
            {
              condition: "Freight requiring temperature control",
              description:
                "If your cargo must remain within a controlled temperature range, heavy-haul open deck is not suitable.",
              recommendation: "Refrigerated Truckload",
              serviceSlug: "reefer",
            },
          ],
          disclaimer:
            "Planning values only. Final equipment fit, permits, and legal limits depend on route, jurisdiction, and configuration; confirm at dispatch.",
        },
        showRelated: false,

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
        label: "Roll-Tite / Conestoga",
        title:
          "Roll-Tite / Conestoga | Covered Deck Truckload for Weather-Protected Open-Deck Capacity",
        description:
          "Conestoga is a covered-deck truckload solution that combines full weather protection with the loading flexibility of an open trailer. It is purpose-built for freight that cannot be exposed to the elements yet requires side or overhead access for safe handling. Ideal for high-value industrial cargo and specialized equipment, Conestoga capacity supports crated machinery, aluminum products, engineered materials, and finished industrial goods moving across North America.",

        image: "/_optimized/services/truckload/conestoga.webp",
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
          intro: "Here's how to use NPT's Roll-Tite / Conestoga service from quote to delivery.",
          items: [
            "Share commodity sensitivity, packaging profile, and protection or securement requirements so we can plan cover and tie-down approach.",
            "Provide loading method and whether side-load or overhead access is required at origin and destination.",
            "Specify pickup and delivery constraints, site access, and unload conditions so we can match equipment and timing.",
            "Give target timeline, appointment process, and receiver compliance requirements for clean handoff.",
            "Confirm status cadence expectations and POD closeout requirements so stakeholders stay aligned.",
            "Clarify contingency rules for weather disruption and schedule variance so we can respond consistently.",
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

        freightFit: {
          title: "Roll-Tite / Conestoga Freight Fit Guide",
          intro:
            "Roll-Tite and Conestoga trailers offer covered-deck capacity with side and top loading access—ideal when freight must be protected from the elements but does not fit or load efficiently in a dry van. This guide helps determine if Roll-Tite or Conestoga is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/rollTite_conestoga.webp",
          diagramAlt:
            "Roll-Tite / Conestoga covered-deck equipment diagram with dimensions and payload guidance",
          specs: {
            length: "48 ft or 53 ft covered deck (typical)",
            width: "8.5 ft (102 in) deck width",
            height: "Covered; flexible clearance with roll-tarp or fixed cover",
            weight: "Varies by axle configuration; typical legal payload similar to flatbed",
            pallets: "N/A — deck-loaded, not pallet-count driven",
          },
          rules: [
            {
              condition: "Standard palletized freight that fits enclosed",
              description:
                "If your freight loads through standard dock doors and fits inside a dry van, enclosed transport is usually simpler and cost-effective.",
              recommendation: "Dry Van Truckload",
              serviceSlug: "dry-van",
            },
            {
              condition: "Freight that can be exposed to weather",
              description:
                "If your cargo can tolerate rain, road spray, or open-deck transit and does not need full weather protection.",
              recommendation: "Flatbed / Step Deck (Oversize)",
              serviceSlug: "flatbed",
            },
            {
              condition: "Freight requiring temperature control",
              description:
                "If your cargo must remain within a controlled temperature range; Conestoga provides weather protection only, not refrigeration.",
              recommendation: "Refrigerated Truckload",
              serviceSlug: "reefer",
            },
            {
              condition: "Shipments under truckload scope",
              description:
                "If your shipment is under roughly 12 linear feet or 15,000 lbs and does not require specialized handling.",
              recommendation: "LTL Freight",
              serviceSlug: "ltl",
            },
          ],
          disclaimer:
            "Planning values only. Final equipment fit depends on route, cover type, and load profile; confirm at dispatch.",
        },
        showRelated: false,

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
      description: "Fast mode guidance for your lane, timing, and cargo profile.",
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
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "service_truckload_final_speak_expert_chat",
      },
    },
  },
  "expedited-specialized": {
    key: "expedited-specialized",
    slug: "expedited-specialized",
    meta: {
      title:
        "Expedited & Specialized (ES) Freight | Priority and Programmed Execution | NPT Logistics",
      description:
        "Expedited and specialized vehicle freight programs built for urgent timelines, dimensional constraints, and controlled execution across North America.",
    },
    hero: {
      kicker: "Expedited & Specialized (ES)",
      title: "Priority and Specialized Transport for Critical Freight Windows.",
      description:
        "NPT combines expedited execution and specialized vehicle programs under one operating model. We align urgency, handling constraints, and risk controls so critical shipments move with clear accountability from pickup through delivery.",
      microNote:
        "Deadline-critical coverage, specialized equipment fit, and milestone control for high-consequence moves.",
      image: "/_optimized/services/specialized&time-sensitive/hero.webp",
      imageAlt: "Specialized and time-sensitive freight operations planning board",
      overlay: "slate",
      primaryCta: {
        label: "Contact Us",
        href: "/contact?topic=expedited-specialized",
        ctaId: "service_es_hero_contact_us",
      },
      secondaryCta: {
        label: "Explore Service Options",
        href: "#service-subnav",
        ctaId: "service_es_hero_explore_options",
      },
    },
    subnavLabel: "Expedited and specialized vehicle service options",
    sections: [
      {
        key: "expedited",
        label: "Expedited",
        title: "Expedited Freight | Priority Capacity for Time-Critical Recovery and Continuity",
        description:
          "Expedited freight is designed for shipments where delivery timing directly affects production, customer commitments, or service recovery. Execution depends on priority dispatch, direct routing, and disciplined communication so teams can act quickly when conditions change.",
        image: "/_optimized/solutions/card-expedited.webp",
        imageAlt: "Expedited shipment moving on a time-critical lane",
        overlay: "red",
        highlights: [
          {
            title: "Priority dispatch model",
            description:
              "Capacity is matched to urgency, route profile, and delivery commitment before release.",
          },
          {
            title: "Direct-route execution",
            description: "Planning minimizes unnecessary handoffs to protect schedule confidence.",
          },
          {
            title: "Exception-first communication",
            description:
              "Milestone updates are tied to operational decision points, not generic status checks.",
          },
        ],
        trustSnippet: {
          title: "Built for high-consequence shipment windows",
          body: "Expedited service is structured for recovery and continuity scenarios where timing variance has business impact. We focus on clean intake, route realism, and proactive escalation.",
        },
        whenToUse: {
          intro:
            "Use expedited service when schedule disruption, revenue exposure, or continuity risk is higher than standard lane cost priorities.",
          items: [
            "Line-down, shutdown-risk, or stockout-sensitive replenishment moves",
            "Urgent customer recovery shipments tied to contractual delivery windows",
            "Late-running or rolled shipments requiring timeline compression",
            "Critical service parts and high-priority replacement component movements",
            "Loads where controlled communication cadence is mandatory",
          ],
        },
        howToUse: {
          intro: "Here's how to use NPT's Expedited service from quote to delivery.",
          items: [
            "Share ready time, hard delivery deadline, and latest-acceptable arrival window so we can confirm feasibility.",
            "Provide exact dimensions, piece count, and total weight so we can match equipment and route.",
            "Specify pickup and delivery facility constraints, dock process, and access limitations for planning.",
            "Give after-hours contacts and escalation owners on shipper and receiver sides for exception response.",
            "Include shipment-critical references and proof-of-delivery expectations for clean closeout.",
            "Confirm communication cadence and milestone expectations so we can meet your visibility needs.",
          ],
        },
        capabilities: {
          intro:
            "Capabilities are focused on urgency response, lane feasibility, and controlled delivery closeout.",
          items: [
            "Priority dispatch workflows for urgent domestic and cross-border lanes",
            "Vehicle and routing selection aligned to deadline and handling profile",
            "Milestone tracking and proactive exception escalation",
            "After-hours operational coordination for critical handoffs",
            "Structured closeout with decision-grade shipment updates",
          ],
        },
        freightFit: {
          title: "Expedited Freight Fit Guide",
          intro:
            "Expedited freight is for shipments where delivery timing directly affects production, customer commitments, or recovery. This guide helps determine if expedited is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/Expedited.webp",
          diagramAlt: "Expedited freight equipment and priority execution diagram",
          specs: {
            length: "Equipment matched to load; direct routing typical",
            width: "Standard dockable dimensions unless specialized",
            height: "Standard clearance; specialized equipment as needed",
            weight: "Per shipment; equipment and route selected to deadline",
            pallets: "Varies; expedited is urgency-driven, not volume-optimized",
          },
          rules: [
            {
              condition: "Standard lane with no urgency pressure",
              description:
                "If your shipment can meet normal transit windows and cost is a priority, truckload or intermodal is usually more economical.",
              recommendation: "Dry Van Truckload",
              serviceSlug: "dry-van",
            },
            {
              condition: "Small or LTL-volume shipments",
              description:
                "If your volume does not justify dedicated expedited equipment and standard LTL transit is acceptable.",
              recommendation: "LTL Freight",
              serviceSlug: "ltl",
            },
            {
              condition: "Freight requiring temperature control",
              description:
                "If your cargo must remain within a controlled temperature range; dedicated temperature-controlled expedited is a different program.",
              recommendation: "Refrigerated Truckload",
              serviceSlug: "reefer",
            },
            {
              condition: "Oversized or specialized equipment needs",
              description:
                "If your load requires flatbed, RGN, or exotic/specialized vehicle equipment rather than standard expedited capacity.",
              recommendation: "Flatbed / Step Deck (Oversize)",
              serviceSlug: "flatbed",
            },
          ],
          disclaimer:
            "Expedited feasibility depends on lane, equipment, and timing; confirm with our priority team at quote.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request an Expedited Quote",
            href: "/quote?service=expedited-specialized&mode=expedited",
            ctaId: "service_es_expedited_request_quote",
          },
          secondary: {
            label: "Talk to Priority Team",
            href: "/contact?topic=expedited-specialized&mode=expedited",
            ctaId: "service_es_expedited_talk_team",
          },
        },
      },
      {
        key: "specialized-vehicle-programs",
        label: "Specialized Vehicle Programs",
        title:
          "Exotic & Specialized Vehicle Hauling | Premium-Asset, Constraint-Controlled Transport",
        description:
          "This program is purpose-built for exotic and specialty vehicle transport where condition integrity, enclosed handling, and route realism are non-negotiable. It also supports non-standard cargo profiles that require strict access, permit, or dimensional controls before dispatch.",
        image: "/_optimized/services/specialized&time-sensitive/exoticCarhaulingImg2.webp",
        imageAlt: "Exotic car hauling with enclosed, premium-asset transport controls",
        overlay: "blue",
        highlights: [
          {
            title: "Premium enclosed equipment-fit planning",
            description:
              "Trailer type, tie-down approach, and handling sequence are selected against verified vehicle profile and condition sensitivity.",
          },
          {
            title: "Route realism and delivery-site feasibility",
            description:
              "Clearance, grade, turning radius, and site-access constraints are validated early to prevent avoidable risk events.",
          },
          {
            title: "Condition-accountable handoff rhythm",
            description:
              "Pickup-to-delivery milestones include condition checks and accountable handoff communication at every critical transition.",
          },
        ],
        trustSnippet: {
          title: "Built for exotic vehicles and controlled risk transfer",
          body: "Exotic hauling succeeds when enclosed handling discipline, route reality, and communication ownership are confirmed before dispatch. Our model is built around that standard.",
        },
        whenToUse: {
          intro:
            "Use this program when exotic or specialty vehicles require enclosed, condition-accountable transport, or when lane constraints exceed standard equipment assumptions.",
          items: [
            "Exotic, collector, luxury, or high-value vehicles where condition integrity is mission-critical",
            "Vehicle moves requiring enclosed transport and low-touch handling controls",
            "Routes that demand feasibility checks for clearance, grade, or constrained access",
            "Site conditions requiring controlled loading/unloading sequencing and documented handoffs",
            "Recurring premium-asset lanes that need repeatable governance and accountability",
          ],
        },
        howToUse: {
          intro: "Here's how to use NPT's Specialized Vehicle Programs from quote to delivery.",
          items: [
            "Share verified vehicle dimensions, ride-height, special handling notes, and securement requirements so we can confirm equipment fit.",
            "Provide origin and destination access details—ramp angle, loading method, receiver constraints—so we can plan the move.",
            "Specify any route, permit, escort, or delivery-window restrictions before we commit to dispatch.",
            "Give target milestone plan with condition-confirmation checkpoints and escalation contacts for accountability.",
            "Include documentation requirements for secure release, transit accountability, and delivery closeout.",
            "Confirm condition expectations and handoff sign-off process so we can meet your standards.",
          ],
        },
        capabilities: {
          intro:
            "Capabilities center on exotic-asset protection, engineered planning, and reduced variance at critical handoffs.",
          items: [
            "Enclosed specialized equipment planning for premium and non-standard vehicle profiles",
            "Route and schedule design aligned to access constraints and timeline commitments",
            "Condition-accountable control across pickup, transfer, and delivery milestones",
            "Exception governance for weather, access, and timing risk events",
            "Program-level support for recurring exotic and specialized lane requirements",
          ],
        },
        freightFit: {
          title: "Specialized Vehicle Programs Freight Fit Guide",
          intro:
            "Specialized Vehicle Programs are for exotic and specialty vehicles—and non-standard cargo—where condition integrity, enclosed handling, and route feasibility are non-negotiable. This guide helps determine if this program is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/specializedVehicle.webp",
          diagramAlt: "Specialized vehicle and enclosed transport equipment diagram",
          specs: {
            length: "Enclosed trailer; dimensions matched to vehicle or cargo profile",
            width: "Standard enclosed width; access and clearance validated per move",
            height: "Interior clearance and load height confirmed before commitment",
            weight: "Per vehicle or load; equipment and securement planned accordingly",
            pallets: "N/A — vehicle or specialized cargo, not pallet-based",
          },
          rules: [
            {
              condition: "Standard vehicles without premium handling needs",
              description:
                "If your vehicle or cargo does not require enclosed, condition-accountable transport, expedited or standard truckload may be more efficient.",
              recommendation: "Expedited",
              serviceSlug: "expedited-specialized",
            },
            {
              condition: "Oversize, overweight, or permit-required moves",
              description:
                "If your load exceeds standard dimensions or requires permits and specialized low-bed equipment.",
              recommendation: "RGN (Oversize)",
              serviceSlug: "rgn-oversize",
            },
            {
              condition: "Freight requiring temperature control",
              description: "If your cargo must remain within a controlled temperature range.",
              recommendation: "Refrigerated Truckload",
              serviceSlug: "reefer",
            },
            {
              condition: "Shipments under trailer utilization",
              description:
                "If your shipment does not require dedicated specialized equipment and fits standard LTL or truckload.",
              recommendation: "LTL Freight",
              serviceSlug: "ltl",
            },
          ],
          disclaimer:
            "Equipment fit and route feasibility depend on vehicle profile and site constraints; confirm with our specialized team at quote.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request a Specialized Program Quote",
            href: "/quote?service=expedited-specialized&mode=specialized-vehicle-programs",
            ctaId: "service_es_specialized_request_quote",
          },
          secondary: {
            label: "Speak With Specialized Team",
            href: "/contact?topic=expedited-specialized&mode=specialized-vehicle-programs",
            ctaId: "service_es_specialized_talk_team",
          },
        },
      },
    ],
    finalCta: {
      title: "Talk to our experts and choose the right critical-shipment strategy.",
      description:
        "Get practical guidance on urgency fit, equipment selection, and execution controls for your lane.",
      proof: [
        { value: "Priority-Ready", label: "Urgency response workflows" },
        { value: "Constraint-Aware", label: "Specialized planning discipline" },
        { value: "Milestone-Controlled", label: "Execution visibility model" },
      ],
      primary: {
        label: "Call Us",
        href: "tel:+15199683632",
        ctaId: "service_es_final_call_us",
      },
      secondary: {
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "service_es_final_speak_expert_chat",
      },
    },
  },
  "cross-border": {
    key: "cross-border",
    slug: "cross-border",
    meta: {
      title: "Cross-Border & Global Freight | Canada-US, Mexico, Ocean, Air | NPT Logistics",
      description:
        "Cross-border and global freight execution across Canada-USA, Mexico, ocean, and air. Customs-ready workflows, milestone visibility, and mode planning built for supply chain reliability.",
    },

    hero: {
      kicker: "Cross-Border & Global",
      title: "Cross-Border and Global Freight Built for Confident Execution.",
      description:
        "NPT coordinates Canada-USA, Mexico cross-border, ocean, and air freight under one operating rhythm. From customs documentation to final delivery milestones, we keep teams aligned across every handoff.",
      microNote:
        "Customs-ready handoffs, proactive milestones, and mode guidance matched to urgency and cost.",
      image: "/_optimized/services/cross-border&global/hero.webp",
      imageAlt: "International freight movement with cross-border and global transport context",
      overlay: "blue",
      primaryCta: {
        label: "Contact Us",
        href: "/contact?topic=cross-border-global",
        ctaId: "service_crossborder_hero_contact_us",
      },
      secondaryCta: {
        label: "Explore Service Options",
        href: "#service-subnav",
        ctaId: "service_crossborder_hero_explore_options",
      },
    },

    subnavLabel: "Cross-border and global service options",

    sections: [
      {
        key: "canada-us",
        label: "Canada ↔ USA",
        title: "Canada ↔ USA Cross-Border | Customs-Aligned Freight Across Major Trade Lanes",
        description:
          "Canada-USA freight requires disciplined documentation, broker coordination, and timing control at both origin and destination. Our cross-border process is built to reduce border friction while protecting delivery commitments across recurring and spot lanes.",
        image: "/_optimized/solutions/card-cross-border-canada-us.webp",
        imageAlt: "Cross-border freight corridor between Canada and the United States",
        overlay: "blue",
        highlights: [
          {
            title: "Customs-ready execution",
            description:
              "Commercial invoice, BOL, and broker handoff requirements are aligned before pickup.",
          },
          {
            title: "Lane-level milestone visibility",
            description:
              "Status updates follow operational decision points, not generic tracking noise.",
          },
          {
            title: "Controlled border handoffs",
            description: "Dispatch, customs stakeholders, and consignee windows stay synchronized.",
          },
        ],
        trustSnippet: {
          title: "Built for repeatable cross-border performance",
          body: "We run Canada-USA freight as a coordinated process between operations and compliance so border events do not become service surprises.",
        },
        whenToUse: {
          intro:
            "Use this service when freight must move reliably between Canadian and U.S. facilities with strong documentation control.",
          items: [
            "Recurring CA-US lanes where appointment integrity matters",
            "Freight programs needing customs broker synchronization",
            "Shipments with strict receiver windows and compliance protocols",
            "Networks requiring predictable updates during border transit",
          ],
        },
        howToUse: {
          intro:
            "Here's how to use NPT's Canada ↔ USA cross-border service from quote to delivery.",
          items: [
            "Share importer/exporter details and customs broker contacts so we can align documentation and handoffs.",
            "Provide commodity profile, values, and commercial invoice requirements for customs readiness.",
            "Specify pickup and delivery appointment windows and facility rules so we can plan border timing.",
            "Give reference numbers, document return workflow, and POD expectations for clean closeout.",
            "Confirm exception and escalation preferences for holds, inspections, or timing changes so we can respond consistently.",
            "Include any carrier or lane preferences so we can match capacity to your compliance and service needs.",
          ],
        },
        capabilities: {
          intro: "Canada-USA execution is structured to reduce friction at border handoffs.",
          items: [
            "Cross-border lane planning with customs workflow alignment",
            "Milestone reporting from dispatch through delivery confirmation",
            "Exception escalation for holds, inspections, and timing changes",
            "Support for both spot shipments and repeat lane programs",
          ],
        },
        freightFit: {
          title: "Canada ↔ USA Cross-Border Freight Fit Guide",
          intro:
            "Canada-USA cross-border service is for freight moving between Canadian and U.S. facilities with customs and documentation control. This guide helps determine if this service is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/crossBorderUSA_Canada.webp",
          diagramAlt: "Canada-USA cross-border freight and customs workflow diagram",
          specs: {
            length: "Mode-dependent; truck, rail, or intermodal as lane requires",
            width: "Standard equipment dimensions; load and border requirements apply",
            height: "Per equipment type and route",
            weight: "Legal and equipment limits; customs declaration aligned",
            pallets: "Varies by mode and equipment; standard when truckload",
          },
          rules: [
            {
              condition: "Domestic-only lanes (US–US or Canada–Canada)",
              description:
                "If your freight moves entirely within one country and does not cross the border, domestic truckload or LTL is typically more direct.",
              recommendation: "Dry Van Truckload",
              serviceSlug: "dry-van",
            },
            {
              condition: "Mexico cross-border freight",
              description:
                "If your lane involves Mexico–USA border crossing, our Mexico cross-border program is designed for that workflow.",
              recommendation: "Mexico Cross-Border",
              serviceSlug: "mexico-cross-border",
            },
            {
              condition: "International ocean moves",
              description:
                "If your shipment is moving by ocean (FCL/LCL) rather than over-the-road cross-border.",
              recommendation: "Ocean Freight",
              serviceSlug: "ocean-freight",
            },
            {
              condition: "International air or expedited",
              description:
                "If your cargo requires air freight or expedited international movement rather than surface cross-border.",
              recommendation: "Air Freight",
              serviceSlug: "air-freight",
            },
          ],
          disclaimer:
            "Border requirements and documentation depend on commodity, origin, and destination; confirm with our border team at quote.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request a Canada-USA Quote",
            href: "/quote?service=cross-border&mode=canada-us",
            ctaId: "service_crossborder_canadaus_request_quote",
          },
          secondary: {
            label: "Talk to Border Team",
            href: "/contact?topic=cross-border-global&mode=canada-us",
            ctaId: "service_crossborder_canadaus_talk_team",
          },
        },
      },
      {
        key: "mexico-cross-border",
        label: "Mexico Cross-Border",
        title: "Mexico Cross-Border Logistics | Coordinated Northbound and Southbound Freight",
        description:
          "Mexico cross-border freight depends on strong handoff design between drayage, transload, customs, and linehaul stakeholders. We engineer the workflow to protect cargo integrity, timing, and communication across each border transition.",
        image: "/_optimized/solutions/card-cross-border-mexico.webp",
        imageAlt: "Cross-border freight operations between Mexico and the United States",
        overlay: "red",
        highlights: [
          {
            title: "Multi-party workflow control",
            description:
              "Carrier, customs, and yard handoffs are coordinated with clear ownership.",
          },
          {
            title: "Documentation discipline",
            description:
              "Critical shipment documents and references are validated before border movement.",
          },
          {
            title: "Operational exception response",
            description: "Holds and delays are escalated early with practical recovery paths.",
          },
        ],
        trustSnippet: {
          title: "Designed for border complexity, not just transport",
          body: "Mexico freight performs best when customs process, transfer points, and timeline expectations are managed as one operating flow.",
        },
        whenToUse: {
          intro:
            "Use this mode for Mexico-related programs requiring controlled border handoffs and consistent communication.",
          items: [
            "US-MX or MX-US lanes with documentation sensitivity",
            "Freight needing transfer-yard or transload coordination",
            "Programs where customs timing directly impacts OTIF",
            "Shipments needing bilingual and multi-stakeholder alignment",
          ],
        },
        howToUse: {
          intro: "Here's how to use NPT's Mexico Cross-Border service from quote to delivery.",
          items: [
            "Share shipper/consignee legal entities and customs participants so we can align roles and responsibilities.",
            "Provide commodity details, values, and required trade/commercial documents for customs readiness.",
            "Specify expected border crossing points, transfer yards, and timing constraints to engineer the workflow.",
            "Give communication protocol for border exceptions and release events so updates reach the right teams.",
            "Include reference numbers and document-return expectations for audit trail and billing.",
            "Confirm escalation paths for delays, inspections, or holds so we can respond consistently.",
          ],
        },
        capabilities: {
          intro: "Our Mexico workflow is built for continuity across multiple handoff points.",
          items: [
            "Northbound and southbound cross-border move coordination",
            "Customs and transfer milestone management",
            "Live exception handling for border release and delay scenarios",
            "Visibility practices aligned to shipper and consignee needs",
          ],
        },
        freightFit: {
          title: "Mexico Cross-Border Freight Fit Guide",
          intro:
            "Mexico cross-border service is for freight moving between Mexico and the United States where drayage, transload, customs, and linehaul must operate as one flow. This guide helps determine if our Mexico program is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/solutions/card-cross-border-mexico.webp",
          diagramAlt: "Mexico–USA cross-border freight and multi-party handoff diagram",
          specs: {
            length: "Multi-leg moves; dray, transload, and linehaul segments",
            width: "Standard equipment dimensions; transfer-yard fit validated",
            height: "Per equipment and route; clearance checked at planning",
            weight: "Legal and route limits across Mexico and U.S. segments",
            pallets: "Varies by equipment and transfer profile; typically truckload-based",
          },
          rules: [
            {
              condition: "Domestic-only lanes within Mexico or the United States",
              description:
                "If your freight stays within one country and does not cross the MX–US border, domestic truckload or LTL is typically more direct.",
              recommendation: "Dry Van Truckload",
              serviceSlug: "dry-van",
            },
            {
              condition: "Canada–USA cross-border lanes",
              description:
                "If your corridor is Canada–USA rather than Mexico–USA, our Canada ↔ USA program is designed for that flow.",
              recommendation: "Canada ↔ USA",
              serviceSlug: "canada-us",
            },
            {
              condition: "Ocean-based international moves",
              description:
                "If your freight is moving by ocean (FCL/LCL) with inland legs rather than primary Mexico–U.S. surface crossing.",
              recommendation: "Ocean Freight",
              serviceSlug: "ocean-freight",
            },
            {
              condition: "Air or highly expedited international moves",
              description:
                "If your shipment requires air freight or highly expedited international transit instead of surface cross-border.",
              recommendation: "Air Freight",
              serviceSlug: "air-freight",
            },
          ],
          disclaimer:
            "Border workflow, routing, and documentation depend on corridor and stakeholders; confirm with our Mexico team at quote.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request a Mexico Cross-Border Quote",
            href: "/quote?service=cross-border&mode=mexico-cross-border",
            ctaId: "service_crossborder_mexico_request_quote",
          },
          secondary: {
            label: "Speak With Mexico Team",
            href: "/contact?topic=cross-border-global&mode=mexico-cross-border",
            ctaId: "service_crossborder_mexico_speak_team",
          },
        },
      },
      {
        key: "ocean-freight",
        label: "Ocean Freight",
        title: "Ocean Freight | FCL and LCL Planning for Global Inbound and Outbound Programs",
        description:
          "Ocean freight supports cost-effective international movement when planning discipline and schedule management are in place. We coordinate origin, booking, and destination milestones so shipments remain visible and controllable from vessel booking through inland delivery.",
        image: "/_optimized/solutions/card-ocean-freight.webp",
        imageAlt: "Ocean container freight operations for international supply chains",
        overlay: "slate",
        highlights: [
          {
            title: "FCL and LCL strategy support",
            description:
              "Mode and consolidation decisions are aligned to service level and landed-cost goals.",
          },
          {
            title: "Port-to-door milestone control",
            description:
              "Execution follows a clear cadence from booking, departure, arrival, and final delivery.",
          },
          {
            title: "Documentation and handoff alignment",
            description:
              "Commercial and shipping documents are managed to reduce avoidable delays.",
          },
        ],
        trustSnippet: {
          title: "Ocean programs built for planning confidence",
          body: "We emphasize booking discipline, milestone visibility, and destination handoff control so ocean freight supports forecast reliability.",
        },
        whenToUse: {
          intro:
            "Choose ocean freight when cost efficiency and planned transit windows are stronger priorities than maximum speed.",
          items: [
            "International freight with stable replenishment planning",
            "Containerized shipments where landed-cost control matters",
            "Programs combining ocean with inland final-mile execution",
            "Scenarios where FCL/LCL optimization improves spend",
          ],
        },
        howToUse: {
          intro: "Here's how to use NPT's Ocean Freight service from quote to delivery.",
          items: [
            "Share origin, destination, Incoterms, and cargo-ready dates so we can design realistic sailings and routing.",
            "Provide container profile, commodity details, and any special handling needs for booking and stowage planning.",
            "Specify required documents and customs/broker participants so we can align paperwork and handoffs.",
            "Give final delivery requirements, receiving windows, and inland constraints so port-to-door plans are accurate.",
            "Confirm visibility expectations and exception communication preferences for rollover, delays, or schedule changes.",
            "Include reference numbers and documentation expectations for end-to-end audit trail and billing.",
          ],
        },
        capabilities: {
          intro: "Ocean freight capabilities are centered on controlled planning and handoffs.",
          items: [
            "FCL and LCL planning with mode-fit guidance",
            "Milestone tracking across booking-to-delivery lifecycle",
            "Port coordination and inland handoff support",
            "Exception governance for rollover, delays, and schedule changes",
          ],
        },
        freightFit: {
          title: "Ocean Freight Fit Guide",
          intro:
            "Ocean freight is designed for international moves where cost efficiency and planned transit windows outweigh maximum speed. This guide helps determine if ocean is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/solutions/card-ocean-freight.webp",
          diagramAlt: "Ocean container freight operations for international supply chains",
          specs: {
            length: "Container-based; 20 ft, 40 ft, 40 ft HC typical",
            width: "Standard container width (8 ft); dock- and yard-compatible",
            height: "Standard or high-cube clearance per container type",
            weight: "Per container; vessel, terminal, and inland limits apply",
            pallets: "Typically 20–24 pallets in 40 ft, lane- and load-dependent",
          },
          rules: [
            {
              condition: "Short-haul or time-critical lanes",
              description:
                "If your lane requires fast transit or tight appointment windows, air freight or expedited surface is usually more appropriate.",
              recommendation: "Air Freight",
              serviceSlug: "air-freight",
            },
            {
              condition: "North American surface-only moves",
              description:
                "If your freight moves within North America without international ocean legs, truckload, intermodal, or cross-border programs are typically a better fit.",
              recommendation: "Truckload or Intermodal",
              serviceSlug: "truckload",
            },
            {
              condition: "Very small parcel or sample shipments",
              description:
                "If your cargo is parcel-sized or highly urgent samples, small-package or air solutions are generally more effective.",
              recommendation: "Air Freight",
              serviceSlug: "air-freight",
            },
            {
              condition: "Temperature-critical or highly regulated cargo",
              description:
                "If your cargo requires strict temperature control or complex compliance handling, specialized reefer or HAZMAT programs may be required.",
              recommendation: "Temperature-Controlled or HAZMAT",
              serviceSlug: "temperature-controlled",
            },
          ],
          disclaimer:
            "Ocean mode fit depends on lane, product profile, and transit expectations; confirm with our ocean team at quote.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request an Ocean Freight Quote",
            href: "/quote?service=cross-border&mode=ocean-freight",
            ctaId: "service_crossborder_ocean_request_quote",
          },
          secondary: {
            label: "Talk to Ocean Specialist",
            href: "/contact?topic=cross-border-global&mode=ocean-freight",
            ctaId: "service_crossborder_ocean_speak_specialist",
          },
        },
      },
      {
        key: "air-freight",
        label: "Air Freight",
        title: "Air Freight | Priority International Cargo for Time-Critical Shipments",
        description:
          "Air freight is designed for urgent replenishment, launch-critical freight, and high-value cargo where transit speed and schedule confidence are essential. We coordinate booking, documentation, and destination handoff to keep urgent supply chain decisions informed in real time.",
        image: "/_optimized/solutions/card-air-freight.webp",
        imageAlt: "Air cargo logistics for time-critical international shipments",
        overlay: "dark",
        highlights: [
          {
            title: "Urgency-first mode planning",
            description:
              "Air solutions are selected around required delivery outcome and risk tolerance.",
          },
          {
            title: "Tight milestone communication",
            description:
              "Critical updates are delivered fast so teams can adjust downstream operations.",
          },
          {
            title: "Global handoff coordination",
            description: "Origin, air movement, and destination release are managed as one flow.",
          },
        ],
        trustSnippet: {
          title: "Built for high-priority cargo decisions",
          body: "Air freight execution focuses on clarity, speed, and exception response so urgent shipments remain actionable for stakeholders.",
        },
        whenToUse: {
          intro:
            "Use air freight when delays create outsized cost, customer impact, or production risk.",
          items: [
            "Time-critical replenishment and launch support",
            "High-value freight requiring faster transit",
            "Service recovery after disruptions in other modes",
            "Programs needing reliable international urgency options",
          ],
        },
        howToUse: {
          intro: "Here's how to use NPT's Air Freight service from quote to delivery.",
          items: [
            "Share ready date, required delivery date, and urgency rationale so we can confirm feasibility and routing.",
            "Provide commodity details, dimensions, and total chargeable weight for booking and capacity fit.",
            "Specify origin and destination handling constraints and contact workflow so we can align handoffs.",
            "Give documentation and customs release requirements for smooth clearance and delivery.",
            "Confirm milestone and exception communication preferences so critical updates reach the right teams.",
            "Include reference numbers and proof-of-delivery expectations for audit trail and billing.",
          ],
        },
        capabilities: {
          intro: "Air capabilities are designed for speed with operational control.",
          items: [
            "Priority international cargo coordination",
            "Milestone visibility from booking through final handoff",
            "Exception escalation for delays and capacity shifts",
            "Integration with truck or ocean workflows when needed",
          ],
        },
        freightFit: {
          title: "Air Freight Fit Guide",
          intro:
            "Air freight is for urgent international cargo where transit speed and schedule confidence outweigh cost. This guide helps determine if air is the right fit for your load—and what to use instead when it isn't.",
          diagram: "/_optimized/solutions/card-air-freight.webp",
          diagramAlt: "Air cargo logistics for time-critical international shipments",
          specs: {
            length: "Chargeable weight and volume; ULD or loose cargo as required",
            width: "Per piece and ULD; airline and handling limits apply",
            height: "Per piece; dimensional weight and handling considered",
            weight: "Chargeable weight (gross or volumetric); carrier limits apply",
            pallets: "Varies; often palletized or unitized for handling and security",
          },
          rules: [
            {
              condition: "Cost-sensitive or planned international moves",
              description:
                "If your shipment can meet longer transit windows and landed cost is a priority, ocean freight is typically more economical.",
              recommendation: "Ocean Freight",
              serviceSlug: "ocean-freight",
            },
            {
              condition: "North American domestic or surface cross-border",
              description:
                "If your freight moves within North America or Canada–USA/Mexico surface lanes without international air legs, truckload or cross-border programs are usually a better fit.",
              recommendation: "Canada ↔ USA or Truckload",
              serviceSlug: "canada-us",
            },
            {
              condition: "Non-urgent or high-volume international",
              description:
                "If timing is flexible and volume supports containerized movement, ocean or intermodal may offer better value.",
              recommendation: "Ocean Freight",
              serviceSlug: "ocean-freight",
            },
            {
              condition: "Temperature-critical or regulated hazardous cargo",
              description:
                "If your cargo requires controlled temperature or HAZMAT handling, specialized programs may be required in addition to or instead of standard air.",
              recommendation: "Temperature-Controlled or HAZMAT",
              serviceSlug: "temperature-controlled",
            },
          ],
          disclaimer:
            "Air feasibility depends on lane, weight, and carrier capacity; confirm with our air team at quote.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request an Air Freight Quote",
            href: "/quote?service=cross-border&mode=air-freight",
            ctaId: "service_crossborder_air_request_quote",
          },
          secondary: {
            label: "Speak With Air Team",
            href: "/contact?topic=cross-border-global&mode=air-freight",
            ctaId: "service_crossborder_air_speak_team",
          },
        },
      },
    ],

    finalCta: {
      title: "Talk to our experts and choose the right cross-border or global mode.",
      description:
        "Get guidance on customs workflow, urgency, and landed-cost priorities for your next move.",
      proof: [
        { value: "CA-US-MX", label: "Cross-border lane support" },
        { value: "Ocean + Air", label: "Global mode coordination" },
        { value: "Customs-ready", label: "Documentation-led execution" },
      ],
      primary: {
        label: "Call Us",
        href: "tel:+15199683632",
        ctaId: "service_crossborder_final_call_us",
      },
      secondary: {
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "service_crossborder_final_speak_expert_chat",
      },
    },
  },
  "value-added": {
    key: "value-added",
    slug: "value-added",
    meta: {
      title:
        "Logistics & Value-Added Services | Warehousing, Managed Capacity, Dedicated, Projects | NPT Logistics",
      description:
        "Integrated warehousing, managed capacity, dedicated contract programs, and project-specific logistics. Operational control, visibility, and execution standards built for scalable supply chains.",
    },
    hero: {
      kicker: "Logistics & Value-Added Services",
      title: "Integrated Logistics Programs Built for Operational Control.",
      description:
        "NPT combines warehousing, managed capacity, dedicated contract operations, and project-specific execution into one coordinated operating model. The result is better service continuity, tighter cost governance, and cleaner handoffs from planning through delivery.",
      microNote:
        "Inventory flow stability, capacity assurance, and execution governance aligned to your network goals.",
      image: "/_optimized/services/logistics&value-added-services/hero.webp",
      imageAlt: "Warehouse and logistics operations control environment",
      overlay: "dark",
      primaryCta: {
        label: "Contact Us",
        href: "/contact?topic=value-added-services",
        ctaId: "service_valueadded_hero_contact_us",
      },
      secondaryCta: {
        label: "Explore Programs",
        href: "#service-subnav",
        ctaId: "service_valueadded_hero_explore_programs",
      },
    },
    subnavLabel: "Logistics and value-added service programs",
    sections: [
      {
        key: "warehousing-distribution",
        label: "Warehousing & Distribution",
        title:
          "Warehousing & Distribution | Inventory Positioning, Fulfillment, and Controlled Outbound Execution",
        description:
          "Warehousing and distribution programs are designed to convert inventory into reliable outbound performance. We align receiving, storage, order processing, and shipping workflows to support accuracy, cycle-time consistency, and customer service-level commitments.",
        image: "/_optimized/solutions/card-warehousing-distribution.webp",
        imageAlt: "Warehouse distribution operations and inventory handling",
        overlay: "slate",
        highlights: [
          {
            title: "Order and inventory discipline",
            description:
              "Inventory control and fulfillment workflows are aligned to reduce errors and rework.",
          },
          {
            title: "Operational visibility",
            description:
              "Inbound, storage, and outbound status signals support faster decisions across teams.",
          },
          {
            title: "Scalable throughput planning",
            description:
              "Capacity and labor rhythm are tuned for peak periods and variable demand.",
          },
        ],
        trustSnippet: {
          title: "Built for service-level consistency",
          body: "Warehouse operations are governed through defined SOPs, receiving discipline, and outbound control to protect delivery commitments.",
        },
        whenToUse: {
          intro:
            "Use this service when inventory positioning and fulfillment performance are critical to customer experience.",
          items: [
            "Multi-channel fulfillment with strict order cutoffs",
            "Regional distribution needing 2-3 day service targets",
            "Programs requiring stronger inventory and order accuracy",
            "Networks managing seasonal or promotional volume swings",
          ],
        },
        howToUse: {
          intro:
            "Here's how to use NPT's Warehousing & Distribution from program design to go-live.",
          items: [
            "Share SKU profile, velocity segmentation, and storage constraints so we can size space and labor.",
            "Define inbound schedule, receiving standards, and put-away expectations for consistent handoffs.",
            "Specify order rules, cutoffs, wave strategy, and carrier routing logic so outbound matches your SLA.",
            "Set SLA targets for pick accuracy, ship timeliness, and exception handling so we can govern to them.",
            "Confirm reporting and review cadence so throughput, accuracy, and variance stay visible.",
          ],
        },
        capabilities: {
          intro:
            "Capabilities focus on inventory integrity, outbound consistency, and scalable operations.",
          items: [
            "Receiving, storage, pick-pack-ship, and outbound coordination",
            "Inventory controls with cycle count and variance management support",
            "Returns and value-added handling workflows as program needs require",
            "Performance reporting for throughput, accuracy, and SLA adherence",
          ],
        },
        freightFit: {
          title: "Warehousing & Distribution Fit Guide",
          intro:
            "Warehousing and distribution fit when inventory positioning and fulfillment performance directly support customer commitments. This guide helps determine if a warehousing program is the right fit for your operation—and what to use instead when it isn't.",
          diagram: "/_optimized/solutions/card-warehousing-distribution.webp",
          diagramAlt: "Warehouse distribution operations and inventory handling",
          specs: {
            length: "Order cycle and lead time from receipt to ship",
            width: "SKU breadth, lane count, and channel mix",
            height: "Peak throughput and storage profile",
            weight: "Volume and weight profile for labor and equipment",
            pallets: "Unit handling, pallet types, and slotting needs",
          },
          rules: [
            {
              condition: "Transport-only or ad-hoc storage needs",
              description:
                "If you need freight movement without ongoing inventory or fulfillment, truckload, LTL, or managed capacity may fit better.",
              recommendation: "Managed Capacity or LTL",
              serviceSlug: "managed-capacity",
            },
            {
              condition: "Dedicated equipment and lane commitment",
              description:
                "If the priority is committed capacity and lane-level consistency rather than warehouse operations, dedicated/contract is a better fit.",
              recommendation: "Dedicated / Contract",
              serviceSlug: "dedicated-contract",
            },
            {
              condition: "Oversize or project cargo with route/permit focus",
              description:
                "If the move is project or oversize with route, permit, and site coordination as the main need, project-specific programs are designed for that.",
              recommendation: "Project-Specific (Oversize) Programs",
              serviceSlug: "project-oversize-programs",
            },
          ],
          disclaimer:
            "Program design depends on volume, SKU profile, and SLA targets; confirm scope with our distribution team.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request a Warehousing Program Quote",
            href: "/quote?service=value-added&mode=warehousing-distribution",
            ctaId: "service_valueadded_warehousing_request_quote",
          },
          secondary: {
            label: "Talk to Distribution Team",
            href: "/contact?topic=value-added-services&mode=warehousing-distribution",
            ctaId: "service_valueadded_warehousing_talk_team",
          },
        },
      },
      {
        key: "managed-capacity",
        label: "Managed Capacity",
        title:
          "Managed Capacity | Procurement, Planning, and Continuous Transportation Optimization",
        description:
          "Managed capacity programs centralize transportation planning, procurement, execution oversight, and performance management. We align carrier strategy, routing decisions, and exception workflows to improve service reliability while controlling total transportation cost.",
        image: "/_optimized/solutions/card-managed-capacity.webp",
        imageAlt: "Transportation control tower and managed capacity planning",
        overlay: "blue",
        highlights: [
          {
            title: "Unified operating model",
            description:
              "Planning, execution, and carrier coordination run through one accountable workflow.",
          },
          {
            title: "KPI-led performance governance",
            description:
              "On-time service, cost variance, and exception patterns are actively managed.",
          },
          {
            title: "Continuous improvement cadence",
            description: "Lane and mode decisions are refined using recurring performance reviews.",
          },
        ],
        trustSnippet: {
          title: "Designed for transportation stability at scale",
          body: "Managed capacity works best when data, carrier strategy, and operations governance are integrated into a repeatable rhythm.",
        },
        whenToUse: {
          intro:
            "Use managed capacity when internal teams need stronger control across cost, service, and network complexity.",
          items: [
            "High lane count or multi-site shipping environments",
            "Recurring service disruptions and avoidable expedite spend",
            "Need for external planning support without losing visibility",
            "Programs requiring standardized KPI and carrier governance",
          ],
        },
        howToUse: {
          intro:
            "Here's how to use NPT's Managed Capacity from assessment to steady-state governance.",
          items: [
            "Share current carrier mix, lane map, and mode profile so we can baseline and identify gaps.",
            "Define service-level targets and key failure/exception patterns so priorities are clear.",
            "Provide cost baseline including accessorial and expedite drivers for improvement tracking.",
            "Set governance cadence, reporting expectations, and stakeholder owners so we operate in rhythm.",
            "Confirm KPI and continuous-improvement process so lane and mode decisions stay data-led.",
          ],
        },
        capabilities: {
          intro: "Managed capacity capabilities combine execution support with strategic control.",
          items: [
            "Carrier procurement and lane strategy support",
            "Routing and mode optimization for service/cost balance",
            "Exception management workflows and escalation protocols",
            "Performance dashboards and recurring continuous-improvement reviews",
          ],
        },
        freightFit: {
          title: "Managed Capacity Fit Guide",
          intro:
            "Managed capacity fits when transportation planning, procurement, and performance need to be centralized and governed. This guide helps determine if a managed program is the right fit—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/managedCapacity.webp",
          diagramAlt: "Transportation control tower and managed capacity planning",
          specs: {
            length: "Lane count and geographic scope",
            width: "Mode mix and carrier strategy breadth",
            height: "Volume and peak demand profile",
            weight: "Cost and service KPI targets",
            pallets: "Shipment profile and accessorial exposure",
          },
          rules: [
            {
              condition: "Warehouse and fulfillment are the primary need",
              description:
                "If inventory positioning and outbound fulfillment are the main focus, warehousing and distribution is the right program.",
              recommendation: "Warehousing & Distribution",
              serviceSlug: "warehousing-distribution",
            },
            {
              condition: "Committed dedicated capacity per lane",
              description:
                "If you need embedded equipment and staffing for recurring lanes, dedicated/contract programs provide that commitment.",
              recommendation: "Dedicated / Contract",
              serviceSlug: "dedicated-contract",
            },
            {
              condition: "Single project or oversize move",
              description:
                "If the need is one-off project or oversize with route and permit focus, project-specific programs are designed for that.",
              recommendation: "Project-Specific (Oversize) Programs",
              serviceSlug: "project-oversize-programs",
            },
          ],
          disclaimer:
            "Scope and savings depend on lane data and governance commitment; our team will size during assessment.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request a Managed Capacity Assessment",
            href: "/quote?service=value-added&mode=managed-capacity",
            ctaId: "service_valueadded_managedcapacity_request_assessment",
          },
          secondary: {
            label: "Speak With Managed Services Team",
            href: "/contact?topic=value-added-services&mode=managed-capacity",
            ctaId: "service_valueadded_managedcapacity_speak_team",
          },
        },
      },
      {
        key: "dedicated-contract",
        label: "Dedicated / Contract",
        title: "Dedicated / Contract Programs | Embedded Capacity and Service-Level Accountability",
        description:
          "Dedicated and contract logistics programs provide predictable capacity and operating discipline for recurring freight demand. We structure staffing, equipment, and workflow governance around committed service outcomes and lane-level consistency.",
        image: "/_optimized/solutions/card-dedicated-contract.webp",
        imageAlt: "Dedicated logistics operations with consistent fleet and service planning",
        overlay: "dark",
        highlights: [
          {
            title: "Committed operating structure",
            description: "Capacity and execution roles are aligned to recurring demand patterns.",
          },
          {
            title: "SLA-oriented delivery model",
            description:
              "Program performance is governed through explicit service and communication standards.",
          },
          {
            title: "Reduced volatility exposure",
            description:
              "Dedicated coverage lowers disruption risk in constrained or variable markets.",
          },
        ],
        trustSnippet: {
          title: "Built for long-horizon operating confidence",
          body: "Contract programs work when accountability, service governance, and stakeholder cadence are defined from day one.",
        },
        whenToUse: {
          intro:
            "Use dedicated/contract when shipment volume and criticality justify a committed logistics operating model.",
          items: [
            "Recurring daily or weekly lane demand with strict service targets",
            "Operations where volatility creates significant cost or service impact",
            "Programs needing stronger continuity than transactional spot coverage",
            "Networks requiring embedded planning and structured governance cadence",
          ],
        },
        howToUse: {
          intro:
            "Here's how to use NPT's Dedicated / Contract programs from design through launch and steady state.",
          items: [
            "Share volume profile by lane, seasonality, and peak-period requirements so we can size capacity and labor.",
            "Define target service metrics and escalation protocol definitions so accountability is clear.",
            "Set resource model expectations for staffing and operational ownership so roles are aligned.",
            "Establish review cadence, performance reporting, and continuous-improvement process so we govern to outcomes.",
            "Confirm proof-of-delivery and exception workflows so day-to-day execution stays consistent.",
          ],
        },
        capabilities: {
          intro:
            "Dedicated/contract capabilities focus on consistency, accountability, and measurable outcomes.",
          items: [
            "Program design around recurring freight requirements",
            "Service governance with KPI tracking and escalation controls",
            "Embedded operations support for daily execution continuity",
            "Structured improvement plans tied to cost and service objectives",
          ],
        },
        freightFit: {
          title: "Dedicated / Contract Fit Guide",
          intro:
            "Dedicated and contract programs fit when recurring volume and service criticality justify committed capacity and operating discipline. This guide helps determine if dedicated/contract is the right fit—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/dedicatedContract.webp",
          diagramAlt: "Dedicated logistics operations with consistent fleet and service planning",
          specs: {
            length: "Lane commitment and service windows",
            width: "Equipment mix and coverage breadth",
            height: "Peak volume and seasonal swing",
            weight: "Service and cost KPI targets",
            pallets: "Shipment profile and handling requirements",
          },
          rules: [
            {
              condition: "Planning and procurement focus without committed equipment",
              description:
                "If you need centralized planning and carrier governance without dedicated fleet, managed capacity is the right fit.",
              recommendation: "Managed Capacity",
              serviceSlug: "managed-capacity",
            },
            {
              condition: "Warehouse and fulfillment as primary need",
              description:
                "If inventory and outbound fulfillment are the core need, warehousing and distribution is designed for that.",
              recommendation: "Warehousing & Distribution",
              serviceSlug: "warehousing-distribution",
            },
            {
              condition: "One-off project or oversize with route/permit focus",
              description:
                "If the move is project or oversize with route, permit, and site coordination as the main need, project-specific programs are the right fit.",
              recommendation: "Project-Specific (Oversize) Programs",
              serviceSlug: "project-oversize-programs",
            },
          ],
          disclaimer:
            "Program structure depends on volume, lane stability, and service targets; our team will design during consultation.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request a Dedicated Program Consultation",
            href: "/quote?service=value-added&mode=dedicated-contract",
            ctaId: "service_valueadded_dedicated_request_consultation",
          },
          secondary: {
            label: "Talk to Contract Logistics Team",
            href: "/contact?topic=value-added-services&mode=dedicated-contract",
            ctaId: "service_valueadded_dedicated_talk_team",
          },
        },
      },
      {
        key: "project-oversize-programs",
        label: "Project-Specific (Oversize) Programs",
        title:
          "Project-Specific (Oversize) Programs | Route, Permit, and Multi-Party Execution Control",
        description:
          "Project and oversize programs require engineering-grade planning, permit governance, route validation, and synchronized stakeholder execution. We coordinate each handoff from pre-move analysis through final delivery to reduce schedule and compliance risk.",
        image: "/_optimized/solutions/card-project-oversize.webp",
        imageAlt: "Project cargo and oversize logistics planning execution",
        overlay: "red",
        highlights: [
          {
            title: "Front-loaded feasibility planning",
            description:
              "Dimensions, route constraints, and jurisdiction requirements are validated before movement.",
          },
          {
            title: "Permit and route governance",
            description: "Jurisdiction sequencing and travel constraints are managed proactively.",
          },
          {
            title: "High-control stakeholder coordination",
            description:
              "Operations, site teams, and compliance participants work from one coordinated plan.",
          },
        ],
        trustSnippet: {
          title: "Project execution managed as a coordinated system",
          body: "Complex freight succeeds when engineering details, compliance tasks, and field execution stay synchronized under one control model.",
        },
        whenToUse: {
          intro:
            "Use project-specific programs for complex moves where route, permit, and handling risk cannot be managed transactionally.",
          items: [
            "Oversize or overweight freight with route constraints",
            "Industrial project cargo with strict timeline dependencies",
            "Moves requiring escorts, special permits, or site sequencing",
            "Programs with high consequence for delay or handling variance",
          ],
        },
        howToUse: {
          intro:
            "Here's how to use NPT's Project-Specific (Oversize) programs from feasibility through delivery.",
          items: [
            "Share load specs including dimensions, weight, and handling points so route and permit planning can start.",
            "Define origin/destination site constraints and equipment requirements so handoffs are planned up front.",
            "Specify jurisdictional permit needs, route limitations, and timing windows so compliance is sequenced.",
            "Provide stakeholder map and escalation owners for execution exceptions so we coordinate from one plan.",
            "Confirm milestone and proof-of-delivery expectations so schedule and compliance risk stay controlled.",
          ],
        },
        capabilities: {
          intro:
            "Project capabilities are built around risk control and reliable sequence execution.",
          items: [
            "Route and permit planning with compliance-aligned sequencing",
            "Coordination across carrier, site, and regulatory stakeholders",
            "Execution governance with milestone checkpoints and escalation",
            "Contingency planning for weather, permit, and route disruptions",
          ],
        },
        freightFit: {
          title: "Project-Specific (Oversize) Fit Guide",
          intro:
            "Project and oversize programs fit when route, permit, and multi-party execution risk cannot be managed transactionally. This guide helps determine if a project-specific program is the right fit for your move—and what to use instead when it isn't.",
          diagram: "/_optimized/equipment-diagrams/projectSpecific.webp",
          diagramAlt: "Project cargo and oversize logistics planning execution",
          specs: {
            length: "Load dimensions and route clearance requirements",
            width: "Jurisdiction and permit scope",
            height: "Site and equipment constraints",
            weight: "Axle and bridge limits",
            pallets: "Handling points and sequence dependencies",
          },
          rules: [
            {
              condition: "Standard dimensions and no special permits",
              description:
                "If freight fits standard equipment and does not require oversize permits or route engineering, truckload or LTL is typically more efficient.",
              recommendation: "Dry Van Truckload or LTL",
              serviceSlug: "dry-van",
            },
            {
              condition: "Recurring lane demand with committed capacity",
              description:
                "If you need ongoing dedicated capacity on recurring lanes, dedicated/contract programs are designed for that.",
              recommendation: "Dedicated / Contract",
              serviceSlug: "dedicated-contract",
            },
            {
              condition: "Transport planning without warehouse or project cargo",
              description:
                "If the need is centralized planning and carrier governance without project or oversize moves, managed capacity may fit better.",
              recommendation: "Managed Capacity",
              serviceSlug: "managed-capacity",
            },
          ],
          disclaimer:
            "Feasibility and cost depend on route, permit lead times, and site constraints; confirm with our project team.",
        },
        showRelated: false,
        ctas: {
          primary: {
            label: "Request a Project Logistics Review",
            href: "/quote?service=value-added&mode=project-oversize-programs",
            ctaId: "service_valueadded_project_request_review",
          },
          secondary: {
            label: "Talk to Project Logistics Team",
            href: "/contact?topic=value-added-services&mode=project-oversize-programs",
            ctaId: "service_valueadded_project_talk_team",
          },
        },
      },
    ],
    finalCta: {
      title: "Talk to our experts and design the right logistics operating model.",
      description:
        "Get program guidance on warehousing, managed capacity, dedicated operations, and project execution.",
      proof: [
        { value: "Warehouse + Transport", label: "Integrated operating coverage" },
        { value: "KPI-led", label: "Governed service performance" },
        { value: "Program-first", label: "Built for repeatable execution" },
      ],
      primary: {
        label: "Call Us",
        href: "tel:+15199683632",
        ctaId: "service_valueadded_final_call_us",
      },
      secondary: {
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "service_valueadded_final_speak_expert_chat",
      },
    },
  },
  ltl: {
    key: "ltl",
    slug: "ltl",
    meta: {
      title: "LTL Freight Services | Cost-Controlled LTL Execution | NPT Logistics",
      description:
        "LTL shipping designed for service-level reliability and cost control. Network-aligned consolidation, class-ready quoting inputs, and milestone visibility from pickup through delivery.",
    },
    hero: {
      kicker: "Less-Than-Truckload (LTL)",
      title: "LTL Freight Built for Cost Efficiency and Delivery Reliability.",
      description:
        "NPT designs LTL execution around consolidation efficiency, shipment handling discipline, and delivery-window reliability. We help shippers balance cost and service through lane-fit planning, class-ready quoting, and proactive exception management.",
      microNote:
        "Consolidation efficiency, handling control, and delivery visibility for recurring shipment programs.",
      image: "/_optimized/solutions/npt-ltl.webp",
      imageAlt: "LTL freight moving through a distribution lane",
      overlay: "slate",
      primaryCta: {
        label: "Request an LTL Quote",
        href: "/quote?service=ltl",
        ctaId: "service_ltl_hero_request_quote",
      },
      secondaryCta: {
        label: "Talk to LTL Specialist",
        href: "/contact?topic=ltl",
        ctaId: "service_ltl_hero_talk_specialist",
      },
    },
    subnavLabel: "LTL service overview",
    singleLayout: {
      whenToUse: {
        title: "When to use this service",
        intro:
          "LTL is the right fit when shipment volume does not require dedicated trailer capacity.",
        items: [
          "Frequent palletized shipments below full truckload volume",
          "Multi-stop distribution where cost efficiency is a priority",
          "Programs balancing service targets against transportation spend",
          "Lanes where consolidation does not compromise required transit windows",
        ],
      },
      howItWorks: {
        title: "How it works",
        intro:
          "Execution starts with clean shipment data and clearly defined service expectations.",
        steps: [
          {
            title: "Shipment Intake",
            description:
              "Collect shipment profile, class-related details, dimensions, and handling constraints.",
          },
          {
            title: "Routing & Carrier Plan",
            description:
              "Match lanes and service requirements to the right network strategy and carrier mix.",
          },
          {
            title: "Execution & Tracking",
            description:
              "Run pickup and linehaul with milestone updates and early exception alerts.",
          },
          {
            title: "Delivery & Closeout",
            description:
              "Confirm delivery, capture documentation, and close with variance visibility.",
          },
        ],
      },
      capabilities: {
        title: "Capabilities and coverage",
        intro:
          "LTL capabilities focus on predictability, cost control, and disciplined shipment handling.",
        items: [
          "Regional and cross-border LTL support across North American lanes",
          "Class/handling-ready quoting workflow to reduce avoidable rework",
          "Service-level aligned routing and carrier selection support",
          "Milestone visibility and structured exception communication",
        ],
      },
      riskAndCompliance: {
        title: "Controls that protect execution quality",
        intro:
          "LTL outcomes improve when classification inputs, handling instructions, and delivery constraints are validated early.",
        items: [
          "Commodity and packaging profile validation before dispatch",
          "Pickup/delivery appointment and facility constraint alignment",
          "Exception protocol for delay, reclass, and accessorial events",
        ],
      },
      freightFit: {
        title: "LTL Freight Fit Guide",
        intro:
          "LTL is built for shipments that do not require a dedicated trailer. This guide helps determine if LTL is the right fit for your load—and what to use instead when it isn't.",
        diagram: "/_optimized/equipment-diagrams/lessThanTruckLoad.webp",
        diagramAlt:
          "LTL freight equipment and network diagram with dimensions and capacity guidance",
        specs: {
          length: "Multi-stop; trailer shared across shipments",
          width: "Standard dock and pallet dimensions",
          height: "Standard trailer clearance; stackable freight",
          weight: "Per-shipment; typically under 15,000 lbs for LTL efficiency",
          pallets: "Typically 1–12 pallets; more may justify truckload",
        },
        rules: [
          {
            condition: "Full truckload volume",
            description:
              "If your shipment consistently fills 12+ pallets or 15,000+ lbs and fits a single trailer, dedicated truckload is usually more efficient.",
            recommendation: "Dry Van Truckload",
            serviceSlug: "dry-van",
          },
          {
            condition: "Freight requiring temperature control",
            description: "If your cargo must remain within a controlled temperature range.",
            recommendation: "Refrigerated Truckload",
            serviceSlug: "reefer",
          },
          {
            condition: "Open-deck or oversized freight",
            description:
              "If your freight requires flatbed, step deck, or RGN equipment due to dimensions or handling.",
            recommendation: "Flatbed / Step Deck (Oversize)",
            serviceSlug: "flatbed",
          },
          {
            condition: "Long-haul lanes with cost focus",
            description:
              "If your lane is long-haul and cost optimization is a priority, intermodal may offer better economics.",
            recommendation: "Intermodal",
            serviceSlug: "intermodal",
          },
        ],
        disclaimer:
          "Planning values only. Lane density, class, and service levels affect fit; confirm with your LTL specialist.",
      },
      howToUse: {
        intro: "Here's how to use NPT's LTL service from quote to delivery.",
        items: [
          "Share origin, destination, and shipment profile (pallet count, weight, dimensions, class) so we can provide class-ready quotes.",
          "Provide pickup and delivery windows and any facility or appointment constraints so we can plan routing.",
          "Specify handling requirements, accessorials, and documentation needs (BOL, POD) for clean execution.",
          "Confirm service-level expectations and exception communication preferences so we can meet your targets.",
          "Include reference numbers and billing instructions for accurate closeout and invoicing.",
          "Clarify contingency for reclass, delay, or accessorial events so we can respond consistently.",
        ],
      },
      highlights: [
        {
          title: "Consolidation efficiency",
          description:
            "Lane-fit planning and carrier selection aligned to cost and service targets—built for predictable LTL execution.",
        },
        {
          title: "Class and handling discipline",
          description:
            "Classification and handling inputs validated at intake to reduce rework, reclass, and accessorial surprises.",
        },
        {
          title: "Milestone visibility",
          description:
            "Pickup, in-transit, and delivery updates aligned to decision points so exceptions are caught early.",
        },
      ],
      trustSnippet: {
        title: "Execution controls that protect LTL performance",
        body: "LTL outcomes improve when shipment profile, facility constraints, and service expectations are defined before tender. We validate class and handling up front and align communication to your program.",
      },
      showRelated: false,
      conversion: {
        title: "Plan your LTL lane strategy with our team",
        body: "Share your shipment profile and lane priorities to receive a structured LTL execution plan.",
        signals: [
          "Quote response with lane-fit assumptions",
          "Service/cost tradeoff guidance",
          "Clear exception and communication model",
        ],
      },
      relatedServices: [
        {
          label: "Truckload",
          href: "/services/truckload",
          reason: "For shipments that consistently outgrow LTL volume thresholds.",
        },
        {
          label: "Intermodal",
          href: "/services/intermodal",
          reason: "For predictable long-haul lanes with strong cost-optimization goals.",
        },
        {
          label: "Managed Capacity",
          href: "/services/value-added#section-managed-capacity",
          reason: "To govern broader lane strategy and KPI performance at scale.",
        },
      ],
    },
    finalCta: {
      title: "Talk to our experts and optimize your LTL program.",
      description:
        "Get practical guidance on shipment profile, lane fit, and service-level targets.",
      proof: [
        { value: "Cost-Controlled", label: "Consolidation-led planning" },
        { value: "Class-Ready", label: "Cleaner quoting inputs" },
        { value: "Milestone-Led", label: "Proactive exception visibility" },
      ],
      primary: {
        label: "Call Us",
        href: "tel:+15199683632",
        ctaId: "service_ltl_final_call_us",
      },
      secondary: {
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "service_ltl_final_speak_expert_chat",
      },
    },
  },
  intermodal: {
    key: "intermodal",
    slug: "intermodal",
    meta: {
      title: "Intermodal Freight Services | Rail-Truck Optimization | NPT Logistics",
      description:
        "Intermodal service for shippers balancing transit expectations with cost stability. Rail-truck execution planning with lane-fit governance and milestone visibility.",
    },
    hero: {
      kicker: "Intermodal",
      title: "Intermodal Programs Built for Predictable Cost and Lane Stability.",
      description:
        "NPT aligns rail and truck handoffs to deliver intermodal programs that improve cost control without sacrificing operational clarity. We focus on lane fit, transit consistency, and exception governance for high-volume corridors.",
      microNote:
        "Lane-fit conversion, rail-truck coordination, and transit governance designed for consistency.",
      image: "/_optimized/solutions/npt-intermodal.webp",
      imageAlt: "Intermodal rail and truck freight operations",
      overlay: "blue",
      primaryCta: {
        label: "Request an Intermodal Quote",
        href: "/quote?service=intermodal",
        ctaId: "service_intermodal_hero_request_quote",
      },
      secondaryCta: {
        label: "Talk to Intermodal Team",
        href: "/contact?topic=intermodal",
        ctaId: "service_intermodal_hero_talk_team",
      },
    },
    subnavLabel: "Intermodal service overview",
    singleLayout: {
      whenToUse: {
        title: "When to use this service",
        intro:
          "Intermodal is strongest on consistent, longer-haul lanes where cost optimization and capacity planning matter most.",
        items: [
          "Freight moving on repeat lanes with stable weekly demand",
          "Programs where truckload cost variance is creating budget pressure",
          "Networks that can plan to slightly longer but reliable transit windows",
          "Shippers prioritizing lane-level cost governance and capacity continuity",
        ],
      },
      howItWorks: {
        title: "How it works",
        intro:
          "Intermodal performance depends on disciplined mode planning and clean handoff control.",
        steps: [
          {
            title: "Lane Qualification",
            description:
              "Assess transit, volume, and service constraints to confirm mode-fit candidates.",
          },
          {
            title: "Rail-Truck Plan",
            description:
              "Define origin dray, rail routing, destination dray, and milestone ownership.",
          },
          {
            title: "Execution Control",
            description: "Monitor milestones and exceptions across each intermodal handoff.",
          },
          {
            title: "Performance Review",
            description: "Track service and cost outcomes to refine lane conversion decisions.",
          },
        ],
      },
      capabilities: {
        title: "Capabilities and coverage",
        intro:
          "Intermodal capabilities support network-level optimization with practical execution controls.",
        items: [
          "Rail-truck coordination for suitable long-haul corridors",
          "Lane conversion support from truck to intermodal models",
          "Handoff visibility and issue escalation protocol",
          "Cost and service reporting for ongoing lane governance",
        ],
      },
      riskAndCompliance: {
        title: "Execution controls that protect reliability",
        intro:
          "Intermodal results improve when handoff dependencies and service thresholds are clearly governed.",
        items: [
          "Origin and destination dray coordination standards",
          "Transit window governance by lane and customer commitment",
          "Exception communication model across rail/truck interfaces",
        ],
      },
      freightFit: {
        title: "Intermodal Freight Fit Guide",
        intro:
          "Intermodal combines rail and truck dray for long-haul lanes where cost stability and capacity matter. This guide helps determine if intermodal is the right fit for your load—and what to use instead when it isn't.",
        diagram: "/_optimized/equipment-diagrams/intermodal.webp",
        diagramAlt:
          "Intermodal rail and truck equipment diagram with dimensions and capacity guidance",
        specs: {
          length: "Container-based; 20 ft, 40 ft, 40 ft HC typical",
          width: "Standard container width (8 ft); dockable",
          height: "Standard or high-cube clearance per container type",
          weight: "Per container; legal and rail limits apply",
          pallets: "Container capacity; typically 20–24 pallets in 40 ft",
        },
        rules: [
          {
            condition: "Short-haul or time-critical lanes",
            description:
              "If your lane is under roughly 500 miles or requires expedited, appointment-tight delivery, truckload is usually more suitable.",
            recommendation: "Dry Van Truckload",
            serviceSlug: "dry-van",
          },
          {
            condition: "Shipments below trailer utilization",
            description:
              "If your volume does not fill a container or you need multi-stop flexibility, LTL may be more efficient.",
            recommendation: "LTL Freight",
            serviceSlug: "ltl",
          },
          {
            condition: "Freight requiring temperature control",
            description:
              "If your cargo must remain within a controlled temperature range; intermodal reefers exist but lane and equipment fit vary.",
            recommendation: "Refrigerated Truckload",
            serviceSlug: "reefer",
          },
          {
            condition: "Expedited or single-load priority",
            description:
              "If you need guaranteed fast transit or dedicated equipment for one-off moves, expedited or truckload is a better fit.",
            recommendation: "Expedited & Specialized",
            serviceSlug: "expedited-specialized",
          },
        ],
        disclaimer:
          "Lane fit depends on corridor, volume, and transit requirements; confirm with your intermodal specialist.",
      },
      howToUse: {
        intro: "Here's how to use NPT's Intermodal service from quote to delivery.",
        items: [
          "Share origin, destination, and lane characteristics (length, frequency, volume) so we can assess mode-fit.",
          "Provide transit and service-level expectations so we can align rail and dray planning.",
          "Specify container type preferences (20 ft, 40 ft, high-cube) and any equipment or handling constraints.",
          "Confirm dray requirements at origin and destination (ramp, facility, appointment needs) for clean handoffs.",
          "Include reference numbers and documentation needs so we can track and close out each move.",
          "Clarify exception and escalation preferences so we can respond consistently across rail and truck interfaces.",
        ],
      },
      highlights: [
        {
          title: "Lane-fit and conversion support",
          description:
            "We help identify corridors where intermodal improves cost and capacity—with clear transit and handoff expectations.",
        },
        {
          title: "Rail-truck handoff control",
          description:
            "Origin dray, rail movement, and destination dray are planned and monitored as one flow with defined ownership.",
        },
        {
          title: "Transit and cost governance",
          description:
            "Service and cost outcomes are tracked by lane so you can refine conversion decisions and capacity strategy.",
        },
      ],
      trustSnippet: {
        title: "Execution controls that protect intermodal reliability",
        body: "Intermodal results improve when handoff dependencies, transit windows, and service thresholds are defined up front. We align dray and rail planning so exceptions are caught early and capacity stays predictable.",
      },
      showRelated: false,
      conversion: {
        title: "Evaluate lane-fit for intermodal conversion",
        body: "Share your corridor profile and service expectations to see where intermodal adds real value.",
        signals: [
          "Lane-by-lane fit analysis",
          "Transit and cost tradeoff framing",
          "Implementation sequence guidance",
        ],
      },
      relatedServices: [
        {
          label: "Truckload",
          href: "/services/truckload",
          reason: "For lanes requiring faster direct transit and tighter appointment control.",
        },
        {
          label: "LTL",
          href: "/services/ltl",
          reason: "For shipment profiles below full trailer utilization.",
        },
        {
          label: "Managed Capacity",
          href: "/services/value-added#section-managed-capacity",
          reason: "To coordinate mode strategy and KPI governance across broader networks.",
        },
      ],
    },
    finalCta: {
      title: "Talk to our experts and identify high-fit intermodal lanes.",
      description:
        "Get practical guidance on conversion sequencing, handoff control, and service-level outcomes.",
      proof: [
        { value: "Lane-Fit", label: "Conversion decision support" },
        { value: "Rail + Truck", label: "Integrated handoff planning" },
        { value: "KPI-Led", label: "Service/cost governance" },
      ],
      primary: {
        label: "Call Us",
        href: "tel:+15199683632",
        ctaId: "service_intermodal_final_call_us",
      },
      secondary: {
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "service_intermodal_final_speak_expert_chat",
      },
    },
  },
  hazmat: {
    key: "hazmat",
    slug: "hazmat",
    meta: {
      title:
        "Hazardous Materials (HAZMAT) Logistics | Compliance-Controlled Freight | NPT Logistics",
      description:
        "HAZMAT transportation with compliance-first execution, documentation discipline, and controlled exception response for regulated freight programs.",
    },
    hero: {
      kicker: "Hazardous Materials (HAZMAT)",
      title: "HAZMAT Logistics Built for Compliance Discipline and Delivery Confidence.",
      description:
        "NPT executes hazardous materials freight with end-to-end process discipline: accurate classification, shipping-paper and labeling controls, carrier and handler alignment, and clear escalation when compliance or safety is at stake. We help shippers and receivers maintain regulatory alignment and audit-ready documentation across North American HAZMAT lanes—so regulated freight moves with accountability from pickup through proof of delivery.",
      microNote:
        "Compliance-first planning, documentation discipline, and controlled escalation for regulated freight.",
      image: "/_optimized/solutions/card-hazmat.webp",
      imageAlt: "Hazmat freight transportation with compliance and safety context",
      overlay: "red",
      primaryCta: {
        label: "Request a HAZMAT Quote",
        href: "/quote?service=hazmat",
        ctaId: "service_hazmat_hero_request_quote",
      },
      secondaryCta: {
        label: "Talk to Compliance Team",
        href: "/contact?topic=hazmat",
        ctaId: "service_hazmat_hero_talk_compliance",
      },
    },
    subnavLabel: "Hazmat service overview",
    singleLayout: {
      whenToUse: {
        title: "When to use this service",
        intro:
          "Use HAZMAT service when freight requires regulated handling and documentation under applicable transport rules.",
        items: [
          "Shipments classified as hazardous under transportation regulations",
          "Programs requiring strict shipping-paper and labeling discipline",
          "Freight moves where compliance variance carries outsized risk",
          "Recurring regulated lanes needing repeatable process control",
        ],
      },
      howItWorks: {
        title: "How it works",
        intro: "HAZMAT execution starts with classification accuracy and documented controls.",
        steps: [
          {
            title: "Classification & Intake",
            description:
              "Validate shipment classification details, handling requirements, and supporting references.",
          },
          {
            title: "Documentation Readiness",
            description:
              "Align shipping descriptions, packaging requirements, and required document package.",
          },
          {
            title: "Controlled Execution",
            description:
              "Run movement with protocol-driven communication and monitored exceptions.",
          },
          {
            title: "Closeout & Audit Trail",
            description:
              "Capture key milestones and documentation continuity for compliance visibility.",
          },
        ],
      },
      capabilities: {
        title: "Capabilities and coverage",
        intro: "Capabilities are built around compliance rigor and operational discipline.",
        items: [
          "HAZMAT workflow support across regulated lane programs",
          "Documentation and handoff process controls",
          "Protocol-led execution with milestone communication",
          "Exception escalation model for risk-sensitive events",
        ],
      },
      riskAndCompliance: {
        title: "Compliance information shippers should prepare",
        intro:
          "Regulated shipments move best when classification, packaging, and shipping-paper details are complete and validated before dispatch.",
        items: [
          "Hazard classification and proper shipping description details",
          "Packaging/marking expectations and handling constraints",
          "Required shipping paper fields and contact/escalation protocol",
        ],
      },
      freightFit: {
        title: "HAZMAT Freight Fit Guide",
        intro:
          "HAZMAT service is for freight classified as hazardous under transport regulations and requiring compliant handling, documentation, and carrier credentials. This guide helps determine if HAZMAT is the right fit for your load—and what to use instead when it isn't.",
        diagram: "/_optimized/equipment-diagrams/Hazmat.webp",
        diagramAlt: "HAZMAT freight and compliance-controlled transport diagram",
        specs: {
          length: "Equipment matched to load and placard requirements",
          width: "Standard dockable; securement and segregation as required",
          height: "Clearance and load profile per classification",
          weight: "Per shipment; legal and equipment limits apply",
          pallets: "Varies; packaging and segregation drive capacity",
        },
        rules: [
          {
            condition: "Non-hazardous or general freight",
            description:
              "If your shipment is not classified as hazardous under transport regulations, standard dry van or LTL is typically more straightforward.",
            recommendation: "Dry Van Truckload",
            serviceSlug: "dry-van",
          },
          {
            condition: "Hazardous freight requiring temperature control",
            description:
              "If your regulated cargo must also maintain a controlled temperature range, temperature-controlled service may be required.",
            recommendation: "Refrigerated Truckload",
            serviceSlug: "reefer",
          },
          {
            condition: "Small non-hazardous shipments",
            description:
              "If your shipment is below truckload volume and does not require hazardous handling or documentation.",
            recommendation: "LTL Freight",
            serviceSlug: "ltl",
          },
          {
            condition: "Expedited non-hazardous freight",
            description:
              "If timing is critical and the shipment is not regulated as hazardous, expedited service may be a better fit.",
            recommendation: "Expedited",
            serviceSlug: "expedited-specialized",
          },
        ],
        disclaimer:
          "Classification and carrier capability depend on commodity and route; confirm with our compliance team at quote.",
      },
      howToUse: {
        intro: "Here's how to use NPT's HAZMAT service from quote to delivery.",
        items: [
          "Share hazard classification, proper shipping name, UN/ID, and packing group so we can confirm carrier and equipment fit.",
          "Provide packaging and marking details and any handling or segregation requirements for planning.",
          "Specify required shipping paper fields and emergency contact/escalation protocol so we can align documentation.",
          "Give origin and destination details, including any facility or routing restrictions for regulated freight.",
          "Include reference numbers and documentation expectations for audit trail and closeout.",
          "Confirm exception and compliance-escalation process so we can respond consistently to any variance.",
        ],
      },
      highlights: [
        {
          title: "Classification and documentation discipline",
          description:
            "We validate hazard classification and shipping description up front so documentation and carrier selection stay compliant.",
        },
        {
          title: "Protocol-led execution",
          description:
            "Handling, communication, and milestone updates follow defined protocols to protect compliance and reduce risk.",
        },
        {
          title: "Exception and escalation control",
          description:
            "Compliance-impacting events are escalated with clear ownership so issues are resolved without documentation or safety gaps.",
        },
      ],
      trustSnippet: {
        title: "Execution controls that protect HAZMAT compliance",
        body: "HAZMAT results improve when classification, packaging, and shipping-paper details are complete and validated before dispatch. We align documentation and handoff process so regulated freight moves with full audit trail.",
      },
      showRelated: false,
      conversion: {
        title: "Plan your regulated freight workflow with our team",
        body: "Share shipment and compliance requirements to receive a structured execution approach.",
        signals: [
          "Compliance-aware quote response",
          "Document-readiness checklist",
          "Protocol-driven exception governance",
        ],
      },
      relatedServices: [
        {
          label: "Temperature-Controlled",
          href: "/services/temperature-controlled",
          reason: "For regulated freight that also requires tight temperature integrity controls.",
        },
        {
          label: "Managed Capacity",
          href: "/services/value-added#section-managed-capacity",
          reason: "To govern recurring regulated lanes through KPI and carrier controls.",
        },
        {
          label: "Cross-Border & Global",
          href: "/services/cross-border",
          reason: "For regulated freight programs involving customs and international handoffs.",
        },
      ],
    },
    finalCta: {
      title: "Talk to our experts about compliance-driven freight execution.",
      description:
        "Get practical guidance on shipment readiness, documentation flow, and risk-managed operations.",
      proof: [
        { value: "Compliance-First", label: "Workflow design approach" },
        { value: "Document-Led", label: "Readiness discipline" },
        { value: "Protocol-Controlled", label: "Execution governance" },
      ],
      primary: {
        label: "Call Us",
        href: "tel:+15199683632",
        ctaId: "service_hazmat_final_call_us",
      },
      secondary: {
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "service_hazmat_final_speak_expert_chat",
      },
    },
  },
  "temperature-controlled": {
    key: "temperature-controlled",
    slug: "temperature-controlled",
    meta: {
      title: "Temperature-Controlled Logistics | Heat and Cold Sensitive Freight | NPT Logistics",
      description:
        "Temperature-controlled freight with setpoint integrity, monitoring visibility, and exception response for heat- and cold-sensitive programs.",
    },
    hero: {
      kicker: "Temperature-Controlled",
      title:
        "Temperature-Controlled Logistics Built for Setpoint Integrity and Delivery Confidence.",
      description:
        "NPT runs temperature-controlled shipments with operational discipline across equipment readiness, transit monitoring, and exception response. We help shippers protect product integrity across heat- and cold-sensitive lanes while meeting strict delivery commitments.",
      microNote:
        "Setpoint governance, monitoring visibility, and proactive response for temperature-sensitive freight.",
      image: "/_optimized/solutions/card-refrigerated.webp",
      imageAlt: "Temperature-controlled freight operations for heat- and cold-sensitive cargo",
      overlay: "blue",
      primaryCta: {
        label: "Request a Temperature-Controlled Quote",
        href: "/quote?service=temperature-controlled",
        ctaId: "service_tempcontrolled_hero_request_quote",
      },
      secondaryCta: {
        label: "Talk to Temperature-Control Team",
        href: "/contact?topic=temperature-controlled",
        ctaId: "service_tempcontrolled_hero_talk_team",
      },
    },
    subnavLabel: "Temperature-controlled service overview",
    singleLayout: {
      whenToUse: {
        title: "When to use this service",
        intro:
          "Use temperature-controlled service when cargo quality is directly dependent on thermal conditions during transit.",
        items: [
          "Food and beverage shipments requiring strict temperature maintenance",
          "Pharma or healthcare lanes with validated thermal thresholds",
          "Seasonal products at high risk of temperature-related variance",
          "Programs with strict receiver requirements for temperature compliance",
        ],
      },
      howItWorks: {
        title: "How it works",
        intro:
          "Temperature-control reliability depends on disciplined pre-load and in-transit controls.",
        steps: [
          {
            title: "Setpoint & Profile Intake",
            description:
              "Define required thermal range, commodity sensitivity, and shipment conditions.",
          },
          {
            title: "Pre-Load Readiness",
            description:
              "Confirm equipment readiness and pre-cooling aligned to shipment requirements.",
          },
          {
            title: "Monitored Transit",
            description:
              "Run shipment with visibility checkpoints and structured exception handling.",
          },
          {
            title: "Delivery Integrity",
            description: "Close with thermal-condition and delivery confirmation workflow.",
          },
        ],
      },
      capabilities: {
        title: "Capabilities and coverage",
        intro:
          "Capabilities are focused on product integrity, delivery reliability, and operational control.",
        items: [
          "Temperature-controlled lane execution across North America",
          "Setpoint governance and temperature-control handling protocol support",
          "Milestone visibility and early exception communication",
          "Delivery closeout process aligned to quality-sensitive programs",
        ],
      },
      riskAndCompliance: {
        title: "Cold-chain controls and response model",
        intro:
          "Temperature-sensitive programs perform best when setpoint discipline and escalation rules are defined before movement.",
        items: [
          "Commodity-specific thermal profile alignment at tender",
          "Pre-load equipment readiness and pre-cool verification workflow",
          "Exception escalation rules for out-of-range or delay events",
        ],
      },
      freightFit: {
        title: "Temperature-Controlled Freight Fit Guide",
        intro:
          "Temperature-controlled service is for cargo whose quality or compliance depends on maintaining a defined thermal range in transit. This guide helps determine if temperature-controlled is the right fit for your load—and what to use instead when it isn't.",
        diagram: "/_optimized/equipment-diagrams/tempCntrl.webp",
        diagramAlt:
          "Temperature-controlled equipment diagram with setpoint and capacity guidance",
        specs: {
          length: "Temperature-controlled trailer; 48 ft or 53 ft typical",
          width: "Standard temperature-controlled width; dockable",
          height: "Interior clearance; temperature management and airflow considered",
          weight: "Legal payload; typical temperature-controlled capacity",
          pallets:
            "Varies by trailer and load configuration; typically 24–26 pallets in a 53 ft temperature-controlled trailer",
        },
        rules: [
          {
            condition: "Non-temperature-sensitive freight",
            description:
              "If your cargo does not require a controlled temperature range in transit, dry van is usually more economical.",
            recommendation: "Dry Van Truckload",
            serviceSlug: "dry-van",
          },
          {
            condition: "Small or LTL-volume temperature shipments",
            description:
              "If your temperature-sensitive shipment is below full truckload volume, LTL temperature-controlled may be a better fit.",
            recommendation: "LTL Freight",
            serviceSlug: "ltl",
          },
          {
            condition: "Hazardous materials with compliance requirements",
            description:
              "If your freight is regulated as hazardous and requires documentation and handling controls in addition to temperature.",
            recommendation: "HAZMAT",
            serviceSlug: "hazmat",
          },
          {
            condition: "Expedited non-temperature-critical freight",
            description:
              "If timing is the priority and your cargo does not require strict thermal control, expedited service may be more appropriate.",
            recommendation: "Expedited",
            serviceSlug: "expedited-specialized",
          },
        ],
        disclaimer:
          "Setpoint and equipment fit depend on commodity, lane, and receiver requirements; confirm with our temperature-control team at quote.",
      },
      howToUse: {
        intro: "Here's how to use NPT's Temperature-Controlled service from quote to delivery.",
        items: [
          "Share required setpoint range, commodity sensitivity, and any validated thermal thresholds so we can confirm equipment and protocol.",
          "Provide origin and destination details and receiver temperature-compliance requirements for planning.",
          "Specify pre-load expectations (pre-cool, load conditions) and in-transit visibility needs so we can align to your program.",
          "Give reference numbers and documentation expectations for delivery closeout and quality records.",
          "Include exception and escalation preferences for out-of-range or delay events so we can respond consistently.",
          "Confirm delivery sign-off and thermal-condition confirmation process so we can meet your integrity standards.",
        ],
      },
      highlights: [
        {
          title: "Setpoint and profile discipline",
          description:
            "We align thermal requirements and commodity profile at intake so equipment and handling protocol match your product.",
        },
        {
          title: "Monitored transit and visibility",
          description:
            "Milestone checkpoints and exception communication are built for time- and temperature-sensitive programs.",
        },
        {
          title: "Controlled exception response",
          description:
            "Out-of-range or delay events trigger defined escalation so exposure is minimized and recovery stays on protocol.",
        },
      ],
      trustSnippet: {
        title: "Execution controls that protect temperature-control integrity",
        body: "Temperature-sensitive programs perform best when setpoint discipline, pre-load readiness, and escalation rules are defined before movement. We align equipment and communication to your thermal and delivery requirements.",
      },
      showRelated: false,
      conversion: {
        title: "Design the right temperature-control execution plan",
        body: "Share commodity profile and lane requirements to receive a structured temperature-control strategy.",
        signals: [
          "Setpoint and handling-fit quote guidance",
          "Risk-control workflow recommendations",
          "Milestone and exception communication model",
        ],
      },
      relatedServices: [
        {
          label: "LTL",
          href: "/services/ltl",
          reason: "For temperature-sensitive freight programs below full truckload volume.",
        },
        {
          label: "Truckload",
          href: "/services/truckload",
          reason: "For dedicated capacity requirements with tighter appointment governance.",
        },
        {
          label: "Hazardous Materials (HAZMAT)",
          href: "/services/hazmat",
          reason: "For regulated cargo with both compliance and temperature constraints.",
        },
      ],
    },
    finalCta: {
      title: "Talk to our experts and strengthen your temperature-control execution model.",
      description:
        "Get practical guidance on setpoints, lane planning, and exception response controls.",
      proof: [
        { value: "Setpoint-Led", label: "Thermal governance model" },
        { value: "Monitored", label: "Milestone visibility approach" },
        { value: "Risk-Controlled", label: "Escalation readiness" },
      ],
      primary: {
        label: "Call Us",
        href: "tel:+15199683632",
        ctaId: "service_tempcontrolled_final_call_us",
      },
      secondary: {
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "service_tempcontrolled_final_speak_expert_chat",
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
    alternates: {
      canonical: `/services/${model.slug}`,
    },
    openGraph: {
      title: model.meta.title,
      description: model.meta.description,
      url: `/services/${model.slug}`,
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
