// src/lib/chatbot/chatActions.store.ts
import { create } from "zustand";

export type QuotePrefill = {
  service?: "LTL" | "FTL" | "AIR" | "OCEAN" | "CUSTOMS" | "WAREHOUSE" | "OTHER";
  origin?: string;
  destination?: string;
  pickupDate?: string; // ISO string, or your format
  notes?: string;
};

type ChatActionsState = {
  // The bot can set these, and any page can read/use them.
  quotePrefill: QuotePrefill;

  // Optional "commands" that pages can react to (scroll, open modal, etc.)
  lastCommand?: { type: string; payload?: any; ts: number };

  setQuotePrefill: (patch: Partial<QuotePrefill>) => void;
  clearQuotePrefill: () => void;

  fireCommand: (type: string, payload?: any) => void;
};

export const useChatActionsStore = create<ChatActionsState>((set) => ({
  quotePrefill: {},

  setQuotePrefill: (patch) =>
    set((s) => ({
      quotePrefill: { ...s.quotePrefill, ...patch },
    })),

  clearQuotePrefill: () => set({ quotePrefill: {} }),

  fireCommand: (type, payload) =>
    set({
      lastCommand: { type, payload, ts: Date.now() },
    }),
}));
