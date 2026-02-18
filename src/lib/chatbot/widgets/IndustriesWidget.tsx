// src/lib/chatbot/widgets/IndustriesWidget.tsx
"use client";

export default function IndustriesWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goTo("/#industries")}
        className="rounded-full border px-3 py-1 text-sm"
      >
        View Industries
      </button>

      <button
        onClick={() => actionProvider.startQuote()}
        className="rounded-full border px-3 py-1 text-sm"
      >
        Get Industry-Specific Quote
      </button>
    </div>
  );
}
