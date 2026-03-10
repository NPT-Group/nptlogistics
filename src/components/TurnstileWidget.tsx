// src/components/TurnstileWidget.tsx
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

export type TurnstileWidgetHandle = {
  reset: () => void;
};

type Props = {
  action?: string;
  onToken: (token: string) => void;
  className?: string;
  onError?: (message: string) => void;
  invalid?: boolean;
  errorMessage?: string;
  fieldPathAttr?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  variant?: "default" | "bare";
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

      if (window.turnstile) {
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

const TurnstileWidget = React.forwardRef<TurnstileWidgetHandle, Props>(function TurnstileWidget(
  {
    action,
    onToken,
    className,
    onError,
    invalid,
    errorMessage,
    fieldPathAttr,
    label,
    hint,
    variant = "default",
  },
  ref,
) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const widgetIdRef = React.useRef<string | null>(null);

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

  React.useImperativeHandle(
    ref,
    () => ({
      reset() {
        onTokenRef.current("");
        setMsg("");
        setStatus("ready");

        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {
            // ignore
          }
        }
      },
    }),
    [],
  );

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

        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }

        containerRef.current.innerHTML = "";

        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: action || undefined,

          callback: (token: string) => {
            if (cancelled) return;
            setStatus("verified");
            setMsg("");
            onTokenRef.current(token);
          },

          "expired-callback": () => {
            if (cancelled) return;
            setStatus("ready");
            setMsg("Verification expired. Please try again.");
            onTokenRef.current("");
            try {
              window.turnstile?.reset(widgetIdRef.current || undefined);
            } catch {
              // ignore
            }
          },

          "error-callback": () => {
            if (cancelled) return;
            setStatus("error");
            setMsg(
              "Verification failed to load. If you’re on localhost, ensure the site key allows this domain.",
            );
            onTokenRef.current("");
            onErrorRef.current?.("Turnstile error-callback fired");
          },

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
  }, [siteKey, action]);

  const showError = Boolean(errorMessage) || status === "error";
  const borderClass =
    invalid || showError ? "border-red-300 bg-red-50" : "border-neutral-200 bg-white";

  const content = (
    <>
      <div ref={containerRef} />

      {status === "loading" ? (
        <div className="mt-2 text-xs text-slate-500">Loading verification…</div>
      ) : null}

      {msg ? (
        <div
          className={["mt-2 text-xs", status === "error" ? "text-red-700" : "text-slate-500"].join(
            " ",
          )}
        >
          {msg}
        </div>
      ) : null}

      {errorMessage ? <div className="mt-2 text-xs text-red-700">{errorMessage}</div> : null}
    </>
  );

  return (
    <div className={className} data-field-path={fieldPathAttr}>
      {variant === "default" && label ? (
        <div className="mb-1 text-sm font-medium text-neutral-900">{label}</div>
      ) : null}

      {variant === "default" ? (
        <div className={["rounded-xl border p-3", borderClass].join(" ")}>{content}</div>
      ) : (
        <div>{content}</div>
      )}

      {variant === "default" && hint ? (
        <div className="mt-1 text-xs text-neutral-500">{hint}</div>
      ) : null}
    </div>
  );
});

export default TurnstileWidget;
