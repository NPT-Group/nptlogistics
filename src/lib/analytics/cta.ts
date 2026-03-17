import { hasAnalyticsConsent } from "@/lib/analytics/consent";

type CtaClickPayload = {
  ctaId: string;
  location: string;
  destination?: string;
  label?: string;
};

const MAX_DIMENSION_LENGTH = 120;
const CLICK_DEDUPE_WINDOW_MS = 800;

let lastEventKey = "";
let lastEventAt = 0;

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

  const ctaId = toCtaSlug(payload.ctaId).slice(0, MAX_DIMENSION_LENGTH);
  const location = toCtaSlug(payload.location).slice(0, MAX_DIMENSION_LENGTH);
  const destination = payload.destination ? normalizeDestination(payload.destination) : undefined;
  const label = payload.label?.trim().slice(0, MAX_DIMENSION_LENGTH);

  if (!ctaId || !location) return;

  // Ignore accidental double-click bursts for the same action.
  const now = Date.now();
  const dedupeKey = `${ctaId}|${location}|${destination ?? ""}|${window.location.pathname}`;
  if (dedupeKey === lastEventKey && now - lastEventAt < CLICK_DEDUPE_WINDOW_MS) return;
  lastEventKey = dedupeKey;
  lastEventAt = now;

  const eventPayload: Record<string, unknown> = {
    event: "cta_click",
    ctaId,
    location,
    interaction_type: "click",
    page_path: window.location.pathname,
    page_title: document.title,
  };
  if (destination) eventPayload.destination = destination;
  if (label) eventPayload.label = label;

  const w = window as typeof window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  };

  if (hasAnalyticsConsent()) {
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(eventPayload);
    }
    if (typeof w.gtag === "function") {
      const gaPayload = { ...eventPayload };
      delete gaPayload.event;
      w.gtag("event", "cta_click", gaPayload);
    }
  }

  window.dispatchEvent(new CustomEvent("npt:cta_click", { detail: eventPayload }));
}

function normalizeDestination(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // Keep analytics dimensions low-cardinality by tracking canonical path only.
  try {
    const asUrl = new URL(trimmed, window.location.origin);
    return `${asUrl.pathname}${asUrl.hash}`.slice(0, MAX_DIMENSION_LENGTH);
  } catch {
    return trimmed.slice(0, MAX_DIMENSION_LENGTH);
  }
}
