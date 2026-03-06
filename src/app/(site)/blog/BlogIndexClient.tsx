// src/app/blog/BlogIndexClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, Search, ArrowRight, X, Loader2 } from "lucide-react";
import { Select } from "@/app/(site)/components/ui/Select";
import { CardImage } from "@/components/media/CardImage";
import { HeroImage } from "@/components/media/HeroImage";
import { cn } from "@/lib/utils/cn";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { NAV_OFFSET } from "@/constants/ui";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
};

type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: { url?: string; alt?: string } | null;
  categories?: Array<{ id: string; name: string; slug: string }> | null;
  publishedAt?: string | null;
  readTimeMins?: number | null;
  viewCount?: number | null;
};

type Meta = { page: number; limit: number; total: number; totalPages: number };

type Query = {
  q: string;
  categoryId: string;
  categorySlug: string;
  sortBy: string;
  page: number;
  limit: number;
};

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

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostViewed", label: "Most viewed" },
  { value: "titleAsc", label: "Title (A–Z)" },
  { value: "relevance", label: "Relevance" },
];

function buildUrlParams(q: Query) {
  const qs = new URLSearchParams();
  if (q.q) qs.set("q", q.q);

  if (q.categorySlug) qs.set("categorySlug", q.categorySlug);
  else if (q.categoryId) qs.set("categoryId", q.categoryId);

  if (q.sortBy) qs.set("sortBy", q.sortBy);
  qs.set("page", String(clampPage(q.page)));
  qs.set("limit", String(q.limit || 9));
  return qs;
}

async function fetchPosts(qs: URLSearchParams, signal?: AbortSignal) {
  const res = await fetch(`/api/v1/blog?${qs.toString()}`, { signal, cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to fetch posts");
  return json as { data: { items: BlogPostListItem[]; meta: Meta } };
}

async function fetchCategories(qs: URLSearchParams, signal?: AbortSignal) {
  const res = await fetch(`/api/v1/blog/categories?${qs.toString()}`, {
    signal,
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to fetch categories");
  return json as { data: CategoryItem[] };
}

function SkeletonCard() {
  return (
    <div className="site-card-surface-subtle rounded-2xl p-3">
      <div className="aspect-[16/10] w-full rounded-xl bg-[color:var(--color-surface-1-light)]" />
      <div className="mt-3 h-4 w-3/4 rounded bg-[color:var(--color-surface-1-light)]" />
      <div className="mt-2 h-3 w-5/6 rounded bg-[color:var(--color-surface-1-light)]" />
      <div className="mt-2 h-3 w-2/3 rounded bg-[color:var(--color-surface-1-light)]" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-[color:var(--color-surface-1-light)]" />
        <div className="h-6 w-20 rounded-full bg-[color:var(--color-surface-1-light)]" />
      </div>
    </div>
  );
}

export default function BlogIndexClient({
  initialItems,
  initialMeta,
  categories: initialCategories,
  recentItems,
  initialQuery,
}: {
  initialItems: BlogPostListItem[];
  initialMeta: Meta;
  categories: CategoryItem[];
  recentItems: BlogPostListItem[];
  initialQuery: Query;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [query, setQuery] = React.useState<Query>(initialQuery);
  const [qInput, setQInput] = React.useState(initialQuery.q || "");

  const queryRef = React.useRef<Query>(initialQuery);
  const lastUrlRef = React.useRef<string>("");

  React.useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const [items, setItems] = React.useState<BlogPostListItem[]>(initialItems ?? []);
  const [meta, setMeta] = React.useState<Meta>(initialMeta);
  const [categories, setCategories] = React.useState<CategoryItem[]>(initialCategories ?? []);

  const [loading, setLoading] = React.useState(false);
  const [catLoading, setCatLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const resultsRef = React.useRef<HTMLDivElement | null>(null);
  const postsAbortRef = React.useRef<AbortController | null>(null);
  const catsAbortRef = React.useRef<AbortController | null>(null);

  const writingUrlRef = React.useRef(false);
  const didMountRef = React.useRef(false);

  const hasFilters = Boolean(
    query.q ||
    query.categorySlug ||
    query.categoryId ||
    (query.sortBy && query.sortBy !== "newest"),
  );
  const showRelevanceOption = Boolean(query.q.trim().length > 0);

  const scrollToResults = React.useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const runFetch = React.useCallback(
    async (
      next: Partial<Query>,
      opts?: { fetchCats?: boolean; scroll?: boolean; replaceUrl?: boolean },
    ) => {
      const fetchCatsOpt = opts?.fetchCats ?? true;
      const scroll = opts?.scroll ?? false;
      const replaceUrl = opts?.replaceUrl ?? true;

      const base = queryRef.current;
      const merged: Query = { ...base, ...next };

      if (merged.sortBy === "relevance" && !merged.q) merged.sortBy = "newest";
      merged.page = clampPage(merged.page);
      merged.limit = merged.limit || 9;

      const qs = buildUrlParams(merged);
      const nextUrl = `/blog?${qs.toString()}`;

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
      postsAbortRef.current?.abort();
      postsAbortRef.current = ac;

      setLoading(true);
      setError(null);

      try {
        const posts = await fetchPosts(qs, ac.signal);

        setItems(posts.data.items);
        setMeta(posts.data.meta);

        setQuery(merged);

        if (typeof next.q === "string") setQInput(next.q);

        if (fetchCatsOpt) {
          setCatLoading(true);

          const cqs = new URLSearchParams();
          if (merged.q) cqs.set("q", merged.q);

          const catsAc = new AbortController();
          catsAbortRef.current?.abort();
          catsAbortRef.current = catsAc;

          try {
            const cats = await fetchCategories(cqs, catsAc.signal);
            setCategories(cats.data);
          } finally {
            setCatLoading(false);
          }
        }

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

  React.useEffect(() => {
    if (writingUrlRef.current) return;

    const next: Query = {
      q: sp.get("q") ?? "",
      categorySlug: sp.get("categorySlug") ?? "",
      categoryId: sp.get("categoryId") ?? "",
      sortBy: sp.get("sortBy") ?? "newest",
      page: clampPage(Number(sp.get("page") ?? "1")),
      limit: query.limit || 9,
    };

    setQuery((prev) => {
      const changed =
        prev.q !== next.q ||
        prev.categorySlug !== next.categorySlug ||
        prev.categoryId !== next.categoryId ||
        prev.sortBy !== next.sortBy ||
        prev.page !== next.page;

      if (!changed) return prev;
      return { ...prev, ...next };
    });

    setQInput(next.q);
  }, [sp]);

  React.useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      runFetch({ q: qInput, page: 1 }, { fetchCats: true, scroll: false, replaceUrl: true });
    }, 350);
    return () => window.clearTimeout(t);
  }, [qInput, runFetch]);

  const onPickCategory = (c: CategoryItem | null) => {
    if (!c) {
      runFetch(
        { categorySlug: "", categoryId: "", page: 1 },
        { fetchCats: false, replaceUrl: true },
      );
      return;
    }
    runFetch(
      { categorySlug: c.slug, categoryId: "", page: 1 },
      { fetchCats: false, replaceUrl: true },
    );
  };

  const onChangeSort = (v: string) => {
    runFetch({ sortBy: v, page: 1 }, { fetchCats: false, replaceUrl: true });
  };

  const clearAll = () => {
    setQInput("");
    runFetch(
      { q: "", categorySlug: "", categoryId: "", sortBy: "newest", page: 1 },
      { fetchCats: true, replaceUrl: true },
    );
  };

  const canPrev = (meta?.page ?? query.page) > 1;
  const canNext = (meta?.page ?? query.page) < (meta?.totalPages ?? 1);

  const reduceMotion = useReducedMotion();
  const SECTION_SCROLL_MARGIN_TOP = `${NAV_OFFSET}px`;

  const scrollToId = React.useCallback((id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    const extra = 12;
    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET - extra;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, []);

  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } } };

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  const categorySelectOptions = React.useMemo(
    () => [
      { value: "", label: "All categories" },
      ...categories.map((c) => ({
        value: c.slug,
        label: typeof c.postCount === "number" ? `${c.name} (${c.postCount})` : c.name,
      })),
    ],
    [categories],
  );

  return (
    <>
      {/* BLOG HERO / HEADER */}
      <Section
        variant="dark"
        className="relative overflow-hidden bg-[color:var(--color-surface-0)]"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <HeroImage
              src="/_optimized/blog/blog-banner.webp"
              alt="Blog banner"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16"
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
                  className="pt-12 pb-12 sm:pt-16 sm:pb-14"
                >
                  <motion.div
                    variants={fadeUp}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-600)]"></span>
                    Industry Insights
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
                    className={cn(
                      "mt-4 max-w-3xl font-semibold tracking-tight text-white",
                      "text-3xl sm:text-4xl lg:text-5xl",
                    )}
                  >
                    The Strategic Logistics Hub
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                    className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base"
                  >
                    Expert analysis, market intelligence, and executive perspectives on securing supply chains and optimizing global freight operations.
                  </motion.p>

                  {/* CTA to scroll to insights */}
                  <motion.div
                    variants={fadeUp}
                    transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                    className="mt-6"
                  >
                    <button
                      type="button"
                      onClick={() => scrollToId("insights")}
                      className={cn(
                        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold",
                        "cursor-pointer border border-[color:var(--color-brand-600)] bg-[linear-gradient(180deg,var(--color-brand-600),var(--color-brand-700))] text-white shadow-[0_8px_20px_rgba(220,38,38,0.25)] transition hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(220,38,38,0.32)]",
                        "focus-ring-surface",
                      )}
                    >
                      Browse insights <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </motion.div>
          </Container>
        </div>
      </Section>

      {/* BODY / INSIGHTS */}
      <Section
        id="insights"
        variant="light"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--audience-bg)", scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        {/* Subtle radial depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 420px at 80% 0%, rgba(220,38,38,0.04), transparent 55%), radial-gradient(900px 420px at 10% 10%, rgba(15,23,42,0.03), transparent 55%)",
          }}
        />
        <Container className="site-page-container relative">
          {/* Section header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
                <span className="text-[10.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--color-brand-600)]">
                  Insights
                </span>
              </div>
              <h2 className="text-[1.6rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.95rem] lg:text-[2.2rem]">
                Latest Articles
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-[color:var(--color-muted-light)]">
                Expert analysis, market intelligence, and executive perspectives on logistics and supply chain.
              </p>
            </div>
          </div>

          {/* Filters Card */}
          <div className="mt-6">
            <div className={cn("relative flex flex-col gap-4 rounded-2xl p-4 sm:p-5", "site-card-surface")}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[color:var(--color-subtle-light)]" />
                  <input
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    placeholder="Search articles (e.g., cross-border, LTL, compliance)…"
                    className={cn(
                      "peer w-full rounded-xl border border-[color:var(--color-border-light)] bg-white py-2.5 pl-10 pr-10 text-sm shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all duration-300",
                      "hover:border-black/[0.15] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
                      "focus:border-[color:var(--color-brand-400)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(220,38,38,0.1)]",
                    )}
                  />
                  {qInput ? (
                    <button
                      onClick={() => setQInput("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
                <div className="sm:w-44">
                  <Select
                    value={query.categorySlug || ""}
                    onChange={(v) => {
                      const picked = categories.find((c) => c.slug === v) ?? null;
                      onPickCategory(picked);
                    }}
                    options={categorySelectOptions}
                    placeholder={catLoading ? "Loading…" : "All categories"}
                    disabled={catLoading}
                    className="w-full cursor-pointer"
                    buttonClassName={cn(
                      "w-full justify-between items-center cursor-pointer rounded-xl bg-white px-4 py-2.5 text-sm",
                      "border border-[color:var(--color-border-light)] text-[color:var(--color-text-light)] shadow-[0_1px_4px_rgba(0,0,0,0.02)]",
                      "transition-all duration-300 hover:border-black/[0.15] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
                      "focus:border-[color:var(--color-brand-400)] focus:outline-none focus:ring-4 focus:ring-[rgba(220,38,38,0.1)]",
                    )}
                    menuClassName={cn(
                      "mt-1 overflow-hidden rounded-xl border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] text-sm",
                      "shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5",
                    )}
                  />
                </div>
                <div className="sm:w-44">
                  <Select
                    value={query.sortBy}
                    onChange={(v) => onChangeSort(v)}
                    options={SORT_OPTIONS.filter((o) => o.value !== "relevance" || showRelevanceOption)}
                    placeholder="Sort"
                    className="w-full cursor-pointer"
                    buttonClassName={cn(
                      "w-full justify-between items-center cursor-pointer rounded-xl bg-white px-4 py-2.5 text-sm",
                      "border border-[color:var(--color-border-light)] text-[color:var(--color-text-light)] shadow-[0_1px_4px_rgba(0,0,0,0.02)]",
                      "transition-all duration-300 hover:border-black/[0.15] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
                      "focus:border-[color:var(--color-brand-400)] focus:outline-none focus:ring-4 focus:ring-[rgba(220,38,38,0.1)]",
                    )}
                    menuClassName={cn(
                      "mt-1 overflow-hidden rounded-xl border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] text-sm",
                      "shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5",
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-medium text-[color:var(--color-subtle-light)]">
                  {loading ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Searching…
                    </span>
                  ) : (
                    <span>
                      <span className="font-bold text-[color:var(--color-text-light)]">{meta?.total ?? items.length}</span>{" "}
                      result{(meta?.total ?? items.length) === 1 ? "" : "s"} found
                    </span>
                  )}
                </div>
                {hasFilters ? (
                  <button
                    onClick={clearAll}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[rgba(220,38,38,0.08)]"
                  >
                    Clear all
                  </button>
                ) : (
                  <span className="text-xs text-[color:var(--color-subtle-light)]">Tip: try searching "cross-border"</span>
                )}
              </div>
            </div>
          </div>

        <div className="mt-10 pb-14 sm:mt-12 sm:pb-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* RESULTS */}
            <div className="lg:col-span-9">
              <div
                ref={resultsRef}
                className="site-card-surface rounded-3xl p-3 sm:p-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[color:var(--color-text-light)]">Latest Insights</h2>
                  <div className="text-xs text-[color:var(--color-subtle-light)]">
                    Page {meta?.page ?? 1} of {meta?.totalPages ?? 1}
                  </div>
                </div>

                {error ? (
                  <div className="mt-4 rounded-2xl border border-[color:var(--color-brand-100)] bg-[color:var(--color-brand-50)] p-4 text-sm text-[color:var(--color-text-light)]">
                    <div className="font-medium">Couldn’t load posts.</div>
                    <div className="mt-1 text-[color:var(--color-muted-light)]">{error}</div>
                    <button
                      onClick={() =>
                        runFetch({}, { fetchCats: false, replaceUrl: false, scroll: false })
                      }
                      className="mt-3 cursor-pointer rounded-md border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-1-light)] px-3 py-2 text-xs text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]"
                    >
                      Retry
                    </button>
                  </div>
                ) : null}

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {loading ? (
                    <>
                      <SkeletonCard />
                      <SkeletonCard />
                      <SkeletonCard />
                      <SkeletonCard />
                    </>
                  ) : items.length ? (
                    items.map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="site-card-surface group cursor-pointer rounded-2xl p-3 transition hover:-translate-y-[1px] hover:shadow-md"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-1-light)]">
                          {p.coverImage?.url ? (
                            <CardImage
                              src={p.coverImage.url}
                              alt={p.coverImage.alt || p.title}
                              fill
                              className="object-cover transition duration-300 group-hover:scale-[1.02]"
                              sizes="(max-width: 768px) 100vw, 420px"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,var(--color-brand-50),var(--color-surface-0-light),var(--color-surface-1-light))]" />
                          )}
                        </div>

                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {(p.categories ?? []).slice(0, 2).map((c) => (
                              <span
                                key={c.id}
                                className="rounded-full border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-1-light)] px-2 py-0.5 text-[10px] text-[color:var(--color-muted-light)]"
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>

                          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-[color:var(--color-text-light)]">
                            {p.title}
                          </h3>

                          {p.excerpt ? (
                            <p className="mt-1 line-clamp-2 text-xs text-[color:var(--color-muted-light)]">{p.excerpt}</p>
                          ) : null}

                          <div className="mt-3 flex items-center justify-between text-[11px] text-[color:var(--color-subtle-light)]">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {fmtDate(p.publishedAt)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {p.readTimeMins ?? 5} min
                            </span>
                          </div>

                          <div className="mt-3 inline-flex items-center gap-2 text-xs text-[color:var(--color-text-light)]">
                            Read more{" "}
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full rounded-2xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-1-light)] p-6 text-center">
                      <div className="text-sm font-semibold text-[color:var(--color-text-light)]">No matches found.</div>
                      <div className="mt-1 text-xs text-[color:var(--color-muted-light)]">
                        Try a different keyword, or reset filters to browse everything.
                      </div>
                      <button
                        onClick={clearAll}
                        className="mt-4 cursor-pointer rounded-md border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-1-light)] px-3 py-2 text-xs text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>

                {/* PAGINATION */}
                <div className="mt-8 flex justify-center">
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
                          { fetchCats: false, scroll: true },
                        )
                      }
                      className={cn(
                        "min-w-[92px] text-center",
                        "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
                        canPrev && !loading
                          ? "text-[color:var(--color-text-light)] hover:bg-[rgba(220,38,38,0.06)] hover:text-[color:var(--color-brand-600)]"
                          : "cursor-not-allowed text-[color:var(--color-subtle-light)]",
                      )}
                    >
                      Previous
                    </button>

                    <div className="h-5 w-px bg-[color:var(--color-border-light)]" />

                    <div className="px-3 text-xs text-[color:var(--color-subtle-light)]">
                      <span className="font-semibold text-[color:var(--color-text-light)]">{meta?.page ?? 1}</span>
                      <span className="mx-1">/</span>
                      <span>{meta?.totalPages ?? 1}</span>
                    </div>

                    <div className="h-5 w-px bg-[color:var(--color-border-light)]" />

                    <button
                      disabled={!canNext || loading}
                      onClick={() =>
                        runFetch(
                          { page: (meta?.page ?? query.page) + 1 },
                          { fetchCats: false, scroll: true },
                        )
                      }
                      className={cn(
                        "min-w-[92px] text-center",
                        "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
                        canNext && !loading
                          ? "text-[color:var(--color-text-light)] hover:bg-[rgba(220,38,38,0.06)] hover:text-[color:var(--color-brand-600)]"
                          : "cursor-not-allowed text-[color:var(--color-subtle-light)]",
                      )}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-4">
                {/* Categories pills */}
                <div className="site-card-surface rounded-3xl p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">Categories</h3>
                    <span className="text-[11px] text-[color:var(--color-subtle-light)]">
                      {catLoading ? "Updating…" : `${categories.length}`}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => onPickCategory(null)}
                      className={cn(
                        "cursor-pointer rounded-full border px-3 py-1 text-xs transition",
                        !query.categorySlug && !query.categoryId
                          ? "border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] text-[color:var(--color-text-light)]"
                          : "border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                      )}
                    >
                      All
                    </button>

                    {categories.map((c) => {
                      const active = query.categorySlug ? c.slug === query.categorySlug : false;
                      return (
                        <button
                          key={c.id}
                          onClick={() => onPickCategory(c)}
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1 text-xs transition",
                            active
                              ? "border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] text-[color:var(--color-text-light)]"
                              : "border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                          )}
                        >
                          {c.name}
                          {typeof c.postCount === "number" ? (
                            <span className="ml-2 text-[10px] text-[color:var(--color-muted-light)]">{c.postCount}</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recent */}
                <div className="site-card-surface rounded-3xl p-4">
                  <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">Recent</h3>
                  <div className="mt-3 space-y-3">
                    {recentItems?.map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="site-card-surface block cursor-pointer rounded-2xl p-3 hover:bg-[color:var(--color-surface-0-light)]"
                      >
                        <div className="line-clamp-2 text-xs font-semibold text-[color:var(--color-text-light)]">
                          {p.title}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-[color:var(--color-subtle-light)]">
                          <span>{fmtDate(p.publishedAt)}</span>
                          <span>{p.readTimeMins ?? 5} min</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA - Dark Premium Card */}
                <div
                  className="group relative overflow-hidden rounded-3xl p-5 sm:p-6"
                  style={{
                    backgroundColor: "#1a1f2e",
                    boxShadow: "0 2px 0 rgba(0,0,0,0.22), 0 20px 56px rgba(0,0,0,0.20)",
                  }}
                >
                  {/* Subtle red glow top-left */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                    style={{
                      background: "radial-gradient(ellipse at 15% 0%, rgba(220,38,38,0.16) 0%, transparent 55%)",
                    }}
                  />
                  {/* Top red accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
                    style={{
                      background: "linear-gradient(90deg, #ef4444 0%, rgba(220,38,38,0.15) 60%, transparent 100%)",
                    }}
                  />

                  <div className="relative">
                    <h3 className="text-sm font-bold text-white">Optimize Your Supply Chain</h3>
                    <p className="mt-2 text-xs leading-[1.6] text-[rgba(255,255,255,0.7)]">
                      Partner with NPT to engineer a highly resilient, cost-effective freight strategy. Tell us your objectives, and our experts will architect the solution.
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Link
                        href="/quote"
                        className={cn(
                          "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold",
                          "border border-[color:var(--color-brand-600)] bg-[linear-gradient(180deg,var(--color-brand-600),var(--color-brand-700))] text-white shadow-[0_8px_20px_rgba(220,38,38,0.25)] transition hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(220,38,38,0.32)]",
                          "focus-ring-surface",
                        )}
                      >
                        Request a quote
                      </Link>
                      <Link
                        href="/contact"
                        className={cn(
                          "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold",
                          "border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.10)] text-[color:var(--color-muted-strong)] shadow-sm backdrop-blur transition hover:-translate-y-[2px] hover:border-[rgba(255,255,255,0.38)] hover:text-white",
                          "focus-ring-surface",
                        )}
                      >
                        Contact us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* END SIDEBAR */}
          </div>
        </div>
        </Container>
      </Section>
    </>
  );
}
