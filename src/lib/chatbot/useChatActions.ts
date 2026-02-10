"use client";

import { useRouter } from "next/navigation";
import { useChatActionsStore, type QuotePrefill } from "./chatActions.store";

export function useChatActions() {
  const router = useRouter();
  const setQuotePrefill = useChatActionsStore((s) => s.setQuotePrefill);
  const fireCommand = useChatActionsStore((s) => s.fireCommand);

  return {
    // Routing actions
    goTo: (href: string) => router.push(href),

    // Prefill actions
    prefillQuote: (patch: Partial<QuotePrefill>) => setQuotePrefill(patch),

    // UI actions: pages can listen to lastCommand and react (scroll/open modal/etc.)
    scrollTo: (anchorId: string) => fireCommand("scrollTo", { anchorId }),

    openContactModal: () => fireCommand("openContactModal"),

    // Add more later without rewriting chatbot core
  };
}
