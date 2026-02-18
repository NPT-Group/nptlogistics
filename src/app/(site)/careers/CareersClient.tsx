"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Building2,
  MapPin,
  Search,
  ArrowRight,
  X,
  ChevronDown,
  Calendar,
  ExternalLink,
} from "lucide-react";

import { NAV_OFFSET } from "@/constants/ui";
import { EEmploymentType } from "@/types/jobPosting.types";
import { trackCtaClick } from "@/lib/analytics/cta";

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

function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  // Slightly more offset so sticky navbar never covers the heading
  const extra = 12;
  const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET - extra;

  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

export default function CareersClient({
  initialItems,
  initialMeta,
}: {
  initialItems: any[];
  initialMeta: any;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const items = initialItems ?? [];
  const meta = initialMeta ?? {};

  const SECTION_SCROLL_MARGIN_TOP = `${NAV_OFFSET}px`;

  // Filters (Job Listings section)
  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [department, setDepartment] = React.useState(sp.get("department") ?? "");
  const [location, setLocation] = React.useState(sp.get("location") ?? "");
  const [employmentType, setEmploymentType] = React.useState(sp.get("employmentType") ?? "");
  const [isPending, startTransition] = React.useTransition();

  const focusRing =
    "focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-ring)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const activeFilters =
    (q && q.trim()) ||
    (department && department.trim()) ||
    (location && location.trim()) ||
    employmentType;

  // Deep-link support: /careers#overview | #drive | #jobs
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash || "";
    const id = hash.replace("#", "");
    if (!id) return;

    const t = window.setTimeout(() => scrollToId(id), 50);
    return () => window.clearTimeout(t);
  }, []);

  function push(next: Record<string, string | null | undefined>) {
    const qs = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v) qs.delete(k);
      else qs.set(k, v);
    }
    qs.set("page", "1");
    startTransition(() => router.push(`/careers?${qs.toString()}#jobs`));
  }

  function apply() {
    // Track filter application (useful to know if people are using search/filtering)
    trackCtaClick({
      ctaId: "careers_apply_filters",
      location: "careers_jobs_filters",
      destination: "/careers#jobs",
      label: "Apply filters",
    });

    push({
      q: q.trim() ? q.trim() : null,
      department: department.trim() ? department.trim() : null,
      location: location.trim() ? location.trim() : null,
      employmentType: employmentType || null,
    });
  }

  function clearAll() {
    trackCtaClick({
      ctaId: "careers_clear_filters",
      location: "careers_jobs_filters",
      destination: "/careers#jobs",
      label: "Clear filters",
    });

    setQ("");
    setDepartment("");
    setLocation("");
    setEmploymentType("");
    startTransition(() => router.push("/careers#jobs"));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      {/* =========================
    1) HERO / OVERVIEW
    Anchor: #overview
   ========================= */}
      <section
        id="overview"
        className="relative overflow-hidden border-b border-slate-200/70"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        {/* background banner */}
        <div className="absolute inset-0">
          <Image
            src="/careers/careers-banner.jpg"
            alt="Careers banner"
            fill
            priority
            className="object-cover"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15"
            aria-hidden="true"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-55"
            style={{
              background:
                "radial-gradient(900px 450px at 10% 0%, rgba(220,38,38,0.16), transparent 60%), radial-gradient(700px 420px at 90% 25%, rgba(15,23,42,0.12), transparent 60%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="mx-auto max-w-6xl px-6">
            <div
              className={[
                "relative z-10 flex flex-col justify-center",
                // shorter height
                "min-h-[44svh] sm:min-h-[42svh]",
                // reduced padding
                "pt-8 pb-8 sm:pt-10 sm:pb-10",
              ].join(" ")}
            >
              {/* Badge */}
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-600)]" />
                Join our logistics team
              </span>

              {/* Headline */}
              <h1 className="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl">
                Careers at NPT
              </h1>

              {/* Subtext */}
              <div className="mt-4 max-w-2xl">
                <p className="border-l-2 border-[color:var(--color-brand-500)] pl-5 text-sm leading-relaxed text-white/90 sm:text-base">
                  Build a career in logistics with a team that values safety, consistency, and clear
                  communication. Explore roles across drivers, terminals, dispatch, and operations.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    trackCtaClick({
                      ctaId: "careers_view_job_listings",
                      location: "careers_hero",
                      destination: "/careers#jobs",
                      label: "View Job Listings",
                    });
                    scrollToId("jobs");
                  }}
                  className={[
                    "inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold",
                    "bg-white text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                    focusRing,
                  ].join(" ")}
                >
                  View Job Listings <ArrowRight className="h-4 w-4" />
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
                  className={[
                    "inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold",
                    "border border-white/22 bg-white/10 text-white shadow-sm transition hover:bg-white/15",
                    "backdrop-blur",
                    focusRing,
                  ].join(" ")}
                >
                  Driver Opportunities <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Micro trust strip */}
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  Safety-first culture
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  Clear communication
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  Reliable support teams
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          2) DRIVE FOR NPT
          Anchor: #drive
         ========================= */}
      <section
        id="drive"
        className="mx-auto max-w-6xl px-6 py-12"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Drive for NPT</h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              If you’re a driver, we’ve made applying quick and straightforward. We prioritize a
              safety-first culture, modern equipment, and reliable support from dispatch and
              operations.
            </p>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Equipment & Safety</div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Maintained fleet and compliance-focused operations</li>
                <li>Safety standards and clear procedures</li>
                <li>Dedicated dispatch and support teams</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Briefcase className="h-4 w-4" />
              Driver Applications
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Driver applications are handled externally.
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
              className={[
                "mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold",
                "bg-slate-900 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                focusRing,
              ].join(" ")}
            >
              Apply via Drivedock <ExternalLink className="h-4 w-4" />
            </a>

            <div className="mt-3 text-xs text-slate-500">
              Opens in a new tab. No internal driver application forms.
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          3) JOB LISTINGS (NON-DRIVER)
          Anchor: #jobs
         ========================= */}
      <section
        id="jobs"
        className="border-t border-slate-200/70 bg-white"
        style={{ scrollMarginTop: SECTION_SCROLL_MARGIN_TOP }}
      >
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Job Openings</h2>
              <p className="mt-1 text-sm text-slate-600">
                Explore open roles across operations, dispatch, and administration.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              Total:{" "}
              <span className="font-semibold text-slate-900">{meta?.total ?? items.length}</span>
            </div>
          </div>

          {/* Filters (minimal, integrated) */}
          <div className="mt-6">
            <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-3 p-4 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => (e.key === "Enter" ? apply() : null)}
                    placeholder="Search roles…"
                    className={[
                      "h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-[15px] text-slate-900",
                      "shadow-sm transition outline-none placeholder:text-slate-400 focus:border-slate-300",
                      focusRing,
                    ].join(" ")}
                  />
                </div>

                <div className="relative">
                  <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    onKeyDown={(e) => (e.key === "Enter" ? apply() : null)}
                    placeholder="Department"
                    className={[
                      "h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-[15px] text-slate-900",
                      "shadow-sm transition outline-none placeholder:text-slate-400 focus:border-slate-300",
                      focusRing,
                    ].join(" ")}
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => (e.key === "Enter" ? apply() : null)}
                    placeholder="Location"
                    className={[
                      "h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-[15px] text-slate-900",
                      "shadow-sm transition outline-none placeholder:text-slate-400 focus:border-slate-300",
                      focusRing,
                    ].join(" ")}
                  />
                </div>

                <div className="relative">
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className={[
                      "h-10 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[15px] text-slate-900",
                      "shadow-sm transition outline-none focus:border-slate-300",
                      focusRing,
                    ].join(" ")}
                  >
                    <option value="">Employment type</option>
                    {Object.values(EEmploymentType).map((v) => (
                      <option key={v} value={v}>
                        {pillLabel(v)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-200/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={apply}
                    disabled={isPending}
                    className={[
                      "inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold",
                      "border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:opacity-60",
                      focusRing,
                    ].join(" ")}
                  >
                    Apply
                  </button>

                  <button
                    onClick={clearAll}
                    disabled={isPending || !activeFilters}
                    className={[
                      "inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold",
                      "border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50",
                      focusRing,
                    ].join(" ")}
                    title="Clear filters"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  Page <span className="font-semibold text-slate-900">{meta?.page ?? 1}</span> of{" "}
                  <span className="font-semibold text-slate-900">{meta?.totalPages ?? 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Display (scannable list, no images) */}
          <div className="mt-4 overflow-hidden rounded-[20px] border border-slate-200 bg-white">
            <div className="grid grid-cols-1 divide-y divide-slate-200">
              {items.map((j: any) => {
                const loc = Array.isArray(j.locations) ? j.locations : [];
                const locLabel =
                  loc[0]?.label || loc[0]?.city || loc[0]?.region || loc[0]?.country || "—";

                const empLabel = j.employmentType ? pillLabel(String(j.employmentType)) : "—";
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
                        ctaId: `careers_open_job_${slug || "unknown"}`,
                        location: "careers_jobs_list",
                        destination: jobHref,
                        label: j.title ? `Open job: ${j.title}` : "Open job",
                      })
                    }
                    className={[
                      "group block px-5 py-4 transition",
                      "hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-ring)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    ].join(" ")}
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

                          {publishedLabel ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {publishedLabel}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 sm:mt-0">
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    {j.summary ? (
                      <div className="mt-2 line-clamp-2 text-sm text-slate-600">{j.summary}</div>
                    ) : null}
                  </Link>
                );
              })}
            </div>

            {!items.length ? (
              <div className="p-10 text-center text-sm text-slate-500">
                No roles found. Try adjusting filters.
              </div>
            ) : null}
          </div>

          {/* Pagination (kept; stays in-section) */}
          <div className="mt-10 flex items-center justify-between gap-3">
            <button
              disabled={!meta?.hasPrev || isPending}
              onClick={() => {
                trackCtaClick({
                  ctaId: "careers_pagination_prev",
                  location: "careers_jobs_pagination",
                  destination: "/careers#jobs",
                  label: "Prev page",
                });

                const qs = new URLSearchParams(sp.toString());
                qs.set("page", String(Math.max(1, (meta.page ?? 1) - 1)));
                startTransition(() => router.push(`/careers?${qs.toString()}#jobs`));
              }}
              className={[
                "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50",
                focusRing,
              ].join(" ")}
            >
              Prev
            </button>

            <div className="text-xs text-slate-500">Showing {items.length} items</div>

            <button
              disabled={!meta?.hasNext || isPending}
              onClick={() => {
                trackCtaClick({
                  ctaId: "careers_pagination_next",
                  location: "careers_jobs_pagination",
                  destination: "/careers#jobs",
                  label: "Next page",
                });

                const qs = new URLSearchParams(sp.toString());
                qs.set("page", String((meta.page ?? 1) + 1));
                startTransition(() => router.push(`/careers?${qs.toString()}#jobs`));
              }}
              className={[
                "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50",
                focusRing,
              ].join(" ")}
            >
              Next
            </button>
          </div>

          <div className="mt-8 text-xs text-slate-500">
            Driver role? Use{" "}
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
              className={[
                "font-semibold text-slate-900 underline underline-offset-2",
                focusRing,
              ].join(" ")}
            >
              Driver Opportunities
            </button>
            .
          </div>
        </div>
      </section>
    </div>
  );
}
