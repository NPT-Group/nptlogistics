// src/lib/chatbot/widgets/CompanyWidget.tsx
"use client";

export default function CompanyWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goToFromNav("About NPT", "/company/about")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        About NPT
      </button>

      <button
        onClick={() => actionProvider.goToFromNav("Locations & Network", "/company/locations")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Locations & Network
      </button>

      <button
        onClick={() => actionProvider.goToFromNav("Safety & Compliance", "/company/safety")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Safety & Compliance
      </button>

      <button
        onClick={() => actionProvider.goToFromNav("Blog / Insights", "/blog")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Blog / Insights
      </button>

      <button
        onClick={() => actionProvider.goToFromNav("Contact", "/contact")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Contact
      </button>
    </div>
  );
}
