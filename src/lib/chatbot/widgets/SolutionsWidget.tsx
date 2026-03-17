// src/lib/chatbot/widgets/SolutionsWidget.tsx
"use client";

import { NAV } from "@/config/navigation";
import type { WidgetComponentProps } from "../chatbot.types";
import { LinkButton } from "./_shared";

type SolutionLink = {
  label: string;
  href: string;
  description?: string;
};

export default function SolutionsWidget({ actionProvider }: WidgetComponentProps) {
  const categories = (
    NAV.solutions as unknown as {
      categories: Array<{ title: string; links: SolutionLink[] }>;
    }
  ).categories;

  const topLinks = categories.flatMap((category) => category.links);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {topLinks.map((link) => (
          <LinkButton key={link.href} onClick={() => actionProvider.goTo(link.href)}>
            {link.label}
          </LinkButton>
        ))}

        <LinkButton onClick={() => actionProvider.goTo("/#solutions")}>
          View all solutions
        </LinkButton>
      </div>
    </div>
  );
}
