/**
 * FAQ page content: categories, questions/answers, and shipping guides.
 * Structured for accordion UI and hash-linked category sidebar.
 */

export type FaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export type FaqCategory = Readonly<{
  id: string;
  label: string;
  items: readonly FaqItem[];
}>;

export type ShippingGuide = Readonly<{
  id: string;
  title: string;
  description: string;
  points: readonly string[];
}>;

export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    id: "services",
    label: "Our Services",
    items: [
      {
        question: "What freight modes does NPT Logistics offer?",
        answer:
          "We offer full truckload (TL), less-than-truckload (LTL), intermodal, expedited and specialized, temperature-controlled, hazmat, and cross-border and global services. Each mode is designed for specific lane, timeline, and compliance needs—we help you match the right mode to your shipment.",
      },
      {
        question: "How do I get a quote?",
        answer:
          "Request a quote through our website or contact operations. For the fastest response, provide lane (origin and destination), weight and dimensions, pickup and delivery windows, and any special requirements (temperature, hazmat, customs). We typically respond with a structured quote within one business cycle.",
      },
      {
        question: "Do you handle cross-border shipments?",
        answer:
          "Yes. We coordinate Canada–U.S. and Mexico cross-border moves with documentation readiness, broker handoffs, and milestone visibility. We also support ocean and air freight for international lanes. Tell us your origin, destination, and commodity and we’ll outline the process and timing.",
      },
      {
        question: "What is your coverage area?",
        answer:
          "We operate across North America with offices and capacity in Canada, the U.S., and Mexico. We provide a single point of accountability for domestic and cross-border lanes rather than handing you off between regional brokers.",
      },
    ],
  },
  {
    id: "safety-compliance",
    label: "Safety & Compliance",
    items: [
      {
        question: "How do you ensure carrier safety and compliance?",
        answer:
          "We vet carriers before dispatch: current insurance, authority, and safety ratings are verified. No load moves without documented compliance. We monitor safety scores and maintain audit-ready documentation so you have one accountable partner.",
      },
      {
        question: "Can you handle hazmat or regulated freight?",
        answer:
          "Yes. We move hazardous and regulated freight with the required documentation, placarding, and carrier credentials. Share your commodity and UN/class and we’ll confirm capability and compliance steps before booking.",
      },
      {
        question: "What documentation do you provide?",
        answer:
          "We provide BOLs, PODs, and any lane-specific documents (e.g. customs, temperature logs). Documentation is stored and available for audit. We can align with your record-keeping and EDI/API needs where applicable.",
      },
    ],
  },
  {
    id: "tracking-operations",
    label: "Tracking & Operations",
    items: [
      {
        question: "How do I track my shipment?",
        answer:
          "Use our Track Shipment tool on the website with your pro or reference number. You’ll see milestone-level status and can contact operations for details. We provide proactive updates at key stages so you’re not left wondering.",
      },
      {
        question: "Who do I contact for updates or issues?",
        answer:
          "Your load has a single point of ownership from dispatch through delivery. Operations coverage is available so you have a clear escalation path. Contact details are provided at booking and in confirmation communications.",
      },
      {
        question: "What happens if there’s a delay or exception?",
        answer:
          "We manage exceptions with root cause, corrective action, and revised ETAs—documented and communicated. We don’t leave you in the dark; we outline what’s happening and what we’re doing to get the load back on plan.",
      },
    ],
  },
  {
    id: "billing-partners",
    label: "Billing & Partners",
    items: [
      {
        question: "How does billing work?",
        answer:
          "We issue a single invoice per load (or as agreed for dedicated programs). Payment terms are confirmed at booking. You get one statement and one relationship—no chasing multiple carriers or brokers for the same move.",
      },
      {
        question: "Do you work with freight brokers or only direct shippers?",
        answer:
          "We work with shippers, 3PLs, and brokers. Our model is built for disciplined execution and clear accountability whether you’re shipping direct or through a partner. We can align to your procurement and reporting requirements.",
      },
      {
        question: "Can we integrate with our TMS or ERP?",
        answer:
          "We can discuss EDI, API, and system integration for visibility, tenders, and documentation. Share your stack and we’ll outline what we support today and what we can roadmap.",
      },
    ],
  },
] as const;

export const FAQ_HERO = {
  title: "Frequently Asked Questions",
  subtitle:
    "How may we help? Browse common questions about our services, safety, tracking, and operations—or jump to shipping guides below.",
} as const;

export const SHIPPING_GUIDES: readonly ShippingGuide[] = [
  {
    id: "mode-selection",
    title: "Choosing the Right Freight Mode",
    description:
      "Enterprise shippers optimize cost and service by matching mode to lane, volume, and timeline. This guide outlines when to use truckload, LTL, intermodal, and specialized options.",
    points: [
      "Use full truckload (TL) when you have enough volume to fill a trailer and need minimal handling and faster transit.",
      "Use LTL when shipment size is below truckload; you pay for space used and benefit from consolidated networks.",
      "Use intermodal (rail + truck) for long-haul lanes where cost stability and capacity matter more than speed.",
      "Use expedited or specialized when deadlines are critical or freight requires dedicated equipment and handling.",
      "Match mode to your KPIs: cost per unit, on-time delivery, damage rates, and compliance requirements.",
    ],
  },
  {
    id: "quote-readiness",
    title: "Getting Quote-Ready: What to Prepare",
    description:
      "Accurate quotes depend on complete information. Prepare these details to speed response and avoid re-quotes.",
    points: [
      "Exact weight and dimensions of fully packaged freight, including pallets and any overhang.",
      "Pickup and delivery addresses plus dock or door access (loading type, appointment needs).",
      "Required dates: earliest pickup and latest acceptable delivery (or exact windows if fixed).",
      "Commodity and any special needs: temperature, hazmat, high value, customs.",
      "Volume or frequency if you’re planning recurring lanes—helps with capacity and pricing.",
    ],
  },
  {
    id: "visibility-exceptions",
    title: "Visibility and Exception Management",
    description:
      "Fortune 500–style execution relies on milestone visibility and structured exception handling.",
    points: [
      "Define the milestones that matter: tender acceptance, dispatch, in-transit checkpoints, delivery, POD.",
      "Expect proactive updates at those milestones so you’re not chasing status.",
      "Agree escalation paths and response times so exceptions are handled before they become failures.",
      "Use documented root cause and corrective action so the same issues don’t repeat.",
      "Treat visibility as a product: consistent, audit-ready, and aligned to your reporting needs.",
    ],
  },
  {
    id: "cross-border-basics",
    title: "Cross-Border Shipping Basics",
    description:
      "Canada–U.S. and Mexico moves require documentation and handoff discipline. Here’s what to plan for.",
    points: [
      "Confirm documentation requirements (BOL, customs forms, certificates) before the load is tendered.",
      "Align with your broker or customs partner so NPT and they have clear handoff and release ownership.",
      "Plan for border wait times and inspection risk in your timeline; we build buffer where it’s realistic.",
      "Use a single point of accountability for the full move so you’re not coordinating multiple parties.",
      "Define border milestones (e.g. submitted, released, delivered) so you know where the shipment stands.",
    ],
  },
  {
    id: "compliance-audit",
    title: "Compliance and Audit Readiness",
    description:
      "Regulated and audit-heavy industries need carriers that document everything and close risk at dispatch.",
    points: [
      "Verify carrier insurance, authority, and safety ratings before every load—no exceptions.",
      "Keep BOLs, PODs, and lane-specific docs in one place and retain per your policy.",
      "Use carriers that embed compliance into the workflow, not as an afterthought.",
      "Expect audit-ready documentation: consistent format, traceable, and available when you need it.",
      "Treat compliance as non-negotiable so one load never puts your program or reputation at risk.",
    ],
  },
  {
    id: "lane-planning-capacity",
    title: "Lane Planning and Capacity",
    description:
      "Predictable execution starts with how you plan lanes and when you lock capacity. Here’s how disciplined shippers approach it.",
    points: [
      "Map your high-volume and recurring lanes first; these are where committed capacity or dedicated options pay off.",
      "Share forecast and seasonality with your carrier so they can plan equipment and driver availability.",
      "Balance spot and contract: use contract for baseline volume, spot for peaks or one-off lanes.",
      "Lock capacity early for known spikes (peak season, promotions) to avoid premium spot rates and missed shipments.",
      "Review lane performance regularly—transit times, claims, on-time—and adjust mode or carrier mix by lane.",
    ],
  },
] as const;

/** FAQ page final CTA: help-oriented copy and live-agent CTA. */
export const FAQ_FINAL_CTA = {
  kicker: "Need more help?",
  title: "Couldn't find what you need above?",
  body: "Chat with our team or request a quote—we're here to help with your freight questions, quotes, and operations.",
  trustSignals: [
    "Live chat with our team",
    "Fast quote response",
    "Lane-level support",
  ] as const,
  proof: [
    { value: "≤ 15 min", label: "Initial response" },
    { value: "24/7", label: "Operations coverage" },
    { value: "CA–US–MX", label: "Lane scope" },
  ] as const,
  microCopy: "Prefer a quick call? Our team can align on your lanes and timing.",
  ctas: {
    primary: {
      label: "Contact Us",
      href: "/contact",
      ctaId: "faq_final_contact_us",
    },
    secondary: {
      label: "Speak with a live agent",
      href: "#live-chat",
      ctaId: "faq_final_speak_live_agent",
    },
  },
} as const;
