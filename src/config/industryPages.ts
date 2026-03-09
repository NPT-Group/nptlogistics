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

/** Unique interactive widget per industry — one per industry page */
export type IndustryWidgetType =
  | "transport-protection" // Automotive
  | "load-optimization" // Manufacturing & Materials
  | "demand-surge" // Retail & Consumer Goods
  | "freshness-preservation" // Food & Beverage
  | "heavy-haul-route" // Industrial & Energy
  | "load-balance-axle"; // Steel & Aluminum

export type IndustryWhatMatters = {
  variant?: "timeline" | "control-board" | "ops-grid";
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

export type IndustryHowWeSupportCard = {
  eyebrow?: string;
  title: string;
  summary: string;
  details: string;
  metric?: string;
};

export type IndustryHowWeSupport = {
  sectionTitle: string;
  intro: string;
  cards: IndustryHowWeSupportCard[];
  cta?: { label: string; href: string; ctaId: string };
};

export type IndustryTrustProof = {
  sectionTitle: string;
  intro?: string;
  comparisonHeading?: string;
  pillars: Array<{
    title: string;
    icon: string;
    industryBaseline: string;
    nptStandard: string;
    evidence: string;
    industryScore: number;
    nptScore: number;
  }>;
  evidenceNote?: string;
};

export type IndustryRelatedServices = {
  sectionTitle: string;
  intro?: string;
  modeFit?: Array<{
    scenario: string;
    recommendation: string;
    rationale: string;
  }>;
  links: Array<{ label: string; href: string }>;
};

export type IndustryFinalCta = {
  kicker?: string;
  title: string;
  body: string;
  implementationSteps?: Array<{
    step: string;
    title: string;
    body: string;
  }>;
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
        "Exotic and specialty vehicle transport supported by disciplined car-hauler execution, plus vehicle-unit and inbound component freight across North America.",
      ogImage: "/_optimized/services/specialized&time-sensitive/exoticCarhauling2.webp",
    },
    hero: {
      kicker: "Industry Logistics Programs",
      valueHeadline: "Production continuity.",
      title: "Automotive Logistics",
      description:
        "Our automotive operation is led by specialized and exotic vehicle hauling, backed by disciplined vehicle-unit moves and inbound component freight for unfinished manufacturing. Every lane is managed with accountable ownership, controlled handoffs, and decision-ready visibility.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_automotive_hero_contact" },
      theme: "red",
      iconKeys: ["car", "truck", "gear", "factory"],
    },
    whatMatters: {
      variant: "timeline",
      sectionTitle: "Operational Priorities for Automotive Freight",
      intro:
        "Automotive execution requires different controls across three realities: high-value exotic/specialty units, finished-vehicle flows, and inbound parts feeding production. Our operating model is intentionally weighted toward premium-asset risk control while preserving appointment precision for unit distribution and sequence reliability for manufacturing support.",

      items: [
        {
          title: "Exotic and Specialty Asset Protection",
          body: "High-value vehicles are planned with route-aware, enclosed transport controls, low-touch handling discipline, and delivery-condition accountability from origin through final handoff.",
        },
        {
          title: "Vehicle Program Timing Discipline",
          body: "Pickup appointments, delivery windows, and handoff timing are confirmed before dispatch and actively managed against milestone checkpoints through completion.",
        },
        {
          title: "Parts Flow Continuity for Manufacturing",
          body: "Inbound component lanes are managed with sequence-sensitive controls, structured exception response, and audit-ready shipment records to protect production cadence.",
        },
      ],

      interactiveWidget: "transport-protection",

      widgetSupportTitle: "Production-Risk Controls in Motion",

      widgetSupportBody:
        "Automotive risk profile changes by shipment type. Exotic units demand premium exposure control, vehicle programs demand timing precision, and parts lanes demand sequence continuity. This model shows how protection choices shift control posture before dispatch.",

      widgetSupportBullets: [
        "Exotic units: enclosed, low-touch handling and condition-verification workflows reduce exposure risk.",
        "Vehicle programs: timing checkpoints and appointment governance protect dealer and destination commitments.",
        "Component freight: handling controls and escalation ownership preserve unfinished manufacturing flow.",
      ],

      widgetSupportFooter: "Control design before dispatch. Visibility through delivery.",
    },
    howWeSupport: {
      sectionTitle: "How NPT Supports Automotive Programs",
      intro:
        "We structure automotive support around a clear concentration: specialized/exotic vehicle hauling first, then finished-vehicle program execution, then inbound parts continuity. The result is a controlled model that protects premium assets and keeps production and distribution lanes stable.",
      cards: [
        {
          eyebrow: "Plan with us",
          title: "Exotic-focused transport design",
          summary: "Specialized lanes are engineered for enclosed transport, route-fit feasibility, and low-touch handoffs before first movement.",
          details:
            "Your team receives a documented operating blueprint for condition-sensitive vehicles, with checkpoint ownership aligned across planning, dispatch, and receiving.",
          metric: "Exotic-control model",
        },
        {
          eyebrow: "Execute it",
          title: "Vehicle-unit execution reliability",
          summary: "Finished-vehicle dispatch, handoff control, and exception escalation are managed under a single accountable operations lead.",
          details:
            "When a vehicle lane moves off plan, corrective pathing is activated immediately with revised milestones and clear ownership through delivery closeout.",
          metric: "Unit-flow control",
        },
        {
          eyebrow: "Monitor in real time",
          title: "Decision-ready lane visibility",
          summary: "Milestone reporting is structured for premium-asset moves, distribution lanes, and production-facing teams.",
          details:
            "Status, exception context, and completion confirmation are shared in one consistent format so teams can act early and without ambiguity.",
          metric: "Reporting cadence",
        },
        {
          eyebrow: "Strengthen resilience",
          title: "Parts continuity and recovery paths",
          summary: "Contingency routing and alternate capacity are prepared in advance for component-lane and sequence disruptions.",
          details:
            "The objective is continuity: contain disruption quickly, restore sequence integrity, and protect unfinished manufacturing commitments downstream.",
          metric: "Production continuity",
        },
      ],
      cta: { label: "Plan your automotive lanes", href: "/contact", ctaId: "industry_automotive_support_contact" },
    },
    trustProof: {
      sectionTitle: "Why Teams Choose NPT",
      comparisonHeading: "NPT relative to typical market practice",
      intro:
        "Automotive teams usually compare providers on risk transfer, compliance discipline, and visibility quality. This is how our operating standard is structured in practice.",
      pillars: [
        {
          title: "Insurance Coverage",
          icon: "IC",
          industryBaseline: "Coverage often sits at minimum requirement with limited lane-specific review before dispatch.",
          nptStandard: "Coverage is reviewed against load profile before movement, with program-fit confirmation at onboarding.",
          evidence: "Carrier insurance verification log attached to pre-dispatch checklist.",
          industryScore: 42,
          nptScore: 82,
        },
        {
          title: "Regulatory Compliance",
          icon: "RC",
          industryBaseline: "Compliance checks are frequently periodic instead of embedded in day-to-day shipment execution.",
          nptStandard: "DOT/FMCSA controls are built into dispatch and escalation workflow with named ownership.",
          evidence: "Compliance checkpoint record retained with shipment closeout file.",
          industryScore: 48,
          nptScore: 86,
        },
        {
          title: "Shipment Visibility",
          icon: "SV",
          industryBaseline: "Updates are commonly event-only and late for operational decision windows.",
          nptStandard: "Milestone and exception updates are structured for planning, receiving, and leadership response timing.",
          evidence: "Timeline-based exception log with timestamped corrective actions.",
          industryScore: 39,
          nptScore: 84,
        },
      ],
      evidenceNote:
        "Sample documents and operating artifacts are available during implementation review.",
    },
    relatedServices: {
      sectionTitle: "Mode Fit and Coverage",
      intro:
        "Select transport approach by lane behavior, sequence criticality, and recovery tolerance.",
      modeFit: [
        {
          scenario: "Production-sequence inbound lanes",
          recommendation: "Truckload + Expedited fallback",
          rationale: "Protects appointment reliability while preserving a rapid recovery path when exceptions emerge.",
        },
        {
          scenario: "Exotic and specialty vehicle moves",
          recommendation: "Specialized protected transport",
          rationale: "Aligns enclosed equipment, route feasibility, and low-touch handling controls to premium-asset sensitivity.",
        },
        {
          scenario: "Cross-border automotive flows",
          recommendation: "Cross-Border + milestone governance",
          rationale: "Combines customs readiness with structured handoff visibility across CA-US-MX lanes.",
        },
      ],
      links: [
        { label: "Expedited & Specialized", href: "/services/expedited-specialized" },
        { label: "Truckload", href: "/services/truckload" },
        { label: "Cross-Border", href: "/services/cross-border" },
      ],
    },
    finalCta: {
      kicker: "Ready to move your automotive freight?",
      title: "Let's get your lanes on plan.",
      body: "Talk to our team about your inbound, outbound, or vehicle-unit moves. We'll align on your windows, requirements, and how we deliver.",
      implementationSteps: [
        {
          step: "01",
          title: "Lane and sequence discovery",
          body: "We map windows, dependencies, and risk points across your automotive flow.",
        },
        {
          step: "02",
          title: "Control-model setup",
          body: "We configure milestone governance, escalation ownership, and reporting cadence.",
        },
        {
          step: "03",
          title: "Launch with active oversight",
          body: "Execution begins with real-time control and structured performance review loops.",
        },
      ],
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
      kicker: "Industry Logistics Programs",
      valueHeadline: "Throughput stability.",
      title: "Manufacturing & Materials",
      description:
        "Raw materials and production-critical freight executed with lane discipline, handling controls, and exception ownership that help keep manufacturing flow stable and predictable.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_manufacturing_hero_contact" },
      theme: "slate",
      iconKeys: ["factory", "cube-stack", "wrench", "gear"],
    },
    whatMatters: {
      variant: "ops-grid",
      sectionTitle: "What Keeps Manufacturing Running",
      intro:
        "Manufacturing performance depends on inbound rhythm, not last-minute firefighting. Late or compromised materials create downstream pressure across labor, equipment, and customer delivery commitments. This model prioritizes lane stability, controlled exception response, and handling standards that protect throughput.",
      items: [
        {
          title: "Inbound Rhythm You Can Plan Around",
          body: "Shipments are managed to milestone checkpoints with proactive status communication so planning, receiving, and production teams can operate from the same timeline.",
        },
        {
          title: "Exception Control with Clear Ownership",
          body: "When disruptions occur, response ownership is immediate: root cause, revised execution path, and documented updates are communicated through resolution.",
        },
        {
          title: "Handling Engineered to Commodity Risk",
          body: "Equipment and securement are matched to commodity profile and handling sensitivity, with documentation quality that supports operational and audit requirements.",
        },
      ],
      interactiveWidget: "load-optimization",
      widgetSupportTitle: "Load Engineering for Manufacturing Flow",
      widgetSupportBody:
        "Utilization is not a volume metric alone. Density, shipment structure, and stress tolerance determine safe efficiency. This model helps teams evaluate loading posture before dispatch.",
      widgetSupportBullets: [
        "FTL: higher structural efficiency when density and distribution remain controlled.",
        "LTL: mixed profiles create natural gaps and require tighter cube planning discipline.",
        "High density raises stress exposure; load plans are engineered to stay within safe operating limits.",
      ],
      widgetSupportFooter: "Engineered utilization. Controlled stress. Documented execution.",
    },
    howWeSupport: {
      sectionTitle: "How NPT Supports Manufacturing & Materials",
      intro:
        "Building on these throughput priorities, we support manufacturing operations with a control-first model focused on inbound rhythm, handling discipline, exception ownership, and execution transparency.",
      cards: [
        {
          eyebrow: "Plan with us",
          title: "Inbound rhythm design",
          summary: "Transport plans are aligned to production cadence, receiving constraints, and material criticality.",
          details:
            "Lane playbooks define appointment strategy, sequencing priorities, and escalation paths so movement supports floor stability.",
          metric: "Operating playbooks",
        },
        {
          eyebrow: "Execute it",
          title: "Commodity-fit handling execution",
          summary: "Equipment and securement protocols are mapped to commodity profile and handling sensitivity.",
          details:
            "From palletized inputs to dense raw material, each movement is executed to preserve cargo condition and receiving readiness.",
          metric: "Handling controls",
        },
        {
          eyebrow: "Monitor in real time",
          title: "Planner-ready visibility",
          summary: "Milestone and exception reporting is structured for planning, receiving, and plant coordination decisions.",
          details:
            "Updates include execution status, exception cause, and corrective path so stakeholders can adjust proactively rather than react late.",
          metric: "Shared visibility",
        },
        {
          eyebrow: "Strengthen resilience",
          title: "Downtime risk containment",
          summary: "When lanes deviate, documented recovery paths are activated to maintain inbound continuity.",
          details:
            "Escalation ownership remains explicit through resolution, reducing cascading disruption across production and fulfillment timelines.",
          metric: "Exception governance",
        },
      ],
      cta: { label: "Stabilize your supply flow", href: "/contact", ctaId: "industry_manufacturing_support_contact" },
    },
    trustProof: {
      sectionTitle: "Why Teams Choose NPT",
      comparisonHeading: "NPT relative to typical market practice",
      intro:
        "Manufacturing buyers benchmark partners on risk coverage, process compliance, and operational visibility under schedule pressure.",
      pillars: [
        {
          title: "Insurance Coverage",
          icon: "IC",
          industryBaseline: "Insurance is often validated once, with limited linkage to commodity-specific risk.",
          nptStandard: "Coverage verification is tied to lane and material profile before dispatch authorization.",
          evidence: "Pre-dispatch risk and insurance check attached to lane execution brief.",
          industryScore: 44,
          nptScore: 81,
        },
        {
          title: "Regulatory Compliance",
          icon: "RC",
          industryBaseline: "Compliance is frequently handled as a separate audit track from daily operations.",
          nptStandard: "Compliance controls are embedded in dispatch, handoff, and exception closure workflow.",
          evidence: "Shipment closeout includes compliance checkpoints and owner signoff.",
          industryScore: 46,
          nptScore: 85,
        },
        {
          title: "Shipment Visibility",
          icon: "SV",
          industryBaseline: "Visibility tends to be reactive when receiving windows are already at risk.",
          nptStandard: "Milestone cadence and exception alerts are structured for production-facing decisions.",
          evidence: "Timestamped milestone and recovery log retained per load.",
          industryScore: 41,
          nptScore: 83,
        },
      ],
      evidenceNote:
        "Operational artifacts and document samples are shared during onboarding and lane design review.",
    },
    relatedServices: {
      sectionTitle: "Mode Fit and Coverage",
      intro: "Match service design to inbound criticality, load profile, and network rhythm.",
      modeFit: [
        {
          scenario: "Production-critical inbound materials",
          recommendation: "Truckload with escalation controls",
          rationale: "Provides stable cadence and controlled response when schedule risk appears.",
        },
        {
          scenario: "Mixed-volume replenishment lanes",
          recommendation: "LTL with consolidation discipline",
          rationale: "Balances cost and service while preserving milestone visibility.",
        },
        {
          scenario: "Long-haul repetitive corridors",
          recommendation: "Intermodal with planning buffer",
          rationale: "Supports predictable cycle planning for repeatable manufacturing flows.",
        },
      ],
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
      implementationSteps: [
        {
          step: "01",
          title: "Network and flow assessment",
          body: "We document lane criticality, receiving constraints, and production dependencies.",
        },
        {
          step: "02",
          title: "Execution playbook setup",
          body: "We define handling standards, milestone governance, and escalation rules by lane.",
        },
        {
          step: "03",
          title: "Controlled launch and tuning",
          body: "Operations start with active oversight and structured cadence optimization.",
        },
      ],
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
      kicker: "Industry Logistics Programs",
      valueHeadline: "Shelf availability.",
      title: "Retail & Consumer Goods",
      description:
        "Store replenishment and DC freight managed with service-level discipline, transparent status, and surge-aware execution built to protect product availability and customer commitments.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_retail_hero_contact" },
      theme: "blue",
      iconKeys: ["store", "rectangle-stack", "truck", "route"],
    },
    whatMatters: {
      variant: "ops-grid",
      sectionTitle: "What Protects Shelf Availability",
      intro:
        "Retail execution depends on replenishment reliability across stores, DCs, and promotional windows. Delays and unclear status create stock risk, service penalties, and preventable escalation. The operating focus here is window compliance, decision-ready visibility, and accountable service governance.",
      items: [
        {
          title: "Window Compliance at Store and DC",
          body: "Appointments and delivery windows are confirmed in advance, then managed to milestone checkpoints to reduce service misses at receiving locations.",
        },
        {
          title: "Operational Visibility Buyers Can Act On",
          body: "Status updates are structured around key moments in transit, with clear exception communication and a named owner responsible for corrective actions.",
        },
        {
          title: "Service Governance That Protects Commitments",
          body: "Proof of delivery quality, exception logs, and communication discipline are maintained so retail teams have traceable performance and accountable execution.",
        },
      ],
      interactiveWidget: "demand-surge",
      widgetSupportTitle: "Surge Readiness for Retail Networks",
      widgetSupportBody:
        "Demand volatility, channel mix, and node coverage can shift fulfillment pressure quickly. This model helps teams see where queue risk builds and how distribution choices stabilize service.",
      widgetSupportBullets: [
        "Store-heavy demand typically moves with steadier cadence; e-commerce-heavy demand increases peak volatility.",
        "Additional distribution nodes can reduce queue concentration and improve response flexibility.",
        "Surge response relies on clear priority rules, active load balancing, and disciplined status communication.",
      ],
      widgetSupportFooter: "Surge-aware planning. Service continuity. Faster response.",
    },
    howWeSupport: {
      sectionTitle: "How NPT Supports Retail & Consumer Goods",
      intro:
        "Building on these service-level priorities, we support retail performance with service-governed execution: promotion-aware planning, delivery-window discipline, transparent status, and controlled surge response.",
      cards: [
        {
          eyebrow: "Plan with us",
          title: "Promotion and replenishment planning",
          summary: "Capacity and routing plans are aligned to campaign calendars, replenishment cycles, and node-level demand patterns.",
          details:
            "Surge assumptions are addressed before peak windows begin, reducing ad-hoc decisions during high-pressure fulfillment periods.",
          metric: "Demand planning",
        },
        {
          eyebrow: "Execute it",
          title: "Window-compliant execution",
          summary: "Appointments and delivery windows are managed with strict handoff discipline across store and DC receiving points.",
          details:
            "The focus is consistency at the dock: disciplined arrivals, clean delivery confirmation, and fewer preventable service exceptions.",
          metric: "Service control",
        },
        {
          eyebrow: "Monitor in real time",
          title: "Decision-ready status visibility",
          summary: "Retail operations receive concise milestone updates and clear exception context at the moments that matter.",
          details:
            "Escalations include ownership and corrective action so merchandising, transportation, and operations teams can move quickly.",
          metric: "Exception clarity",
        },
        {
          eyebrow: "Strengthen resilience",
          title: "Surge and disruption response",
          summary: "When demand spikes or lane conditions tighten, execution plans are adjusted without losing service governance.",
          details:
            "Routing, coverage, and communication are rebalanced in flight to protect product availability and customer experience.",
          metric: "Continuity response",
        },
      ],
      cta: { label: "Support your retail network", href: "/contact", ctaId: "industry_retail_support_contact" },
    },
    trustProof: {
      sectionTitle: "Why Teams Choose NPT",
      comparisonHeading: "NPT relative to typical market practice",
      intro:
        "Retail performance is judged by consistency during promotions and peaks. This comparison shows operating-standard differences that affect shelf availability.",
      pillars: [
        {
          title: "Insurance Coverage",
          icon: "IC",
          industryBaseline: "Coverage confirmation is often generic and disconnected from promotion-risk periods.",
          nptStandard: "Coverage and liability readiness are reviewed against lane profile and surge risk timing.",
          evidence: "Risk review entry included in pre-peak execution checklist.",
          industryScore: 43,
          nptScore: 80,
        },
        {
          title: "Regulatory Compliance",
          icon: "RC",
          industryBaseline: "Compliance workflows are commonly separate from day-of-operation ownership.",
          nptStandard: "Compliance controls are integrated into dispatch and exception escalation paths.",
          evidence: "Compliance and dispatch checkpoints captured in shipment closure report.",
          industryScore: 45,
          nptScore: 84,
        },
        {
          title: "Shipment Visibility",
          icon: "SV",
          industryBaseline: "Visibility is frequently delayed during high-volume periods when decisions matter most.",
          nptStandard: "Milestone updates and escalation context are issued in decision-ready cadence.",
          evidence: "Service-window variance log with owner, trigger, and corrective timeline.",
          industryScore: 40,
          nptScore: 86,
        },
      ],
      evidenceNote:
        "Document samples and evidence artifacts can be reviewed as part of implementation planning.",
    },
    relatedServices: {
      sectionTitle: "Mode Fit and Coverage",
      intro: "Choose service mix based on replenishment speed, network spread, and product profile.",
      modeFit: [
        {
          scenario: "Store and DC replenishment corridors",
          recommendation: "Truckload + appointment governance",
          rationale: "Supports predictable dock performance and cleaner service-level execution.",
        },
        {
          scenario: "Mixed-volume replenishment needs",
          recommendation: "LTL with milestone visibility",
          rationale: "Improves cost efficiency while preserving exception transparency.",
        },
        {
          scenario: "Sensitive or seasonal product lanes",
          recommendation: "Temperature-controlled and value-added support",
          rationale: "Protects product quality and receiving readiness in variable-demand periods.",
        },
      ],
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
      implementationSteps: [
        {
          step: "01",
          title: "Demand and lane review",
          body: "We align on campaign windows, replenishment cadence, and service risk points.",
        },
        {
          step: "02",
          title: "Service-governance setup",
          body: "We configure appointment controls, visibility standards, and escalation ownership.",
        },
        {
          step: "03",
          title: "Launch with surge readiness",
          body: "Operations run with active balancing and structured communication during peaks.",
        },
      ],
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
      kicker: "Industry Logistics Programs",
      valueHeadline: "Integrity protected.",
      title: "Food & Beverage",
      description:
        "Cold-chain and food freight managed through temperature-governed execution, transit-time discipline, and compliance-ready documentation that protects product quality and brand trust.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_food_hero_contact" },
      theme: "green",
      iconKeys: ["snowflake", "thermometer", "document-check", "clock"],
    },
    whatMatters: {
      variant: "control-board",
      sectionTitle: "What Protects Product Integrity",
      intro:
        "Food and beverage freight is governed by three non-negotiables: temperature control, transit-time discipline, and documentation quality. When one fails, product integrity and brand trust are exposed. The operating model prioritizes cold-chain stability, controlled handoffs, and compliance-ready records.",
      items: [
        {
          title: "Temperature Governance by Lane",
          body: "Equipment selection and monitoring requirements are aligned to product profile, with documented temperature handling expectations from pickup through delivery.",
        },
        {
          title: "Transit-Time Control for Shelf-Life Risk",
          body: "Appointment precision and transit execution are managed to reduce time-at-risk and protect freshness windows at receiving facilities.",
        },
        {
          title: "Compliance-Ready Records and Exceptions",
          body: "Shipment documents, temperature records, and exception logs are maintained in a traceable format that supports internal QA and customer audit requirements.",
        },
      ],
      interactiveWidget: "freshness-preservation",
      widgetSupportTitle: "Cold-Chain Control Model",
      widgetSupportBody:
        "Freshness is a function of temperature discipline and time-at-risk. This model shows how deviation compounds exposure and where intervention protects product integrity.",
      widgetSupportBullets: [
        "Each product profile has a target band; out-of-band exposure accelerates quality decay.",
        "Longer transit increases cumulative risk, making route discipline and handoff timing critical.",
        "Exception records and temperature documentation maintain compliance traceability through delivery.",
      ],
      widgetSupportFooter: "Temperature governance. Time control. Compliance-ready records.",
    },
    howWeSupport: {
      sectionTitle: "How NPT Supports Food & Beverage Logistics",
      intro:
        "Building on these integrity priorities, we protect food and beverage shipments through temperature-governed execution, transit-time control, and documentation discipline across cold-chain lanes.",
      cards: [
        {
          eyebrow: "Plan with us",
          title: "Cold-chain lane design",
          summary: "Lane plans are built around product sensitivity, transit limits, and receiving requirements before dispatch begins.",
          details:
            "Equipment strategy, timing controls, and escalation steps are documented up front to reduce preventable quality exposure.",
          metric: "Cold-chain planning",
        },
        {
          eyebrow: "Execute it",
          title: "Integrity-first transport control",
          summary: "Loads move with specification-matched equipment and monitored handling from pickup through final handoff.",
          details:
            "Execution discipline centers on thermal control, appointment precision, and clean transfer-of-custody at each milestone.",
          metric: "Process discipline",
        },
        {
          eyebrow: "Monitor in real time",
          title: "Compliance-ready visibility",
          summary: "Status and document trails are maintained in a traceable format that supports QA and compliance workflows.",
          details:
            "Milestone updates and exception records are structured so operations and quality teams can intervene quickly when needed.",
          metric: "Traceability",
        },
        {
          eyebrow: "Strengthen resilience",
          title: "Freshness-window recovery",
          summary: "If disruptions occur, recovery options are executed to protect freshness windows and receiving readiness.",
          details:
            "Alternate routing and controlled escalation are coordinated quickly to contain quality risk and preserve customer confidence.",
          metric: "Risk containment",
        },
      ],
      cta: { label: "Protect your cold chain", href: "/contact", ctaId: "industry_food_support_contact" },
    },
    trustProof: {
      sectionTitle: "Why Teams Choose NPT",
      comparisonHeading: "NPT relative to typical market practice",
      intro:
        "Food and beverage teams compare partners on cold-chain exposure controls, compliance rigor, and visibility during freshness-sensitive windows.",
      pillars: [
        {
          title: "Insurance Coverage",
          icon: "IC",
          industryBaseline: "Coverage checks are often broad and not tied to thermal or shelf-life exposure conditions.",
          nptStandard: "Coverage validation is tied to product sensitivity and route risk before movement starts.",
          evidence: "Product-profile risk sheet included in dispatch readiness packet.",
          industryScore: 42,
          nptScore: 83,
        },
        {
          title: "Regulatory Compliance",
          icon: "RC",
          industryBaseline: "Compliance controls are frequently treated as periodic documentation tasks.",
          nptStandard: "Compliance checkpoints are enforced in daily cold-chain execution and exception closure.",
          evidence: "Temperature and handling checkpoint log retained with load records.",
          industryScore: 47,
          nptScore: 87,
        },
        {
          title: "Shipment Visibility",
          icon: "SV",
          industryBaseline: "Status updates may not arrive in time for freshness-window intervention.",
          nptStandard: "Milestone and deviation reporting is structured for immediate QA and operations response.",
          evidence: "Exception-to-recovery timeline with timestamps and assigned owner.",
          industryScore: 38,
          nptScore: 85,
        },
      ],
      evidenceNote:
        "QA-supporting record samples are available during onboarding and operating-model alignment.",
    },
    relatedServices: {
      sectionTitle: "Mode Fit and Coverage",
      intro: "Align transport mode to temperature sensitivity, shelf-life pressure, and lane constraints.",
      modeFit: [
        {
          scenario: "High-sensitivity refrigerated lanes",
          recommendation: "Temperature-Controlled with governance checkpoints",
          rationale: "Maintains thermal control and documented handoffs across the full route.",
        },
        {
          scenario: "High-volume standard shipments",
          recommendation: "Truckload with milestone discipline",
          rationale: "Supports predictable timing and cleaner receiving execution.",
        },
        {
          scenario: "Urgent freshness-window recovery",
          recommendation: "Expedited and Cross-Border options",
          rationale: "Provides accelerated recovery paths when schedule or border constraints emerge.",
        },
      ],
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
      implementationSteps: [
        {
          step: "01",
          title: "Product and lane qualification",
          body: "We review product sensitivity, transit limits, and compliance expectations by lane.",
        },
        {
          step: "02",
          title: "Cold-chain control setup",
          body: "We establish temperature handling, documentation cadence, and escalation protocols.",
        },
        {
          step: "03",
          title: "Launch with compliance oversight",
          body: "Operations begin with active monitoring and structured quality-risk reporting.",
        },
      ],
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
      kicker: "Industry Logistics Programs",
      valueHeadline: "Critical delivery certainty.",
      title: "Industrial & Energy",
      description:
        "Site-critical and project freight delivered through permit-aware planning, safety-governed execution, and checkpoint visibility that supports schedule certainty in high-consequence environments.",
      cta: {
        label: "Contact us",
        href: "/contact",
        ctaId: "industry_industrial_energy_hero_contact",
      },
      theme: "amber",
      iconKeys: ["bolt", "route", "cube", "shield"],
    },
    whatMatters: {
      variant: "timeline",
      sectionTitle: "What Secures Site-Critical Delivery",
      intro:
        "Industrial and energy freight carries schedule and safety consequences that extend beyond transportation. Permit constraints, route complexity, and site timing must be engineered before movement begins. The operating priority is safety-led control, checkpoint governance, and execution ownership from dispatch to handoff.",
      items: [
        {
          title: "Pre-Move Safety and Permit Readiness",
          body: "Equipment fit, securement approach, and applicable routing constraints are validated before dispatch so movement begins on a compliant foundation.",
        },
        {
          title: "Command Ownership Through Each Checkpoint",
          body: "A single operations owner manages status communication, checkpoint progress, and exception escalation from origin through site delivery.",
        },
        {
          title: "Equipment-Fit Planning for High-Consequence Loads",
          body: "Transport mode, route assumptions, and handling controls are aligned to load class so project timelines and site operations remain protected.",
        },
      ],
      interactiveWidget: "heavy-haul-route",
      widgetSupportTitle: "Route Compliance Control",
      widgetSupportBody:
        "Project requirements escalate with load class and route complexity. This model shows how permits, escorts, and control checkpoints shift before mobilization.",
      widgetSupportBullets: [
        "Standard heavy freight may run baseline controls; oversized moves increase permit and escort demands.",
        "Hazardous classifications add compliance requirements, handling controls, and route restrictions.",
        "Special-handling moves are engineered in advance so legal and schedule constraints stay aligned.",
      ],
      widgetSupportFooter: "Permit-aware planning. Safety governance. Schedule protection.",
    },
    howWeSupport: {
      sectionTitle: "How NPT Supports Industrial & Energy Projects",
      intro:
        "Building on these site-critical priorities, we apply a project-control model built on permit-aware planning, safety governance, checkpoint visibility, and accountable recovery.",
      cards: [
        {
          eyebrow: "Plan with us",
          title: "Permit and route engineering",
          summary: "Transport plans are engineered around permit constraints, route complexity, and site delivery milestones.",
          details:
            "Regulatory checkpoints, escort considerations, and contingency routes are established before mobilization begins.",
          metric: "Project planning",
        },
        {
          eyebrow: "Execute it",
          title: "Safety-governed execution control",
          summary: "Execution runs under defined safety and compliance controls with clear operational command throughout movement.",
          details:
            "From pre-move preparation through final-site delivery, process adherence is managed against project-critical requirements.",
          metric: "Safety governance",
        },
        {
          eyebrow: "Monitor in real time",
          title: "Checkpoint-based visibility",
          summary: "Project teams receive checkpoint progress, timing adjustments, and active risk-control status in real time.",
          details:
            "Reporting is structured to keep project, procurement, and site operations aligned without information gaps.",
          metric: "Project reporting",
        },
        {
          eyebrow: "Strengthen resilience",
          title: "Schedule-protection recovery",
          summary: "When constraints emerge, predefined recovery paths are activated to protect project schedule commitments.",
          details:
            "Alternate routing and resource options are coordinated with clear ownership to maintain delivery certainty on critical assets.",
          metric: "Recovery control",
        },
      ],
      cta: {
        label: "Coordinate your project freight",
        href: "/contact",
        ctaId: "industry_industrial_energy_support_contact",
      },
    },
    trustProof: {
      sectionTitle: "Why Teams Choose NPT",
      comparisonHeading: "NPT relative to typical market practice",
      intro:
        "Industrial and energy moves are judged by permit readiness, compliance discipline, and checkpoint-level visibility under project pressure.",
      pillars: [
        {
          title: "Insurance Coverage",
          icon: "IC",
          industryBaseline: "Coverage verification is often handled as a static prerequisite rather than project-specific risk control.",
          nptStandard: "Coverage is reviewed against load class, route constraints, and project consequence before mobilization.",
          evidence: "Project risk-coverage review recorded in pre-move readiness file.",
          industryScore: 41,
          nptScore: 82,
        },
        {
          title: "Regulatory Compliance",
          icon: "RC",
          industryBaseline: "Permit and regulatory checks are sometimes fragmented across teams.",
          nptStandard: "Permit, compliance, and dispatch checkpoints are unified under clear operational ownership.",
          evidence: "Permit/compliance signoff trail retained for each movement stage.",
          industryScore: 44,
          nptScore: 88,
        },
        {
          title: "Shipment Visibility",
          icon: "SV",
          industryBaseline: "Stakeholder updates are often inconsistent across project checkpoints.",
          nptStandard: "Checkpoint reporting cadence is structured for project, site, and procurement decisions.",
          evidence: "Checkpoint variance and recovery log maintained through final handoff.",
          industryScore: 40,
          nptScore: 84,
        },
      ],
      evidenceNote:
        "Project evidence packets and operational records can be shared in qualification and mobilization planning.",
    },
    relatedServices: {
      sectionTitle: "Mode Fit and Coverage",
      intro: "Select the movement model by load class, permit complexity, and project risk profile.",
      modeFit: [
        {
          scenario: "Permit-heavy project moves",
          recommendation: "Expedited & Specialized with route governance",
          rationale: "Combines permit-aware execution with active control over checkpoint timing.",
        },
        {
          scenario: "Heavy equipment standard corridors",
          recommendation: "Truckload and Flatbed/RGN",
          rationale: "Aligns equipment fit and securement discipline to large-format cargo profiles.",
        },
        {
          scenario: "Site schedule-critical handoffs",
          recommendation: "Value-Added coordination layer",
          rationale: "Adds operating controls around communication and exception recovery.",
        },
      ],
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
      implementationSteps: [
        {
          step: "01",
          title: "Project movement scoping",
          body: "We assess load profile, route complexity, permit dependencies, and site timing.",
        },
        {
          step: "02",
          title: "Control and safety setup",
          body: "We define checkpoint governance, escalation pathways, and communication cadence.",
        },
        {
          step: "03",
          title: "Mobilize with command oversight",
          body: "Execution launches with active project-control reporting through delivery closeout.",
        },
      ],
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
      kicker: "Industry Logistics Programs",
      valueHeadline: "Heavy-freight control.",
      title: "Steel & Aluminum",
      description:
        "Metal coils, plate, and high-density freight executed with engineered load planning, compliance-rigorous routing, and accountable operating control from origin handoff through delivery.",
      cta: { label: "Contact us", href: "/contact", ctaId: "industry_steel_aluminum_hero_contact" },
      theme: "steel",
      iconKeys: ["coil", "cube", "shield", "gear"],
    },
    whatMatters: {
      variant: "control-board",
      sectionTitle: "What Controls Heavy-Metal Risk",
      intro:
        "Steel and aluminum freight is governed by load physics, route constraints, and securement discipline. Misalignment in any of those areas increases exposure to damage, delay, and compliance failure. Execution here is centered on engineered load control, route readiness, and traceable ownership.",
      items: [
        {
          title: "Securement and Distribution Engineered to Load",
          body: "Equipment selection, axle distribution, and securement approach are matched to commodity profile before pickup to reduce in-transit risk.",
        },
        {
          title: "Route and Compliance Rigor Before Dispatch",
          body: "Weight, dimension, and routing requirements are confirmed up front, with documentation maintained for site, safety, and audit expectations.",
        },
        {
          title: "Traceable Execution from Mill to Delivery",
          body: "One accountable operations lead manages milestone updates, exception handling, and shipment documentation from origin handoff to final receipt.",
        },
      ],
      interactiveWidget: "load-balance-axle",
      widgetSupportTitle: "Axle and Stability Control",
      widgetSupportBody:
        "For high-density metal freight, load distribution and center-of-gravity discipline determine axle pressure and stability. This model surfaces imbalance risk before movement.",
      widgetSupportBullets: [
        "Balanced distribution stabilizes axle pressure and improves transport control margins.",
        "As weight rises, axle load tolerance narrows and requires tighter placement discipline.",
        "When overstress appears, load placement and equipment strategy are adjusted before execution.",
      ],
      widgetSupportFooter: "Balanced load physics. Compliance discipline. Controlled delivery.",
    },
    howWeSupport: {
      sectionTitle: "How NPT Supports Steel & Aluminum Shippers",
      intro:
        "Building on these heavy-freight priorities, we support metal programs with engineered load control, compliance-rigorous routing, and execution accountability from mill handoff through delivery.",
      cards: [
        {
          eyebrow: "Plan with us",
          title: "Load and lane engineering",
          summary: "Move plans are built around weight profile, securement requirements, and destination handling constraints.",
          details:
            "Each shipment is pre-structured for equipment fit, route feasibility, and risk controls tailored to metal cargo characteristics.",
          metric: "Load planning",
        },
        {
          eyebrow: "Execute it",
          title: "Heavy-freight execution discipline",
          summary: "Dispatch and handoffs are managed with the precision required for dense, high-consequence metal loads.",
          details:
            "Operational control prioritizes secure loading, balanced distribution, and compliance integrity through final delivery.",
          metric: "Execution rigor",
        },
        {
          eyebrow: "Monitor in real time",
          title: "Transparent milestone oversight",
          summary: "Status, timing, and exception handling are reported at each milestone in a consistent operating format.",
          details:
            "Communication cadence is designed to support mill, warehouse, and project coordination without uncertainty.",
          metric: "Operational visibility",
        },
        {
          eyebrow: "Strengthen resilience",
          title: "Risk-contained recovery execution",
          summary: "When lane constraints emerge, alternate routing and escalation controls are activated to preserve delivery commitments.",
          details:
            "Recovery decisions remain anchored to safety, compliance, and arrival certainty across heavy-freight programs.",
          metric: "Recovery governance",
        },
      ],
      cta: { label: "Move your metal with confidence", href: "/contact", ctaId: "industry_steel_support_contact" },
    },
    trustProof: {
      sectionTitle: "Why Teams Choose NPT",
      comparisonHeading: "NPT relative to typical market practice",
      intro:
        "Steel and aluminum shippers evaluate partners by risk control discipline, route compliance rigor, and visibility through heavy-load constraints.",
      pillars: [
        {
          title: "Insurance Coverage",
          icon: "IC",
          industryBaseline: "Coverage checks are often generic and not always aligned to high-density load risk profile.",
          nptStandard: "Coverage and liability posture are validated against lane constraints and cargo behavior before dispatch.",
          evidence: "Load-risk and coverage assessment attached to execution release checklist.",
          industryScore: 43,
          nptScore: 81,
        },
        {
          title: "Regulatory Compliance",
          icon: "RC",
          industryBaseline: "Compliance can be treated as separate paperwork instead of a live execution control.",
          nptStandard: "Route, dimension, and regulatory controls are embedded in planning and in-transit governance.",
          evidence: "Route-compliance checkpoint trail stored with shipment records.",
          industryScore: 46,
          nptScore: 87,
        },
        {
          title: "Shipment Visibility",
          icon: "SV",
          industryBaseline: "Heavy-load visibility is often event-only with limited context for corrective decisions.",
          nptStandard: "Milestone reporting includes variance context and owner-led recovery actions.",
          evidence: "Checkpoint exception log with timestamped correction path.",
          industryScore: 39,
          nptScore: 83,
        },
      ],
      evidenceNote:
        "Evidence files and operating-control examples are available during heavy-freight program onboarding.",
    },
    relatedServices: {
      sectionTitle: "Mode Fit and Coverage",
      intro: "Map each metal movement to equipment fit, route constraints, and risk controls.",
      modeFit: [
        {
          scenario: "Coil and plate heavy-load lanes",
          recommendation: "Flatbed/RGN with engineered securement",
          rationale: "Aligns deck and securement strategy to high-density load behavior and stability limits.",
        },
        {
          scenario: "Time-sensitive heavy freight corridors",
          recommendation: "Truckload + expedited contingency",
          rationale: "Protects schedule commitments while preserving controlled recovery options.",
        },
        {
          scenario: "Complex destination handling requirements",
          recommendation: "Value-Added operational coordination",
          rationale: "Improves handoff quality and exception ownership at receiving sites.",
        },
      ],
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
      implementationSteps: [
        {
          step: "01",
          title: "Load and route qualification",
          body: "We assess weight profile, securement requirements, and compliance constraints by lane.",
        },
        {
          step: "02",
          title: "Execution-control setup",
          body: "We define handling standards, milestone reporting, and exception ownership.",
        },
        {
          step: "03",
          title: "Launch with heavy-freight oversight",
          body: "Operations begin with disciplined control loops focused on stability and arrival certainty.",
        },
      ],
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
