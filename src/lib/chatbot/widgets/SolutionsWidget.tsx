// src/lib/chatbot/widgets/SolutionsWidget.tsx
"use client";

import { NAV } from "@/config/navigation";

export default function SolutionsWidget({ actionProvider }: any) {
  const categories = (NAV.solutions as any).categories as Array<{
    title: string;
    links: Array<{ label: string; href: string; description?: string }>;
  }>;

  const topLinks = categories.flatMap((c) => c.links);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {topLinks.map((l) => (
          <button
            key={l.href}
            onClick={() => actionProvider.goTo(l.href)}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
            type="button"
          >
            {l.label}
          </button>
        ))}

        <button
          onClick={() => actionProvider.goTo("/#solutions")}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
          type="button"
        >
          View all solutions
        </button>
      </div>
    </div>
  );
}
