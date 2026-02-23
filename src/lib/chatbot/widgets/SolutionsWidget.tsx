// src/lib/chatbot/widgets/SolutionsWidget.tsx
"use client";

import { SOLUTIONS_REPLIES } from "../knowledgeBase";

export default function SolutionsWidget({ actionProvider }: any) {
  const onPick = (intent: string) => {
    switch (intent) {
      case "TL":
        return actionProvider.goToTruckload();
      case "LTL":
        return actionProvider.goToLtl();
      case "INTERMODAL":
        return actionProvider.goToIntermodal();
      case "EXPEDITED":
        return actionProvider.goToExpedited();
      case "HAZMAT":
        return actionProvider.goToHazmat();
      case "TEMP_CONTROLLED":
        return actionProvider.goToTemp();
      case "CROSS_BORDER":
        return actionProvider.goToCrossBorder();
      case "VALUE_ADDED":
        return actionProvider.goToValueAdded();
      default:
        return actionProvider.startQuote();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {SOLUTIONS_REPLIES.map((r) => (
        <button
          key={r.intent}
          onClick={() => onPick(r.intent)}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
          type="button"
        >
          {r.label}
        </button>
      ))}

      <button
        onClick={() => actionProvider.goToFromNav("View all solutions", "/#solutions")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        View all solutions
      </button>
    </div>
  );
}
