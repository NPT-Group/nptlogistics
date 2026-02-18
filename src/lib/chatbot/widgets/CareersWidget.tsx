// src/lib/chatbot/widgets/CareersWidget.tsx
"use client";

export default function CareersWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goTo("/careers#jobs")}
        className="rounded-full border px-3 py-1 text-sm"
      >
        View Open Roles
      </button>

      <button
        onClick={() => actionProvider.goTo("/careers#drive")}
        className="rounded-full border px-3 py-1 text-sm"
      >
        Driver Opportunities
      </button>
    </div>
  );
}
