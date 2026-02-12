// src/lib/chatbot/GuidedChatbot.tsx
"use client";

import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { MessageCircle, X, Sparkles } from "lucide-react";

import botConfig from "@/lib/chatbot/botConfig";
import MessageParser from "@/lib/chatbot/MessageParser";
import { makeActionProvider } from "@/lib/chatbot/ActionProvider";
import { useChatActions } from "@/lib/chatbot/useChatActions";

const TOOLTIP_KEY = "npt_chatbot_tooltip_dismissed";

export default function GuidedChatbot() {
  const pageActions = useChatActions();
  const ActionProvider = React.useMemo(() => makeActionProvider(pageActions), [pageActions]);

  const [open, setOpen] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // Show tooltip once (per session) after a short delay
  React.useEffect(() => {
    // If user already dismissed this session, skip
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem(TOOLTIP_KEY) === "1";
    if (dismissed) return;

    const t = window.setTimeout(() => {
      // Only show if chat isn't already open
      setShowTooltip(true);

      // Auto-hide after a bit
      const t2 = window.setTimeout(() => setShowTooltip(false), 7000);
      return () => window.clearTimeout(t2);
    }, 1800);

    return () => window.clearTimeout(t);
  }, []);

  // Close on Esc
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Click outside to close (optional)
  React.useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!open) return;
      const el = panelRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  function openChat() {
    setOpen(true);
    setShowTooltip(false);
    try {
      sessionStorage.setItem(TOOLTIP_KEY, "1");
    } catch {
      // Ignore (probably quota exceeded or in private mode)
    }
  }

  function dismissTooltip() {
    setShowTooltip(false);
    try {
      sessionStorage.setItem(TOOLTIP_KEY, "1");
    } catch {
      // Ignore (probably quota exceeded or in private mode)
    }
  }

  return (
    <div className="fixed right-5 bottom-5 z-50">
      {/* Chat panel (always mounted so conversation persists) */}
      <div
        ref={panelRef}
        className={[
          "w-[360px] max-w-[92vw] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl",
          open ? "block" : "hidden",
        ].join(" ")}
        role="dialog"
        aria-label="Chatbot"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">
              <MessageCircle size={16} />
            </span>
            <div className="text-sm font-semibold text-gray-900">NPT Assistant</div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="npt-chatbot">
          <Chatbot
            config={botConfig as any}
            messageParser={MessageParser as any}
            actionProvider={ActionProvider as any}
            placeholderText="Type your message…"
          />
        </div>
      </div>

      {/* Launcher cluster (only when closed) */}
      {!open && (
        <div className="relative flex items-end justify-end">
          {/* Tooltip bubble */}
          {showTooltip && (
            <div className="absolute right-0 bottom-16 w-[260px]">
              <div className="relative rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-xl">
                <button
                  type="button"
                  onClick={dismissTooltip}
                  className="absolute top-2 right-2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
                  aria-label="Dismiss tip"
                >
                  <X size={14} />
                </button>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">
                    <Sparkles size={16} />
                  </span>

                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">Hi 👋</div>
                    <div className="mt-0.5 text-gray-600">
                      Want help finding the right service or starting a quote?
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={openChat}
                        className="rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                      >
                        Open chat
                      </button>
                      <button
                        type="button"
                        onClick={dismissTooltip}
                        className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Not now
                      </button>
                    </div>
                  </div>
                </div>

                {/* little pointer */}
                <div className="absolute right-6 -bottom-2 h-4 w-4 rotate-45 border-r border-b border-gray-200 bg-white" />
              </div>
            </div>
          )}

          {/* Circular launcher */}
          <button
            type="button"
            onClick={openChat}
            aria-label="Open chat"
            className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none active:translate-y-0"
          >
            {/* animated sheen */}
            <span
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 55%)",
              }}
            />

            {/* subtle border glow */}
            <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-40" />

            {/* Ping dot (cleaner) */}
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>

            {/* icon badge */}
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <MessageCircle size={20} className="transition group-hover:scale-105" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
