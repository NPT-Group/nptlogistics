// src/lib/chatbot/widgets/CareersWidget.tsx
"use client";

import { NAV } from "@/config/navigation";

function href(label: string, fallback: string) {
  const links: Array<{ label: string; href: string }> = NAV.careers.links as any;
  return links.find((l) => l.label === label)?.href ?? fallback;
}

const JOBS = href("Job Listings", "/careers#jobs");
const DRIVERS = href("Driver Opportunities", "/careers#drive");

export default function CareersWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goTo(JOBS)}
        className="rounded-full border px-3 py-1 text-sm"
        type="button"
      >
        View Open Roles
      </button>

      <button
        onClick={() => actionProvider.goTo(DRIVERS)}
        className="rounded-full border px-3 py-1 text-sm"
        type="button"
      >
        Driver Opportunities
      </button>
    </div>
  );
}
