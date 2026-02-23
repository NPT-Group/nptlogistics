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

function keywordsFor(item: { label: string; description?: string; href: string }) {
  const words = new Set<string>();

  const addWords = (txt: string) => {
    norm(txt)
      .replace(/[^\w\s↔-]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => words.add(w));
  };

  addWords(item.label);
  if (item.description) addWords(item.description);
  addWords(item.href);

  // Add a few useful synonyms
  const l = norm(item.label);
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
  if (l.includes("guides")) ["guide", "shipping guides", "resources"].forEach((k) => words.add(k));

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
    const section = NAV[sectionKey] as NavSection & any;

    // Section intro CTA
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

    // Solutions uses "categories", others use "links"
    const links: readonly NavLink[] =
      sectionKey === "solutions"
        ? (section.categories || []).flatMap((c: any) => c.links || [])
        : section.links || [];

    links.forEach((l) => pushLink(items, sectionKey, section.label, l));
  });

  return items;
}

export const NAV_INDEX = buildNavIndex();

export function findNavHref(query: string) {
  const q = norm(query);
  if (!q) return null;

  // 1) exact label match
  const exact = NAV_INDEX.find((i) => norm(i.label) === q);
  if (exact) return exact.href;

  // 2) contains label
  const contains = NAV_INDEX.find((i) => norm(i.label).includes(q));
  if (contains) return contains.href;

  // 3) keyword hit scoring
  const terms = q.split(/\s+/).filter(Boolean);
  let best: { href: string; score: number } | null = null;

  for (const item of NAV_INDEX) {
    let score = 0;
    for (const t of terms) {
      if (item.keywords.includes(t)) score += 2;
      if (norm(item.label).includes(t)) score += 3;
      if (norm(item.href).includes(t)) score += 1;
    }
    if (!best || score > best.score) best = { href: item.href, score };
  }

  if (best && best.score >= 3) return best.href;
  return null;
}

export function getSectionCtas() {
  return {
    solutions: NAV.solutions.intro.ctaHref,
    industries: NAV.industries.intro.ctaHref,
    company: NAV.company.intro.ctaHref,
    careers: NAV.careers.intro.ctaHref,
  };
}
