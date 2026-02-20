// src/app/(site)/blog/BlogIndexClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, Search, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";

import { NAV_OFFSET } from "@/constants/ui";
import { trackCtaClick } from "@/lib/analytics/cta";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { cn } from "@/lib/cn";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
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

function BannerImg({
  url,
  alt,
  className,
  priority,
  sizes,
}: {
  url?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!url) return <div className={cn("bg-gray-100", className)} />;

  return (
    <Image
      src={url}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}

export default function BlogIndexClient({
  initialItems,
  initialMeta,
  initialCategories = [],
  initialRecentPosts = [],
}: {
  initialItems: any[];
  initialMeta: any;
  initialCategories?: CategoryItem[];
  initialRecentPosts?: any[];
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const appliedQ = sp.get("q") ?? "";
  const activeCategoryId = sp.get("categoryId") ?? "";

  const [q, setQ] = React.useState(appliedQ);

  const hasFilters = Boolean(appliedQ.trim() || activeCategoryId);

  function pushWith(params: Record<string, string | null | undefined>) {
    const qs = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(params)) {
      if (!v) qs.delete(k);
      else qs.set(k, v);
    }
    qs.set("page", "1");
    router.push(`/blog?${qs.toString()}`);
  }

  function applySearch() {
    trackCtaClick({
      ctaId: "blog_search_apply",
      location: "blog_hero_search",
      destination: "/blog",
      label: "Search",
    });

    pushWith({ q: q.trim() ? q.trim() : null });
  }

  function selectCategory(categoryId?: string | null) {
    const nextId = categoryId && categoryId !== "all" ? categoryId : null;

    trackCtaClick({
      ctaId: nextId ? `blog_category_select_${nextId}` : "blog_category_select_all",
      location: "blog_categories",
      destination: "/blog",
      label: nextId ? "Select category" : "All categories",
    });

    pushWith({ categoryId: nextId });
  }

  function clearFilters() {
    trackCtaClick({
      ctaId: "blog_clear_filters",
      location: "blog_filters",
      destination: "/blog",
      label: "Clear filters",
    });

    const qs = new URLSearchParams(sp.toString());
    qs.delete("q");
    qs.delete("categoryId");
    qs.set("page", "1");
    router.push(`/blog?${qs.toString()}`);
    setQ(""); // reset input UI too
  }

  const items = initialItems ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      {/* HERO */}
      <Section className="relative overflow-hidden !py-0" variant="light">
        {/* background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
          <div className="absolute inset-0 opacity-30">
            <Image
              src="/blog/blog-banner.jpg"
              alt="Blog banner"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/15" />
        </div>

        <Container className="relative z-10 max-w-[1440px] px-4 py-14 sm:px-6 lg:px-6">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              North American Logistics Insights
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Connecting North America
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
              Expert analysis and insights on cross-border transportation, supply chain integration,
              and logistics innovation across the United States, Mexico, and Canada.
            </p>

            {/* search */}
            <div className="mt-6 flex max-w-xl items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/65" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => (e.key === "Enter" ? applySearch() : null)}
                  placeholder="Search articles…"
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pr-3 pl-9 text-sm text-white backdrop-blur outline-none placeholder:text-white/55 focus:ring-4 focus:ring-white/10"
                />
              </div>
              <button
                onClick={applySearch}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Topics panel (mobile only) */}
          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-5 text-white/90 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)] backdrop-blur lg:hidden">
            <div className="text-sm font-semibold">Explore topics</div>
            <div className="mt-3 grid gap-2">
              {(initialCategories ?? []).slice(0, 6).map((c) => {
                const active = activeCategoryId && c.id === activeCategoryId;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectCategory(c.id)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm transition",
                      active
                        ? "border-white/25 bg-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Tag className="h-4 w-4 text-white/70" />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80">
                      {c.postCount ?? 0}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => selectCategory(null)}
                className="mt-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                All categories
              </button>
            </div>
          </div>
        </Container>
      </Section>

      {/* CONTENT */}
      <Section className="py-10" variant="light">
      <Container className="max-w-[1440px] px-4 sm:px-6 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-xl font-semibold tracking-tight text-slate-900">
                  {hasFilters ? "Results" : "Latest Articles"}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {hasFilters
                    ? "Showing posts matching your filters."
                    : "Fresh thinking from our logistics team."}
                </div>
              </div>

              {hasFilters ? (
                <button
                  onClick={clearFilters}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            {/* Cards grid */}
            <div className="grid gap-5 sm:grid-cols-2">
              {items.map((p) => {
                const bannerUrl =
                  typeof p.bannerImage === "string" ? p.bannerImage : (p.bannerImage?.url ?? null);

                const slug = String(p.slug || "");
                const href = `/blog/${encodeURIComponent(slug)}`;

                return (
                  <Link
                    key={String(p.id)}
                    href={href}
                    onClick={() =>
                      trackCtaClick({
                        ctaId: `blog_open_post_${slug || "unknown"}`,
                        location: "blog_posts_grid",
                        destination: href,
                        label: p.title ? `Open post: ${p.title}` : "Open post",
                      })
                    }
                    className="group overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <BannerImg
                        url={bannerUrl}
                        alt={p.title ?? "Post banner"}
                        sizes="(min-width: 640px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/10 to-transparent opacity-70 transition group-hover:opacity-90" />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                        <div className="absolute inset-0 ring-2 ring-slate-900/10" />
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="line-clamp-2 text-base font-semibold tracking-tight text-slate-900 group-hover:underline">
                        {p.title}
                      </div>
                      {p.excerpt ? (
                        <div className="mt-2 line-clamp-3 text-sm text-slate-600">{p.excerpt}</div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {p.publishedAt ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {fmtDate(p.publishedAt)}
                          </span>
                        ) : null}
                        {p.readingTimeMinutes ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {p.readingTimeMinutes} min read
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {!items.length ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                No posts found.
              </div>
            ) : null}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between text-sm text-slate-600">
              <div>
                Page <span className="font-semibold text-slate-900">{initialMeta?.page ?? 1}</span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">{initialMeta?.totalPages ?? 1}</span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={!initialMeta?.hasPrev}
                  onClick={() => {
                    trackCtaClick({
                      ctaId: "blog_pagination_prev",
                      location: "blog_pagination",
                      destination: "/blog",
                      label: "Prev page",
                    });

                    const qs = new URLSearchParams(sp.toString());
                    qs.set("page", String(Math.max(1, (initialMeta.page ?? 1) - 1)));
                    router.push(`/blog?${qs.toString()}`);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  disabled={!initialMeta?.hasNext}
                  onClick={() => {
                    trackCtaClick({
                      ctaId: "blog_pagination_next",
                      location: "blog_pagination",
                      destination: "/blog",
                      label: "Next page",
                    });

                    const qs = new URLSearchParams(sp.toString());
                    qs.set("page", String((initialMeta.page ?? 1) + 1));
                    router.push(`/blog?${qs.toString()}`);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT (sticky) */}
          <aside className="hidden lg:block">
            <div className="space-y-5" style={{ position: "sticky", top: NAV_OFFSET + 16 }}>
              {/* Categories (desktop only) */}
              <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">Categories</div>
                  <button
                    onClick={() => {
                      trackCtaClick({
                        ctaId: hasFilters
                          ? "blog_clear_filters_sidebar"
                          : "blog_category_select_all",
                        location: "blog_categories_sidebar",
                        destination: "/blog",
                        label: hasFilters ? "Clear filters (sidebar)" : "All (sidebar)",
                      });

                      if (hasFilters) clearFilters();
                      else selectCategory(null);
                    }}
                    className={cn(
                      "text-xs font-semibold",
                      hasFilters || !activeCategoryId
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-900",
                    )}
                  >
                    {hasFilters ? "Clear filters" : "All"}
                  </button>
                </div>

                <div className="mt-3 space-y-1.5">
                  {(initialCategories ?? []).map((c) => {
                    const active = activeCategoryId && c.id === activeCategoryId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => selectCategory(c.id)}
                        className={cn(
                          "w-full rounded-2xl border px-3 py-2 text-left text-sm transition",
                          active
                            ? "border-slate-900/15 bg-slate-50"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate text-slate-800">{c.name}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {c.postCount ?? 0}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent posts */}
              <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Recent Posts</div>
                <div className="mt-3 divide-y divide-slate-200">
                  {(initialRecentPosts ?? []).slice(0, 6).map((p: any) => {
                    const slug = String(p.slug || "");
                    const href = `/blog/${encodeURIComponent(slug)}`;
                    return (
                      <Link
                        key={String(p.id)}
                        href={href}
                        onClick={() =>
                          trackCtaClick({
                            ctaId: `blog_open_recent_${slug || "unknown"}`,
                            location: "blog_recent_posts",
                            destination: href,
                            label: p.title ? `Open recent post: ${p.title}` : "Open recent post",
                          })
                        }
                        className="block py-3 transition hover:opacity-80"
                      >
                        <div className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {p.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{fmtDate(p.publishedAt)}</div>
                      </Link>
                    );
                  })}
                  {!initialRecentPosts?.length ? (
                    <div className="py-3 text-sm text-slate-500">No recent posts.</div>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
      </Section>
    </div>
  );
}
