// src/lib/chatbot/widgets/IndustriesWidget.tsx
"use client";

import { NAV } from "@/config/navigation";
import type { WidgetComponentProps } from "../chatbot.types";
import { LinkButton, ResponseButton } from "./_shared";

type IndustriesPayload = {
  viewAllHref?: string;
};

export default function IndustriesWidget({
  actionProvider,
  payload,
  props,
}: WidgetComponentProps<IndustriesPayload>) {
  const viewAllHref = payload?.viewAllHref || props?.viewAllHref || NAV.industries.intro.ctaHref;

  return (
    <div className="flex flex-wrap gap-2">
      <LinkButton onClick={() => actionProvider.goTo(viewAllHref)}>View industries</LinkButton>

      <ResponseButton onClick={() => actionProvider.startQuote()}>Request a quote</ResponseButton>
    </div>
  );
}
