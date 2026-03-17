// src/lib/chatbot/widgets/QuoteWidget.tsx
"use client";

import type { WidgetComponentProps } from "../chatbot.types";
import { LinkButton, ResponseButton } from "./_shared";

export default function QuoteWidget({ actionProvider }: WidgetComponentProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <LinkButton onClick={() => actionProvider.goTo("/quote")}>Open quote page</LinkButton>

      <ResponseButton onClick={() => actionProvider.showContact()}>
        Contact support instead
      </ResponseButton>
    </div>
  );
}
