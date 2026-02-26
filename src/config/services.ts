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

export type SingleServiceLayout = {
  snapshot: { title: string; items: string[] };
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
      ogImage: "/og/services-truckload.png",
    },

    hero: {
      kicker: "Truckload",
      title: "Truckload Solutions Engineered for Supply Chain Performance.",
      description:
        "NPT moves truckload freight across Canada, the United States, and Mexico through a hybrid asset + brokerage model built for scale. Dry van, flatbed, RGN heavy haul, and Conestoga capacity delivered with appointment precision, secure trade compliance, and milestone-level visibility from dispatch through POD.",
      microNote: "Built for lane consistency, clean handoffs, and faster exception recovery.",
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
      image: "/services/specialized&time-sensitive/hero.png",
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
        image: "/solutions/card-expedited.jpg",
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
          intro:
            "Expedited quoting and dispatch improve when timing constraints and facility realities are defined at intake.",
          items: [
            "Ready time, hard delivery deadline, and latest-acceptable arrival window",
            "Exact dimensions, piece count, and total weight for equipment fit",
            "Pickup/delivery facility constraints, dock process, and access limitations",
            "After-hours contacts and escalation owners on shipper and receiver sides",
            "Shipment-critical references and proof-of-delivery expectations",
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
        relatedServices: [
          { label: "Air Freight", href: "/services/cross-border#section-air-freight", icon: "●" },
          { label: "Truckload (TL)", href: "/services/truckload", icon: "●" },
          {
            label: "Managed Capacity",
            href: "/services/value-added#section-managed-capacity",
            icon: "●",
          },
        ],
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
        title: "Specialized Vehicle Programs | Dimension-Aware and Constraint-Controlled Moves",
        description:
          "Specialized vehicle programs support freight that requires non-standard equipment, route feasibility validation, or strict loading and handling controls. This mode is built for complex cargo profiles where permit, clearance, and site access planning must be aligned before wheels move.",
        image: "/solutions/card-specialized-vehicle.jpg",
        imageAlt: "Specialized vehicle transport with route and handling controls",
        overlay: "blue",
        highlights: [
          {
            title: "Equipment-fit engineering",
            description:
              "Trailer and handling method are selected against actual cargo dimensions and load profile.",
          },
          {
            title: "Route and access feasibility",
            description:
              "Clearance and site constraints are validated early to prevent avoidable delays.",
          },
          {
            title: "Permit-aware execution rhythm",
            description:
              "Planning ties permit sequence, transit windows, and stakeholder timing into one workflow.",
          },
        ],
        trustSnippet: {
          title: "Designed for complex cargo and controlled risk",
          body: "Specialized vehicle moves succeed when route reality, equipment fit, and communication ownership are set before dispatch. Our model is built around that discipline.",
        },
        whenToUse: {
          intro:
            "Use specialized vehicle programs when cargo profile or lane constraints exceed standard equipment assumptions.",
          items: [
            "Freight with dimensional, weight, or handling constraints beyond standard trailers",
            "Moves requiring route planning around clearance or access limitations",
            "Site conditions that require specific loading/unloading sequencing",
            "High-value assets where reduced handling risk is a priority",
            "Program freight requiring repeatable governance across recurring lanes",
          ],
        },
        howToUse: {
          intro:
            "Specialized program accuracy depends on complete cargo and site data before quote confirmation.",
          items: [
            "Verified dimensions, center-of-gravity notes, and total load profile",
            "Origin and destination site access, loading method, and equipment constraints",
            "Permit, escort, and route restrictions known at planning stage",
            "Target milestone plan, communication cadence, and exception contacts",
            "Documentation package needed for secure release and handoff continuity",
          ],
        },
        capabilities: {
          intro:
            "Capabilities center on engineered planning, execution control, and reduced variance at critical handoffs.",
          items: [
            "Specialized equipment planning for non-standard freight profiles",
            "Route and schedule design aligned to permit and access constraints",
            "Operational control across pickup, transfer, and delivery milestones",
            "Exception governance for weather, access, and timeline risk events",
            "Program-level support for recurring specialized lane requirements",
          ],
        },
        relatedServices: [
          { label: "RGN / Oversize", href: "/services/truckload#section-rgn-oversize", icon: "●" },
          {
            label: "Project-Specific / Oversize",
            href: "/services/value-added#section-project-oversize-programs",
            icon: "●",
          },
          { label: "Cross-Border & Global", href: "/services/cross-border", icon: "●" },
        ],
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
      image: "/services/cross-border&global/hero.png",
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
        image: "/solutions/card-cross-border-canada-us.jpg",
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
            "For faster setup and cleaner execution, share commercial and operational requirements at tender.",
          items: [
            "Importer/exporter details and customs broker contacts",
            "Commodity profile, values, and commercial invoice requirements",
            "Pickup and delivery appointment windows with facility rules",
            "Reference numbers, document return workflow, and POD expectations",
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
        image: "/solutions/card-cross-border-mexico.jpg",
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
          intro:
            "Provide full lane and customs details up front so execution can be engineered correctly.",
          items: [
            "Shipper/consignee legal entities and customs participants",
            "Commodity, values, and required trade/commercial documents",
            "Expected border crossing points and timing constraints",
            "Communication protocol for border exceptions and release events",
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
        image: "/solutions/card-ocean-freight.jpg",
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
          intro:
            "Provide shipment readiness and destination requirements early to secure cleaner bookings and delivery plans.",
          items: [
            "Origin, destination, incoterms, and cargo-ready dates",
            "Container profile, commodity details, and special handling needs",
            "Required documents and customs/broker participants",
            "Final delivery requirements and receiving windows",
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
        image: "/solutions/card-air-freight.jpg",
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
          intro:
            "To accelerate booking and movement, provide complete shipment and timing requirements upfront.",
          items: [
            "Ready date, required delivery date, and urgency rationale",
            "Commodity details, dimensions, and total chargeable weight",
            "Origin/destination handling constraints and contact workflow",
            "Documentation and customs release requirements",
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
      image: "/services/logistics&value-added-services/hero.png",
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
        image: "/solutions/card-warehousing-distribution.jpg",
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
          intro: "For fast onboarding, define profile, throughput, and SLA requirements early.",
          items: [
            "SKU profile, velocity segmentation, and storage constraints",
            "Inbound schedule, receiving standards, and put-away expectations",
            "Order rules, cutoffs, wave strategy, and carrier routing logic",
            "SLA targets for pick accuracy, ship timeliness, and exception handling",
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
        image: "/solutions/card-managed-capacity.jpg",
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
            "Start with baseline lane and performance data so priorities can be mapped quickly.",
          items: [
            "Current carrier mix, lane map, and mode profile",
            "Service-level targets and key failure/exception patterns",
            "Cost baseline including accessorial and expedite drivers",
            "Governance cadence, reporting expectations, and stakeholder owners",
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
        image: "/solutions/card-dedicated-contract.jpg",
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
            "Define demand shape, service targets, and governance model before launch planning.",
          items: [
            "Volume profile by lane, seasonality, and peak-period requirements",
            "Target service metrics and escalation protocol definitions",
            "Resource model expectations for staffing and operational ownership",
            "Review cadence, performance reporting, and continuous-improvement process",
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
        label: "Project-Specific / Oversize Programs",
        title:
          "Project-Specific / Oversize Programs | Route, Permit, and Multi-Party Execution Control",
        description:
          "Project and oversize programs require engineering-grade planning, permit governance, route validation, and synchronized stakeholder execution. We coordinate each handoff from pre-move analysis through final delivery to reduce schedule and compliance risk.",
        image: "/solutions/card-project-oversize.jpg",
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
            "Provide engineering and site details early so route/permit workflows can be built correctly.",
          items: [
            "Load specs including dimensions, weight, and handling points",
            "Origin/destination site constraints and equipment requirements",
            "Jurisdictional permit needs, route limitations, and timing windows",
            "Stakeholder map and escalation owners for execution exceptions",
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
      image: "/solutions/npt-ltl.jpg",
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
      snapshot: {
        title: "What this LTL program is built to improve",
        items: [
          "Shipment consolidation economics",
          "Class and handling accuracy at tender",
          "Pickup and delivery consistency",
          "Exception visibility before customer impact",
        ],
      },
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
      image: "/solutions/npt-intermodal.jpg",
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
      snapshot: {
        title: "What intermodal is designed to improve",
        items: [
          "Long-haul transportation cost stability",
          "Capacity resilience on predictable lanes",
          "Mode-fit planning by lane characteristics",
          "Operational control across rail-truck handoffs",
        ],
      },
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
      title: "HAZMAT Logistics Engineered Around Compliance and Risk Control.",
      description:
        "NPT coordinates hazardous materials freight with process discipline across documentation, handling controls, and execution governance. We align operational workflows to regulatory requirements and shipper-specific risk protocols.",
      microNote:
        "Compliance-first planning, documentation discipline, and controlled escalation for regulated freight.",
      image: "/solutions/card-hazmat.jpg",
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
      snapshot: {
        title: "What this HAZMAT service protects",
        items: [
          "Regulatory alignment and documentation accuracy",
          "Handling and communication controls during transit",
          "Exception escalation for compliance-impacting events",
          "Operational consistency for recurring regulated lanes",
        ],
      },
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
      image: "/solutions/card-refrigerated.png",
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
      snapshot: {
        title: "What this temperature-controlled service improves",
        items: [
          "Product integrity across planned transit windows",
          "Setpoint and handling discipline before and during movement",
          "Visibility for time- and temperature-sensitive milestones",
          "Controlled exception response to reduce exposure",
        ],
      },
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
