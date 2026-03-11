export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nptlogistics.com";

export const SITE_NAME = "NPT Logistics";

export const SITE_DEFAULT_DESCRIPTION =
  "NPT Logistics provides reliable freight transportation across North America, specializing in truckload, LTL, cross-border, and temperature-controlled shipping.";

export const SITE_DEFAULT_OG_IMAGE = "/_optimized/brand/nptLogo-glow.webp";

export const COMPANY_CONTACT = {
  email: "sales@nptlogistics.com",
  phoneE164: "+15199683632",
  phoneDisplay: "+1 (519) 968-3632",
};

export const SOCIAL_PROFILES: string[] = [];

export function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

