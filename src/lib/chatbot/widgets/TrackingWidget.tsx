// src/lib/chatbot/widgets/TrackingWidget.tsx
"use client";

export default function TrackingWidget(props: any) {
  const { actionProvider } = props;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actionProvider.goTo("/tracking")}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Open tracking
      </button>

      <button
        onClick={() => actionProvider.showContact()}
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        type="button"
      >
        Contact support
      </button>
    </div>
  );
}
