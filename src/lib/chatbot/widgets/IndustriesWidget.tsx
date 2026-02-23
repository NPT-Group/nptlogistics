// src/lib/chatbot/widgets/IndustriesWidget.tsx
"use client";

import { NAV } from "@/config/navigation";

const INDUSTRIES = NAV.industries.intro.ctaHref; // "/#industries"

export default function IndustriesWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goTo(INDUSTRIES)}
        className="rounded-full border px-3 py-1 text-sm"
        type="button"
      >
        View Industries
      </button>

      <button
        onClick={() => actionProvider.startQuote()}
        className="rounded-full border px-3 py-1 text-sm"
        type="button"
      >
        Get Industry-Specific Quote
      </button>
    </div>
  );
}
