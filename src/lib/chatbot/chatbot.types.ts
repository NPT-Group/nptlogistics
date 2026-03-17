// src/lib/chatbot/chatbot.types.ts
import type React from "react";

export type BotIntentId =
  | "GET_QUOTE"
  | "TRACKING"
  | "SOLUTIONS"
  | "INDUSTRIES"
  | "CAREERS"
  | "WHY_NPT"
  | "COMPANY"
  | "RESOURCES_GUIDES"
  | "RESOURCES_FAQS"
  | "HUMAN_CONTACT";

export type QuickReply = Readonly<{
  label: string;
  intent: BotIntentId;
}>;

export type FlatFaqItem = Readonly<{
  id: string;
  categoryId: string;
  categoryLabel: string;
  question: string;
  answer: string;
  tags: readonly string[];
}>;

export type ChatSuggestion = Readonly<{
  label: string;
  href: string;
  description?: string;
}>;

export type SecondaryActionName =
  | "startOver"
  | "startSolutions"
  | "showContact"
  | "showResources"
  | "showCompany";

export type PageSuggestionPayload = Readonly<{
  title: string;
  suggestions: readonly ChatSuggestion[];
  secondaryLabel?: string;
  secondaryAction?: SecondaryActionName;
}>;

export type ActionProviderShape = {
  goTo: (href: string) => void;
  goToFromNav: (labelHint: string, fallbackHref: string) => void;

  startOver: () => void;
  startQuote: () => void;
  startTracking: () => void;
  startSolutions: () => void;
  showCompany: () => void;
  showResources: () => void;
  showContact: () => void;
  showIndustries: () => void;
  showCareers: () => void;
  showWhyNpt: () => void;

  suggestNavOptions: (userText: string, opts?: { limit?: number }) => boolean;
  suggestNavPage: (labelHint: string, fallbackHref: string, description?: string) => void;

  tryAnswerFaq: (query: string) => boolean;
  searchFaq: (query: string) => void;
};

export type BaseWidgetProps = {
  actionProvider: ActionProviderShape;
  payload?: unknown;
  props?: unknown;
  children?: React.ReactNode;
};

export type WidgetComponentProps<TPayload = unknown> = {
  actionProvider: ActionProviderShape;
  payload?: TPayload;
  props?: TPayload;
  children?: React.ReactNode;
};
