// src/lib/chatbot/widgets/CareersWidget.tsx
"use client";

import { NAV } from "@/config/navigation";
import type { WidgetComponentProps } from "../chatbot.types";
import { LinkButton } from "./_shared";

function href(label: string, fallback: string) {
  const links = NAV.careers.links as Array<{ label: string; href: string }>;
  return links.find((link) => link.label === label)?.href ?? fallback;
}

const JOBS = href("Job Listings", "/careers#jobs");
const DRIVERS = href("Driver Opportunities", "/careers#drive");

export default function CareersWidget({ actionProvider }: WidgetComponentProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <LinkButton onClick={() => actionProvider.goTo(JOBS)}>View open roles</LinkButton>

      <LinkButton onClick={() => actionProvider.goTo(DRIVERS)}>Driver opportunities</LinkButton>
    </div>
  );
}
