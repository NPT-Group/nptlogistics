// src/lib/chatbot/widgets/SingleLinkWidget.tsx
"use client";

export default function SingleLinkWidget({ props, actionProvider }: any) {
  const label = props?.label || "Open";
  const href = props?.href || "/";

  return (
    <button
      onClick={() => actionProvider.goTo(href)}
      className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
      type="button"
    >
      {label}
    </button>
  );
}
