// src/lib/chatbot/navIndex.ts
import { NAV, type NavLink, type NavSection } from "@/config/navigation";

export type NavIndexItem = {
  sectionKey: keyof typeof NAV;
  sectionLabel: string;

  label: string;
  href: string;
  description?: string;
  icon?: NavLink["icon"];

  keywords: string[];
};

function norm(s: string) {
  return (s || "").toLowerCase().trim();
}

function tokenize(s: string) {
  return norm(s)
    .replace(/[^\w\s↔-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function keywordsFor(item: { label: string; description?: string; href: string }) {
  const words = new Set<string>();

  const add = (txt?: string) => {
    if (!txt) return;
    tokenize(txt).forEach((w) => words.add(w));
  };

  add(item.label);
  add(item.description);
  add(item.href);

  const l = norm(item.label);

  // Helpful synonyms
  if (l.includes("truckload") || l.includes("(tl)"))
    ["tl", "ftl", "truckload"].forEach((k) => words.add(k));
  if (l.includes("less-than-truckload") || l.includes("(ltl)"))
    ["ltl", "partial", "less-than-truckload"].forEach((k) => words.add(k));
  if (l.includes("intermodal")) ["rail", "train", "intermodal"].forEach((k) => words.add(k));
  if (l.includes("expedited"))
    ["expedite", "rush", "priority", "expedited"].forEach((k) => words.add(k));
  if (l.includes("hazardous") || l.includes("hazmat"))
    ["hazmat", "dangerous", "tdg"].forEach((k) => words.add(k));
  if (l.includes("temperature"))
    ["reefer", "temp", "cold", "coldchain"].forEach((k) => words.add(k));
  if (l.includes("cross-border"))
    ["border", "customs", "canada", "usa", "mexico"].forEach((k) => words.add(k));
  if (l.includes("warehousing"))
    ["warehouse", "storage", "distribution", "3pl"].forEach((k) => words.add(k));
  if (l.includes("faq")) ["faqs", "help", "questions"].forEach((k) => words.add(k));
  if (l.includes("guides")) ["guide", "shipping", "resources"].forEach((k) => words.add(k));

  return Array.from(words);
}

function pushLink(
  acc: NavIndexItem[],
  sectionKey: keyof typeof NAV,
  sectionLabel: string,
  link: NavLink,
) {
  acc.push({
    sectionKey,
    sectionLabel,
    label: link.label,
    href: link.href,
    description: link.description,
    icon: link.icon,
    keywords: keywordsFor({ label: link.label, description: link.description, href: link.href }),
  });

  (link.children || []).forEach((child) => {
    acc.push({
      sectionKey,
      sectionLabel,
      label: `${link.label} — ${child.label}`,
      href: child.href,
      description: link.description,
      icon: link.icon,
      keywords: keywordsFor({
        label: `${link.label} ${child.label}`,
        description: link.description,
        href: child.href,
      }),
    });
  });
}

export function buildNavIndex() {
  const items: NavIndexItem[] = [];

  (Object.keys(NAV) as Array<keyof typeof NAV>).forEach((sectionKey) => {
    const section = NAV[sectionKey] as unknown as NavSection & {
      categories?: Array<{ title: string; links: readonly NavLink[] }>;
    };

    // Intro CTA as an indexable item
    items.push({
      sectionKey,
      sectionLabel: section.label,
      label: section.intro?.ctaLabel || `View ${section.label}`,
      href: section.intro?.ctaHref || "/",
      description: section.intro?.description,
      icon: undefined,
      keywords: keywordsFor({
        label: section.intro?.ctaLabel || section.label,
        description: section.intro?.description,
        href: section.intro?.ctaHref || "/",
      }),
    });

    // Solutions has categories; others have links
    const links: readonly NavLink[] =
      sectionKey === "solutions"
        ? (section.categories || []).flatMap((c) => c.links || [])
        : section.links || [];

    links.forEach((l) => pushLink(items, sectionKey, section.label, l));
  });

  return items;
}

export const NAV_INDEX = buildNavIndex();

export type NavMatch = {
  label: string;
  href: string;
  description?: string;
  sectionLabel: string;
  sectionKey: keyof typeof NAV;
  score: number;
};

export function searchNavMatches(query: string, limit = 3): NavMatch[] {
  const q = norm(query);
  if (!q) return [];

  const terms = tokenize(q);

  const scored = NAV_INDEX.map((item) => {
    const labelN = norm(item.label);
    const hrefN = norm(item.href);

    let score = 0;

    // Strong signals
    if (labelN === q) score += 24;
    if (labelN.includes(q)) score += 12;

    // Term-based scoring
    for (const t of terms) {
      if (labelN.includes(t)) score += 5;
      if (item.keywords.includes(t)) score += 4;
      if (hrefN.includes(t)) score += 1;
    }

    // Slight preference for non-anchor pages unless query includes "section" etc.
    if (item.href.includes("#")) score -= 0.5;

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, limit))
    .map((s) => ({
      label: s.item.label,
      href: s.item.href,
      description: s.item.description,
      sectionLabel: s.item.sectionLabel,
      sectionKey: s.item.sectionKey,
      score: s.score,
    }));
}

/**
 * A "confident" single href.
 * Used for suggestion widgets; we still do NOT auto-navigate.
 */
export function findNavHref(query: string) {
  const top = searchNavMatches(query, 1)[0];
  if (!top) return null;
  return top.score >= 7 ? top.href : null;
}

export function getSectionCtas() {
  return {
    solutions: NAV.solutions.intro.ctaHref,
    industries: NAV.industries.intro.ctaHref,
    company: NAV.company.intro.ctaHref,
    careers: NAV.careers.intro.ctaHref,
  };
}

export function getSolutionsTopLinks() {
  const solutions = NAV.solutions as unknown as {
    categories: Array<{ title: string; links: readonly NavLink[] }>;
  };
  return (solutions.categories || []).flatMap((c) => c.links || []);
}
