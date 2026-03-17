// src/lib/chatbot/widgets/ContactWidget.tsx
"use client";

import { CONTACT_INFO } from "../knowledgeBase";
import type { BaseWidgetProps } from "../chatbot.types";

export default function ContactWidget(_: BaseWidgetProps) {
  return (
    <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3 text-sm">
      <div className="font-medium text-gray-900">Customer Support</div>
      <div className="text-gray-600">
        Email:{" "}
        <a className="font-medium text-gray-900 underline" href={`mailto:${CONTACT_INFO.email}`}>
          {CONTACT_INFO.email}
        </a>
      </div>
    </div>
  );
}
