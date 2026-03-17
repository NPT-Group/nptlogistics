// src/lib/chatbot/useChatActions.ts
"use client";

import { useRouter } from "next/navigation";

export function useChatActions() {
  const router = useRouter();

  return {
    goTo: (href: string) => router.push(href),
    scrollTo: (anchorId: string) => {
      const el =
        document.getElementById(anchorId) || document.querySelector(`[data-anchor="${anchorId}"]`);

      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  };
}
