// src/lib/chatbot/widgets/CompanyWidget.tsx
"use client";

import type { WidgetComponentProps } from "../chatbot.types";
import { LinkButton } from "./_shared";

export default function CompanyWidget({ actionProvider }: WidgetComponentProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <LinkButton onClick={() => actionProvider.goToFromNav("About NPT", "/company/about")}>
        About NPT
      </LinkButton>

      <LinkButton
        onClick={() => actionProvider.goToFromNav("Locations & Network", "/company/locations")}
      >
        Locations & Network
      </LinkButton>

      <LinkButton
        onClick={() => actionProvider.goToFromNav("Safety & Compliance", "/company/safety")}
      >
        Safety & Compliance
      </LinkButton>

      <LinkButton onClick={() => actionProvider.goToFromNav("Blog / Insights", "/blog")}>
        Blog / Insights
      </LinkButton>

      <LinkButton onClick={() => actionProvider.goToFromNav("Contact", "/contact")}>
        Contact
      </LinkButton>
    </div>
  );
}
