// src/lib/chatbot/widgets/IndustriesWidget.tsx
"use client";

import { NAV } from "@/config/navigation";

export default function IndustriesWidget({ actionProvider, ...rest }: any) {
  const viewAllHref =
    rest?.payload?.viewAllHref ||
    rest?.props?.viewAllHref ||
    rest?.viewAllHref ||
    NAV.industries.intro.ctaHref; // fallback

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goTo(viewAllHref)}
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
