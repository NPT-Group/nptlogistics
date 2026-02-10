export type BotIntentId = "GET_QUOTE" | "SERVICES_HELP" | "TRACKING" | "HUMAN_CONTACT" | "GENERAL_FAQ";

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

/**
 * Replace these with real content later.
 * Keep this file as your single “content plug-in”.
 */
export const FAQ: FAQItem[] = [
  {
    id: "placeholder-1",
    question: "What services do you offer?",
    answer: "We offer freight and logistics services. (Replace with real answer.)",
    tags: ["services"],
  },
];

/**
 * The first buttons the user sees.
 * You can add/remove/rename intents without touching the core bot engine.
 */
export const START_REPLIES: QuickReply[] = [
  { label: "Request a quote", intent: "GET_QUOTE" },
  { label: "Help choosing a service", intent: "SERVICES_HELP" },
  { label: "General questions", intent: "GENERAL_FAQ" },
  { label: "Contact an agent", intent: "HUMAN_CONTACT" },
];
