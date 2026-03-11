// src/config/countries.ts

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import type { ICountry } from "@/types/shared.types";

countries.registerLocale(enLocale);

export const ALL_COUNTRIES: ICountry[] = Object.entries(
  countries.getNames("en", { select: "official" }),
).map(([code, name]) => ({
  code,
  name,
}));

export const NORTH_AMERICAN_COUNTRIES: ICountry[] = ALL_COUNTRIES.filter(
  (c) => c.code === "CA" || c.code === "US" || c.code === "MX",
);

export const NORTH_AMERICAN_COUNTRY_CODES = ["CA", "US", "MX"] as const;

/* ───────────────────────── Country helpers ───────────────────────── */

export const COUNTRY_NAME_BY_CODE = new Map(
  ALL_COUNTRIES.map((c) => [c.code.toUpperCase(), c.name] as const),
);

export function getCountryNameFromCode(code?: string | null): string {
  if (!code) return "";
  const normalized = String(code).trim().toUpperCase();
  return COUNTRY_NAME_BY_CODE.get(normalized) || normalized;
}

export function getCountryOptionByCode(code?: string | null): ICountry | undefined {
  if (!code) return undefined;
  const normalized = String(code).trim().toUpperCase();
  const name = COUNTRY_NAME_BY_CODE.get(normalized);
  return name ? { code: normalized, name } : undefined;
}
