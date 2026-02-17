export const CONSENT_STORAGE_KEY = "npt_cookie_consent";
const CONSENT_COOKIE_KEY = "npt_cookie_consent";
const CONSENT_VERSION = 1;
const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  version: number;
  updatedAt: string;
};

export function createConsentPreferences(analytics: boolean): ConsentPreferences {
  return {
    necessary: true,
    analytics,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

export function readConsentPreferences(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentPreferences;
    if (typeof parsed?.analytics !== "boolean") return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      version: parsed.version ?? CONSENT_VERSION,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveConsentPreferences(preferences: ConsentPreferences) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(preferences);
  window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
  document.cookie = `${CONSENT_COOKIE_KEY}=${encodeURIComponent(serialized)}; Max-Age=${CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Secure`;
}

export function hasAnalyticsConsent() {
  const preferences = readConsentPreferences();
  return preferences?.analytics === true;
}

export function applyAnalyticsConsent(preferences: ConsentPreferences) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    gtag?: (
      command: "consent",
      action: "update",
      params: Record<string, "granted" | "denied">,
    ) => void;
  };

  if (typeof w.gtag !== "function") return;
  w.gtag("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
  });
}
