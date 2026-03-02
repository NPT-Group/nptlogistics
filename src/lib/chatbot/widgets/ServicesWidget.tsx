// src/lib/chatbot/widgets/ServicesWidget.tsx
"use client";

export default function ServicesWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.startSolutions()}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Browse solutions
      </button>

      <button
        onClick={() => actionProvider.goToTruckload()}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Truckload (TL)
      </button>

      <button
        onClick={() => actionProvider.goToLtl()}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        LTL
      </button>

      <button
        onClick={() => actionProvider.goToCrossBorder()}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Cross-border
      </button>

      <button
        onClick={() => actionProvider.startQuote()}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Start a quote
      </button>
    </div>
  );
}
