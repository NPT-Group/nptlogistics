// src/lib/chatbot/knowledgeBase.ts
import { FAQ_CATEGORIES, SHIPPING_GUIDES, FAQ_FINAL_CTA } from "@/config/faqs";
import { NEXT_PUBLIC_NPT_CS_EMAIL, NEXT_PUBLIC_NPT_PHONE } from "@/config/env";
import type { BotIntentId, FlatFaqItem, QuickReply } from "./chatbot.types";

function normText(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueWords(parts: readonly string[]) {
  const set = new Set<string>();

  for (const part of parts) {
    const normalized = normText(part);
    if (!normalized) continue;
    for (const token of normalized.split(" ")) {
      if (token.length >= 3) set.add(token);
    }
  }

  return Array.from(set);
}

export const CONTACT_INFO = {
  email: NEXT_PUBLIC_NPT_CS_EMAIL || "cs@nptlogistics.com",
  phone: NEXT_PUBLIC_NPT_PHONE || "+1 (281) 607-0001",
} as const;

export const COMPANY_FACTS = {
  loadsMoved: ">250,000",
  onTime: "98%",
  crossBorder: ">25,000",
  responseTime: "≤ 15 minutes",
  coverage: "Canada • USA • Mexico",
} as const;

export const FAQ: readonly FlatFaqItem[] = FAQ_CATEGORIES.flatMap((category) =>
  category.items.map((item, index) => ({
    id: `${category.id}-${index + 1}`,
    categoryId: category.id,
    categoryLabel: category.label,
    question: item.question,
    answer: item.answer,
    tags: uniqueWords([category.id, category.label, item.question, item.answer]),
  })),
);

export const SHIPPING_GUIDE_KEYWORDS = SHIPPING_GUIDES.map((guide) => ({
  id: guide.id,
  title: guide.title,
  description: guide.description,
  tags: uniqueWords([guide.title, guide.description, ...guide.points]),
}));

export const START_REPLIES: readonly QuickReply[] = [
  { label: "Request a quote", intent: "GET_QUOTE" },
  { label: "Track a shipment", intent: "TRACKING" },
  { label: "Explore solutions", intent: "SOLUTIONS" },
  { label: "FAQs", intent: "RESOURCES_FAQS" },
  { label: "Shipping guides", intent: "RESOURCES_GUIDES" },
  { label: "Company info", intent: "COMPANY" },
  { label: "Careers at NPT", intent: "CAREERS" },
  { label: "Contact support", intent: "HUMAN_CONTACT" },
] as const satisfies readonly QuickReply[];

export const INTENT_LABELS: Readonly<Record<BotIntentId, string>> = {
  GET_QUOTE: "Request a quote",
  TRACKING: "Track a shipment",
  SOLUTIONS: "Explore solutions",
  INDUSTRIES: "Industries we serve",
  CAREERS: "Careers at NPT",
  WHY_NPT: "Why choose NPT",
  COMPANY: "Company info",
  RESOURCES_GUIDES: "Shipping guides",
  RESOURCES_FAQS: "FAQs",
  HUMAN_CONTACT: "Contact support",
};

export const FAQ_HELP_FALLBACK = {
  title: FAQ_FINAL_CTA.title,
  body: FAQ_FINAL_CTA.body,
} as const;
