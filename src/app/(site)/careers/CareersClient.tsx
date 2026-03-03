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
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  Sparkles,
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

  // Only include non-default pagination/sort in the URL
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
  const writingUrlRef = React.useRef(false);
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

  // Local inputs (debounced)
  const [qInput, setQInput] = React.useState(query.q ?? "");
  const [deptInput, setDeptInput] = React.useState(query.department ?? "");
  const [locInput, setLocInput] = React.useState(query.location ?? "");

  const activeFilters = Boolean(
    qInput.trim() ||
    deptInput.trim() ||
    locInput.trim() ||
    query.workplaceType ||
    query.employmentType,
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
      merged.pageSize = merged.pageSize || 12;
      merged.sortBy = (merged.sortBy || "publishedAt") as SortBy;
      merged.sortDir = (merged.sortDir || "desc") as SortDir;

      const qs = buildUrlParams(merged);
      const qsStr = qs.toString();
      const hash = opts?.scroll
        ? "#jobs"
        : typeof window !== "undefined"
          ? window.location.hash
          : "";

      const nextUrl = `/careers${qsStr ? `?${qsStr}` : ""}${hash || ""}`;

      if (replaceUrl) {
        if (lastUrlRef.current !== nextUrl) {
          writingUrlRef.current = true;
          lastUrlRef.current = nextUrl;
          router.replace(nextUrl);
          setTimeout(() => {
            writingUrlRef.current = false;
          }, 0);
        }
      }

      const ac = new AbortController();
      jobsAbortRef.current?.abort();
      jobsAbortRef.current = ac;

      setLoading(true);
      setError(null);

      try {
        const resp = await fetchJobs(qs, ac.signal);
        setItems(resp.data.items ?? []);
        setMeta(resp.data.meta ?? {});
        setQuery(merged);

        // keep inputs in sync if explicitly changed by caller
        if (typeof next.q === "string") setQInput(next.q);
        if (typeof next.department === "string") setDeptInput(next.department);
        if (typeof next.location === "string") setLocInput(next.location);

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

  // Sync from URL (back/forward, external links)
  React.useEffect(() => {
    if (writingUrlRef.current) return;

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

    // If nothing changed, do nothing.
    // This prevents a "setQInput(...)" -> debounce -> runFetch -> router.replace chain on client nav.
    if (!changed) return;

    setQuery(next);
    setQInput(next.q);
    setDeptInput(next.department);
    setLocInput(next.location);
  }, [sp]);

  // Debounced fetch for the 3 text inputs
  React.useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const t = window.setTimeout(() => {
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

  // Deep-link support: /careers#overview | #why | #drive | #jobs
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
    <div className="min-h-screen bg-white text-slate-900">
      {/* =========================
          HERO (no filters here)
         ========================= */}
      <Section
        id="overview"
        className="relative overflow-hidden"
        variant="light"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <HeroImage
              src="/careers/careers-banner.jpg"
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
            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-black/80"
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
                Join the team behind dependable freight execution.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base"
              >
                We run on clear standards, reliable communication, and doing things right — every
                day. Explore openings across terminals, dispatch, safety, and operations.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    trackCtaClick({
                      ctaId: "careers_view_job_listings",
                      location: "careers_hero",
                      destination: "/careers#jobs",
                      label: "View Open Roles",
                    });
                    scrollToId("jobs");
                  }}
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold",
                    "cursor-pointer bg-white text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                    "focus-ring-light",
                  )}
                >
                  View Open Roles <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    trackCtaClick({
                      ctaId: "careers_driver_opportunities",
                      location: "careers_hero",
                      destination: "/careers#drive",
                      label: "Driver Opportunities",
                    });
                    scrollToId("drive");
                  }}
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold",
                    "cursor-pointer border border-white/22 bg-white/10 text-white shadow-sm backdrop-blur transition hover:bg-white/15",
                    "focus-ring-light",
                  )}
                >
                  Driver Opportunities <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>

              {/* Micro trust strip */}
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

      {/* =========================
          WHY JOIN NPT (separate background)
         ========================= */}
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
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs text-slate-700">
                    <Sparkles className="h-3.5 w-3.5 text-red-600" />
                    What you can count on
                  </div>
                  <h2 className="mt-3 text-[1.6rem] font-semibold tracking-tight text-slate-900 sm:text-[1.95rem] lg:text-[2.2rem]">
                    A place where standards are real — and support matches them.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The work is fast-paced, but not chaotic. We keep processes clean, communication
                    direct, and decisions grounded in safety and service.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToId("jobs")}
                  className={cn(
                    "hidden cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 sm:inline-flex",
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
                    title: "Safety is non-negotiable",
                    desc: "Training, maintained equipment, and decisions that protect the team and the public.",
                  },
                  {
                    title: "Straightforward operations",
                    desc: "Clear handoffs, practical tools, and fewer surprises because expectations are set early.",
                  },
                  {
                    title: "Support you can reach",
                    desc: "Dispatch and ops teams that communicate clearly and resolve issues without finger-pointing.",
                  },
                  {
                    title: "Room to grow responsibly",
                    desc: "Ownership is encouraged — when you’re ready, we help you build your lane with structure.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="site-card-surface-subtle rounded-3xl p-5"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <CheckCircle2 className="h-4 w-4 text-red-600" />
                      {c.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{c.desc}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </div>
      </Section>

      {/* =========================
          DRIVE FOR NPT (separate background)
         ========================= */}
      <Section
        id="drive"
        className="border-t border-slate-200/70 bg-white py-14 sm:py-16"
        variant="light"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        <Container className="site-page-container">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                <Briefcase className="h-3.5 w-3.5 text-slate-900" />
                For drivers
              </div>

              <h2 className="mt-3 text-[1.6rem] font-semibold tracking-tight text-slate-900 sm:text-[1.95rem] lg:text-[2.2rem]">
                Driver Opportunities
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                We run a safety-led fleet with dispatch support you can rely on. If you value clear
                expectations, well-maintained equipment, and consistent planning, you’ll feel at
                home here.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="site-card-surface-subtle rounded-2xl p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Equipment & maintenance
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Modern fleet with preventative maintenance and compliance baked into daily ops.
                  </p>
                </div>

                <div className="site-card-surface-subtle rounded-2xl p-5">
                  <div className="text-sm font-semibold text-slate-900">Dispatch & planning</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Clear communication, practical routing, and teams that help you keep moving.
                  </p>
                </div>
              </div>
            </div>

            <div className="site-card-surface-subtle rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ExternalLink className="h-4 w-4" />
                Apply externally
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Driver applications are handled through our external portal.
              </p>

              <a
                href="https://drivedock.ssp4you.com"
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackCtaClick({
                    ctaId: "careers_apply_drivedock",
                    location: "careers_drive_card",
                    destination: "https://drivedock.ssp4you.com",
                    label: "Apply via Drivedock",
                  })
                }
                className={cn(
                  "mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold",
                  "bg-slate-900 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  "focus-ring-light",
                )}
              >
                Apply via Drivedock <ExternalLink className="h-4 w-4" />
              </a>

              <div className="mt-3 text-xs text-slate-500">Opens in a new tab.</div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================
          JOB LISTINGS (filters moved here)
         ========================= */}
      <Section
        id="jobs"
        className="border-t border-slate-200/70 bg-slate-50 py-14 sm:py-16"
        variant="light"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        <Container className="site-page-container">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[1.6rem] font-semibold tracking-tight text-slate-900 sm:text-[1.95rem] lg:text-[2.2rem]">
                Open Roles
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Browse current openings, then filter by team, location, and work style to narrow
                down fast.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              Total:{" "}
              <span className="font-semibold text-slate-900">{meta?.total ?? items.length}</span>
            </div>
          </div>

          {/* Filters Card (inside jobs) */}
          <div className="mt-6">
            <div
              className={cn(
                "site-card-surface rounded-3xl p-4 sm:p-5",
                "ring-1 ring-red-500/5",
              )}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    placeholder="Search roles (e.g., dispatcher, safety, operations)…"
                    className={cn(
                      "site-input-light focus-ring-light w-full rounded-2xl px-10 py-3 text-sm",
                    )}
                  />
                  {qInput ? (
                    <button
                      onClick={() => setQInput("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                {/* Department */}
                <div className="relative lg:w-56">
                  <Building2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    placeholder="Department (optional)"
                    className={cn(
                      "site-input-light focus-ring-light w-full rounded-2xl px-10 py-3 text-sm",
                    )}
                  />
                  {deptInput ? (
                    <button
                      onClick={() => setDeptInput("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Clear department"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                {/* Location */}
                <div className="relative lg:w-56">
                  <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={locInput}
                    onChange={(e) => setLocInput(e.target.value)}
                    placeholder="Location (optional)"
                    className={cn(
                      "site-input-light focus-ring-light w-full rounded-2xl px-10 py-3 text-sm",
                    )}
                  />
                  {locInput ? (
                    <button
                      onClick={() => setLocInput("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Clear location"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Row 2: selects + meta */}
              <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="sm:w-48">
                    <Select
                      value={query.workplaceType || ""}
                      onChange={(v) =>
                        runFetch({ workplaceType: v, page: 1 }, { replaceUrl: true })
                      }
                      options={WORKPLACE_OPTIONS}
                      placeholder="Workplace type"
                      className="w-full cursor-pointer"
                      buttonClassName={cn(
                        "w-full justify-between cursor-pointer",
                        "border-slate-200 bg-white text-slate-900 shadow-none",
                        "hover:bg-slate-50",
                        "focus:ring-2 focus:ring-red-500/10 focus:outline-none",
                      )}
                      menuClassName={cn(
                        "border-slate-200 bg-white text-slate-900",
                        "ring-1 ring-black/5",
                        "shadow-[0_24px_60px_rgba(2,6,23,0.16)]",
                      )}
                    />
                  </div>

                  <div className="sm:w-48">
                    <Select
                      value={query.employmentType || ""}
                      onChange={(v) =>
                        runFetch({ employmentType: v, page: 1 }, { replaceUrl: true })
                      }
                      options={EMPLOYMENT_OPTIONS}
                      placeholder="Employment type"
                      className="w-full cursor-pointer"
                      buttonClassName={cn(
                        "w-full justify-between cursor-pointer",
                        "border-slate-200 bg-white text-slate-900 shadow-none",
                        "hover:bg-slate-50",
                        "focus:ring-2 focus:ring-red-500/10 focus:outline-none",
                      )}
                      menuClassName={cn(
                        "border-slate-200 bg-white text-slate-900",
                        "ring-1 ring-black/5",
                        "shadow-[0_24px_60px_rgba(2,6,23,0.16)]",
                      )}
                    />
                  </div>

                  <div className="sm:w-48">
                    <Select
                      value={sortValue}
                      onChange={(v) => {
                        const { sortBy, sortDir } = parseSortValue(v);
                        runFetch({ sortBy, sortDir, page: 1 }, { replaceUrl: true });
                      }}
                      options={SORT_OPTIONS}
                      placeholder="Sort"
                      className="w-full cursor-pointer"
                      buttonClassName={cn(
                        "w-full justify-between cursor-pointer",
                        "border-slate-200 bg-white text-slate-900 shadow-none",
                        "hover:bg-slate-50",
                        "focus:ring-2 focus:ring-red-500/10 focus:outline-none",
                      )}
                      menuClassName={cn(
                        "border-slate-200 bg-white text-slate-900",
                        "ring-1 ring-black/5",
                        "shadow-[0_24px_60px_rgba(2,6,23,0.16)]",
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
                  <div className="text-xs text-slate-500">
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Searching…
                      </span>
                    ) : (
                      <span>
                        {meta?.total ?? items.length} role
                        {(meta?.total ?? items.length) === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>

                  {activeFilters ? (
                    <button
                      onClick={() =>
                        runFetch(
                          {
                            q: "",
                            department: "",
                            location: "",
                            workplaceType: "",
                            employmentType: "",
                            sortBy: "publishedAt",
                            sortDir: "desc",
                            page: 1,
                          },
                          { replaceUrl: true },
                        )
                      }
                      className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Reset
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Tip: try “dispatch”</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="mt-6" ref={resultsRef}>
            <div className="site-card-surface rounded-3xl p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Listings</h3>
                <div className="text-xs text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-900">{meta?.page ?? query.page}</span>{" "}
                  of <span className="font-semibold text-slate-900">{meta?.totalPages ?? 1}</span>
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-slate-900">
                  <div className="font-medium">Couldn’t load jobs.</div>
                  <div className="mt-1 text-slate-600">{error}</div>
                  <button
                    onClick={() => runFetch({}, { replaceUrl: false, scroll: false })}
                    className="mt-3 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Retry
                  </button>
                </div>
              ) : null}

              <div className="site-card-surface mt-4 overflow-hidden rounded-2xl">
                <div className="grid grid-cols-1 divide-y divide-slate-200">
                  {loading ? (
                    <div className="p-10 text-center text-sm text-slate-500">
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
                              ctaId: "careers_open_job_listing",
                              location: "careers_jobs_list",
                              destination: jobHref,
                              label: "Open job listing",
                            })
                          }
                          className={cn(
                            "group block px-5 py-4 transition",
                            "hover:bg-slate-50 focus-ring-light",
                          )}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-slate-900 group-hover:underline">
                                {j.title || "Untitled role"}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {locLabel}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <Building2 className="h-3.5 w-3.5" />
                                  {deptLabel}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5" />
                                  {empLabel}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5" />
                                  {workLabel}
                                </span>

                                {publishedLabel ? (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {publishedLabel}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 sm:mt-0">
                              View details <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                          </div>

                          {j.summary ? (
                            <div className="mt-2 line-clamp-2 text-sm text-slate-600">
                              {j.summary}
                            </div>
                          ) : null}
                        </Link>
                      );
                    })
                  ) : (
                    <div className="p-10 text-center text-sm text-slate-500">
                      No roles found. Try adjusting filters.
                    </div>
                  )}
                </div>
              </div>

              {/* PAGINATION */}
              <div className="mt-8 flex justify-center">
                <div
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm",
                    "ring-1 ring-red-500/5",
                    loading ? "opacity-80" : "",
                  )}
                >
                  <button
                    disabled={!canPrev || loading}
                    onClick={() =>
                      runFetch(
                        { page: Math.max(1, (meta?.page ?? query.page) - 1) },
                        { scroll: true },
                      )
                    }
                    className={cn(
                      "min-w-[92px] text-center",
                      "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
                      canPrev && !loading
                        ? "text-slate-700 hover:bg-red-50/40 hover:text-slate-900"
                        : "cursor-not-allowed text-slate-400",
                    )}
                  >
                    Previous
                  </button>

                  <div className="h-5 w-px bg-red-200/60" />

                  <div className="px-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-900">{meta?.page ?? query.page}</span>
                    <span className="mx-1 text-red-300/80">/</span>
                    <span>{meta?.totalPages ?? 1}</span>
                  </div>

                  <div className="h-5 w-px bg-red-200/60" />

                  <button
                    disabled={!canNext || loading}
                    onClick={() =>
                      runFetch({ page: (meta?.page ?? query.page) + 1 }, { scroll: true })
                    }
                    className={cn(
                      "min-w-[92px] text-center",
                      "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
                      canNext && !loading
                        ? "text-slate-700 hover:bg-red-50/40 hover:text-slate-900"
                        : "cursor-not-allowed text-slate-400",
                    )}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="mt-8 text-xs text-slate-500">
                Looking for a driver role? Jump to{" "}
                <button
                  type="button"
                  onClick={() => {
                    trackCtaClick({
                      ctaId: "careers_driver_opportunities_footer",
                      location: "careers_jobs_footer",
                      destination: "/careers#drive",
                      label: "Driver Opportunities",
                    });
                    scrollToId("drive");
                  }}
                  className={cn(
                    "cursor-pointer font-semibold text-slate-900 underline underline-offset-2",
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
    </div>
  );
}
