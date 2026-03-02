// src/lib/chatbot/widgets/ResourcesWidget.tsx
"use client";

export default function ResourcesWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goToFromNav("Shipping Guides", "/resources/guides")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Shipping Guides
      </button>

      <button
        onClick={() => actionProvider.goToFromNav("FAQs", "/resources/faqs")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        FAQs
      </button>

      <button
        onClick={() => actionProvider.startQuote()}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Start a quote
      </button>

      <button
        onClick={() => actionProvider.showContact()}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Contact an agent
      </button>
    </div>
  );
}
