// src/app/(site)/components/ClientChatbot.tsx
"use client";

import dynamic from "next/dynamic";

const GuidedChatbot = dynamic(() => import("@/lib/chatbot/GuidedChatbot"), {
  ssr: false,
  loading: () => null,
});

export default function ClientChatbot() {
  return <GuidedChatbot />;
}
