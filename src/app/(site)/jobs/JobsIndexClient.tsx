// src/app/(site)/jobs/JobsIndexClient.tsx
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
  Filter,
  X,
  ChevronDown,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

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

function getAssetUrl(asset: any): string {
  if (!asset) return "";
  return (
    asset?.url ||
    asset?.publicUrl ||
    asset?.cdnUrl ||
    asset?.s3Url ||
    asset?.location ||
    asset?.href ||
    ""
  );
}

export default function JobsIndexClient({
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

  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [department, setDepartment] = React.useState(sp.get("department") ?? "");
  const [location, setLocation] = React.useState(sp.get("location") ?? "");
  const [workplaceType, setWorkplaceType] = React.useState(sp.get("workplaceType") ?? "");
  const [employmentType, setEmploymentType] = React.useState(sp.get("employmentType") ?? "");
  const [isPending, startTransition] = React.useTransition();

  const focusRing =
    "focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-ring)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const fieldBase =
    "h-11 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-[15px] text-slate-900 " +
    "placeholder:text-slate-400 shadow-sm outline-none transition " +
    "focus:border-[color:var(--color-brand-600)]/35";

  const fieldWithIcon = "pl-10 pr-4";

  const selectBase =
    "h-11 w-full rounded-2xl border border-slate-200/80 bg-white px-4 pr-10 text-[15px] text-slate-900 shadow-sm outline-none transition " +
    "focus:border-[color:var(--color-brand-600)]/35 appearance-none";

  function push(next: Record<string, string | null | undefined>) {
    const qs = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v) qs.delete(k);
      else qs.set(k, v);
    }
    qs.set("page", "1");
    startTransition(() => router.push(`/jobs?${qs.toString()}`));
  }

  function apply() {
    push({
      q: q.trim() ? q.trim() : null,
      department: department.trim() ? department.trim() : null,
      location: location.trim() ? location.trim() : null,
      workplaceType: workplaceType || null,
      employmentType: employmentType || null,
    });
  }

  function clearAll() {
    setQ("");
    setDepartment("");
    setLocation("");
    setWorkplaceType("");
    setEmploymentType("");
    startTransition(() => router.push("/jobs"));
  }

  const activeFilters =
    (q && q.trim()) ||
    (department && department.trim()) ||
    (location && location.trim()) ||
    workplaceType ||
    employmentType;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200/70">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(900px_450px_at_10%_0%,rgba(220,38,38,0.10),transparent_55%),radial-gradient(700px_420px_at_90%_20%,rgba(15,23,42,0.07),transparent_55%)]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-600)]" />
              Now hiring across North America
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Careers at NPT Logistics
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Join a team focused on dependable, modern logistics — cross-border expertise, strong
              execution, and customer-first service.
            </p>

            {/* Search row */}
            <div className="mt-6 rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => (e.key === "Enter" ? apply() : null)}
                    placeholder="Search roles, tags, department…"
                    className={[fieldBase, fieldWithIcon, focusRing].join(" ")}
                  />
                </div>

                <button
                  onClick={apply}
                  disabled={isPending}
                  className={[
                    "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold",
                    "bg-slate-900 text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60",
                    focusRing,
                  ].join(" ")}
                >
                  Search <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Filters */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div className="relative">
                  <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department"
                    className={[fieldBase, fieldWithIcon, focusRing].join(" ")}
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className={[fieldBase, fieldWithIcon, focusRing].join(" ")}
                  />
                </div>

                <div className="relative">
                  <select
                    value={workplaceType}
                    onChange={(e) => setWorkplaceType(e.target.value)}
                    className={[
                      selectBase,
                      focusRing,
                      "[&>option]:bg-white [&>option]:text-slate-900",
                    ].join(" ")}
                  >
                    <option value="">Workplace type</option>
                    {["ONSITE", "HYBRID", "REMOTE"].map((v) => (
                      <option key={v} value={v}>
                        {pillLabel(v)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="relative">
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className={[
                      selectBase,
                      focusRing,
                      "[&>option]:bg-white [&>option]:text-slate-900",
                    ].join(" ")}
                  >
                    <option value="">Employment type</option>
                    {["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY", "INTERN"].map((v) => (
                      <option key={v} value={v}>
                        {pillLabel(v)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={apply}
                    disabled={isPending}
                    className={[
                      "inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold",
                      "border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60",
                      focusRing,
                    ].join(" ")}
                  >
                    <Filter className="h-4 w-4" />
                    Apply
                  </button>

                  <button
                    onClick={clearAll}
                    disabled={isPending || !activeFilters}
                    className={[
                      "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                      "border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50",
                      focusRing,
                    ].join(" ")}
                    title="Clear"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {activeFilters ? (
                <div className="mt-3 text-xs text-slate-500">
                  Tip: results match title, summary, department, and tags.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-xl font-semibold tracking-tight text-slate-900">Open roles</div>
            <div className="mt-1 text-sm text-slate-500">
              Page <span className="font-semibold text-slate-900">{meta?.page ?? 1}</span> of{" "}
              <span className="font-semibold text-slate-900">{meta?.totalPages ?? 1}</span>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Total:{" "}
            <span className="font-semibold text-slate-900">{meta?.total ?? items.length}</span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((j: any) => {
            const loc = Array.isArray(j.locations) ? j.locations : [];
            const locLabel =
              loc[0]?.label || loc[0]?.city || loc[0]?.region || loc[0]?.country || "—";

            const workLabel = j.workplaceType ? pillLabel(String(j.workplaceType)) : "";
            const empLabel = j.employmentType ? pillLabel(String(j.employmentType)) : "";

            const typeLabel = [workLabel, empLabel].filter(Boolean).join(" • ") || "—";

            const publishedLabel = fmtDate(j.publishedAt || j.createdAt);
            const coverUrl = getAssetUrl(j.coverImage);

            return (
              <Link
                key={String(j.id ?? j.slug)}
                href={`/jobs/${encodeURIComponent(String(j.slug))}`}
                className="group overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Cover */}
                <div className="relative h-32 w-full bg-slate-50">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={j.title ? `${j.title} cover` : "Job cover"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="line-clamp-2 text-base font-semibold tracking-tight text-slate-900 group-hover:underline">
                    {j.title || "Untitled role"}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {locLabel}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      {typeLabel}
                    </span>

                    {publishedLabel ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {publishedLabel}
                      </span>
                    ) : null}
                  </div>

                  {j.summary ? (
                    <div className="mt-3 line-clamp-3 text-sm text-slate-600">{j.summary}</div>
                  ) : null}

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    View role <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!items.length ? (
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            No roles found. Try adjusting filters.
          </div>
        ) : null}

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            disabled={!meta?.hasPrev || isPending}
            onClick={() => {
              const qs = new URLSearchParams(sp.toString());
              qs.set("page", String(Math.max(1, (meta.page ?? 1) - 1)));
              startTransition(() => router.push(`/jobs?${qs.toString()}`));
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
              const qs = new URLSearchParams(sp.toString());
              qs.set("page", String((meta.page ?? 1) + 1));
              startTransition(() => router.push(`/jobs?${qs.toString()}`));
            }}
            className={[
              "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50",
              focusRing,
            ].join(" ")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
