/**
 * Industry detail page config: slug-based routing and full page content.
 * Slugs must match NAV.industries.links[].href (e.g. /industries/automotive → slug "automotive").
 */

import type { IndustryKey } from "./industries";

export type IndustrySlug =
  | "automotive"
  | "manufacturing-materials"
  | "retail-consumer-goods"
  | "food-beverage"
  | "industrial-energy"
  | "steel-aluminum";

/** Decisive hero color theme per industry — drives background and gradient accents */
export type IndustryHeroTheme =
  | "green" // Food & Beverage — fresh, natural
  | "red" // Automotive — power, brand
  | "blue" // Retail — trust, calm
  | "slate" // Manufacturing — industrial
  | "amber" // Industrial & Energy — energy, power
  | "steel"; // Steel & Aluminum — metal, strength

export type IndustryHero = {
  kicker?: string;
  valueHeadline: string;
  title: string;
  description: string;
  cta: { label: string; href: string; ctaId: string };
  /** Decisive theme: sets hero background color and gradient overlays */
  theme: IndustryHeroTheme;
  iconKeys?: string[]; // e.g. ["truck", "package"] for scattered hero icons
};

/** Unique interactive widget per industry — engaging, original, premium */
export type IndustryWidgetType =
  | "transport-protection" // Automotive — stress-test protection (vehicles vs parts)
  | "delivery-window" // (legacy) JIT / appointment windows
  | "visibility-checkpoints" // Manufacturing — order-to-delivery visibility (legacy)
  | "load-optimization" // Manufacturing & Materials — trailer load / utilization simulator
  | "delivery-promise" // Retail — speed tiers (legacy)
  | "demand-surge" // Retail & Consumer Goods — demand / fulfillment flow simulator
  | "cold-chain-journey" // Food & Beverage — cold chain checkpoints (legacy)
  | "freshness-preservation" // Food & Beverage — temperature + time decay / freshness simulator
  | "project-phase" // Industrial & Energy — plan / execute / deliver (legacy)
  | "heavy-haul-route" // Industrial & Energy — route complexity / compliance / escort simulator
  | "load-type" // Steel & Aluminum — legacy axle balance
  | "load-balance-axle"; // Steel & Aluminum — load balance & axle stress simulator

export type IndustryWhatMatters = {
  sectionTitle: string;
  intro: string;
  items: Array<{ title: string; body: string }>;
  interactiveWidget?: IndustryWidgetType | null;
  /** Shown in col-6 next to the widget: title + body so the widget is easy to comprehend */
  widgetSupportTitle?: string;
  widgetSupportBody?: string;
  /** Optional bullets for richer support content (e.g. industry-specific points) */
  widgetSupportBullets?: string[];
  /** Optional footer line (e.g. key takeaway) */
  widgetSupportFooter?: string;
};

export type IndustryHowWeSupport = {
  sectionTitle: string;
  steps: Array<{ title: string; description: string }>;
};

export type IndustryTrustProof = {
  sectionTitle: string;
  intro?: string;
  stats: Array<{ value: string; label: string }>;
  complianceItems?: string[];
  insuranceNote?: string;
};

export type IndustryRelatedServices = {
  sectionTitle: string;
  intro?: string;
  links: Array<{ label: string; href: string }>;
};

export type IndustryFinalCta = {
  kicker?: string;
  title: string;
  body: string;
  proof: Array<{ value: string; label: string }>;
  trustSignals?: string[];
  ctas: {
    primary: { label: string; href: string; ctaId: string };
    secondary: { label: string; href: string; ctaId: string };
  };
};

export type IndustryPageModel = {
  key: IndustryKey;
  slug: IndustrySlug;
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
  hero: IndustryHero;
  whatMatters: IndustryWhatMatters;
  howWeSupport: IndustryHowWeSupport;
  trustProof: IndustryTrustProof;
  relatedServices: IndustryRelatedServices;
  finalCta: IndustryFinalCta;
};

const INDUSTRY_PAGE_DATA: Record<IndustryKey, IndustryPageModel> = {
  automotive: {
    key: "automotive",
    slug: "automotive",
    meta: {
      title: "Automotive Logistics | Inbound & Outbound Freight | NPT Logistics",
      description:
        "Inbound parts, finished vehicles, and time-sensitive automotive freight. Disciplined handoffs, proactive updates, and lane-level control across North America.",
    },
    hero: {
      kicker: "Specialized logistics",
      valueHeadline: "On schedule.",
      title: "Automotive Logistics",
      description:
        "Inbound components, finished vehicles, and just-in-sequence freight — managed with precision, visibility, and single-point accountability. Because when production stops, everything stops.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_automotive_hero_contact" },
      theme: "red",
      iconKeys: ["car", "truck", "gear", "engine"],
    },
    whatMatters: {
      sectionTitle: "What Matters on the Production Line",
      intro:
        "Automotive logistics operates on zero-margin schedules. Just-in-sequence components, finished vehicles, and time-critical lanes demand disciplined execution, risk control, and absolute accountability. Our operations are structured around those realities—so your production schedule stays intact.",

      items: [
        {
          title: "Production-Level Precision",
          body: "Confirmed appointments before dispatch, milestone-based tracking, and structured communication throughout the move. Every shipment is managed with the same precision your assembly schedule requires.",
        },
        {
          title: "Equipment Aligned to Risk",
          body: "From enclosed carriers to secured open transport, we align equipment, routing, and handling protocols to cargo sensitivity, environmental exposure, and delivery window tolerance—minimizing disruption before it happens.",
        },
        {
          title: "End-to-End Accountability",
          body: "One operational owner from pickup to final delivery. Clear handoffs, real-time visibility, and audit-ready documentation across every mile of the supply chain.",
        },
      ],

      interactiveWidget: "transport-protection",

      widgetSupportTitle: "Protection Aligned to Production Risk",

      widgetSupportBody:
        "Automotive freight faces three core risk dimensions: environmental exposure, handling intensity, and schedule sensitivity. We structure equipment selection, routing strategy, and communication cadence to mitigate all three—before the shipment moves.",

      widgetSupportBullets: [
        "Finished vehicles: enclosed or covered transport, engineered securement, and route planning designed to reduce exposure to debris and weather.",
        "Components: controlled handling protocols, packaging guidance, and transport mode selection based on shock tolerance and moisture sensitivity.",
        "Production-critical lanes: appointment discipline, proactive milestone updates, and single-point operational ownership.",
      ],

      widgetSupportFooter: "Structured execution. Proactive visibility. No surprises at the dock.",
    },
    howWeSupport: {
      sectionTitle: "How NPT supports automotive",
      steps: [
        {
          title: "Consult with us",
          description:
            "We work with automotive partners to analyze supply chains and identify opportunities for efficiency and cost savings. From route optimization to carrier selection, we provide expert guidance so you make smarter, faster shipping decisions that keep production on schedule.",
        },
        {
          title: "Plan with us",
          description:
            "We create tailored shipping plans that align with your production schedules and delivery requirements. By mapping routes, timing pickups, and defining milestones, we turn complexity into a repeatable process.",
        },
        {
          title: "Execute",
          description:
            "Our team turns plans into action with precision and accountability. Every shipment is tracked, monitored, and handled with care to ensure on-time delivery and full documentation.",
        },
        {
          title: "Monitor",
          description:
            "Real-time tracking and visibility for every shipment so you always know where your parts are. Proactive monitoring lets us identify and resolve issues before they impact your line.",
        },
      ],
    },
    trustProof: {
      sectionTitle: "Trust and proof",
      intro:
        "We meet the standards automotive shippers expect: safety, compliance, and coverage you can rely on.",
      stats: [
        { value: "98%", label: "On-time delivery" },
        { value: "$2M+", label: "Cargo insurance" },
        { value: "10+", label: "Years in automotive lanes" },
      ],
      complianceItems: [
        "Carrier safety and insurance verified before every load",
        "BOLs and PODs retained for audit",
        "Documented exception and root-cause process",
      ],
      insuranceNote:
        "We maintain cargo and liability coverage that meets typical automotive requirements; specific limits can be confirmed for your program.",
    },
    relatedServices: {
      sectionTitle: "How we move your freight",
      intro:
        "Automotive shippers often use these modes; we can align the right solution for your lanes.",
      links: [
        { label: "Truckload", href: "/services/truckload" },
        { label: "Expedited & Specialized", href: "/services/expedited-specialized" },
        { label: "Cross-Border", href: "/services/cross-border" },
      ],
    },
    finalCta: {
      kicker: "Ready to move your automotive freight?",
      title: "Let's get your lanes on plan.",
      body: "Talk to our team about your inbound, outbound, or finished-vehicle moves. We'll align on your windows, requirements, and how we deliver.",
      proof: [
        { value: "≤ 15 min", label: "Initial response" },
        { value: "24/7", label: "Operations coverage" },
        { value: "CA–US–MX", label: "Lane scope" },
      ],
      trustSignals: [
        "Single point of accountability",
        "Proactive updates",
        "Audit-ready documentation",
      ],
      ctas: {
        primary: {
          label: "Contact us",
          href: "/contact",
          ctaId: "industry_automotive_final_contact",
        },
        secondary: {
          label: "Speak with a live agent",
          href: "#live-chat",
          ctaId: "industry_automotive_final_live_agent",
        },
      },
    },
  },

  manufacturing: {
    key: "manufacturing",
    slug: "manufacturing-materials",
    meta: {
      title: "Manufacturing & Materials Logistics | Industrial Supply Chain | NPT Logistics",
      description:
        "Raw materials and production-critical freight moved with consistency, visibility, and recovery when conditions shift. Industrial supply chain execution across North America.",
    },
    hero: {
      kicker: "Specialized Logistics Solutions",
      valueHeadline: "Control.",
      title: "Manufacturing & Materials",
      description:
        "Raw materials and production-critical freight moved with consistency, visibility, and recovery when conditions shift. We keep your supply chain predictable.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_manufacturing_hero_contact" },
      theme: "slate",
      iconKeys: ["cube-stack", "wrench"],
    },
    whatMatters: {
      sectionTitle: "The rhythm your floor depends on.",
      intro:
        "Predictable in, predictable out. When materials are late or damaged, production pays—and you're left firefighting. We keep your lanes under control with milestone visibility, proactive updates, and recovery that doesn't go silent when things go wrong.",
      items: [
        {
          title: "Consistency and visibility",
          body: "You need to know when raw materials or components will arrive and in what condition. We give you milestone visibility and proactive updates so you can plan with confidence.",
        },
        {
          title: "Recovery when it matters",
          body: "Weather, breakdown, delay—when it hits, you need root cause and a revised plan, not silence. We document and communicate every step so you're never in the dark.",
        },
        {
          title: "Right equipment and handling",
          body: "Bulk, palletized, or specialized—we match equipment and handling to your commodity. Proper securement and documentation protect your cargo and your audit trail.",
        },
      ],
      interactiveWidget: "load-optimization",
      widgetSupportTitle: "Load engineering, not guesswork",
      widgetSupportBody:
        "Volume optimization, weight balancing, and stable loads matter every trip. Adjust material density and switch between FTL and LTL to see how utilization and stress change. We help you pack smarter so every trailer runs efficiently and within spec.",
      widgetSupportBullets: [
        "FTL: full trailer, clean fill, maximum structural efficiency when density is balanced.",
        "LTL: mixed loads create natural gaps; we optimize cube and reduce empty miles.",
        "Overstress risk at very high density—we align load planning so equipment and cargo stay safe.",
      ],
      widgetSupportFooter: "Optimized loads. Fewer empty miles. Clear accountability.",
    },
    howWeSupport: {
      sectionTitle: "How NPT supports manufacturing",
      steps: [
        {
          title: "Consult with us",
          description:
            "We analyze your lanes, volumes, and constraints to recommend the right mode and carrier mix. Our goal is a plan that balances cost, reliability, and visibility.",
        },
        {
          title: "Plan with us",
          description:
            "We build shipping plans that align with your production cycles and inventory targets. Clear milestones and escalation paths mean fewer surprises.",
        },
        {
          title: "Execute",
          description:
            "Disciplined execution from pickup through delivery. Every load has an owner; every exception is documented and communicated so you stay in control.",
        },
        {
          title: "Monitor",
          description:
            "Real-time tracking and regular updates so you always know where your materials are. We surface issues early and keep you informed until the load is closed.",
        },
      ],
    },
    trustProof: {
      sectionTitle: "Trust and proof",
      intro: "Manufacturing shippers need a partner they can rely on. Here’s how we back that up.",
      stats: [
        { value: "98%", label: "On-time delivery" },
        { value: "$2M+", label: "Cargo insurance" },
        { value: "250K+", label: "Loads moved" },
      ],
      complianceItems: [
        "Carrier vetting and safety verification before dispatch",
        "BOLs and PODs retained for audit",
        "Documented exception and corrective action process",
      ],
      insuranceNote:
        "Cargo and liability coverage meet typical industrial requirements; we can confirm limits for your program.",
    },
    relatedServices: {
      sectionTitle: "How we move your freight",
      intro: "Manufacturing shippers often use these modes.",
      links: [
        { label: "Truckload", href: "/services/truckload" },
        { label: "LTL", href: "/services/ltl" },
        { label: "Intermodal", href: "/services/intermodal" },
        { label: "Value-Added", href: "/services/value-added" },
      ],
    },
    finalCta: {
      kicker: "Ready to simplify your manufacturing freight?",
      title: "Let's align on your lanes.",
      body: "Talk to our team about your raw materials, components, and production-critical moves. We'll outline how we deliver consistency and visibility.",
      proof: [
        { value: "≤ 15 min", label: "Initial response" },
        { value: "24/7", label: "Operations coverage" },
        { value: "CA–US–MX", label: "Lane scope" },
      ],
      trustSignals: ["Lane-level control", "Proactive updates", "Audit-ready documentation"],
      ctas: {
        primary: {
          label: "Contact us",
          href: "/contact",
          ctaId: "industry_manufacturing_final_contact",
        },
        secondary: {
          label: "Speak with a live agent",
          href: "#live-chat",
          ctaId: "industry_manufacturing_final_live_agent",
        },
      },
    },
  },

  retail: {
    key: "retail",
    slug: "retail-consumer-goods",
    meta: {
      title: "Retail & Consumer Goods Logistics | Store & DC Replenishment | NPT Logistics",
      description:
        "Store replenishment and DC lanes with predictable execution, clear updates, and service-level discipline. Retail freight delivered with zero drama.",
    },
    hero: {
      kicker: "Specialized Logistics Solutions",
      valueHeadline: "Zero drama.",
      title: "Retail & Consumer Goods",
      description:
        "Store replenishment and DC lanes with predictable execution, clear updates, and service-level discipline. We deliver so you can sell.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_retail_hero_contact" },
      theme: "blue",
      iconKeys: ["rectangle-stack", "truck"],
    },
    whatMatters: {
      sectionTitle: "From dock to shelf—without the drama.",
      intro:
        "Full shelves and on-time replenishment aren't nice-to-haves. When freight is late or mishandled, sales and trust take the hit. We deliver the predictability and communication your stores and your brand demand.",
      items: [
        {
          title: "Predictable execution",
          body: "Delivery windows you can count on. We confirm appointments, track to milestone, and communicate proactively so your stores and DCs are never left waiting.",
        },
        {
          title: "Clear communication",
          body: "No chasing status. Updates at key milestones and a single point of contact for every load. If something changes, we tell you—and we fix it.",
        },
        {
          title: "Service-level discipline",
          body: "Your service levels are non-negotiable. We deliver on-time, clean PODs, and documented exceptions so you have one accountable partner, not a black box.",
        },
      ],
      interactiveWidget: "demand-surge",
      widgetSupportTitle: "Flow under pressure",
      widgetSupportBody:
        "Demand spikes and channel mix change how fast orders flow through your network. Crank demand toward Black Friday and watch queue and fulfillment respond; add distribution nodes to spread load. We help you stay surge-ready so shelves stay full.",
      widgetSupportBullets: [
        "Stores: steadier flow, lower parcel volatility. E-comm: higher velocity, more peaks.",
        "More nodes spread load and reduce queue—we help you scale capacity when it matters.",
        "Surge mode means we’re already responding: priority handling and clear status until the wave passes.",
      ],
      widgetSupportFooter: "Velocity. Responsiveness. Network scaling when demand spikes.",
    },
    howWeSupport: {
      sectionTitle: "How NPT supports retail",
      steps: [
        {
          title: "Consult with us",
          description:
            "We review your network, volumes, and service requirements to recommend the right mode and execution model. Our goal is a plan that meets your SLA and your budget.",
        },
        {
          title: "Plan with us",
          description:
            "We build replenishment and DC plans that align with your cycles and capacity. Clear milestones and escalation paths keep everyone aligned.",
        },
        {
          title: "Execute",
          description:
            "Disciplined execution from pickup through delivery. Every load has an owner; every exception is documented so you stay in control of your shelves.",
        },
        {
          title: "Monitor",
          description:
            "Real-time tracking and proactive updates so you always know where your freight is. We surface issues early and close the loop with POD and documentation.",
        },
      ],
    },
    trustProof: {
      sectionTitle: "Trust and proof",
      intro: "Retail shippers need reliability and accountability. Here’s how we deliver.",
      stats: [
        { value: "98%", label: "On-time delivery" },
        { value: "$2M+", label: "Cargo insurance" },
        { value: "250K+", label: "Loads moved" },
      ],
      complianceItems: [
        "Carrier safety and insurance verified before every load",
        "BOLs and PODs retained for audit",
        "Documented exception and root-cause process",
      ],
      insuranceNote:
        "We maintain cargo and liability coverage that meets typical retail program requirements.",
    },
    relatedServices: {
      sectionTitle: "How we move your freight",
      intro: "Retail and consumer goods shippers often use these modes.",
      links: [
        { label: "Truckload", href: "/services/truckload" },
        { label: "LTL", href: "/services/ltl" },
        { label: "Temperature-Controlled", href: "/services/temperature-controlled" },
        { label: "Value-Added", href: "/services/value-added" },
      ],
    },
    finalCta: {
      kicker: "Ready to simplify your retail freight?",
      title: "Let's get your shelves stocked.",
      body: "Talk to our team about your store and DC lanes. We'll outline how we deliver predictable execution and clear communication.",
      proof: [
        { value: "≤ 15 min", label: "Initial response" },
        { value: "24/7", label: "Operations coverage" },
        { value: "CA–US–MX", label: "Lane scope" },
      ],
      trustSignals: [
        "Predictable execution",
        "Proactive updates",
        "Single point of accountability",
      ],
      ctas: {
        primary: { label: "Contact us", href: "/contact", ctaId: "industry_retail_final_contact" },
        secondary: {
          label: "Speak with a live agent",
          href: "#live-chat",
          ctaId: "industry_retail_final_live_agent",
        },
      },
    },
  },

  food: {
    key: "food",
    slug: "food-beverage",
    meta: {
      title: "Food & Beverage Logistics | Cold Chain & Temperature-Controlled | NPT Logistics",
      description:
        "Temperature-aware handling, clean documentation, and on-time execution to protect shelf life and brand trust. Food and beverage freight with precision.",
    },
    hero: {
      kicker: "Specialized Logistics Solutions",
      valueHeadline: "Precision.",
      title: "Food & Beverage",
      description:
        "Temperature-aware handling, clean documentation, and on-time execution to protect shelf life and brand trust. From farm to table, we move it right.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_food_hero_contact" },
      theme: "green",
      iconKeys: ["snowflake", "document-check"],
    },
    whatMatters: {
      sectionTitle: "From farm to table, intact.",
      intro:
        "Temperature, time, and documentation. One slip and product—and trust—are at risk. We keep your cold chain intact and your paperwork audit-ready, so what leaves the dock arrives at the dock the way it should.",
      items: [
        {
          title: "Temperature control and monitoring",
          body: "From refrigerated to frozen to ambient, the right equipment and monitoring protect your product. We match equipment to your specs and document conditions so you have an audit trail.",
        },
        {
          title: "On-time delivery and shelf life",
          body: "Every day (or hour) counts when shelf life is limited. We prioritize appointment accuracy and transit reliability so your product reaches the dock when it’s supposed to.",
        },
        {
          title: "Clean documentation",
          body: "BOLs, temperature logs, and lane-specific certs must be complete and traceable. We provide documentation that meets your compliance and audit requirements.",
        },
      ],
      interactiveWidget: "freshness-preservation",
      widgetSupportTitle: "Temperature + time, not just cold",
      widgetSupportBody:
        "Freshness depends on temperature and transit time together. Set temp and days in transit; the decay curve shows how product holds up. Keep temp in the safe band to flatten decay and preserve quality. We run a precision cold chain so your product arrives as intended.",
      widgetSupportBullets: [
        "Each product has an ideal temperature band; outside it, decay accelerates.",
        "Longer transit multiplies risk—we optimize routes and equipment to minimize time at risk.",
        "Preserved = cold chain stable. We document variance and deliver audit-ready visibility.",
      ],
      widgetSupportFooter: "Biological sensitivity. Controlled cold chain. No guesswork.",
    },
    howWeSupport: {
      sectionTitle: "How NPT supports food & beverage",
      steps: [
        {
          title: "Consult with us",
          description:
            "We review your temperature requirements, lanes, and compliance needs to recommend the right equipment and processes. Our goal is a plan that protects your product and your brand.",
        },
        {
          title: "Plan with us",
          description:
            "We build cold-chain plans that align with your specs and delivery windows. Clear milestones and documentation requirements keep everyone aligned.",
        },
        {
          title: "Execute",
          description:
            "Temperature-controlled execution from pickup through delivery. We monitor, document, and communicate so your product and your paperwork are both in order.",
        },
        {
          title: "Monitor",
          description:
            "Real-time tracking and temperature documentation so you always know where your product is and how it’s been handled. We surface issues early and close with full documentation.",
        },
      ],
    },
    trustProof: {
      sectionTitle: "Trust and proof",
      intro:
        "Food and beverage shippers need a partner that takes temperature and compliance seriously. Here’s how we deliver.",
      stats: [
        { value: "98%", label: "On-time delivery" },
        { value: "$2M+", label: "Cargo insurance" },
        { value: "Full chain", label: "Temperature documentation" },
      ],
      complianceItems: [
        "Carrier safety and insurance verified before every load",
        "Temperature logs and BOLs retained for audit",
        "Documented exception and corrective action process",
      ],
      insuranceNote:
        "We maintain cargo and liability coverage that meets typical food and beverage program requirements.",
    },
    relatedServices: {
      sectionTitle: "How we move your freight",
      intro: "Food and beverage shippers often use these modes.",
      links: [
        { label: "Temperature-Controlled", href: "/services/temperature-controlled" },
        { label: "Truckload", href: "/services/truckload" },
        { label: "Expedited & Specialized", href: "/services/expedited-specialized" },
        { label: "Cross-Border", href: "/services/cross-border" },
      ],
    },
    finalCta: {
      kicker: "Ready to move your food & beverage freight?",
      title: "Let's protect your cold chain.",
      body: "Talk to our team about your temperature requirements and lanes. We'll outline how we deliver precision and documentation.",
      proof: [
        { value: "≤ 15 min", label: "Initial response" },
        { value: "24/7", label: "Operations coverage" },
        { value: "CA–US–MX", label: "Lane scope" },
      ],
      trustSignals: ["Temperature documentation", "Proactive updates", "Audit-ready paperwork"],
      ctas: {
        primary: { label: "Contact us", href: "/contact", ctaId: "industry_food_final_contact" },
        secondary: {
          label: "Speak with a live agent",
          href: "#live-chat",
          ctaId: "industry_food_final_live_agent",
        },
      },
    },
  },

  "industrial-energy": {
    key: "industrial-energy",
    slug: "industrial-energy",
    meta: {
      title: "Industrial & Energy Logistics | Equipment & Project Freight | NPT Logistics",
      description:
        "Equipment and site-critical freight moved with safety-first execution, clear ownership, and accurate status. Industrial and energy lanes need reliability.",
    },
    hero: {
      kicker: "Specialized Logistics Solutions",
      valueHeadline: "Reliability.",
      title: "Industrial & Energy",
      description:
        "Equipment and site-critical freight moved with safety-first execution, clear ownership, and accurate status. When the load matters, we deliver.",
      cta: {
        label: "Contact us",
        href: "/contact",
        ctaId: "industry_industrial_energy_hero_contact",
      },
      theme: "amber",
      iconKeys: ["bolt", "cube"],
    },
    whatMatters: {
      sectionTitle: "When downtime isn't an option.",
      intro:
        "Site-critical freight doesn't get a second chance. Safety, timing, and the right equipment aren't negotiable. We bring safety-first execution, clear ownership, and the expertise so your project stays on track.",
      items: [
        {
          title: "Safety-first execution",
          body: "Oversize, heavy, or site-critical loads demand the right equipment, securement, and carrier vetting. We don’t move until safety and compliance are confirmed.",
        },
        {
          title: "Clear ownership and status",
          body: "You need to know who owns the load and where it is. We provide a single point of accountability and proactive updates so you’re never in the dark.",
        },
        {
          title: "Right equipment and expertise",
          body: "From flatbed to specialized to project moves, we match equipment and experience to your load. Proper planning and execution protect your cargo and your timeline.",
        },
      ],
      interactiveWidget: "heavy-haul-route",
      widgetSupportTitle: "Compliance and route complexity",
      widgetSupportBody:
        "Heavy, oversized, and hazardous loads change permit and escort requirements. Increase route complexity to see checkpoints and bridge constraints; switch load type to see compliance and escort rules update. We plan permits and escort so your cargo stays legal and on schedule.",
      widgetSupportBullets: [
        "Heavy: standard routing. Oversized: bridge permits, escort above moderate complexity.",
        "Hazardous: additional compliance nodes, placards, and enhanced controls.",
        "Special handling means we coordinate permits, escorts, and route constraints before the load moves.",
      ],
      widgetSupportFooter: "Regulatory compliance. Risk planning. Engineering-grade transport.",
    },
    howWeSupport: {
      sectionTitle: "How NPT supports industrial & energy",
      steps: [
        {
          title: "Consult with us",
          description:
            "We review your equipment needs, site requirements, and timelines to recommend the right mode and execution. Our goal is a plan that’s safe, compliant, and on time.",
        },
        {
          title: "Plan with us",
          description:
            "We build project and lane plans that align with your site schedules and constraints. Clear milestones and escalation paths keep everyone aligned.",
        },
        {
          title: "Execute",
          description:
            "Safety-first execution from pickup through delivery. Every load has an owner; every exception is documented and communicated.",
        },
        {
          title: "Monitor",
          description:
            "Real-time tracking and proactive updates so you always know where your equipment is. We surface issues early and close with full documentation.",
        },
      ],
    },
    trustProof: {
      sectionTitle: "Trust and proof",
      intro:
        "Industrial and energy shippers need a partner that takes safety and compliance seriously. Here’s how we deliver.",
      stats: [
        { value: "98%", label: "On-time delivery" },
        { value: "$2M+", label: "Cargo insurance" },
        { value: "Safety-first", label: "Carrier vetting" },
      ],
      complianceItems: [
        "Carrier safety and insurance verified before every load",
        "BOLs and specialized documentation retained for audit",
        "Documented exception and root-cause process",
      ],
      insuranceNote:
        "We maintain cargo and liability coverage that meets typical industrial and project requirements.",
    },
    relatedServices: {
      sectionTitle: "How we move your freight",
      intro: "Industrial and energy shippers often use these modes.",
      links: [
        { label: "Truckload", href: "/services/truckload" },
        { label: "Expedited & Specialized", href: "/services/expedited-specialized" },
        { label: "Flatbed & RGN", href: "/services/truckload#section-flatbed" },
        { label: "Value-Added", href: "/services/value-added" },
      ],
    },
    finalCta: {
      kicker: "Ready to move your industrial & energy freight?",
      title: "Let's get your equipment there.",
      body: "Talk to our team about your project and lane requirements. We'll outline how we deliver safety-first execution and clear ownership.",
      proof: [
        { value: "≤ 15 min", label: "Initial response" },
        { value: "24/7", label: "Operations coverage" },
        { value: "CA–US–MX", label: "Lane scope" },
      ],
      trustSignals: ["Safety-first execution", "Proactive updates", "Right equipment"],
      ctas: {
        primary: {
          label: "Contact us",
          href: "/contact",
          ctaId: "industry_industrial_energy_final_contact",
        },
        secondary: {
          label: "Speak with a live agent",
          href: "#live-chat",
          ctaId: "industry_industrial_energy_final_live_agent",
        },
      },
    },
  },

  "steel-aluminum": {
    key: "steel-aluminum",
    slug: "steel-aluminum",
    meta: {
      title: "Steel & Aluminum Logistics | Heavy Freight & Metal Shipping | NPT Logistics",
      description:
        "Metal coils, plate, and high-density loads moved with the right equipment, securement, and accountable execution. Heavy freight handled with discipline.",
    },
    hero: {
      kicker: "Specialized Logistics Solutions",
      valueHeadline: "Discipline.",
      title: "Steel & Aluminum",
      description:
        "Metal coils, plate, and high-density loads moved with the right equipment, securement, and accountable execution. Heavy freight that gets there right.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_steel_aluminum_hero_contact" },
      theme: "steel",
      iconKeys: ["cube", "shield"],
    },
    whatMatters: {
      sectionTitle: "Where specs and safety meet the road.",
      intro:
        "Coils, plate, and heavy metal demand the right equipment and securement. One wrong move and you're dealing with damage, delay, or worse. We match capability to your load and keep accountability clear from pickup to delivery.",
      items: [
        {
          title: "Right equipment and securement",
          body: "Coils, plate, and structural need flatbed, specialized trailers, and proper securement. We match equipment and carrier capability so your load arrives safe and undamaged.",
        },
        {
          title: "Safety and compliance",
          body: "Weight, dimensions, route constraints—planned and documented. We vet for heavy-haul experience and maintain the documentation your sites and auditors require.",
        },
        {
          title: "Accountable execution",
          body: "One load, one owner. Single point of contact and proactive updates so you know where your metal is and when it will arrive.",
        },
      ],
      interactiveWidget: "load-balance-axle",
      widgetSupportTitle: "Mechanical load physics",
      widgetSupportBody:
        "Weight and center of gravity determine axle pressure and stability. Adjust weight and CoG; the axle bars and stability score show when the load is balanced or at risk. We engineer securement and distribution so every heavy run is within spec.",
      widgetSupportBullets: [
        "Balanced load: even axle pressure, high stability. Imbalance spikes one axle and drops the score.",
        "Heavy loads increase pressure across all axles; we stay within axle limits and securement specs.",
        "Overstress means reposition or reduce—we plan load placement and equipment so you never run red.",
      ],
      widgetSupportFooter: "Structural integrity. Axle distribution. Engineered heavy transport.",
    },
    howWeSupport: {
      sectionTitle: "How NPT supports steel & aluminum",
      steps: [
        {
          title: "Consult with us",
          description:
            "We review your load specs, origins, and destinations to recommend the right equipment and carrier. Our goal is a plan that’s safe, compliant, and on time.",
        },
        {
          title: "Plan with us",
          description:
            "We build heavy-haul plans that align with your site and timeline. Clear milestones and securement requirements keep everyone aligned.",
        },
        {
          title: "Execute",
          description:
            "Disciplined execution from pickup through delivery. Every load has an owner; every exception is documented and communicated.",
        },
        {
          title: "Monitor",
          description:
            "Real-time tracking and proactive updates so you always know where your load is. We surface issues early and close with full documentation.",
        },
      ],
    },
    trustProof: {
      sectionTitle: "Trust and proof",
      intro:
        "Steel and aluminum shippers need a partner that knows heavy freight. Here’s how we deliver.",
      stats: [
        { value: "98%", label: "On-time delivery" },
        { value: "$2M+", label: "Cargo insurance" },
        { value: "Heavy-haul", label: "Equipment & expertise" },
      ],
      complianceItems: [
        "Carrier safety and insurance verified before every load",
        "BOLs and weight/dimension documentation retained for audit",
        "Documented exception and root-cause process",
      ],
      insuranceNote:
        "We maintain cargo and liability coverage that meets typical heavy-haul and metal shipping requirements.",
    },
    relatedServices: {
      sectionTitle: "How we move your freight",
      intro: "Steel and aluminum shippers often use these modes.",
      links: [
        { label: "Truckload", href: "/services/truckload" },
        { label: "Flatbed & RGN", href: "/services/truckload#section-flatbed" },
        { label: "Expedited & Specialized", href: "/services/expedited-specialized" },
        { label: "Value-Added", href: "/services/value-added" },
      ],
    },
    finalCta: {
      kicker: "Ready to move your steel & aluminum freight?",
      title: "Let's get your metal there.",
      body: "Talk to our team about your coils, plate, and heavy loads. We'll outline how we deliver the right equipment and accountable execution.",
      proof: [
        { value: "≤ 15 min", label: "Initial response" },
        { value: "24/7", label: "Operations coverage" },
        { value: "CA–US–MX", label: "Lane scope" },
      ],
      trustSignals: ["Right equipment", "Proactive updates", "Audit-ready documentation"],
      ctas: {
        primary: {
          label: "Contact us",
          href: "/contact",
          ctaId: "industry_steel_aluminum_final_contact",
        },
        secondary: {
          label: "Speak with a live agent",
          href: "#live-chat",
          ctaId: "industry_steel_aluminum_final_live_agent",
        },
      },
    },
  },
};

const SLUG_TO_KEY: Record<IndustrySlug, IndustryKey> = {
  automotive: "automotive",
  "manufacturing-materials": "manufacturing",
  "retail-consumer-goods": "retail",
  "food-beverage": "food",
  "industrial-energy": "industrial-energy",
  "steel-aluminum": "steel-aluminum",
};

export function getIndustryBySlug(slug: string): IndustryPageModel | null {
  const key = SLUG_TO_KEY[slug as IndustrySlug];
  if (!key) return null;
  return INDUSTRY_PAGE_DATA[key] ?? null;
}

export function getIndustrySlugs(): IndustrySlug[] {
  return Object.values(INDUSTRY_PAGE_DATA).map((m) => m.slug);
}

export function getIndustryKeys(): IndustryKey[] {
  return Object.keys(INDUSTRY_PAGE_DATA) as IndustryKey[];
}
