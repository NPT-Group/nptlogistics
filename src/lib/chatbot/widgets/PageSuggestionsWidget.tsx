// src/lib/chatbot/widgets/PageSuggestionsWidget.tsx
"use client";

import type { PageSuggestionPayload, WidgetComponentProps } from "../chatbot.types";
import { LinkButton, ResponseButton } from "./_shared";

export default function PageSuggestionsWidget({
  actionProvider,
  payload,
  props,
}: WidgetComponentProps<PageSuggestionPayload>) {
  const widgetProps = payload ?? props;

  const title = widgetProps?.title || "Suggested pages";
  const suggestions = widgetProps?.suggestions ?? [];
  const secondaryLabel = widgetProps?.secondaryLabel || "Go back";
  const secondaryAction = widgetProps?.secondaryAction || "startOver";

  const onSecondary = () => {
    const fn = actionProvider[secondaryAction];
    if (typeof fn === "function") {
      fn();
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-medium text-gray-600">{title}</div>

      <div className="space-y-2">
        {suggestions.slice(0, 3).map((suggestion) => (
          <div
            key={`${suggestion.href}-${suggestion.label}`}
            className="rounded-xl border border-gray-200 bg-white p-2"
          >
            <div className="flex flex-wrap gap-2">
              <LinkButton onClick={() => actionProvider.goTo(suggestion.href)}>
                {suggestion.label}
              </LinkButton>
            </div>

            {suggestion.description ? (
              <div className="mt-2 text-xs text-gray-600">{suggestion.description}</div>
            ) : null}
          </div>
        ))}

        <ResponseButton onClick={onSecondary}>{secondaryLabel}</ResponseButton>
      </div>
    </div>
  );
}
