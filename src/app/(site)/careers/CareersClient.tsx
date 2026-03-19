// src/app/(site)/careers/CareersClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Home,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { NAV_OFFSET } from "@/constants/ui";
import { EEmploymentType, EWorkplaceType } from "@/types/jobPosting.types";
import { trackCtaClick } from "@/lib/analytics/cta";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { Select } from "@/app/(site)/components/ui/Select";
import { HeroImage } from "@/components/media/HeroImage";
import { cn } from "@/lib/cn";
import { NEXT_PUBLIC_NPT_HR_EMAIL } from "@/config/env";

type SortBy = "publishedAt" | "title" | "createdAt";
type SortDir = "asc" | "desc";

type JobItem = any;

type JobsMeta = {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  sortBy?: SortBy;
  sortDir?: SortDir;
};

type Query = {
  page: number;
  pageSize: number;
  q: string;
  department: string;
  location: string;
  workplaceType: string;
  employmentType: string;
  sortBy: SortBy;
  sortDir: SortDir;
};

function pillLabel(v?: string) {
  return (v || "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function fmtDate(d?: any) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function clampPage(p: number) {
  return Number.isFinite(p) && p > 0 ? Math.floor(p) : 1;
}

function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const extra = 12;
  const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET - extra;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

const WORKPLACE_OPTIONS = [
  { value: "", label: "Workplace type" },
  ...Object.values(EWorkplaceType).map((v) => ({ value: v, label: pillLabel(v) })),
];

const EMPLOYMENT_OPTIONS = [
  { value: "", label: "Employment type" },
  ...Object.values(EEmploymentType).map((v) => ({ value: v, label: pillLabel(v) })),
];

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "publishedAt:desc", label: "Newest" },
  { value: "publishedAt:asc", label: "Oldest" },
  { value: "title:asc", label: "Title (A–Z)" },
  { value: "title:desc", label: "Title (Z–A)" },
  { value: "createdAt:desc", label: "Recently added" },
];

const DEFAULTS = {
  page: 1,
  pageSize: 12,
  sortBy: "publishedAt" as SortBy,
  sortDir: "desc" as SortDir,
};

function buildUrlParams(q: Query) {
  const qs = new URLSearchParams();

  if (q.q.trim()) qs.set("q", q.q.trim());
  if (q.department.trim()) qs.set("department", q.department.trim());
  if (q.location.trim()) qs.set("location", q.location.trim());
  if (q.workplaceType) qs.set("workplaceType", q.workplaceType);
  if (q.employmentType) qs.set("employmentType", q.employmentType);

  const page = clampPage(q.page);
  const pageSize = q.pageSize || DEFAULTS.pageSize;

  if (page !== DEFAULTS.page) qs.set("page", String(page));
  if (pageSize !== DEFAULTS.pageSize) qs.set("pageSize", String(pageSize));

  if (q.sortBy !== DEFAULTS.sortBy) qs.set("sortBy", q.sortBy);
  if (q.sortDir !== DEFAULTS.sortDir) qs.set("sortDir", q.sortDir);

  return qs;
}

async function fetchJobs(qs: URLSearchParams, signal?: AbortSignal) {
  const res = await fetch(`/api/v1/jobs?${qs.toString()}`, { signal, cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to fetch jobs");
  return json as { data: { items: JobItem[]; meta: JobsMeta } };
}

function parseSortValue(v: string): { sortBy: SortBy; sortDir: SortDir } {
  const [rawSortBy, rawDir] = (v || "").split(":");

  const allowed = new Set<SortBy>(["publishedAt", "title", "createdAt"]);
  const sortBy: SortBy = allowed.has(rawSortBy as SortBy) ? (rawSortBy as SortBy) : "publishedAt";
  const sortDir: SortDir = rawDir === "asc" ? "asc" : "desc";

  return { sortBy, sortDir };
}

export default function CareersClient({
  initialItems,
  initialMeta,
  initialQuery,
}: {
  initialItems: JobItem[];
  initialMeta: JobsMeta;
  initialQuery: Query;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [query, setQuery] = React.useState<Query>(initialQuery);
  const queryRef = React.useRef<Query>(initialQuery);
  const lastUrlRef = React.useRef<string>("");
  const didMountRef = React.useRef(false);

  React.useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const [items, setItems] = React.useState<JobItem[]>(initialItems ?? []);
  const [meta, setMeta] = React.useState<JobsMeta>(initialMeta ?? {});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const jobsAbortRef = React.useRef<AbortController | null>(null);
  const resultsRef = React.useRef<HTMLDivElement | null>(null);

  const SECTION_SCROLL_MARGIN_TOP = `${NAV_OFFSET}px`;

  // local inputs (debounced), same idea as blog
  const [qInput, setQInput] = React.useState(initialQuery.q ?? "");
  const [deptInput, setDeptInput] = React.useState(initialQuery.department ?? "");
  const [locInput, setLocInput] = React.useState(initialQuery.location ?? "");

  const activeFilters = Boolean(
    query.q.trim() ||
    query.department.trim() ||
    query.location.trim() ||
    query.workplaceType ||
    query.employmentType ||
    query.sortBy !== DEFAULTS.sortBy ||
    query.sortDir !== DEFAULTS.sortDir,
  );

  const scrollToResults = React.useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const runFetch = React.useCallback(
    async (next: Partial<Query>, opts?: { scroll?: boolean; replaceUrl?: boolean }) => {
      const scroll = opts?.scroll ?? false;
      const replaceUrl = opts?.replaceUrl ?? true;

      const base = queryRef.current;
      const merged: Query = { ...base, ...next };

      merged.page = clampPage(merged.page);
      merged.pageSize = merged.pageSize || DEFAULTS.pageSize;
      merged.sortBy = (merged.sortBy || DEFAULTS.sortBy) as SortBy;
      merged.sortDir = (merged.sortDir || DEFAULTS.sortDir) as SortDir;

      const qs = buildUrlParams(merged);
      const qsStr = qs.toString();
      const nextUrl = `/careers${qsStr ? `?${qsStr}` : ""}`;

      if (replaceUrl && lastUrlRef.current !== nextUrl) {
        lastUrlRef.current = nextUrl;
        router.replace(nextUrl, { scroll: false });
      }

      jobsAbortRef.current?.abort();
      const ac = new AbortController();
      jobsAbortRef.current = ac;

      setLoading(true);
      setError(null);

      try {
        const resp = await fetchJobs(qs, ac.signal);
        setItems(resp.data.items ?? []);
        setMeta(resp.data.meta ?? {});
        setQuery(merged);

        if (scroll) scrollToResults();
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message ?? "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [router, scrollToResults],
  );

  // sync from URL like blog
  React.useEffect(() => {
    const nextPage = clampPage(Number(sp.get("page") ?? String(DEFAULTS.page)));
    const nextPageSize =
      Number(sp.get("pageSize") ?? String(queryRef.current.pageSize ?? DEFAULTS.pageSize)) ||
      DEFAULTS.pageSize;

    const rawSortBy = sp.get("sortBy") ?? DEFAULTS.sortBy;
    const rawSortDir = sp.get("sortDir") ?? DEFAULTS.sortDir;

    const allowedSort = new Set<SortBy>(["publishedAt", "title", "createdAt"]);
    const nextSortBy: SortBy = allowedSort.has(rawSortBy as SortBy)
      ? (rawSortBy as SortBy)
      : DEFAULTS.sortBy;
    const nextSortDir: SortDir = rawSortDir === "asc" ? "asc" : "desc";

    const next: Query = {
      page: nextPage,
      pageSize: nextPageSize,
      q: sp.get("q") ?? "",
      department: sp.get("department") ?? "",
      location: sp.get("location") ?? "",
      workplaceType: sp.get("workplaceType") ?? "",
      employmentType: sp.get("employmentType") ?? "",
      sortBy: nextSortBy,
      sortDir: nextSortDir,
    };

    const prev = queryRef.current;

    const changed =
      prev.page !== next.page ||
      prev.pageSize !== next.pageSize ||
      prev.q !== next.q ||
      prev.department !== next.department ||
      prev.location !== next.location ||
      prev.workplaceType !== next.workplaceType ||
      prev.employmentType !== next.employmentType ||
      prev.sortBy !== next.sortBy ||
      prev.sortDir !== next.sortDir;

    if (!changed) return;

    setQuery(next);

    // blog-style input sync only when URL changed externally/browser nav
    setQInput((prevVal) => (prevVal === next.q ? prevVal : next.q));
    setDeptInput((prevVal) => (prevVal === next.department ? prevVal : next.department));
    setLocInput((prevVal) => (prevVal === next.location ? prevVal : next.location));
  }, [sp]);

  // debounced fetch for text inputs, same search behavior pattern as blog
  React.useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const t = window.setTimeout(() => {
      const current = queryRef.current;

      if (
        qInput === current.q &&
        deptInput === current.department &&
        locInput === current.location
      ) {
        return;
      }

      runFetch(
        {
          q: qInput,
          department: deptInput,
          location: locInput,
          page: 1,
        },
        { replaceUrl: true, scroll: false },
      );
    }, 350);

    return () => window.clearTimeout(t);
  }, [qInput, deptInput, locInput, runFetch]);

  // deep-link support: /careers#overview | #why | #drive | #jobs
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash || "";
    const id = hash.replace("#", "");
    if (!id) return;
    const t = window.setTimeout(() => scrollToId(id), 50);
    return () => window.clearTimeout(t);
  }, []);

  const canPrev = Boolean(meta?.hasPrev ?? (meta?.page ?? query.page) > 1);
  const canNext = Boolean(meta?.hasNext ?? (meta?.page ?? query.page) < (meta?.totalPages ?? 1));

  const sortValue = `${query.sortBy}:${query.sortDir}`;

  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } } };

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <>
      <Section
        id="overview"
        className="relative overflow-hidden bg-[color:var(--color-surface-0)]"
        variant="dark"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <HeroImage
              src="/_optimized/careers/careers-banner.webp"
              alt="Careers banner"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15"
            aria-hidden="true"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(900px 450px at 10% 0%, rgba(220,38,38,0.18), transparent 60%), radial-gradient(700px 420px at 90% 25%, rgba(15,23,42,0.14), transparent 60%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-20"
            style={{ background: "linear-gradient(to bottom, transparent, #070a12)" }}
            aria-hidden="true"
          />
        </div>

        <div className="relative">
          <Container className="site-page-container">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="pt-14 pb-14 sm:pt-20 sm:pb-18"
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-600)]" />
                Careers at NPT Logistics
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
                className={cn(
                  "mt-4 max-w-3xl font-semibold tracking-tight text-white",
                  "text-3xl sm:text-4xl lg:text-5xl",
                )}
              >
                Drive Impact. Deliver Excellence.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                className="mt-3 max-w-2xl text-sm leading-relaxed text-[rgba(255,255,255,0.85)] sm:text-base"
              >
                Join a high-performance team where precision meets opportunity. Whether you're
                navigating the road or optimizing global supply chains, NPT provides the stability,
                scale, and strategic vision to accelerate your career.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    scrollToId("jobs");
                  }}
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold",
                    "cursor-pointer border border-[color:var(--color-brand-600)] bg-[linear-gradient(180deg,var(--color-brand-600),var(--color-brand-700))] text-white shadow-[0_8px_20px_rgba(220,38,38,0.25)] transition hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(220,38,38,0.32)]",
                    "focus-ring-surface",
                  )}
                >
                  View Open Roles <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    scrollToId("drive");
                  }}
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold",
                    "cursor-pointer border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.10)] text-[color:var(--color-muted-strong)] shadow-sm backdrop-blur transition hover:-translate-y-[2px] hover:border-[rgba(255,255,255,0.38)] hover:text-white",
                    "focus-ring-surface",
                  )}
                >
                  Driver Opportunities <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  Clear expectations
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  Safety-led decisions
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  Strong dispatch & ops support
                </div>
              </motion.div>
            </motion.div>
          </Container>
        </div>
      </Section>

      <Section
        id="why"
        className="relative py-14 sm:py-16"
        variant="light"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 420px at 20% 0%, rgba(220,38,38,0.06), transparent 60%), radial-gradient(900px 420px at 90% 10%, rgba(15,23,42,0.04), transparent 60%)",
          }}
        />
        <div className="relative">
          <Container className="site-page-container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
                    <span className="text-[10.5px] font-bold tracking-[0.15em] text-[color:var(--color-brand-500)] uppercase">
                      The NPT Advantage
                    </span>
                  </div>
                  <h2 className="text-[1.6rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.95rem] lg:text-[2.2rem]">
                    Uncompromising Standards. Unwavering Support.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted-light)]">
                    We operate at the intersection of speed and reliability. Our culture is built on
                    operational clarity, direct communication, and an absolute commitment to
                    safety—so you can focus on execution.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToId("jobs")}
                  className={cn(
                    "hidden cursor-pointer items-center gap-2 rounded-md border border-[color:var(--color-border-light)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-text-light)] shadow-sm transition hover:bg-[color:var(--color-surface-0-light)] sm:inline-flex",
                    "focus-ring-light",
                  )}
                >
                  See openings <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {[
                  {
                    title: "Safety as a Core Value",
                    desc: "Rigorous training, state-of-the-art equipment, and protocols designed to protect our people and the public.",
                  },
                  {
                    title: "Operational Clarity",
                    desc: "Streamlined workflows, intelligent technology, and zero ambiguity. We set clear expectations and provide the tools to meet them.",
                  },
                  {
                    title: "Dedicated Support Infrastructure",
                    desc: "Dispatch and operations teams that operate as true partners, resolving complex challenges with speed and precision.",
                  },
                  {
                    title: "Accelerated Career Trajectory",
                    desc: "We reward ownership and results. As we scale, we provide the framework for you to expand your scope and lead with impact.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="site-card-surface-subtle overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-[2px]"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--color-text-light)]">
                      <CheckCircle2 className="h-4 w-4 text-[color:var(--color-brand-600)]" />
                      {c.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted-light)]">
                      {c.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </div>
      </Section>

      <Section
        id="drive"
        className="relative overflow-hidden"
        variant="dark"
        style={{
          backgroundColor: "var(--color-about-operating-bg)",
          scrollMarginTop: SECTION_SCROLL_MARGIN_TOP,
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.06),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(15,23,42,0.6),transparent_70%)]" />
        </div>
        <Container className="site-page-container relative">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
                <span className="text-[10.5px] font-bold tracking-[0.15em] text-[color:var(--color-brand-500)] uppercase">
                  Fleet Operations
                </span>
              </div>

              <h2 className="text-[1.6rem] font-semibold tracking-tight text-white sm:text-[1.95rem] lg:text-[2.2rem]">
                Elite Driver Opportunities
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(255,255,255,0.7)]">
                We deploy a safety-first fleet backed by world-class dispatch intelligence. If you
                demand premium equipment, strategic routing, and a culture of respect, your future
                is behind the wheel at NPT.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.11)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.30)",
                  }}
                >
                  <div className="text-sm font-semibold text-white">
                    Premium Equipment &amp; Maintenance
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.6)]">
                    A modernized fleet with proactive, scheduled maintenance to keep you moving
                    safely and efficiently.
                  </p>
                </div>

                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.11)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.30)",
                  }}
                >
                  <div className="text-sm font-semibold text-white">
                    Strategic Dispatch &amp; Planning
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.6)]">
                    Intelligent routing and 24/7 cross-functional support designed to maximize your
                    time, earnings, and work-life balance.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[2rem] p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-brand-500)] via-transparent to-white/10 opacity-40 transition-opacity duration-500 group-hover:opacity-70"
                aria-hidden="true"
              />

              <div className="relative h-full rounded-[calc(2rem-1px)] bg-[#0d111a]/95 p-6 backdrop-blur-2xl sm:p-8">
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[color:var(--color-brand-600)] opacity-20 mix-blend-screen blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-30"
                  aria-hidden="true"
                />

                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(220,38,38,0.25)] bg-[rgba(220,38,38,0.1)] shadow-[0_0_15px_rgba(220,38,38,0.15)]">
                  <ArrowUpRight className="h-5 w-5 text-[color:var(--color-brand-400)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </div>

                <h3 className="mb-2 text-xl font-bold tracking-tight text-white">
                  Driver Applications
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-[rgba(255,255,255,0.65)]">
                  Driver opportunities are currently handled directly through our HR team. To apply
                  or ask about available driver roles, please email us and we’ll guide you through
                  the next steps.
                </p>

                <a
                  href={`mailto:${NEXT_PUBLIC_NPT_HR_EMAIL}`}
                  onClick={() =>
                    trackCtaClick({
                      ctaId: "email_hr",
                      location: "careers_drive_card",
                      destination: `mailto:${NEXT_PUBLIC_NPT_HR_EMAIL}`,
                      label: "Email HR about driver opportunities",
                    })
                  }
                  className={cn(
                    "group/btn relative flex w-full items-center justify-between rounded-xl px-5 py-4 transition-all duration-300",
                    "border border-[rgba(220,38,38,0.5)] bg-gradient-to-r from-[color:var(--color-brand-700)] via-[color:var(--color-brand-600)] to-[color:var(--color-brand-500)]",
                    "shadow-[0_8px_25px_rgba(220,38,38,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(220,38,38,0.5)]",
                    "focus-ring-light",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block font-semibold tracking-wide text-white">
                      Email HR to apply
                    </span>
                    <span className="block truncate text-xs text-white/80">
                      {NEXT_PUBLIC_NPT_HR_EMAIL}
                    </span>
                  </span>

                  <div className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover/btn:bg-white group-hover/btn:text-[color:var(--color-brand-700)]">
                    <ArrowRight className="h-4 w-4 text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:text-[color:var(--color-brand-700)]" />
                  </div>
                </a>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-[rgba(255,255,255,0.5)]">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    Accepting applications
                  </div>
                  <div className="text-[10px] tracking-wider text-[rgba(255,255,255,0.3)] uppercase">
                    Direct contact
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        id="jobs"
        className="relative overflow-hidden"
        variant="light"
        style={{
          backgroundColor: "var(--audience-bg)",
          scrollMarginTop: SECTION_SCROLL_MARGIN_TOP,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 420px at 80% 0%, rgba(220,38,38,0.04), transparent 55%), radial-gradient(900px 420px at 10% 10%, rgba(15,23,42,0.03), transparent 55%)",
          }}
        />
        <Container className="site-page-container relative">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
                <span className="text-[10.5px] font-bold tracking-[0.15em] text-[color:var(--color-brand-600)] uppercase">
                  Current Openings
                </span>
              </div>
              <h2 className="text-[1.6rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.95rem] lg:text-[2.2rem]">
                Shape the Future of Logistics
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-[color:var(--color-muted-light)]">
                Explore strategic opportunities across fleet operations, supply chain management,
                and corporate leadership. We seek high-caliber professionals dedicated to driving
                operational excellence.
              </p>
            </div>

            <div className="text-sm text-[color:var(--color-subtle-light)]">
              Total:{" "}
              <span className="font-semibold text-[color:var(--color-text-light)]">
                {meta?.total ?? items.length}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="site-card-surface relative flex flex-col gap-4 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[color:var(--color-subtle-light)]" />
                  <input
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    placeholder="Search roles (e.g., dispatcher, safety, operations)…"
                    className={cn(
                      "w-full rounded-xl border bg-white py-2.5 pr-10 pl-10 text-sm transition-all duration-200",
                      "border-black/[0.06] text-[color:var(--color-text-light)]",
                      "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                      "placeholder:text-[color:var(--color-subtle-light)]",
                      "hover:border-[color:var(--color-brand-600)]",
                      "focus:border-[color:var(--color-brand-600)] focus:ring-4 focus:ring-[color:var(--color-brand-600)]/10 focus:outline-none",
                    )}
                  />
                  {qInput ? (
                    <button
                      type="button"
                      onClick={() => setQInput("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>

                <div className="relative lg:w-56">
                  <Building2 className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[color:var(--color-subtle-light)]" />
                  <input
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    placeholder="Department (optional)"
                    className={cn(
                      "w-full rounded-xl border bg-white py-2.5 pr-10 pl-10 text-sm transition-all duration-200",
                      "border-black/[0.06] text-[color:var(--color-text-light)]",
                      "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                      "placeholder:text-[color:var(--color-subtle-light)]",
                      "hover:border-[color:var(--color-brand-600)]",
                      "focus:border-[color:var(--color-brand-600)] focus:ring-4 focus:ring-[color:var(--color-brand-600)]/10 focus:outline-none",
                    )}
                  />
                  {deptInput ? (
                    <button
                      type="button"
                      onClick={() => setDeptInput("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Clear department"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>

                <div className="relative lg:w-56">
                  <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[color:var(--color-subtle-light)]" />
                  <input
                    value={locInput}
                    onChange={(e) => setLocInput(e.target.value)}
                    placeholder="Location (optional)"
                    className={cn(
                      "w-full rounded-xl border bg-white py-2.5 pr-10 pl-10 text-sm transition-all duration-200",
                      "border-black/[0.06] text-[color:var(--color-text-light)]",
                      "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                      "placeholder:text-[color:var(--color-subtle-light)]",
                      "hover:border-[color:var(--color-brand-600)]",
                      "focus:border-[color:var(--color-brand-600)] focus:ring-4 focus:ring-[color:var(--color-brand-600)]/10 focus:outline-none",
                    )}
                  />
                  {locInput ? (
                    <button
                      type="button"
                      onClick={() => setLocInput("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Clear location"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="sm:w-48">
                    <Select
                      value={query.workplaceType || ""}
                      onChange={(v) =>
                        runFetch({ workplaceType: v, page: 1 }, { replaceUrl: true, scroll: false })
                      }
                      options={WORKPLACE_OPTIONS}
                      placeholder="Workplace type"
                      className="w-full cursor-pointer"
                      buttonClassName={cn(
                        "w-full items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm",
                        "border border-black/[0.06] text-[color:var(--color-text-light)]",
                        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                        "transition-all duration-200 hover:border-[color:var(--color-brand-600)]",
                        "focus:border-[color:var(--color-brand-600)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-600)]/10",
                      )}
                      menuClassName={cn(
                        "mt-1 overflow-hidden rounded-xl bg-white text-sm text-[color:var(--color-text-light)]",
                        "border border-black/[0.06] shadow-[0_12px_36px_rgba(15,23,42,0.08)]",
                      )}
                    />
                  </div>

                  <div className="sm:w-48">
                    <Select
                      value={query.employmentType || ""}
                      onChange={(v) =>
                        runFetch(
                          { employmentType: v, page: 1 },
                          { replaceUrl: true, scroll: false },
                        )
                      }
                      options={EMPLOYMENT_OPTIONS}
                      placeholder="Employment type"
                      className="w-full cursor-pointer"
                      buttonClassName={cn(
                        "w-full items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm",
                        "border border-black/[0.06] text-[color:var(--color-text-light)]",
                        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                        "transition-all duration-200 hover:border-[color:var(--color-brand-600)]",
                        "focus:border-[color:var(--color-brand-600)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-600)]/10",
                      )}
                      menuClassName={cn(
                        "mt-1 overflow-hidden rounded-xl bg-white text-sm text-[color:var(--color-text-light)]",
                        "border border-black/[0.06] shadow-[0_12px_36px_rgba(15,23,42,0.08)]",
                      )}
                    />
                  </div>

                  <div className="sm:w-48">
                    <Select
                      value={sortValue}
                      onChange={(v) => {
                        const { sortBy, sortDir } = parseSortValue(v);
                        runFetch({ sortBy, sortDir, page: 1 }, { replaceUrl: true, scroll: false });
                      }}
                      options={SORT_OPTIONS}
                      placeholder="Sort"
                      className="w-full cursor-pointer"
                      buttonClassName={cn(
                        "w-full items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm",
                        "border border-black/[0.06] text-[color:var(--color-text-light)]",
                        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                        "transition-all duration-200 hover:border-[color:var(--color-brand-600)]",
                        "focus:border-[color:var(--color-brand-600)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-600)]/10",
                      )}
                      menuClassName={cn(
                        "mt-1 overflow-hidden rounded-xl bg-white text-sm text-[color:var(--color-text-light)]",
                        "border border-black/[0.06] shadow-[0_12px_36px_rgba(15,23,42,0.08)]",
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
                  <div className="text-xs font-medium text-[color:var(--color-subtle-light)]">
                    {loading ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Searching…
                      </span>
                    ) : (
                      <span>
                        <span className="font-bold text-[color:var(--color-text-light)]">
                          {meta?.total ?? items.length}
                        </span>{" "}
                        role{(meta?.total ?? items.length) === 1 ? "" : "s"} found
                      </span>
                    )}
                  </div>

                  {activeFilters ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQInput("");
                        setDeptInput("");
                        setLocInput("");
                        runFetch(
                          {
                            q: "",
                            department: "",
                            location: "",
                            workplaceType: "",
                            employmentType: "",
                            sortBy: DEFAULTS.sortBy,
                            sortDir: DEFAULTS.sortDir,
                            page: 1,
                          },
                          { replaceUrl: true, scroll: false },
                        );
                      }}
                      className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-50)]"
                    >
                      Clear all
                    </button>
                  ) : (
                    <span className="text-xs text-[color:var(--color-subtle-light)]">
                      Tip: try searching “dispatch”
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10" ref={resultsRef}>
            <div className="site-card-surface relative overflow-hidden rounded-2xl p-5 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold tracking-tight text-[color:var(--color-text-light)]">
                  Available Listings
                </h3>
                <div className="text-xs font-medium text-[color:var(--color-subtle-light)]">
                  Page{" "}
                  <span className="font-bold text-[color:var(--color-text-light)]">
                    {meta?.page ?? query.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[color:var(--color-text-light)]">
                    {meta?.totalPages ?? 1}
                  </span>
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-brand-50)] p-5 text-sm">
                  <div className="font-medium">Couldn’t load jobs.</div>
                  <div className="mt-1 text-[color:var(--color-muted-light)]">{error}</div>
                  <button
                    type="button"
                    onClick={() => runFetch({}, { replaceUrl: false, scroll: false })}
                    className="mt-4 cursor-pointer rounded-lg border border-[color:var(--color-border-light)] bg-white px-4 py-2 text-xs font-semibold text-[color:var(--color-text-light)] shadow-sm transition hover:bg-[color:var(--color-surface-0-light)]"
                  >
                    Retry
                  </button>
                </div>
              ) : null}

              <div className="mt-2">
                <div className="flex flex-col">
                  {loading ? (
                    <div className="p-10 text-center text-sm text-[color:var(--color-subtle-light)]">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading roles…
                      </span>
                    </div>
                  ) : items.length ? (
                    items.map((j: any) => {
                      const loc = Array.isArray(j.locations) ? j.locations : [];
                      const locLabel =
                        loc[0]?.label || loc[0]?.city || loc[0]?.region || loc[0]?.country || "—";

                      const empLabel = j.employmentType ? pillLabel(String(j.employmentType)) : "—";
                      const workLabel = j.workplaceType ? pillLabel(String(j.workplaceType)) : "—";
                      const deptLabel = j.department || j.departmentName || "—";
                      const publishedLabel = fmtDate(j.publishedAt || j.createdAt);

                      const slug = String(j.slug || "");
                      const jobHref = `/careers/${encodeURIComponent(slug)}`;

                      return (
                        <Link
                          key={String(j.id ?? j.slug)}
                          href={jobHref}
                          target="_blank"
                          onClick={() =>
                            trackCtaClick({
                              ctaId: "apply_now",
                              location: "careers_jobs_list",
                              destination: jobHref,
                              label: j.title || "Open job listing",
                            })
                          }
                          className={cn(
                            "group block border-b border-[color:var(--color-border-light)] py-4 transition-colors duration-200 last:border-0",
                            "focus-ring-light hover:bg-[rgba(15,23,42,0.02)]",
                          )}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="truncate text-[15px] font-semibold tracking-tight text-[color:var(--color-text-light)]">
                                {j.title || "Untitled role"}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--color-muted-light)]">
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  {locLabel}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                                  {deptLabel}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5 shrink-0" />
                                  {empLabel}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <Home className="h-3.5 w-3.5 shrink-0" />
                                  {workLabel}
                                </span>
                                {publishedLabel ? (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                                    {publishedLabel}
                                  </span>
                                ) : null}
                              </div>

                              {j.summary ? (
                                <div className="mt-1.5 line-clamp-2 text-sm text-[color:var(--color-muted-light)]">
                                  {j.summary}
                                </div>
                              ) : null}
                            </div>

                            <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-text-light)] sm:mt-0">
                              View role
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)]/30 p-8 text-center">
                      <p className="text-sm font-medium text-[color:var(--color-text-light)]">
                        No roles found
                      </p>
                      <p className="mt-0.5 text-xs text-[color:var(--color-muted-light)]">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <div
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-light)] bg-white px-2 py-1.5",
                    loading ? "opacity-80" : "",
                  )}
                >
                  <button
                    disabled={!canPrev || loading}
                    onClick={() =>
                      runFetch(
                        { page: Math.max(1, (meta?.page ?? query.page) - 1) },
                        { scroll: true, replaceUrl: true },
                      )
                    }
                    className={cn(
                      "min-w-[92px] text-center",
                      "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
                      canPrev && !loading
                        ? "text-[color:var(--color-text-light)] hover:bg-black/[0.04]"
                        : "cursor-not-allowed text-[color:var(--color-subtle-light)]",
                    )}
                  >
                    Previous
                  </button>

                  <div className="h-5 w-px bg-[color:var(--color-border-light)]" />

                  <div className="px-3 text-xs text-[color:var(--color-subtle-light)]">
                    <span className="font-semibold text-[color:var(--color-text-light)]">
                      {meta?.page ?? query.page}
                    </span>
                    <span className="mx-1">/</span>
                    <span>{meta?.totalPages ?? 1}</span>
                  </div>

                  <div className="h-5 w-px bg-[color:var(--color-border-light)]" />

                  <button
                    disabled={!canNext || loading}
                    onClick={() =>
                      runFetch(
                        { page: (meta?.page ?? query.page) + 1 },
                        { scroll: true, replaceUrl: true },
                      )
                    }
                    className={cn(
                      "min-w-[92px] text-center",
                      "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
                      canNext && !loading
                        ? "text-[color:var(--color-text-light)] hover:bg-black/[0.04]"
                        : "cursor-not-allowed text-[color:var(--color-subtle-light)]",
                    )}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center text-xs text-[color:var(--color-subtle-light)]">
                Looking for a driver role? Jump to{" "}
                <button
                  type="button"
                  onClick={() => {
                    scrollToId("drive");
                  }}
                  className={cn(
                    "cursor-pointer font-medium text-[color:var(--color-brand-600)] underline underline-offset-2 transition-colors hover:text-[color:var(--color-brand-700)]",
                    "focus-ring-light",
                  )}
                >
                  Driver Opportunities
                </button>
                .
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
