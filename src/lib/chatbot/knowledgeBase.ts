// src/lib/chatbot/knowledgeBase.ts
export type BotIntentId =
  | "GET_QUOTE"
  | "TRACKING"
  | "SOLUTIONS"
  | "SERVICES_HELP"
  | "INDUSTRIES"
  | "CAREERS"
  | "WHY_NPT"
  | "COMPANY"
  | "RESOURCES_GUIDES"
  | "RESOURCES_FAQS"
  | "HUMAN_CONTACT"
  | "GENERAL_FAQ"
  // Specific solutions (new)
  | "TL"
  | "LTL"
  | "INTERMODAL"
  | "EXPEDITED"
  | "HAZMAT"
  | "TEMP_CONTROLLED"
  | "CROSS_BORDER"
  | "VALUE_ADDED";

export type QuickReply = {
  label: string;
  intent: BotIntentId;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

export const CONTACT_INFO = {
  email: "sales@nptlogistics.com",
  phone: "+1 (519) 968-3632",
};

export const COMPANY_FACTS = {
  loadsMoved: ">250,000",
  onTime: "98%",
  crossBorder: ">25,000",
  responseTime: "≤ 15 minutes",
  coverage: "Canada • USA • Mexico",
};

export const FAQ: FAQItem[] = [
  {
    id: "coverage",
    question: "Where do you operate?",
    answer:
      "We operate across Canada, USA, and Mexico with cross-border expertise and 24/7 dispatch support.",
    tags: ["coverage", "canada", "usa", "mexico", "cross border"],
  },
  {
    id: "tracking",
    question: "How does tracking work?",
    answer:
      "We provide real-time shipment visibility with proactive exception management and single-thread communication.",
    tags: ["tracking", "visibility", "status"],
  },
  {
    id: "quote-speed",
    question: "How fast can I get a quote?",
    answer:
      "Our operations team targets an initial structured response within 15 minutes during business hours.",
    tags: ["quote", "pricing", "response"],
  },
  {
    id: "proof",
    question: "Why choose NPT?",
    answer:
      "We’ve moved over 250,000 loads with a 98% on-time performance and strong cross-border execution discipline.",
    tags: ["why", "trust", "proof", "reliability"],
  },
];

export const START_REPLIES: QuickReply[] = [
  { label: "Request a quote", intent: "GET_QUOTE" },
  { label: "Track a shipment", intent: "TRACKING" },
  { label: "Explore solutions", intent: "SOLUTIONS" },
  { label: "Industries we serve", intent: "INDUSTRIES" },
  { label: "Shipping guides", intent: "RESOURCES_GUIDES" },
  { label: "FAQs", intent: "RESOURCES_FAQS" },
  { label: "Company info", intent: "COMPANY" },
  { label: "Careers at NPT", intent: "CAREERS" },
  { label: "Contact an agent", intent: "HUMAN_CONTACT" },
];

export const SOLUTIONS_REPLIES: QuickReply[] = [
  { label: "Truckload (FTL)", intent: "TL" },
  { label: "Less-than-truckload (LTL)", intent: "LTL" },
  // { label: "Intermodal", intent: "INTERMODAL" }, // COMMENTED OUT - uncomment to restore
  { label: "Expedited & Specialized", intent: "EXPEDITED" },
  { label: "Hazmat", intent: "HAZMAT" },
  { label: "Temperature-controlled", intent: "TEMP_CONTROLLED" },
  { label: "Cross-border & global", intent: "CROSS_BORDER" },
  { label: "Value-added / warehousing", intent: "VALUE_ADDED" },
];
