import { hasAnalyticsConsent } from "@/lib/analytics/consent";

type CtaClickPayload = {
  ctaId: string;
  location: string;
  destination?: string;
  label?: string;
};

export function toCtaSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function trackCtaClick(payload: CtaClickPayload) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: "cta_click",
    ...payload,
    ts: Date.now(),
  };

  const w = window as typeof window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  };

  if (hasAnalyticsConsent()) {
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(eventPayload);
    }
    if (typeof w.gtag === "function") {
      w.gtag("event", "cta_click", payload);
    }
  }

  window.dispatchEvent(new CustomEvent("npt:cta_click", { detail: eventPayload }));
}
