"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import {
  applyAnalyticsConsent,
  createConsentPreferences,
  readConsentPreferences,
  saveConsentPreferences,
  type ConsentPreferences,
} from "@/lib/analytics/consent";
import { cn } from "@/lib/cn";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

type BannerMode = "compact" | "preferences";
const ANALYTICS_EXCLUDED_PREFIXES = ["/admin"];

function CookieConsentBanner({
  initialized,
  consent,
  onSave,
}: {
  initialized: boolean;
  consent: ConsentPreferences | null;
  onSave: (analytics: boolean) => void;
}) {
  const [visible, setVisible] = React.useState(false);
  const [mode, setMode] = React.useState<BannerMode>("compact");
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(consent?.analytics ?? true);

  React.useEffect(() => {
    setAnalyticsEnabled(consent?.analytics ?? true);
  }, [consent]);

  // Wait for consent initialization before deciding visibility to avoid flash/hide.
  React.useEffect(() => {
    if (!initialized) return;
    setVisible(!consent);
  }, [consent, initialized]);

  React.useEffect(() => {
    const openPreferences = () => {
      setVisible(true);
      setMode("preferences");
    };
    window.addEventListener("npt:open-cookie-preferences", openPreferences);
    return () => window.removeEventListener("npt:open-cookie-preferences", openPreferences);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-3 bottom-3 left-3 z-[120] w-auto pb-[env(safe-area-inset-bottom)] sm:right-auto sm:bottom-5 sm:left-5 sm:w-[min(92vw,430px)]">
      <div
        className={cn(
          "rounded-2xl border border-[color:var(--color-border-light)] bg-white p-4 shadow-[0_20px_50px_rgba(2,6,23,0.18)]",
          "backdrop-blur",
        )}
      >
        <div className="text-sm font-semibold text-[color:var(--color-text-light)]">Cookie settings</div>
        <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--color-muted-light)]">
          We use essential cookies to run the site and optional analytics cookies to understand
          performance and improve conversion.
        </p>

        {mode === "preferences" ? (
          <div className="mt-3 rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)]/50 p-3">
            <label className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-xs font-semibold text-[color:var(--color-text-light)]">
                  Analytics cookies
                </span>
                <span className="block text-[11px] text-[color:var(--color-muted-light)]">
                  Helps us measure CTA clicks and page engagement.
                </span>
              </span>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="h-4 w-4 accent-[color:var(--color-brand-600)]"
              />
            </label>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              onSave(true);
              setVisible(false);
            }}
            className="inline-flex h-9 items-center justify-center rounded-md bg-[color:var(--color-brand-600)] px-3.5 text-xs font-semibold text-white hover:bg-[color:var(--color-brand-700)]"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(false);
              setVisible(false);
            }}
            className="inline-flex h-9 items-center justify-center rounded-md border border-[color:var(--color-border-light)] bg-white px-3.5 text-xs font-semibold text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]"
          >
            Reject non-essential
          </button>
          {mode === "compact" ? (
            <button
              type="button"
              onClick={() => setMode("preferences")}
              className="inline-flex h-9 items-center justify-center rounded-md border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)]/40 px-3.5 text-xs font-semibold text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]"
            >
              Manage preferences
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onSave(analyticsEnabled);
                setVisible(false);
              }}
              className="inline-flex h-9 items-center justify-center rounded-md border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)]/40 px-3.5 text-xs font-semibold text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]"
            >
              Save preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsClient() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeExcluded = ANALYTICS_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const [consent, setConsent] = React.useState<ConsentPreferences | null>(null);
  const [initialized, setInitialized] = React.useState(false);
  const trackedPathRef = React.useRef<string>("");

  React.useEffect(() => {
    const stored = readConsentPreferences();
    if (stored) {
      setConsent(stored);
      applyAnalyticsConsent(stored);
    }
    setInitialized(true);
  }, []);

  React.useEffect(() => {
    if (
      routeExcluded ||
      !initialized ||
      !gaId ||
      !consent?.analytics ||
      typeof window.gtag !== "function"
    ) {
      return;
    }

    const pagePath = pathname;
    if (trackedPathRef.current === pagePath) return;

    trackedPathRef.current = pagePath;
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
      transport_type: "beacon",
    });
  }, [consent?.analytics, gaId, initialized, pathname, routeExcluded, searchParams]);

  const saveConsent = React.useCallback((analytics: boolean) => {
    const next = createConsentPreferences(analytics);
    saveConsentPreferences(next);
    setConsent(next);
    applyAnalyticsConsent(next);
    window.dispatchEvent(new CustomEvent("npt:cookie_consent_updated", { detail: next }));
  }, []);

  if (!gaId || routeExcluded) return null;

  return (
    <>
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script
          id="npt-ga-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  functionality_storage: 'granted',
                  personalization_storage: 'denied',
                  security_storage: 'granted',
                  wait_for_update: 500
                });
                gtag('config', '${gaId}', {
                  send_page_view: false,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false
                });
              `,
          }}
        />
      </>

      <CookieConsentBanner initialized={initialized} consent={consent} onSave={saveConsent} />
    </>
  );
}
