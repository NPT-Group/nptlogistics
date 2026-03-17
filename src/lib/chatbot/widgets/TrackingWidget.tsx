// src/lib/chatbot/widgets/TrackingWidget.tsx
"use client";

import type { WidgetComponentProps } from "../chatbot.types";
import { LinkButton, ResponseButton } from "./_shared";

export default function TrackingWidget({ actionProvider }: WidgetComponentProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <LinkButton onClick={() => actionProvider.goTo("/tracking")}>Open tracking</LinkButton>

      <ResponseButton onClick={() => actionProvider.showContact()}>Contact support</ResponseButton>
    </div>
  );
}
