// src/app/blog/BlogIndexClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, Search, ArrowRight, X, Loader2 } from "lucide-react";
import { Select } from "@/app/(site)/components/ui/Select";
import { CardImage } from "@/components/media/CardImage";
import { cn } from "@/lib/utils/cn";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";

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
      <div className="aspect-[16/10] w-full rounded-xl bg-slate-100" />
      <div className="mt-3 h-4 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-100" />
        <div className="h-6 w-20 rounded-full bg-slate-100" />
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
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff7f7] to-white text-slate-900">
      {/* BLOG HERO / HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/_optimized/blog/blog-banner.webp)" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/80"
            aria-hidden="true"
          />
        </div>

        <div className="relative">
          <Container className="site-page-container">
            {(() => {
              const reduceMotion = useReducedMotion();

              const stagger: Variants = reduceMotion
                ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                : {
                    hidden: {},
                    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
                  };

              const fadeUp: Variants = reduceMotion
                ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
                : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

              return (
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
                    NPT Logistics Blog
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
                    className={cn(
                      "mt-4 max-w-3xl font-semibold tracking-tight text-white",
                      "text-3xl sm:text-4xl lg:text-5xl",
                    )}
                  >
                    Logistics Insights
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                    className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base"
                  >
                    News, guides, and operator-first breakdowns on freight, lanes, compliance, and
                    execution.
                  </motion.p>

                  {/* Unified Filters Card */}
                  <motion.div
                    variants={fadeUp}
                    transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                    className="mt-6 sm:mt-7"
                  >
                    <div
                      className={cn(
                        "rounded-3xl border border-white/18",
                        "bg-black/25 backdrop-blur-md",
                        "p-4 sm:p-5",
                        "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
                      )}
                    >
                      {/* Filters row: Category + Search + Sort */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Search */}
                        <div className="relative flex-1">
                          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/60" />
                          <input
                            value={qInput}
                            onChange={(e) => setQInput(e.target.value)}
                            placeholder="Search articles (e.g., cross-border, LTL, compliance)…"
                            className={cn(
                              "w-full rounded-2xl border border-white/15 bg-black/20 px-10 py-3 text-sm text-white placeholder:text-white/60 focus-ring-light",
                            )}
                          />
                          {qInput ? (
                            <button
                              onClick={() => setQInput("")}
                              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white"
                              aria-label="Clear search"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>

                        {/* Category select */}
                        <div className="cursor-pointer sm:w-44">
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
                              "w-full justify-between cursor-pointer",
                              "border-white/15 bg-black/30 text-white shadow-none",
                              "hover:bg-black/40",
                              "focus:ring-2 focus:ring-white/20 focus:outline-none",
                            )}
                            menuClassName={cn(
                              // more opaque so it reads over white sections
                              "border-white/12 bg-black/85 text-white",
                              // glass feel + contrast
                              "backdrop-blur-xl",
                              // separation from page
                              "ring-1 ring-white/10",
                              "shadow-[0_24px_60px_rgba(0,0,0,0.65)]",
                            )}
                          />
                        </div>

                        {/* Sort */}
                        <div className="cursor-pointer sm:w-44">
                          <Select
                            value={query.sortBy}
                            onChange={(v) => onChangeSort(v)}
                            options={SORT_OPTIONS.filter(
                              (o) => o.value !== "relevance" || showRelevanceOption,
                            )}
                            placeholder="Sort"
                            className="w-full cursor-pointer"
                            buttonClassName={cn(
                              "w-full justify-between cursor-pointer",
                              "border-white/15 bg-black/30 text-white shadow-none",
                              "hover:bg-black/40",
                              "focus:ring-2 focus:ring-white/20 focus:outline-none",
                            )}
                            menuClassName={cn(
                              // more opaque so it reads over white sections
                              "border-white/12 bg-black/85 text-white",
                              // glass feel + contrast
                              "backdrop-blur-xl",
                              // separation from page
                              "ring-1 ring-white/10",
                              "shadow-[0_24px_60px_rgba(0,0,0,0.65)]",
                            )}
                          />
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs text-white/75">
                          {loading ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Searching…
                            </span>
                          ) : (
                            <span>
                              {meta?.total ?? items.length} result
                              {(meta?.total ?? items.length) === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>

                        {hasFilters ? (
                          <button
                            onClick={clearAll}
                            className="cursor-pointer rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs text-white/80 hover:bg-black/30 hover:text-white"
                          >
                            Reset
                          </button>
                        ) : (
                          <span className="text-xs text-white/60">Tip: try “cross-border”</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </Container>
        </div>
      </section>

      {/* BODY */}
      <Container className="site-page-container">
        <div className="mt-10 pb-14 sm:mt-12 sm:pb-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* RESULTS */}
            <div className="lg:col-span-9">
              <div
                ref={resultsRef}
                className="site-card-surface rounded-3xl p-3 sm:p-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Articles</h2>
                  <div className="text-xs text-slate-500">
                    Page {meta?.page ?? 1} of {meta?.totalPages ?? 1}
                  </div>
                </div>

                {error ? (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-slate-900">
                    <div className="font-medium">Couldn’t load posts.</div>
                    <div className="mt-1 text-slate-600">{error}</div>
                    <button
                      onClick={() =>
                        runFetch({}, { fetchCats: false, replaceUrl: false, scroll: false })
                      }
                      className="mt-3 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
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
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          {p.coverImage?.url ? (
                            <CardImage
                              src={p.coverImage.url}
                              alt={p.coverImage.alt || p.title}
                              fill
                              className="object-cover transition duration-300 group-hover:scale-[1.02]"
                              sizes="(max-width: 768px) 100vw, 420px"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-slate-50" />
                          )}
                        </div>

                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {(p.categories ?? []).slice(0, 2).map((c) => (
                              <span
                                key={c.id}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600"
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>

                          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">
                            {p.title}
                          </h3>

                          {p.excerpt ? (
                            <p className="mt-1 line-clamp-2 text-xs text-slate-600">{p.excerpt}</p>
                          ) : null}

                          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {fmtDate(p.publishedAt)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {p.readTimeMins ?? 5} min
                            </span>
                          </div>

                          <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-700">
                            Read more{" "}
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                      <div className="text-sm font-semibold text-slate-900">No matches found.</div>
                      <div className="mt-1 text-xs text-slate-600">
                        Try a different keyword, or reset filters to browse everything.
                      </div>
                      <button
                        onClick={clearAll}
                        className="mt-4 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
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
                          { fetchCats: false, scroll: true },
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
                      <span className="font-semibold text-slate-900">{meta?.page ?? 1}</span>
                      <span className="mx-1 text-red-300/80">/</span>
                      <span>{meta?.totalPages ?? 1}</span>
                    </div>

                    <div className="h-5 w-px bg-red-200/60" />

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
                          ? "text-slate-700 hover:bg-red-50/40 hover:text-slate-900"
                          : "cursor-not-allowed text-slate-400",
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
                    <h3 className="text-sm font-semibold text-slate-900">Categories</h3>
                    <span className="text-[11px] text-slate-500">
                      {catLoading ? "Updating…" : `${categories.length}`}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => onPickCategory(null)}
                      className={cn(
                        "cursor-pointer rounded-full border px-3 py-1 text-xs transition",
                        !query.categorySlug && !query.categoryId
                          ? "border-red-200 bg-red-50 text-slate-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
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
                              ? "border-red-200 bg-red-50 text-slate-900"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                          )}
                        >
                          {c.name}
                          {typeof c.postCount === "number" ? (
                            <span className="ml-2 text-[10px] text-slate-500">{c.postCount}</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recent */}
                <div className="site-card-surface rounded-3xl p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Recent</h3>
                  <div className="mt-3 space-y-3">
                    {recentItems?.map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="site-card-surface block cursor-pointer rounded-2xl p-3 hover:bg-slate-50"
                      >
                        <div className="line-clamp-2 text-xs font-semibold text-slate-900">
                          {p.title}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{fmtDate(p.publishedAt)}</span>
                          <span>{p.readTimeMins ?? 5} min</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="site-card-surface-subtle rounded-3xl p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Need help shipping?</h3>
                  <p className="mt-2 text-xs text-slate-600">
                    Tell us what you’re moving and where—our team will suggest the right mode and
                    lane strategy.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/quote"
                      className="cursor-pointer rounded-xl bg-red-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Request a quote
                    </Link>
                    <Link
                      href="/contact"
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* END SIDEBAR */}
          </div>
        </div>
      </Container>
    </div>
  );
}
