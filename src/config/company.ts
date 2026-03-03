// src/config/company.ts
export type Hub = {
  name: string;
  location: string;
};

export type CoverageRegion = {
  id: string;
  label: string;
  description: string;
};

export type OperationalHub = {
  region: string;
  description?: string;
};

export type YardLocation = {
  city: string;
  region: string; // "ON", "QC", "TX", "CA", "FL", "MX" etc.
  label: string; // "Milton, ON" for display
};

export const companyAbout = {
  hero: {
    title: "Built on Discipline. Trusted for Execution.",
    description:
      "NPT Logistics supports shippers across Canada and the U.S. with compliance-first execution, accountable communication, and lane-level control from dispatch through POD.",
    ctas: {
      primary: {
        label: "Contact Us",
        href: "/contact",
        ctaId: "about_hero_contact_us",
      },
      secondary: {
        label: "Explore Our Story",
        href: "#who-we-are",
        ctaId: "about_hero_explore_our_story",
      },
    },
  },

  whoWeAre: {
    title: "Who we are",
    subtitle: "The standard other carriers aim for.",
    body: [
      "NPT Logistics helps enterprise shippers execute with",
      "discipline, from lane planning through final POD.",
      "Every move follows accountable standards and",
      "proactive visibility. We protect service",
      "levels and scale with confidence.",
    ],
    stats: [
      { value: "10", label: "Years Experience" },
      { value: "250K+", label: "Loads moved" },
      { value: "98%", label: "On-time delivery" },
    ],
    cta: {
      label: "Explore Careers",
      href: "/careers",
      ctaId: "about_who_we_are_explore_careers",
    },
  },

  missionVision: {
    sectionTitle: "Operated by principle.",
    sectionSubtitle:
      "Every load we move is governed by non-negotiable operating standards. This is how we think, how we build, and how we earn trust that compounds.",
    missionLabel: "Mission",
    missionTitle: "Execution is the product.",
    mission:
      "We exist to move freight the right way—every load dispatched on plan, tracked with full accountability, and closed with documented integrity. Not as a goal. As a daily operating standard. Our shippers don't manage us. They trust us to manage it.",
    visionLabel: "Vision",
    visionTitle: "The carrier others are measured by.",
    vision:
      "To be the logistics partner that enterprise shippers benchmark their entire network against—recognized not for our size, but for the quality, consistency, and auditability of every lane we own. When the freight matters, NPT is the answer.",
    valuesTitle: "What we hold ourselves to.",
    valuesSubtitle: "Four operating principles. Non-negotiable. Built into every move.",
    principles: [
      {
        title: "Control eliminates chaos",
        body: "We engineer lanes before we move them. Appointments are confirmed, risks identified, and contingencies in place before the first wheel turns. Preparation is not overhead—it is the service.",
      },
      {
        title: "Compliance is non-negotiable",
        body: "Safety and regulatory standards are embedded into every move—not audited after the fact. We operate as if every load is under review, because the right operation has nothing to hide.",
      },
      {
        title: "Communication is a discipline",
        body: "Proactive updates, documented exceptions, and structured escalation paths. Our shippers never wonder where their freight is. Silence is not an option when freight is moving.",
      },
      {
        title: "Performance must be provable",
        body: "We track what matters, report it consistently, and use the data to raise the bar. Results are documented. Accountability is not a value statement—it is a workflow.",
      },
    ],
  },

  operatingModel: {
    title: "How every load moves.",
    subtitle: "Six steps. No variance. Every time.",
    supportingLine: "A repeatable six-step sequence, executed without variance.",
    sectionLabel: "Operating Model",
    steps: [
      {
        number: "01",
        title: "Engineer the lane.",
        body: "Pickup windows, constraints, and risk points resolved before dispatch — not discovered in transit.",
        tag: "Pre-Dispatch",
      },
      {
        number: "02",
        title: "Match the right capacity.",
        body: "Asset or brokerage selected on service fit, equipment type, and carrier history. Not just availability.",
        tag: "Capacity",
      },
      {
        number: "03",
        title: "Control the dispatch.",
        body: "Confirmed appointments, documented instructions, and check-in structure in place before origin.",
        tag: "Dispatch",
      },
      {
        number: "04",
        title: "Track with intent.",
        body: "Milestone-based monitoring, not passive GPS. Deviation triggers escalation before it becomes a problem.",
        tag: "In-Transit",
      },
      {
        number: "05",
        title: "Manage exceptions.",
        body: "Root cause, corrective action, revised ETA — documented and communicated. No scrambling. No silence.",
        tag: "Exceptions",
      },
      {
        number: "06",
        title: "Close clean.",
        body: "POD collected, documents verified, settlement closed on a defined timeline. Every load, provable.",
        tag: "Closeout",
      },
    ],
  },

  safetyCompliance: {
    sectionLabel: "Safety & Compliance",
    title: "Non-negotiable. Every load.",
    subtitle: "Disciplined standards. Documented accountability.",
    body: "We meet the rules, every time. From carrier vetting to documentation, we build trust through consistent compliance so you have one accountable partner.",
    heroImage: "/_optimized/company/safety_compliance2.webp",
    snapshot: {
      value: "Every load.",
      label: "Meets the standard.",
      supportingText:
        "Carrier credentials, insurance, and documentation are verified before dispatch. We follow the regulations so you can trust the outcome.",
    },
    policyCards: [
      {
        title: "Zero tolerance compliance",
        body: "No load moves without verified carrier, current insurance, and full documentation. We close risk at dispatch.",
      },
      {
        title: "Real time visibility",
        body: "Tracking and status from pickup to delivery. You always know where things stand.",
      },
    ],
    howWeStayAboveStandardHeading: "How we stay above standard",
    howWeStayAboveStandard: [
      "Carrier vetting before dispatch",
      "Safety score monitoring",
      "Audit ready documentation",
    ],
    certificationsHeading: "Certifications & Partners",
    certificationsSubline:
      "Verified credentials and partner programs that reinforce secure, compliant execution.",
    certificationsTagline:
      "Strategic alliances with industry-leading programs and partners strengthen our capabilities and support consistent execution across North America.",
  },

  locationsNetwork: {
    sectionLabel: "Locations & Network",
    title: "Where we operate.",
    supportingLine:
      "Integrated operations and a single point of accountability across Canada, the United States, and Mexico.",
    heroStat: "07",
    heroStatLabel: "North American Offices",
    metrics: [
      { value: "One", label: "Accountable Partner" },
      { value: "3", label: "Countries Covered" },
    ],
    capabilitiesHeading: "What you get",
    capabilities: [
      "Single team across Canada, U.S. and Mexico",
      "Customs and compliance handled for you",
      "Real-time visibility when you need it",
      "Dedicated capacity, not broker spot",
      "Audit-ready documentation",
      "Single invoice, single accountability",
    ],
    mapImage: "/_optimized/company/locationMaps.webp",
    countries: [
      { name: "Canada", yards: ["Milton, ON", "Montreal, QC"] },
      { name: "United States", yards: ["Laredo, TX", "Houston, TX", "Livermore, CA", "Miami, FL"] },
      { name: "Mexico", yards: ["Monterrey, MX"] },
    ],
    yards: [
      { city: "Milton", region: "ON", label: "Milton, ON" },
      { city: "Montreal", region: "QC", label: "Montreal, QC" },
      { city: "Laredo", region: "TX", label: "Laredo, TX" },
      { city: "Monterrey", region: "MX", label: "Monterrey, MX" },
      { city: "Houston", region: "TX", label: "Houston, TX" },
      { city: "Livermore", region: "CA", label: "Livermore, CA" },
      { city: "Miami", region: "FL", label: "Miami, FL" },
    ] satisfies YardLocation[],
  },

  finalCta: {
    kicker: "Let's execute",
    title: "Let’s move your freight with discipline.",
    body: "Talk to our team about your lanes, requirements, and service constraints. We’ll align capacity, compliance, and execution control with your operation.",
    trustSignals: [
      "Execution discipline and repeatable processes",
      "Compliance-first posture",
      "Single team, single accountability",
    ],
    proof: [
      { value: "≤ 15 min", label: "Initial response target" },
      { value: "24/7", label: "Operations coverage" },
      { value: "CA–US–MX", label: "Lane execution scope" },
    ],
    microCopy:
      "Prefer a quick call? We'll align on lanes, service levels, and launch timing in minutes.",
    ctas: {
      primary: {
        label: "Request a Quote",
        href: "/quote",
        ctaId: "about_final_request_a_quote",
      },
      secondary: {
        label: "Speak with a live agent",
        href: "#live-chat",
        ctaId: "about_final_speak_live_agent",
      },
    },
  },
} as const;
