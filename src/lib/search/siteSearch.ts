import { NAV_INDEX } from "@/lib/chatbot/navIndex";
import { SEO_LOCATIONS } from "@/config/seoLocations";
import { SEO_LANES } from "@/config/seoLanes";
import { getIndustryBySlug, getIndustrySlugs } from "@/config/industryPages";
import { SERVICES } from "@/config/services";

export type SiteSearchResult = {
  label: string;
  href: string;
  description?: string;
  keywords: string[];
  score: number;
};

type SearchCandidate = {
  label: string;
  href: string;
  description?: string;
  keywords: string[];
};

const SMART_ALIASES: Array<Omit<SearchCandidate, "keywords"> & { keywords: string[] }> = [
  {
    label: "Flatbed",
    href: "/services/truckload#section-flatbed",
    description: "Open-deck securement freight",
    keywords: ["flatbed", "flat bed", "open deck", "open-deck"],
  },
  {
    label: "Step Deck",
    href: "/services/truckload#section-step-deck",
    description: "Drop-deck for tall cargo",
    keywords: ["stepdeck", "step deck", "drop deck", "drop-deck"],
  },
  {
    label: "Dry Van",
    href: "/services/truckload#section-dry-van",
    description: "Enclosed truckload freight",
    keywords: ["dryvan", "dry van", "van freight"],
  },
  {
    label: "RGN (Oversize)",
    href: "/services/truckload#section-rgn-oversize",
    description: "Permit and heavy-haul freight",
    keywords: ["rgn", "oversize", "heavy haul", "oversized"],
  },
  {
    label: "Roll-Tite / Conestoga",
    href: "/services/truckload#section-roll-tite-conestoga",
    description: "Covered-deck protection",
    keywords: ["conestoga", "roll tite", "roll-tite", "covered deck"],
  },
  {
    label: "Request a Quote",
    href: "/quote",
    description: "Get pricing and planning support",
    keywords: ["quote", "pricing", "rate", "rfq"],
  },
];

const LOCATION_CANDIDATES: SearchCandidate[] = SEO_LOCATIONS.map((loc) => ({
  label: `${loc.city}, ${loc.region}`,
  href: `/locations/${loc.slug}`,
  description: `Freight services in ${loc.city}`,
  keywords: [
    loc.city.toLowerCase(),
    loc.region.toLowerCase(),
    loc.slug.toLowerCase(),
    `${loc.city.toLowerCase()} freight`,
    `${loc.city.toLowerCase()} logistics`,
  ],
}));

const LANE_CANDIDATES: SearchCandidate[] = SEO_LANES.map((lane) => ({
  label: `${lane.originLabel} → ${lane.destinationLabel}`,
  href: `/lanes/${lane.slug}`,
  description: lane.title,
  keywords: [
    lane.originLabel.toLowerCase(),
    lane.destinationLabel.toLowerCase(),
    lane.slug.toLowerCase(),
    lane.title.toLowerCase(),
    ...lane.bestFor.map((x) => x.toLowerCase()),
  ],
}));

const INDUSTRY_CANDIDATES: SearchCandidate[] = getIndustrySlugs()
  .map((slug) => getIndustryBySlug(slug))
  .filter((x): x is NonNullable<typeof x> => Boolean(x))
  .map((industry) => ({
    label: industry.hero.title,
    href: `/industries/${industry.slug}`,
    description: industry.hero.description,
    keywords: [
      industry.slug.toLowerCase(),
      industry.hero.kicker?.toLowerCase() ?? "",
      industry.hero.valueHeadline.toLowerCase(),
      industry.hero.title.toLowerCase(),
      ...industry.relatedServices.links.map((x) => x.label.toLowerCase()),
    ].filter(Boolean),
  }));

const SERVICE_SECTION_CANDIDATES: SearchCandidate[] = Object.values(SERVICES).flatMap((service) => {
  const base: SearchCandidate[] = [
    {
      label: service.hero.kicker,
      href: `/services/${service.slug}`,
      description: service.hero.title,
      keywords: [
        service.slug.toLowerCase(),
        service.hero.kicker.toLowerCase(),
        service.hero.title.toLowerCase(),
      ],
    },
  ];

  const sectionCandidates = (service.sections ?? []).map((section) => ({
    label: section.label,
    href: `/services/${service.slug}#section-${section.key}`,
    description: section.trustSnippet?.title ?? section.title,
    keywords: [
      section.key.toLowerCase(),
      section.label.toLowerCase(),
      section.title.toLowerCase(),
      section.description.toLowerCase(),
    ],
  }));

  return [...base, ...sectionCandidates];
});

const NAV_CANDIDATES: SearchCandidate[] = NAV_INDEX.map((n) => ({
  label: n.label,
  href: n.href,
  description: n.description,
  keywords: n.keywords,
}));

const CANDIDATES: SearchCandidate[] = [
  ...SMART_ALIASES,
  ...NAV_CANDIDATES,
  ...SERVICE_SECTION_CANDIDATES,
  ...INDUSTRY_CANDIDATES,
  ...LOCATION_CANDIDATES,
  ...LANE_CANDIDATES,
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\w\s-]/g, " ").trim();
}

function compact(value: string) {
  return normalize(value).replace(/\s+/g, "");
}

function toTerms(value: string) {
  return normalize(value).split(/\s+/).filter(Boolean);
}

export function getSiteSearchResults(query: string, limit = 6): SiteSearchResult[] {
  const normalized = normalize(query);
  if (!normalized) return [];

  const terms = toTerms(normalized);
  const compactQuery = compact(normalized);

  const scored = CANDIDATES.map((candidate) => {
    const labelN = normalize(candidate.label);
    const descN = normalize(candidate.description ?? "");
    const hrefN = normalize(candidate.href);
    const keyN = candidate.keywords.map(normalize);
    const keyCompact = keyN.map(compact);
    const labelCompact = compact(candidate.label);

    let score = 0;

    if (labelN === normalized) score += 60;
    if (labelCompact === compactQuery) score += 70;
    if (labelN.includes(normalized)) score += 25;
    if (descN.includes(normalized)) score += 8;

    for (const k of keyN) {
      if (k === normalized) score += 40;
      if (k.includes(normalized)) score += 14;
    }

    for (const k of keyCompact) {
      if (k === compactQuery) score += 45;
    }

    for (const t of terms) {
      if (labelN.includes(t)) score += 8;
      if (descN.includes(t)) score += 3;
      if (hrefN.includes(t)) score += 2;
      if (keyN.some((k) => k.includes(t))) score += 6;
    }

    // Prefer specific anchored destinations for service intent.
    if (candidate.href.includes("#section-")) score += 3;

    return { candidate, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // Deduplicate by href while keeping best score.
  const deduped: SiteSearchResult[] = [];
  const seen = new Set<string>();
  for (const row of scored) {
    if (seen.has(row.candidate.href)) continue;
    seen.add(row.candidate.href);
    deduped.push({
      label: row.candidate.label,
      href: row.candidate.href,
      description: row.candidate.description,
      keywords: row.candidate.keywords,
      score: row.score,
    });
    if (deduped.length >= limit) break;
  }

  return deduped;
}

