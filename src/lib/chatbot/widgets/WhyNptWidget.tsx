// src/lib/chatbot/widgets/WhyNptWidget.tsx
"use client";

const WHY_NPT = "/#why-npt"; // not present in NAV (keep explicit unless you add it)

export default function WhyNptWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goTo(WHY_NPT)}
        className="rounded-full border px-3 py-1 text-sm"
        type="button"
      >
        Why Choose NPT
      </button>

      <button
        onClick={() => actionProvider.goTo("/quote")}
        className="rounded-full border px-3 py-1 text-sm"
        type="button"
      >
        Request a Quote
      </button>
    </div>
  );
}
