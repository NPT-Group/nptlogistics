// src/lib/chatbot/widgets/StartWidget.tsx
"use client";

import { START_REPLIES } from "../knowledgeBase";

export default function StartWidget(props: any) {
  const { actionProvider } = props;

  const onPick = (intent: string) => {
    switch (intent) {
      case "GET_QUOTE":
        return actionProvider.startQuote();

      case "TRACKING":
        return actionProvider.startTracking();

      case "SERVICES_HELP":
        return actionProvider.startServicesHelp();

      case "INDUSTRIES":
        return actionProvider.showIndustries();

      case "CAREERS":
        return actionProvider.showCareers();

      case "WHY_NPT":
        return actionProvider.showWhyNpt();

      case "HUMAN_CONTACT":
        return actionProvider.showContact();

      case "GENERAL_FAQ":
        return actionProvider.searchFaq("services");

      default:
        return actionProvider.startOver();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {START_REPLIES.map((r) => (
        <button
          key={r.intent}
          onClick={() => onPick(r.intent)}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
          type="button"
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
