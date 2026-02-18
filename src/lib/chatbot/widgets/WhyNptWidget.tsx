// src/lib/chatbot/widgets/WhyNptWidget.tsx
"use client";

export default function WhyNptWidget({ actionProvider }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goTo("/#why-npt")}
        className="rounded-full border px-3 py-1 text-sm"
      >
        Why Choose NPT
      </button>

      <button
        onClick={() => actionProvider.goTo("/quote")}
        className="rounded-full border px-3 py-1 text-sm"
      >
        Request a Quote
      </button>
    </div>
  );
}
