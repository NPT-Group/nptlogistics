// src/lib/chatbot/widgets/PageSuggestionsWidget.tsx
"use client";

type Suggestion = {
  label: string;
  href: string;
  description?: string;
};

export default function PageSuggestionsWidget(incoming: any) {
  const actionProvider = incoming?.actionProvider;

  // Support payload / props / top-level
  const widgetProps = ((incoming?.payload &&
    typeof incoming.payload === "object" &&
    incoming.payload) ||
    (incoming?.props && typeof incoming.props === "object" && incoming.props) ||
    incoming) as any;

  const title = widgetProps?.title || "Choose a page";

  const suggestions: Suggestion[] = Array.isArray(widgetProps?.suggestions)
    ? widgetProps.suggestions
    : [];

  const secondaryLabel = widgetProps?.secondaryLabel || "Not now";
  const secondaryAction = widgetProps?.secondaryAction || "startOver";

  const onSecondary = () => {
    const fn = actionProvider?.[secondaryAction];
    if (typeof fn === "function") fn();
  };

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-medium text-gray-600">{title}</div>

      <div className="space-y-1.5">
        {suggestions.slice(0, 3).map((s) => {
          return (
            <div
              key={`${s.href}-${s.label}`}
              className="rounded-xl border border-gray-200 bg-white px-2 py-1.5"
            >
              {/* Top row: label + arrow */}
              <button
                onClick={() => actionProvider?.goTo?.(s.href)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1 text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
                type="button"
                title={s.description || s.label}
              >
                <span className="line-clamp-1">{s.label}</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          );
        })}

        {/* Secondary */}
        <button
          onClick={onSecondary}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          type="button"
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}
