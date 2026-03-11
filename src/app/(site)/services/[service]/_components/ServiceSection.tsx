"use client";

// src/app/(site)/services/[service]/_components/ServiceSection.tsx
import Link from "next/link";
import { Container } from "@/app/(site)/components/layout/Container";
import { SectionImage } from "@/components/media/SectionImage";
import { FreightFitGuideMedia, FreightFitGuideRecommendations } from "./FreightFitGuide";
import { cn } from "@/lib/cn";
import { trackCtaClick, toCtaSlug } from "@/lib/analytics/cta";
import type { ServiceKey, SubServiceSection } from "@/config/services";

function overlayClass(overlay?: SubServiceSection["overlay"]) {
  switch (overlay) {
    case "red":
      return "bg-[linear-gradient(180deg,rgba(127,29,29,0.18),rgba(2,6,23,0.06))]";
    case "blue":
      return "bg-[linear-gradient(180deg,rgba(30,58,138,0.16),rgba(2,6,23,0.06))]";
    case "slate":
      return "bg-[linear-gradient(180deg,rgba(30,41,59,0.14),rgba(2,6,23,0.05))]";
    default:
      return "bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.05))]";
  }
}

const scrollMarginTopStyle = {
  scrollMarginTop:
    "calc(var(--service-header-h) + var(--service-subnav-h) + var(--service-anchor-gap))",
} as React.CSSProperties;

const CONTEXTUAL_RELATED_BY_TYPE: Record<
  SubServiceSection["key"],
  Array<{ label: string; href: string; reason: string }>
> = {
  "dry-van": [
    {
      label: "LTL Consolidation",
      href: "/services/ltl",
      reason: "Use when shipment volume does not justify dedicated trailer space.",
    },
    /* COMMENTED OUT - uncomment to restore intermodal
    {
      label: "Intermodal",
      href: "/services/intermodal",
      reason: "Best fit for predictable lanes where cost stability matters.",
    },
    */
    {
      label: "Cross-border Solutions",
      href: "/services/cross-border",
      reason: "For CA-USA-MX customs handoff and compliance coordination.",
    },
  ],
  flatbed: [
    {
      label: "RGN (Oversize)",
      href: "/services/truckload#section-rgn-oversize",
      reason: "When dimensions, axle weights, or permits exceed flatbed thresholds.",
    },
    {
      label: "Roll-Tite / Conestoga",
      href: "/services/truckload#section-roll-tite-conestoga",
      reason: "When you need weather protection without losing side-load access.",
    },
    {
      label: "Cross-border Solutions",
      href: "/services/cross-border",
      reason: "For project freight moving across national compliance regimes.",
    },
  ],
  "step-deck": [
    {
      label: "Flatbed",
      href: "/services/truckload#section-flatbed",
      reason: "When load fits on standard flatbed within legal height limits.",
    },
    {
      label: "RGN (Oversize)",
      href: "/services/truckload#section-rgn-oversize",
      reason: "When dimensions or permits exceed step deck thresholds.",
    },
    {
      label: "Roll-Tite / Conestoga",
      href: "/services/truckload#section-roll-tite-conestoga",
      reason: "When you need weather protection without losing side-load access.",
    },
    {
      label: "Cross-border Solutions",
      href: "/services/cross-border",
      reason: "For project freight moving across national compliance regimes.",
    },
  ],
  "rgn-oversize": [
    {
      label: "Flatbed",
      href: "/services/truckload#section-flatbed",
      reason: "For open-deck freight that does not require heavy-haul configuration.",
    },
    {
      label: "Roll-Tite / Conestoga",
      href: "/services/truckload#section-roll-tite-conestoga",
      reason: "For high-value freight requiring covered-deck protection.",
    },
    {
      label: "Cross-border Solutions",
      href: "/services/cross-border",
      reason: "For permit, routing, and border process coordination.",
    },
  ],
  "roll-tite-conestoga": [
    {
      label: "Flatbed",
      href: "/services/truckload#section-flatbed",
      reason: "For open-deck freight where weather exposure is acceptable.",
    },
    {
      label: "Dry Van",
      href: "/services/truckload#section-dry-van",
      reason: "For fully enclosed dock-to-dock freight protection and control.",
    },
    {
      label: "LTL Consolidation",
      href: "/services/ltl",
      reason: "For split shipments, multi-stop deliveries, and smaller payloads.",
    },
  ],
  expedited: [
    {
      label: "Air Freight",
      href: "/services/cross-border#section-air-freight",
      reason:
        "For cross-region urgent moves when timeline compression outweighs landed-cost priority.",
    },
    {
      label: "Truckload (FTL)",
      href: "/services/truckload",
      reason: "For full-load continuity once recovery demand transitions into steady lane flow.",
    },
    {
      label: "Managed Capacity",
      href: "/services/value-added#section-managed-capacity",
      reason: "To convert recurring urgent lanes into governed, KPI-managed execution.",
    },
  ],
  "specialized-vehicle-programs": [
    {
      label: "Expedited",
      href: "/services/expedited-specialized#section-expedited",
      reason:
        "For exotic and specialty vehicle moves tied to hard delivery windows, event timing, or urgent recovery timelines.",
    },
    {
      label: "Dry Van",
      href: "/services/truckload#section-dry-van",
      reason:
        "For automotive parts and unfinished manufacturing components that need enclosed, schedule-disciplined lane execution.",
    },
    {
      label: "Truckload (FTL)",
      href: "/services/truckload",
      reason:
        "For general vehicle-unit program support where lane consistency, appointment control, and scalable capacity matter.",
    },
  ],
  "canada-us": [
    {
      label: "Mexico Cross-Border",
      href: "/services/cross-border#section-mexico-cross-border",
      reason: "For southbound and northbound lanes requiring multi-party border handoffs.",
    },
    {
      label: "Truckload (FTL)",
      href: "/services/truckload",
      reason: "For domestic inland execution after border clearance.",
    },
    /* COMMENTED OUT - uncomment to restore intermodal
    {
      label: "Intermodal",
      href: "/services/intermodal",
      reason: "For steady lanes where cost stability can outperform full truckload.",
    },
    */
  ],
  "mexico-cross-border": [
    {
      label: "Canada ↔ USA",
      href: "/services/cross-border#section-canada-us",
      reason: "For northern cross-border lanes with different customs process profiles.",
    },
    {
      label: "Ocean Freight",
      href: "/services/cross-border#section-ocean-freight",
      reason: "For global inbound programs feeding Mexico or U.S. border distribution.",
    },
    {
      label: "Truckload (FTL)",
      href: "/services/truckload",
      reason: "For inland plant, warehouse, and distribution handoff execution.",
    },
  ],
  "ocean-freight": [
    {
      label: "Air Freight",
      href: "/services/cross-border#section-air-freight",
      reason: "For urgent SKUs that need speed while ocean carries base volume.",
    },
    {
      label: "Canada ↔ USA",
      href: "/services/cross-border#section-canada-us",
      reason: "For post-arrival cross-border distribution between CA and US facilities.",
    },
    {
      label: "Truckload (FTL)",
      href: "/services/truckload",
      reason: "For inland drayage and final over-the-road delivery after port handling.",
    },
  ],
  "air-freight": [
    {
      label: "Ocean Freight",
      href: "/services/cross-border#section-ocean-freight",
      reason: "For base-load cost optimization while reserving air for urgent demand.",
    },
    {
      label: "Canada ↔ USA",
      href: "/services/cross-border#section-canada-us",
      reason: "For cross-border final-mile execution after air arrival and customs release.",
    },
    {
      label: "Mexico Cross-Border",
      href: "/services/cross-border#section-mexico-cross-border",
      reason: "For fast replenishment into Mexico-related supply chain flows.",
    },
  ],
  "warehousing-distribution": [
    {
      label: "Managed Capacity",
      href: "/services/value-added#section-managed-capacity",
      reason: "For transportation governance tied directly to warehouse outbound execution.",
    },
    {
      label: "Dedicated / Contract",
      href: "/services/value-added#section-dedicated-contract",
      reason: "When recurring flows need committed capacity and service-level accountability.",
    },
    {
      label: "Truckload (FTL)",
      href: "/services/truckload",
      reason: "For scalable linehaul from distribution nodes into major lane networks.",
    },
  ],
  "managed-capacity": [
    {
      label: "Warehousing & Distribution",
      href: "/services/value-added#section-warehousing-distribution",
      reason: "To align transportation planning with inventory and fulfillment operations.",
    },
    {
      label: "Dedicated / Contract",
      href: "/services/value-added#section-dedicated-contract",
      reason: "For lanes where committed resources improve service continuity.",
    },
    /* COMMENTED OUT - uncomment to restore intermodal
    {
      label: "Intermodal",
      href: "/services/intermodal",
      reason: "For predictable corridors where mode optimization can improve cost stability.",
    },
    */
  ],
  "dedicated-contract": [
    {
      label: "Managed Capacity",
      href: "/services/value-added#section-managed-capacity",
      reason: "To add strategic network optimization on top of committed execution resources.",
    },
    {
      label: "Warehousing & Distribution",
      href: "/services/value-added#section-warehousing-distribution",
      reason: "For integrated storage-to-delivery programs under one operating cadence.",
    },
    {
      label: "Truckload (FTL)",
      href: "/services/truckload",
      reason: "For recurring lanes requiring disciplined over-the-road execution.",
    },
  ],
  "project-oversize-programs": [
    {
      label: "RGN (Oversize)",
      href: "/services/truckload#section-rgn-oversize",
      reason: "For heavy-haul execution when project loads exceed standard legal thresholds.",
    },
    {
      label: "Managed Capacity",
      href: "/services/value-added#section-managed-capacity",
      reason: "To coordinate multi-lane project flows with KPI-led transport governance.",
    },
    {
      label: "Cross-Border & Global",
      href: "/services/cross-border",
      reason: "When project cargo spans customs boundaries and global transport handoffs.",
    },
  ],
};

const CONVERSION_SIGNALS_BY_TYPE: Record<SubServiceSection["key"], string[]> = {
  "dry-van": [
    "Equipment-fit and lane assumptions defined before tender",
    "Appointment, POD, and exception workflows aligned at intake",
    "Structured quote response within one business cycle",
  ],
  flatbed: [
    "Securement planning before dispatch release",
    "Site access and loading window coordination",
    "Escalation path for weather and route exceptions",
  ],
  "step-deck": [
    "Deck fit and height clearance confirmed before tender",
    "Site access and loading method coordination",
    "Escalation path for weather and route exceptions",
  ],
  "rgn-oversize": [
    "Permit and route sequencing support",
    "Pre-move risk review with compliance controls",
    "Milestone communication for every critical handoff",
  ],
  "roll-tite-conestoga": [
    "Covered-deck protection for weather-sensitive freight",
    "Load access flexibility with operational control",
    "Status cadence tailored to shipper requirements",
  ],
  expedited: [
    "Priority dispatch aligned to hard delivery windows",
    "Direct-route planning to reduce timeline variance",
    "Escalation path defined before release",
  ],
  "specialized-vehicle-programs": [
    "Equipment-fit and handling profile validation",
    "Route and access feasibility planning",
    "Permit-aware timeline governance",
  ],
  "canada-us": [
    "Broker and documentation handoff alignment",
    "Border milestone updates tied to decision points",
    "Exception response for holds and inspection events",
  ],
  "mexico-cross-border": [
    "Crossing-point and transfer workflow coordination",
    "Bilingual communication support across handoffs",
    "Escalation process for border release disruptions",
  ],
  "ocean-freight": [
    "FCL/LCL planning aligned to service objectives",
    "Booking-to-delivery milestone governance",
    "Exception workflow for rollover and schedule shifts",
  ],
  "air-freight": [
    "Priority booking guidance for urgent demand",
    "Fast status cadence across critical milestones",
    "Recovery planning for time-sensitive disruptions",
  ],
  "warehousing-distribution": [
    "Inventory and order workflow governance",
    "Outbound SLA monitoring and exception control",
    "Scalable throughput planning for variable demand",
  ],
  "managed-capacity": [
    "Carrier and lane strategy aligned to KPIs",
    "Cost and service optimization cadence",
    "Structured escalation for network exceptions",
  ],
  "dedicated-contract": [
    "Committed resource model with SLA accountability",
    "Recurring lane governance and performance reviews",
    "Reduced volatility through embedded execution",
  ],
  "project-oversize-programs": [
    "Engineering-grade route and permit planning",
    "Multi-stakeholder milestone control",
    "Contingency design for schedule-risk events",
  ],
};

const BORDER_PRIORITIES_BY_TYPE: Partial<Record<SubServiceSection["key"], string[]>> = {
  "canada-us": [
    "Customs and broker touchpoints confirmed pre-pickup",
    "Border milestone ownership defined across teams",
    "Delivery commitments aligned to release-risk scenarios",
  ],
  "mexico-cross-border": [
    "Crossing-point strategy matched to service requirements",
    "Transfer and yard handoffs mapped before dispatch",
    "Exception paths pre-aligned for release and inspection delays",
  ],
  "ocean-freight": [
    "FCL vs LCL decision tied to service and cost goals",
    "Port-to-door timeline aligned to inventory exposure",
    "Fallback pathways prepared for rollover and congestion",
  ],
  "air-freight": [
    "Urgency validated against landed-cost impact",
    "Critical milestones tied to downstream operations",
    "Recovery mode defined before first exception event",
  ],
};

const CROSS_BORDER_FLOW_STEPS: Partial<Record<SubServiceSection["key"], string[]>> = {
  "canada-us": ["Docs", "Clearance", "Delivery"],
  "mexico-cross-border": ["Handoff", "Release", "Final-mile"],
  "ocean-freight": ["Booking", "Sailing", "Arrival"],
  "air-freight": ["Book", "Uplift", "Release"],
};

const VALUE_ADDED_OUTCOMES: Partial<Record<SubServiceSection["key"], string[]>> = {
  "warehousing-distribution": ["Order accuracy", "Cycle-time discipline", "Inventory integrity"],
  "managed-capacity": ["Cost governance", "KPI visibility", "Lane optimization"],
  "dedicated-contract": ["Service continuity", "SLA accountability", "Capacity stability"],
  "project-oversize-programs": ["Route certainty", "Permit control", "Risk-managed execution"],
};

const ES_PRIORITY_TAGS: Partial<Record<SubServiceSection["key"], string[]>> = {
  expedited: ["Deadline-first", "Rapid handoff", "Escalation ready"],
  "specialized-vehicle-programs": ["Equipment-fit", "Route-feasible", "Constraint-controlled"],
};

const SHIPPER_FAQS_BY_TYPE: Record<
  SubServiceSection["key"],
  {
    title: string;
    items: Array<{ q: string; a: string }>;
  }
> = {
  "dry-van": {
    title: "Dry Van shipper FAQs",
    items: [
      {
        q: "What details do you need to return a precise quote?",
        a: "Lane, pickup and delivery windows, pallet count, dimensions, total weight, and any dock constraints or appointment rules.",
      },
      {
        q: "Can you support cross-border dry van execution?",
        a: "Yes. We coordinate CA-US-MX dry van lanes with documentation-ready handoff and milestone visibility across border transitions.",
      },
      {
        q: "How are legal fit and payload confirmed?",
        a: "Published specs are planning ranges. Final legal fit is confirmed at dispatch using route, axle configuration, and equipment details.",
      },
    ],
  },
  flatbed: {
    title: "Flatbed shipper FAQs",
    items: [
      {
        q: "When should flatbed be selected?",
        a: "Use flatbed when freight requires side or top loading, exceeds van dimensions, or needs open-deck securement controls.",
      },
      {
        q: "How do you reduce on-site delays?",
        a: "We confirm site readiness, loading method, securement requirements, and appointment windows before dispatch release.",
      },
      {
        q: "Can flatbed run cross-border?",
        a: "Yes. We coordinate mode-specific handling and compliance requirements for cross-border project and industrial freight.",
      },
    ],
  },
  "step-deck": {
    title: "Step Deck shipper FAQs",
    items: [
      {
        q: "When should step deck be selected over flatbed?",
        a: "Use step deck when load height exceeds flatbed legal limits or when the drop-deck configuration improves route feasibility.",
      },
      {
        q: "How do you confirm deck fit for step deck?",
        a: "We verify dimensions, weight distribution, and center-of-gravity against the step deck configuration before dispatch.",
      },
      {
        q: "Can step deck run cross-border?",
        a: "Yes. We coordinate mode-specific handling and compliance for cross-border project and industrial freight.",
      },
    ],
  },
  "rgn-oversize": {
    title: "RGN (Oversize) shipper FAQs",
    items: [
      {
        q: "What shipments need RGN or oversize handling?",
        a: "Freight exceeding legal dimensions, axle limits, or loading tolerances that require specialized deck and permit planning.",
      },
      {
        q: "How do permits and routing get managed?",
        a: "Permit sequencing and route validation are integrated into pre-move planning to protect timeline and compliance.",
      },
      {
        q: "How do you control heavy-haul risk?",
        a: "Execution is governed through milestone checkpoints, stakeholder alignment, and proactive exception escalation.",
      },
    ],
  },
  "roll-tite-conestoga": {
    title: "Roll-Tite / Conestoga shipper FAQs",
    items: [
      {
        q: "Why choose Conestoga over flatbed?",
        a: "Conestoga keeps open-deck loading flexibility while adding weather protection for freight sensitive to exposure.",
      },
      {
        q: "Is it suitable for high-value shipments?",
        a: "Yes. It is a strong fit where handling control and in-transit protection are both operational requirements.",
      },
      {
        q: "What details are needed before dispatch?",
        a: "Commodity sensitivity, loading method, site constraints, timeline requirements, and status cadence expectations.",
      },
    ],
  },
  expedited: {
    title: "Expedited shipper FAQs",
    items: [
      {
        q: "What details speed up expedited quoting?",
        a: "Provide ready time, latest acceptable delivery time, dimensions/weight, and pickup-delivery constraints with escalation contacts.",
      },
      {
        q: "When is expedited the right mode?",
        a: "Use it when delay risk impacts production, customer recovery, or contractual service commitments.",
      },
      {
        q: "How is timeline risk managed during transit?",
        a: "Execution uses milestone-based updates with proactive escalation so teams can make decisions before a missed commitment occurs.",
      },
    ],
  },
  "specialized-vehicle-programs": {
    title: "Specialized program FAQs",
    items: [
      {
        q: "What information is required before planning starts?",
        a: "Verified dimensions, weight profile, handling method, site access constraints, and required timeline windows.",
      },
      {
        q: "Why are route and access checks important?",
        a: "They reduce avoidable delays by validating clearance, turning constraints, and loading conditions before dispatch.",
      },
      {
        q: "How do you reduce risk on specialized moves?",
        a: "By aligning equipment fit, route feasibility, permit constraints, and milestone ownership in one execution plan.",
      },
    ],
  },
  "canada-us": {
    title: "Cross-border guidance",
    items: [],
  },
  "mexico-cross-border": {
    title: "Cross-border guidance",
    items: [],
  },
  "ocean-freight": {
    title: "Cross-border guidance",
    items: [],
  },
  "air-freight": {
    title: "Cross-border guidance",
    items: [],
  },
  "warehousing-distribution": {
    title: "Value-added guidance",
    items: [],
  },
  "managed-capacity": {
    title: "Value-added guidance",
    items: [],
  },
  "dedicated-contract": {
    title: "Value-added guidance",
    items: [],
  },
  "project-oversize-programs": {
    title: "Value-added guidance",
    items: [],
  },
};

const PILL_ACCENTS_BY_TYPE: Record<SubServiceSection["key"], string[]> = {
  "dry-van": [
    // Requested: grey outline pill near top-left around intro start.
    "left-[10%] top-[4.4%] h-9 w-36 border border-slate-300/55 bg-transparent",
    // Soft brand fills for luxury depth.
    "right-[10%] top-[23.4%] h-8 w-32 border border-transparent bg-[rgba(220,38,38,0.10)]",
    "left-[15%] top-[27%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
    // Neutral outline near lower right.
    "right-[11%] bottom-[2.65%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
  ],
  flatbed: [
    "left-[10%] top-[3.9%] h-9 w-36 border border-slate-300/50 bg-transparent",
    "right-[10%] top-[27.4%] h-8 w-32 border border-transparent bg-[rgba(217,119,6,0.11)]",
    "left-[15%] top-[31%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
    "right-[11%] bottom-[2.5%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
  ],
  "step-deck": [
    "left-[10%] top-[3.9%] h-9 w-36 border border-slate-300/50 bg-transparent",
    "right-[10%] top-[27%] h-8 w-32 border border-transparent bg-[rgba(59,130,246,0.11)]",
    "left-[15%] top-[31%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
    "right-[11%] bottom-[2.5%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
  ],
  "rgn-oversize": [
    "left-[10%] top-[3.9%] h-9 w-36 border border-slate-300/50 bg-transparent",
    "right-[10%] top-[27.9%] h-8 w-32 border border-transparent bg-[rgba(185,28,28,0.11)]",
    "left-[15%] top-[31%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.06)]",
    "right-[11%] bottom-[2.5%] h-9 w-42 border border-slate-300/44 bg-transparent",
  ],
  "roll-tite-conestoga": [
    "left-[10%] top-[3.9%] h-9 w-36 border border-slate-300/50 bg-transparent",
    "right-[10%] top-[23%] h-8 w-32 border border-transparent bg-[rgba(37,99,235,0.10)]",
    "left-[18%] top-[23.5%]  h-8 w-30 border border-transparent bg-[rgba(15,23,42,0.05)]",
    "right-[11%] bottom-[2.5%] h-9 w-40 border border-slate-300/42 bg-transparent",
  ],
  expedited: [
    "left-[10%] top-[3.9%] h-9 w-36 border border-slate-300/50 bg-transparent",
    "right-[10%] top-[22.8%] h-8 w-34 border border-transparent bg-[rgba(244,63,94,0.11)]",
    "left-[15.5%] top-[31.5%]  h-8 w-30 border border-transparent bg-[rgba(15,23,42,0.06)]",
    "right-[11%] bottom-[2.7%] h-8 w-34 border border-slate-300/42 bg-transparent",
  ],
  "specialized-vehicle-programs": [
    "left-[10%] top-[3.9%] h-9 w-36 border border-slate-300/50 bg-transparent",
    "right-[10%] top-[25.35%] h-8 w-38 border border-transparent bg-[rgba(124,58,237,0.11)]",
    "left-[15.3%] top-[31%] h-8 w-31 border border-transparent bg-[rgba(15,23,42,0.06)]",
    "right-[10.5%] bottom-[2.5%] h-8 w-36 border border-slate-300/42 bg-transparent",
  ],
  "canada-us": [
    "left-[10%] top-[2.4%] h-9 w-40 border border-slate-300/56 bg-transparent",
    "left-[16%] top-[24.5%] h-7 w-28 border border-transparent bg-[rgba(2,6,23,0.06)]",
    "right-[11%] bottom-[2.5%] h-8 w-32 border border-slate-300/44 bg-transparent",
  ],
  "mexico-cross-border": [
    "left-[9%] top-[2.5%] h-9 w-36 border border-slate-300/52 bg-transparent",
    "left-[17%] top-[24%] h-8 w-30 border border-transparent bg-[rgba(2,6,23,0.05)]",
    "right-[10.5%] bottom-[2.5%] h-8 w-34 border border-slate-300/42 bg-transparent",
  ],
  "ocean-freight": [
    "left-[9%] top-[2.5%] h-9 w-35 border border-slate-300/52 bg-transparent",
    "left-[16%] top-[24%] h-8 w-30 border border-transparent bg-[rgba(15,23,42,0.05)]",
    "right-[11%] bottom-[2.5%] h-8 w-33 border border-slate-300/42 bg-transparent",
  ],
  "air-freight": [
    "left-[9.5%] top-[2.5%] h-9 w-34 border border-slate-300/50 bg-transparent",
    "left-[17%] top-[24%] h-7 w-28 border border-transparent bg-[rgba(15,23,42,0.05)]",
    "right-[10.5%] bottom-[2.5%] h-8 w-30 border border-slate-300/42 bg-transparent",
  ],
  "warehousing-distribution": [
    "left-[9%] top-[2.5%] h-9 w-38 border border-slate-300/52 bg-transparent",
    "left-[16%] top-[24%] h-8 w-30 border border-transparent bg-[rgba(16,185,129,0.09)]",
    "right-[11%] bottom-[2.5%] h-8 w-34 border border-slate-300/42 bg-transparent",
  ],
  "managed-capacity": [
    "left-[9%] top-[2.5%] h-9 w-36 border border-slate-300/52 bg-transparent",
    "left-[17%] top-[24%] h-8 w-30 border border-transparent bg-[rgba(59,130,246,0.09)]",
    "right-[11%] bottom-[2.5%] h-8 w-32 border border-slate-300/42 bg-transparent",
  ],
  "dedicated-contract": [
    "left-[9%] top-[2.5%] h-9 w-35 border border-slate-300/52 bg-transparent",
    "left-[17%] top-[24%] h-8 w-30 border border-transparent bg-[rgba(99,102,241,0.09)]",
    "right-[11%] bottom-[2.5%] h-8 w-34 border border-slate-300/42 bg-transparent",
  ],
  "project-oversize-programs": [
    "left-[9%] top-[2.5%] h-9 w-40 border border-slate-300/52 bg-transparent",
    "left-[16%] top-[24%] h-8 w-30 border border-transparent bg-[rgba(245,158,11,0.1)]",
    "right-[10.5%] bottom-[2.5%] h-8 w-36 border border-slate-300/42 bg-transparent",
  ],
};

const SECTION_THEME: Record<
  SubServiceSection["key"],
  {
    accent: string;
    glow: string;
    sectionBase: string;
    sectionVeil: string;
    auraA: string;
    auraB: string;
    gridStroke: string;
    gridOpacity: number;
    panelBg: string;
    imageWash: string;
  }
> = {
  "dry-van": {
    accent: "#dc2626",
    glow: "rgba(220,38,38,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(248,250,252,0.985),rgba(244,247,251,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(960px_460px_at_52%_-10%,rgba(220,38,38,0.04),transparent_66%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_14%_12%,rgba(220,38,38,0.082),transparent_60%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_92%_86%,rgba(37,99,235,0.044),transparent_66%)]",
    gridStroke: "rgba(15,23,42,0.018)",
    gridOpacity: 0.4,
    panelBg: "bg-white/80",
    imageWash: "bg-[linear-gradient(120deg,rgba(220,38,38,0.16),rgba(2,6,23,0.10))]",
  },
  flatbed: {
    accent: "#d97706",
    glow: "rgba(217,119,6,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_480px_at_42%_-12%,rgba(217,119,6,0.043),transparent_68%)]",
    auraA: "bg-[radial-gradient(940px_560px_at_18%_8%,rgba(217,119,6,0.082),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_520px_at_88%_86%,rgba(2,132,199,0.04),transparent_67%)]",
    gridStroke: "rgba(120,53,15,0.02)",
    gridOpacity: 0.38,
    panelBg: "bg-[rgba(255,255,255,0.8)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(217,119,6,0.15),rgba(2,6,23,0.10))]",
  },
  "step-deck": {
    accent: "#2563eb",
    glow: "rgba(37,99,235,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_480px_at_48%_-12%,rgba(37,99,235,0.043),transparent_68%)]",
    auraA: "bg-[radial-gradient(940px_560px_at_18%_8%,rgba(37,99,235,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_520px_at_88%_86%,rgba(2,132,199,0.04),transparent_67%)]",
    gridStroke: "rgba(30,64,175,0.02)",
    gridOpacity: 0.38,
    panelBg: "bg-[rgba(255,255,255,0.8)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(37,99,235,0.15),rgba(2,6,23,0.10))]",
  },
  "rgn-oversize": {
    accent: "#b91c1c",
    glow: "rgba(185,28,28,0.11)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_55%_-14%,rgba(185,28,28,0.047),transparent_68%)]",
    auraA: "bg-[radial-gradient(940px_560px_at_18%_8%,rgba(185,28,28,0.086),transparent_62%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_90%_84%,rgba(15,23,42,0.06),transparent_68%)]",
    gridStroke: "rgba(127,29,29,0.02)",
    gridOpacity: 0.38,
    panelBg: "bg-[rgba(255,255,255,0.8)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(185,28,28,0.18),rgba(2,6,23,0.12))]",
  },
  "roll-tite-conestoga": {
    accent: "#2563eb",
    glow: "rgba(37,99,235,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_48%_-10%,rgba(37,99,235,0.043),transparent_68%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_10%,rgba(37,99,235,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_88%_86%,rgba(220,38,38,0.038),transparent_68%)]",
    gridStroke: "rgba(30,64,175,0.019)",
    gridOpacity: 0.38,
    panelBg: "bg-[rgba(255,255,255,0.8)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(37,99,235,0.16),rgba(2,6,23,0.12))]",
  },
  expedited: {
    accent: "#e11d48",
    glow: "rgba(225,29,72,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(252,248,251,0.99),rgba(250,244,248,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_48%_-11%,rgba(225,29,72,0.047),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_10%,rgba(225,29,72,0.082),transparent_62%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_89%_86%,rgba(99,102,241,0.036),transparent_68%)]",
    gridStroke: "rgba(159,18,57,0.02)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(225,29,72,0.16),rgba(15,23,42,0.1))]",
  },
  "specialized-vehicle-programs": {
    accent: "#7c3aed",
    glow: "rgba(124,58,237,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(249,248,255,0.99),rgba(245,244,252,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_49%_-12%,rgba(124,58,237,0.046),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_9%,rgba(124,58,237,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_560px_at_88%_85%,rgba(2,132,199,0.033),transparent_68%)]",
    gridStroke: "rgba(91,33,182,0.02)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(124,58,237,0.16),rgba(15,23,42,0.11))]",
  },
  "canada-us": {
    accent: "#2563eb",
    glow: "rgba(37,99,235,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(248,251,255,0.99),rgba(243,248,255,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_48%_-12%,rgba(37,99,235,0.048),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_14%_9%,rgba(37,99,235,0.082),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_560px_at_89%_86%,rgba(14,116,144,0.04),transparent_68%)]",
    gridStroke: "rgba(30,64,175,0.019)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(37,99,235,0.16),rgba(15,23,42,0.1))]",
  },
  "mexico-cross-border": {
    accent: "#dc2626",
    glow: "rgba(220,38,38,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(255,250,250,0.99),rgba(252,246,246,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_50%_-12%,rgba(220,38,38,0.045),transparent_67%)]",
    auraA: "bg-[radial-gradient(940px_520px_at_18%_10%,rgba(220,38,38,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_88%_86%,rgba(30,64,175,0.038),transparent_68%)]",
    gridStroke: "rgba(127,29,29,0.02)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(220,38,38,0.15),rgba(15,23,42,0.11))]",
  },
  "ocean-freight": {
    accent: "#0e7490",
    glow: "rgba(14,116,144,0.11)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(248,251,252,0.99),rgba(242,248,250,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_48%_-12%,rgba(14,116,144,0.048),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_9%,rgba(14,116,144,0.082),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_560px_at_88%_85%,rgba(37,99,235,0.038),transparent_68%)]",
    gridStroke: "rgba(15,118,110,0.02)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(14,116,144,0.17),rgba(2,6,23,0.12))]",
  },
  "air-freight": {
    accent: "#0284c7",
    glow: "rgba(2,132,199,0.11)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(248,252,255,0.99),rgba(244,249,253,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_48%_-10%,rgba(2,132,199,0.045),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_14%_9%,rgba(2,132,199,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(860px_560px_at_89%_86%,rgba(220,38,38,0.035),transparent_68%)]",
    gridStroke: "rgba(3,105,161,0.019)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(2,132,199,0.16),rgba(15,23,42,0.11))]",
  },
  "warehousing-distribution": {
    accent: "#059669",
    glow: "rgba(5,150,105,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(248,252,250,0.99),rgba(242,250,247,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_49%_-12%,rgba(5,150,105,0.045),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_9%,rgba(16,185,129,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_560px_at_88%_85%,rgba(2,132,199,0.035),transparent_68%)]",
    gridStroke: "rgba(5,150,105,0.02)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(5,150,105,0.16),rgba(15,23,42,0.11))]",
  },
  "managed-capacity": {
    accent: "#2563eb",
    glow: "rgba(37,99,235,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(248,251,255,0.99),rgba(242,248,255,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_49%_-12%,rgba(37,99,235,0.045),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_9%,rgba(59,130,246,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_560px_at_88%_85%,rgba(16,185,129,0.033),transparent_68%)]",
    gridStroke: "rgba(30,64,175,0.019)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(37,99,235,0.16),rgba(15,23,42,0.11))]",
  },
  "dedicated-contract": {
    accent: "#4f46e5",
    glow: "rgba(79,70,229,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(249,250,255,0.99),rgba(244,246,255,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_49%_-12%,rgba(79,70,229,0.045),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_9%,rgba(99,102,241,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_560px_at_88%_85%,rgba(30,64,175,0.033),transparent_68%)]",
    gridStroke: "rgba(79,70,229,0.02)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(79,70,229,0.16),rgba(15,23,42,0.11))]",
  },
  "project-oversize-programs": {
    accent: "#d97706",
    glow: "rgba(217,119,6,0.1)",
    sectionBase: "bg-[linear-gradient(180deg,rgba(253,251,247,0.99),rgba(250,246,239,0.97))]",
    sectionVeil:
      "bg-[radial-gradient(980px_500px_at_49%_-12%,rgba(217,119,6,0.045),transparent_67%)]",
    auraA: "bg-[radial-gradient(920px_520px_at_15%_9%,rgba(245,158,11,0.08),transparent_62%)]",
    auraB: "bg-[radial-gradient(900px_560px_at_88%_85%,rgba(185,28,28,0.03),transparent_68%)]",
    gridStroke: "rgba(180,83,9,0.02)",
    gridOpacity: 0.39,
    panelBg: "bg-[rgba(255,255,255,0.82)]",
    imageWash: "bg-[linear-gradient(120deg,rgba(217,119,6,0.16),rgba(15,23,42,0.11))]",
  },
};

function ContentSection({
  title,
  intro,
  items,
  accent,
}: {
  title: string;
  intro: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="mt-8">
      <h3 className="text-[1.18rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.28rem]">
        {title}
      </h3>
      <p className="mt-2.5 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
        {intro}
      </p>
      <ul className="mt-4.5 space-y-2.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            <span className="text-[14px] leading-[1.65] text-[color:var(--color-muted-light)] sm:text-[14.5px]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceSection({
  section,
  serviceKey,
  index: _index,
}: {
  section: SubServiceSection;
  serviceKey: ServiceKey;
  index: number;
}) {
  const sectionId = `section-${section.key}`;
  const theme = SECTION_THEME[section.key];
  const contextualRelated = CONTEXTUAL_RELATED_BY_TYPE[section.key];
  const conversionSignals = CONVERSION_SIGNALS_BY_TYPE[section.key];
  const shipperFaqs = SHIPPER_FAQS_BY_TYPE[section.key];
  const pillAccents = PILL_ACCENTS_BY_TYPE[section.key];
  const borderPriorities = BORDER_PRIORITIES_BY_TYPE[section.key] ?? [];
  const isCrossBorderService = serviceKey === "cross-border";
  const isCrossBorderMode =
    section.key === "canada-us" ||
    section.key === "mexico-cross-border" ||
    section.key === "ocean-freight" ||
    section.key === "air-freight";
  const isValueAddedMode =
    section.key === "warehousing-distribution" ||
    section.key === "managed-capacity" ||
    section.key === "dedicated-contract" ||
    section.key === "project-oversize-programs";
  const isSpecializedMode =
    section.key === "expedited" || section.key === "specialized-vehicle-programs";
  const flowSteps = CROSS_BORDER_FLOW_STEPS[section.key] ?? [];
  const valueAddedOutcomes = VALUE_ADDED_OUTCOMES[section.key] ?? [];
  const esPriorityTags = ES_PRIORITY_TAGS[section.key] ?? [];
  const freightFit = section.freightFit;
  const showRelated = section.showRelated !== false;

  return (
    <section
      id={sectionId}
      className={cn("relative overflow-hidden transition-colors duration-500", theme.sectionBase)}
      style={scrollMarginTopStyle}
    >
      {/* Premium background with section-specific light language */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className={cn("absolute inset-0", theme.sectionVeil)} />
        <div className={cn("absolute inset-0", theme.auraA)} />
        <div className={cn("absolute inset-0", theme.auraB)} />

        {/* Decorative pill accents: balanced filled + outline */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {pillAccents.map((pillClass, idx) => (
            <div
              key={`${section.key}-pill-${idx}`}
              className={cn("absolute rounded-full", pillClass)}
            />
          ))}
        </div>

        {/* Subtle engineering line texture */}
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1600 1000"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={`grid-pattern-${section.key}`}
              x="0"
              y="0"
              width="96"
              height="96"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 96 0 L 0 0 0 96" fill="none" stroke={theme.gridStroke} strokeWidth="1" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#grid-pattern-${section.key})`}
            opacity={theme.gridOpacity}
          />
        </svg>
      </div>

      <Container className="site-page-container relative z-10 py-12 sm:py-14 lg:py-16">
        <div className="relative">
          {/* Intro row */}
          <div
            className={cn(
              "grid gap-0 border-y border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-stretch",
              isCrossBorderMode &&
                "bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(59,130,246,0.01))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
              isValueAddedMode &&
                "bg-[linear-gradient(180deg,rgba(248,250,252,0.72),rgba(255,255,255,0.45))] backdrop-blur-[1px]",
              isSpecializedMode &&
                "bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(124,58,237,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)]",
            )}
          >
            <div
              className={cn(
                theme.panelBg,
                "px-6 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-10",
                isCrossBorderMode ? "lg:order-1 lg:col-span-6" : "lg:col-span-6",
              )}
            >
              <div className="mb-3 h-[2px] w-14" style={{ backgroundColor: theme.accent }} />
              <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                {section.label}
              </div>
              <h2 className="mt-2.5 text-[1.78rem] leading-[1.14] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[2.08rem]">
                {section.title}
              </h2>
              <p className="mt-4 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                {section.description}
              </p>
              {section.detailParagraph ? (
                <p className="mt-4 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                  {section.detailParagraph}
                </p>
              ) : null}

              {isCrossBorderMode ? (
                <div className="mt-4 flex items-center gap-2.5">
                  {flowSteps.map((step, idx) => (
                    <div key={step} className="flex items-center gap-2.5">
                      <span
                        className="inline-flex h-5 min-w-6 items-center justify-center rounded-md px-1.5 text-[10px] font-semibold text-white"
                        style={{ backgroundColor: theme.accent }}
                      >
                        {step}
                      </span>
                      {idx < flowSteps.length - 1 ? (
                        <span
                          className="h-px w-5 bg-[color:var(--color-border-light)]"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {isValueAddedMode ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {valueAddedOutcomes.map((outcome) => (
                    <span
                      key={outcome}
                      className="inline-flex items-center rounded-md border border-[color:var(--color-border-light)]/80 bg-white/88 px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-muted-light)]"
                    >
                      {outcome}
                    </span>
                  ))}
                </div>
              ) : null}

              {isSpecializedMode ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {esPriorityTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-[color:var(--color-border-light)] bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-muted-light)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                "relative border-t border-[color:var(--color-border-light)]/65 bg-white/60 lg:border-t-0",
                isCrossBorderMode
                  ? "lg:order-2 lg:col-span-6 lg:border-l"
                  : "lg:col-span-6 lg:border-l",
              )}
            >
              {freightFit ? (
                <div className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
                  <FreightFitGuideMedia
                    diagram={freightFit.diagram}
                    diagramAlt={freightFit.diagramAlt}
                    specs={freightFit.specs}
                    disclaimer={freightFit.disclaimer}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "relative h-[260px] w-full sm:h-[300px]",
                    isCrossBorderMode ? "lg:h-[380px]" : "lg:h-full",
                  )}
                >
                  <SectionImage
                    src={section.image}
                    alt={section.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className={cn("absolute inset-0", overlayClass(section.overlay))} />
                  <div className={cn("absolute inset-0", theme.imageWash)} />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(560px 320px at 50% 50%, ${theme.glow}, transparent 72%)`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Content + conversion row */}
          <div
            className={cn(
              "grid gap-0 border-b border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-stretch",
              isValueAddedMode &&
                "bg-[linear-gradient(90deg,rgba(15,23,42,0.02),rgba(255,255,255,0.0)_35%,rgba(15,23,42,0.02))]",
              isSpecializedMode &&
                "bg-[linear-gradient(90deg,rgba(244,114,182,0.03),rgba(255,255,255,0.0)_35%,rgba(99,102,241,0.03))]",
            )}
          >
            <div className="order-1 bg-white/64 px-5 py-6 sm:px-8 sm:py-8 md:px-9 md:py-9 lg:order-1 lg:col-span-7 lg:px-9 lg:py-10">
              {freightFit ? (
                <FreightFitGuideRecommendations
                  title={freightFit.title}
                  intro={freightFit.intro}
                  rules={freightFit.rules}
                  onRecommendationClick={(rule, href) =>
                    trackCtaClick({
                      ctaId: `service_section_fit_${serviceKey}_${section.key}_${toCtaSlug(rule.recommendation)}`,
                      location: `service_section_fit:${serviceKey}:${section.key}`,
                      destination: href,
                      label: rule.recommendation,
                    })
                  }
                />
              ) : section.whenToUse ? (
                <ContentSection
                  title="When to use this Service"
                  intro={section.whenToUse.intro}
                  items={section.whenToUse.items}
                  accent={theme.accent}
                />
              ) : null}

              {section.howToUse && (
                <ContentSection
                  title="How to use this Service"
                  intro={section.howToUse.intro}
                  items={section.howToUse.items}
                  accent={theme.accent}
                />
              )}

              {section.capabilities && (
                <ContentSection
                  title={
                    freightFit
                      ? "Operational Coverage & Service Standards"
                      : "Capabilities and Options"
                  }
                  intro={section.capabilities.intro}
                  items={section.capabilities.items}
                  accent={theme.accent}
                />
              )}
            </div>

            <div
              className={cn(
                "order-2 border-b border-[color:var(--color-border-light)]/65 px-5 py-6 sm:px-8 sm:py-8 md:px-9 md:py-9 lg:order-2 lg:col-span-5 lg:border-t-0 lg:border-b-0 lg:border-l lg:px-9 lg:py-10",
                isCrossBorderMode
                  ? "bg-[linear-gradient(180deg,rgba(248,252,255,0.78),rgba(240,249,255,0.62))]"
                  : isValueAddedMode
                    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,250,252,0.72))]"
                    : isSpecializedMode
                      ? "bg-[linear-gradient(180deg,rgba(252,248,251,0.8),rgba(247,243,255,0.68))]"
                      : "bg-white/60",
              )}
            >
              <div className="flex h-full flex-col gap-4">
                {/* CTA */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-lg",
                    "border border-[color:var(--color-border-light)]",
                    isCrossBorderMode
                      ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.93),rgba(239,246,255,0.74))]"
                      : isValueAddedMode
                        ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.74))]"
                        : isSpecializedMode
                          ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.93),rgba(250,245,255,0.74))]"
                          : "bg-white/82",
                    "p-4 sm:p-5 md:p-6",
                  )}
                >
                  <div className="relative">
                    <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                      Get pricing and capacity for this mode
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-muted-light)]">
                      Share your lane requirements and we will return a structured quote with
                      equipment fit, timing expectations, and operating assumptions.
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {conversionSignals.map((signal) => (
                        <li
                          key={signal}
                          className="flex items-center gap-2 text-xs text-[color:var(--color-muted-light)]"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: theme.accent }}
                          />
                          {signal}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 grid gap-3">
                      <Link
                        href={section.ctas.primary.href}
                        onClick={() =>
                          trackCtaClick({
                            ctaId: section.ctas.primary.ctaId,
                            location: `service_section:${serviceKey}:${section.key}`,
                            destination: section.ctas.primary.href,
                            label: section.ctas.primary.label,
                          })
                        }
                        className={cn(
                          "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold text-white md:h-11",
                          "shadow-[0_8px_22px_rgba(2,6,23,0.18)]",
                          "focus-ring-light",
                        )}
                        style={{ backgroundColor: theme.accent }}
                      >
                        {section.ctas.primary.label}
                      </Link>

                      {section.ctas.secondary ? (
                        <Link
                          href={section.ctas.secondary.href}
                          onClick={() =>
                            trackCtaClick({
                              ctaId: section.ctas.secondary!.ctaId,
                              location: `service_section:${serviceKey}:${section.key}`,
                              destination: section.ctas.secondary!.href,
                              label: section.ctas.secondary!.label,
                            })
                          }
                          className={cn(
                            "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold md:h-11",
                            "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                            "focus-ring-light",
                          )}
                        >
                          {section.ctas.secondary.label}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Why shippers trust this mode (hidden when trust is merged into execution block below, e.g. Dry Van) */}
                {!freightFit ? (
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-lg",
                      "border border-[color:var(--color-border-light)]",
                      isCrossBorderMode
                        ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(241,245,249,0.72))]"
                        : isValueAddedMode
                          ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(243,244,246,0.72))]"
                          : isSpecializedMode
                            ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,244,255,0.72))]"
                            : "bg-white/78",
                      "p-4 sm:p-5 md:p-6",
                    )}
                  >
                    <div className="relative">
                      <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                        {section.trustSnippet.title}
                      </h3>
                      <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-muted-light)]">
                        {section.trustSnippet.body}
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Practical Q&A card (non-redundant decision support) */}
                {shipperFaqs.items.length > 0 ? (
                  <div
                    className={cn(
                      "relative flex-1 overflow-hidden rounded-lg",
                      "border border-[color:var(--color-border-light)]",
                      isCrossBorderMode
                        ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,246,255,0.72))]"
                        : isValueAddedMode
                          ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(243,244,246,0.72))]"
                          : isSpecializedMode
                            ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,244,255,0.72))]"
                            : "bg-white/78",
                      "p-4 sm:p-5 md:p-6",
                    )}
                  >
                    <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                      {shipperFaqs.title}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {shipperFaqs.items.map((item) => (
                        <div
                          key={item.q}
                          className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3"
                        >
                          <div className="text-[13px] font-semibold text-[color:var(--color-text-light)]">
                            {item.q}
                          </div>
                          <div className="mt-1 text-[12px] leading-[1.58] text-[color:var(--color-muted-light)]">
                            {item.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isCrossBorderService &&
                shipperFaqs.items.length === 0 &&
                borderPriorities.length > 0 ? (
                  <div
                    className={cn(
                      "relative flex-1 overflow-hidden rounded-lg",
                      "border border-[color:var(--color-border-light)]",
                      "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,246,255,0.72))]",
                      "p-4 sm:p-5 md:p-6",
                    )}
                  >
                    <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                      Program design priorities
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.62] text-[color:var(--color-muted-light)]">
                      Core decisions we align before launch to reduce border and handoff variance.
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {borderPriorities.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: theme.accent }}
                            aria-hidden="true"
                          />
                          <span className="text-[12.5px] leading-[1.62] text-[color:var(--color-muted-light)]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Utility row (balanced lower closure) */}
          <div className="grid gap-0 border-b border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-stretch">
            <div
              className={cn(
                "bg-white/62 px-6 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-9",
                showRelated ? "lg:col-span-6" : "lg:col-span-12",
              )}
            >
              <div
                className={cn(
                  "h-full rounded-lg border border-[color:var(--color-border-light)] bg-white/82 p-5 sm:p-6",
                )}
              >
                <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                  {freightFit
                    ? "Execution and compliance"
                    : isCrossBorderMode
                      ? "Cross-border execution standards"
                      : isValueAddedMode
                        ? "Program standards included"
                        : isSpecializedMode
                          ? "Priority and control standards"
                          : "Execution standards included"}
                </div>
                {freightFit && section.trustSnippet?.body ? (
                  <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-muted-light)]">
                    {section.trustSnippet.body}
                  </p>
                ) : null}
                <ul className="mt-4 space-y-3">
                  {section.highlights.map((h) => (
                    <li
                      key={h.title}
                      className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3"
                    >
                      <div className="text-[14px] font-semibold text-[color:var(--color-text-light)]">
                        {h.title}
                      </div>
                      <div className="mt-1 text-[13.5px] leading-relaxed text-[color:var(--color-muted-light)]">
                        {h.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {showRelated ? (
              <div className="border-t border-[color:var(--color-border-light)]/65 bg-white/60 px-6 py-7 sm:px-8 sm:py-8 lg:col-span-6 lg:border-t-0 lg:border-l lg:px-9 lg:py-9">
                <div
                  className={cn(
                    "h-full rounded-lg border border-[color:var(--color-border-light)] bg-white/80 p-5 sm:p-6",
                  )}
                >
                  <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                    {isCrossBorderMode
                      ? `Connected mode pairings for ${section.label}`
                      : isValueAddedMode
                        ? `Program adjacencies for ${section.label}`
                        : isSpecializedMode
                          ? `Critical-support services for ${section.label}`
                          : `Related for ${section.label}`}
                  </h3>
                  <p className="mt-1 text-xs text-[color:var(--color-muted-light)]">
                    {isCrossBorderMode
                      ? "Mode combinations frequently used to balance urgency, landed cost, and border reliability."
                      : isValueAddedMode
                        ? "Adjacent services that improve end-to-end program performance and governance."
                        : isSpecializedMode
                          ? "Service pairings commonly used to protect urgent timelines and high-constraint shipments."
                          : "Suggestions based on equipment fit, risk profile, and shipment constraints."}
                  </p>
                  <div className="mt-4 grid gap-2.5">
                    {contextualRelated.map((service, idx) => {
                      const colors = isCrossBorderMode
                        ? [
                            "bg-blue-500/10 text-blue-700",
                            "bg-cyan-500/10 text-cyan-700",
                            "bg-slate-500/12 text-slate-700",
                            "bg-indigo-500/10 text-indigo-700",
                          ]
                        : isValueAddedMode
                          ? [
                              "bg-emerald-500/10 text-emerald-700",
                              "bg-indigo-500/10 text-indigo-700",
                              "bg-amber-500/10 text-amber-700",
                              "bg-slate-500/12 text-slate-700",
                            ]
                          : isSpecializedMode
                            ? [
                                "bg-rose-500/10 text-rose-700",
                                "bg-violet-500/10 text-violet-700",
                                "bg-fuchsia-500/10 text-fuchsia-700",
                                "bg-slate-500/12 text-slate-700",
                              ]
                            : [
                                "bg-pink-500/10 text-pink-600",
                                "bg-red-500/10 text-red-600",
                                "bg-blue-500/10 text-blue-600",
                                "bg-green-500/10 text-green-600",
                              ];
                      const colorClass = colors[idx % colors.length];

                      return (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() =>
                            trackCtaClick({
                              ctaId: `service_section_related_${serviceKey}_${section.key}_${toCtaSlug(service.label)}`,
                              location: `service_section_related:${serviceKey}:${section.key}`,
                              destination: service.href,
                              label: service.label,
                            })
                          }
                          className={cn(
                            "group flex items-center gap-3 rounded-xl border border-[color:var(--color-border-light)]",
                            "bg-white px-4 py-3 transition-all",
                            "hover:border-[color:var(--color-brand-500)]/40 hover:bg-[color:var(--color-surface-0-light)]",
                            "hover:shadow-[0_4px_12px_rgba(2,6,23,0.06)]",
                            "focus-ring-light",
                          )}
                        >
                          <div
                            className={cn(
                              "h-8 w-8 shrink-0 rounded-lg",
                              colorClass,
                              "flex items-center justify-center font-semibold",
                            )}
                          >
                            <span className="text-xs">●</span>
                          </div>
                          <div>
                            <div className="text-[14px] font-semibold text-[color:var(--color-text-light)] group-hover:text-[color:var(--color-brand-600)]">
                              {service.label}
                            </div>
                            <div className="mt-0.5 text-[11.5px] leading-relaxed text-[color:var(--color-muted-light)]">
                              {service.reason}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
