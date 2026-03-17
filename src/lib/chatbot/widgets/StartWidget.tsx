// src/lib/chatbot/widgets/StartWidget.tsx
"use client";

import { START_REPLIES } from "../knowledgeBase";
import type { BotIntentId, WidgetComponentProps } from "../chatbot.types";
import { LinkButton, ResponseButton } from "./_shared";

export default function StartWidget({ actionProvider }: WidgetComponentProps) {
  const onPick = (intent: BotIntentId) => {
    switch (intent) {
      case "GET_QUOTE":
        return actionProvider.startQuote();

      case "TRACKING":
        return actionProvider.startTracking();

      case "SOLUTIONS":
        return actionProvider.startSolutions();

      case "INDUSTRIES":
        return actionProvider.showIndustries();

      case "CAREERS":
        return actionProvider.showCareers();

      case "WHY_NPT":
        return actionProvider.showWhyNpt();

      case "COMPANY":
        return actionProvider.showCompany();

      case "RESOURCES_GUIDES":
        return actionProvider.goToFromNav("Shipping Guides", "/resources/guides");

      case "RESOURCES_FAQS":
        return actionProvider.goToFromNav("FAQs", "/resources/faqs");

      case "HUMAN_CONTACT":
        return actionProvider.showContact();

      default:
        return actionProvider.startOver();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {START_REPLIES.map((reply) => {
        const isDirectLink =
          reply.intent === "TRACKING" ||
          reply.intent === "RESOURCES_FAQS" ||
          reply.intent === "RESOURCES_GUIDES";

        const Button = isDirectLink ? LinkButton : ResponseButton;

        return (
          <Button key={reply.intent} onClick={() => onPick(reply.intent)}>
            {reply.label}
          </Button>
        );
      })}
    </div>
  );
}
