// src/components/shared/TurnstileWidget.tsx
"use client";

import * as React from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    __turnstileScriptLoaded?: boolean;
    __turnstileScriptLoadPromise?: Promise<void>;
  }
}

type Props = {
  /** Turnstile "action" (optional, but nice for analytics / rules) */
  action?: string;
  /** Called when token is issued */
  onToken: (token: string) => void;
  /** Optional class wrapper */
  className?: string;
  /** Optional: called when widget fails */
  onError?: (message: string) => void;
};

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  if (window.__turnstileScriptLoaded && window.turnstile) return Promise.resolve();
  if (window.__turnstileScriptLoadPromise) return window.__turnstileScriptLoadPromise;

  window.__turnstileScriptLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile="true"]');
    if (existing) {
      existing.addEventListener("load", () => {
        window.__turnstileScriptLoaded = true;
        resolve();
      });
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Turnstile script")),
      );
      if ((window as any).turnstile) {
        window.__turnstileScriptLoaded = true;
        resolve();
      }
      return;
    }

    const s = document.createElement("script");
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    s.dataset.turnstile = "true";
    s.onload = () => {
      window.__turnstileScriptLoaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error("Failed to load Turnstile script"));
    document.head.appendChild(s);
  });

  return window.__turnstileScriptLoadPromise;
}

export default function TurnstileWidget({ action, onToken, className, onError }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const widgetIdRef = React.useRef<string | null>(null);

  // Keep latest callbacks in refs so parent re-renders don't re-init widget
  const onTokenRef = React.useRef(onToken);
  const onErrorRef = React.useRef(onError);

  React.useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  React.useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const [status, setStatus] = React.useState<"idle" | "loading" | "ready" | "verified" | "error">(
    "idle",
  );
  const [msg, setMsg] = React.useState<string>("");

  // Helpful: if the site key is missing, surface immediately.
  React.useEffect(() => {
    if (!siteKey) {
      setStatus("error");
      setMsg("Turnstile is not configured (missing NEXT_PUBLIC_TURNSTILE_SITE_KEY).");
      onErrorRef.current?.("Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY");
    }
  }, [siteKey]);

  React.useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!siteKey) return;
      if (!containerRef.current) return;

      setStatus("loading");
      setMsg("");

      try {
        await loadTurnstileScript();
        if (cancelled) return;

        if (!window.turnstile) {
          setStatus("error");
          setMsg("Turnstile failed to initialize (script loaded but API missing).");
          onErrorRef.current?.("Turnstile API missing after script load");
          return;
        }

        // Cleanup any previous widget
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }

        // Clear container so re-render is clean
        containerRef.current.innerHTML = "";

        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: action || undefined,

          // Receive the token
          callback: (token: string) => {
            if (cancelled) return;
            setStatus("verified");
            setMsg("");
            onTokenRef.current(token);
          },

          // If token expires, reset and clear token upstream
          "expired-callback": () => {
            if (cancelled) return;
            setStatus("ready");
            setMsg("Verification expired. Please try again.");
            onTokenRef.current(""); // clear token
            try {
              window.turnstile?.reset(widgetIdRef.current || undefined);
            } catch {
              // ignore
            }
          },

          // If something goes wrong, show a meaningful state
          "error-callback": () => {
            if (cancelled) return;
            setStatus("error");
            setMsg(
              "Verification failed to load. If you’re on localhost, ensure the site key allows this domain.",
            );
            onTokenRef.current(""); // clear token
            onErrorRef.current?.("Turnstile error-callback fired");
          },

          // Optional: visuals
          theme: "light",
          size: "normal",
        });

        widgetIdRef.current = widgetId;
        setStatus("ready");
      } catch (e: any) {
        if (cancelled) return;
        setStatus("error");
        setMsg(e?.message || "Failed to load verification.");
        onErrorRef.current?.(e?.message || "Turnstile load failed");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action]); // NOTE: callbacks intentionally excluded

  return (
    <div className={className}>
      <div className={[status === "error" ? "border-red-200 bg-red-50" : ""].join(" ")}>
        {/* Turnstile mounts here */}
        <div ref={containerRef} />

        {/* Small status line */}
        {status === "loading" ? (
          <div className="mt-2 text-xs text-slate-500">Loading verification…</div>
        ) : null}

        {msg ? (
          <div
            className={[
              "mt-2 text-xs",
              status === "error" ? "text-red-700" : "text-slate-500",
            ].join(" ")}
          >
            {msg}
          </div>
        ) : null}
      </div>
    </div>
  );
}
