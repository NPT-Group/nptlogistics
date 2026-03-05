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
