/**
 * Shared industry page theme: background, accents, and gradients.
 * Ensures the entire industry page uses the hero theme (no navy on a green page).
 */

import type { IndustryHeroTheme } from "@/config/industryPages";

/** Theme-specific dark background (hero and dark sections) */
export const THEME_BG: Record<IndustryHeroTheme, string> = {
  green: "#0d3320",
  red: "#0f0a0c",
  blue: "#0c1929",
  slate: "#1a1f2e",
  amber: "#231a0d",
  steel: "#111827",
};

/** Theme accent — used for value headline, kicker, section underlines, stats. Intentional per theme (no red on green). */
export const THEME_ACCENT: Record<IndustryHeroTheme, string> = {
  green: "#34d399",
  red: "#f87171",
  blue: "#60a5fa",
  slate: "#94a3b8",
  amber: "#fbbf24",
  steel: "#9ca3af",
};

/** Light section background — subtle theme tint so the whole page feels themed */
export const THEME_LIGHT_BG: Record<IndustryHeroTheme, string> = {
  green: "#f0f7f4",
  red: "#faf5f5",
  blue: "#f0f4f9",
  slate: "#f2f3f5",
  amber: "#faf8f4",
  steel: "#f4f5f6",
};

/** Operational Proof background — slightly denser tint for evidence-focused section */
export const THEME_PROOF_BG: Record<IndustryHeroTheme, string> = {
  green: "#f4f8f6",
  red: "#f8f5f5",
  blue: "#f3f7fb",
  slate: "#f3f5f7",
  amber: "#f8f6f1",
  steel: "#f2f5f8",
};

/** Mode Fit background — cleaner companion tint to separate from Operational Proof */
export const THEME_MODEFIT_BG: Record<IndustryHeroTheme, string> = {
  green: "#dde8e1",
  red: "#e7dddd",
  blue: "#dbe4ee",
  slate: "#dde2e9",
  amber: "#e5dece",
  steel: "#d7dee8",
};

/** Radial gradient orbs for dark sections (e.g. How we support) — theme-tinted */
export function getThemeOrbs(theme: IndustryHeroTheme): { main: string; secondary: string } {
  switch (theme) {
    case "green":
      return { main: "rgba(16,185,129,0.08)", secondary: "rgba(5,150,105,0.05)" };
    case "red":
      return { main: "rgba(220,38,38,0.08)", secondary: "rgba(185,28,28,0.05)" };
    case "blue":
      return { main: "rgba(37,99,235,0.08)", secondary: "rgba(59,130,246,0.05)" };
    case "slate":
      return { main: "rgba(71,85,105,0.08)", secondary: "rgba(51,65,85,0.05)" };
    case "amber":
      return { main: "rgba(245,158,11,0.08)", secondary: "rgba(217,119,6,0.05)" };
    case "steel":
      return { main: "rgba(100,116,139,0.08)", secondary: "rgba(71,85,105,0.05)" };
    default:
      return { main: "rgba(220,38,38,0.08)", secondary: "rgba(185,28,28,0.05)" };
  }
}

/** Top bar gradient for step cards in How we support — theme-tinted */
export function getThemeBarGradient(theme: IndustryHeroTheme): string {
  switch (theme) {
    case "green":
      return "linear-gradient(90deg,#34d399_0%,rgba(16,185,129,0.12)_70%,transparent_100%)";
    case "red":
      return "linear-gradient(90deg,#ef4444_0%,rgba(220,38,38,0.12)_70%,transparent_100%)";
    case "blue":
      return "linear-gradient(90deg,#3b82f6_0%,rgba(37,99,235,0.12)_70%,transparent_100%)";
    case "slate":
      return "linear-gradient(90deg,#64748b_0%,rgba(71,85,105,0.12)_70%,transparent_100%)";
    case "amber":
      return "linear-gradient(90deg,#f59e0b_0%,rgba(245,158,11,0.12)_70%,transparent_100%)";
    case "steel":
      return "linear-gradient(90deg,#6b7280_0%,rgba(100,116,139,0.12)_70%,transparent_100%)";
    default:
      return "linear-gradient(90deg,#ef4444_0%,rgba(220,38,38,0.12)_70%,transparent_100%)";
  }
}
