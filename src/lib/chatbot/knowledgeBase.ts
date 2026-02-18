// src/lib/chatbot/knowledgeBase.ts

export type BotIntentId =
  | "GET_QUOTE"
  | "SERVICES_HELP"
  | "TRACKING"
  | "CAREERS"
  | "DRIVERS"
  | "INDUSTRIES"
  | "WHY_NPT"
  | "HUMAN_CONTACT"
  | "GENERAL_FAQ";

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
  phone: "+1 (111) 111-1111",
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
  { label: "Explore services", intent: "SERVICES_HELP" },
  { label: "Industries we serve", intent: "INDUSTRIES" },
  { label: "Careers at NPT", intent: "CAREERS" },
  { label: "Contact an agent", intent: "HUMAN_CONTACT" },
];
