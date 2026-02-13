// src/app/(admin)/admin/jobs/applications/AdminJobApplicationsClient.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAdminTheme } from "@/components/admin/theme/AdminThemeProvider";
import { Select } from "@/components/admin/ui/Select";
import { SoftButton } from "@/components/admin/ui/Buttons";
import { Search, RefreshCw, X, Users } from "lucide-react";

export default function AdminJobApplicationsForJobClient({
  jobId,
  jobTitle,
  initialItems,
  initialMeta,
}: {
  jobId: string;
  jobTitle: string;
  initialItems: any[];
  initialMeta: any;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const items = initialItems ?? [];
  const meta = initialMeta ?? {};

  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [status, setStatus] = React.useState(sp.get("status") ?? "");
  const [isPending, startTransition] = React.useTransition();

  function pushQuery(next: Record<string, string | null | undefined>) {
    const qs = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v) qs.delete(k);
      else qs.set(k, v);
    }
    startTransition(() =>
      router.push(`/admin/jobs/${encodeURIComponent(jobId)}/applications?${qs.toString()}`),
    );
  }

  return (
    <div className="min-h-screen bg-[var(--dash-bg)]">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 -z-10",
          isDark
            ? "bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(220,38,38,0.14),transparent_55%),radial-gradient(900px_500px_at_90%_10%,rgba(255,255,255,0.06),transparent_55%)]"
            : "bg-[radial-gradient(1100px_520px_at_10%_0%,rgba(220,38,38,0.08),transparent_55%),radial-gradient(900px_480px_at_90%_10%,rgba(15,23,42,0.06),transparent_55%)]",
        )}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div
          className={cn(
            "mb-6 rounded-3xl border shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
        >
          <div className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-2xl border",
                      "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                    )}
                  >
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-[var(--dash-text)]">
                      Applications — {jobTitle}
                    </div>
                    <div className="mt-1 text-sm text-[var(--dash-muted)]">
                      Scoped to this job posting.
                    </div>
                  </div>
                </div>
              </div>

              <SoftButton
                disabled={isPending}
                onClick={() => startTransition(() => router.refresh())}
                icon={<RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />}
                label="Refresh"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px_160px]">
              <div
                className={cn(
                  "group flex items-center gap-2 rounded-2xl border px-3 py-2 transition",
                  "border-[var(--dash-border)] bg-[var(--dash-bg)]",
                  "focus-within:ring-2 focus-within:ring-[var(--dash-red-soft)]",
                )}
              >
                <Search className="h-4 w-4 text-[var(--dash-muted)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, email…"
                  className="w-full bg-transparent text-sm text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-muted)]"
                />
                {q.trim() ? (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className={cn(
                      "rounded-2xl p-1.5 text-[var(--dash-muted)] transition",
                      "hover:bg-[var(--dash-surface-2)] hover:text-[var(--dash-text)]",
                    )}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <Select
                value={status}
                onChange={setStatus}
                placeholder="All statuses"
                disabled={isPending}
                options={[
                  { value: "RECEIVED", label: "Received" },
                  { value: "VIEWED", label: "Viewed" },
                  { value: "ARCHIVED", label: "Archived" },
                ]}
                className="z-[80]"
              />

              <SoftButton
                disabled={isPending}
                onClick={() =>
                  pushQuery({ q: q.trim() || null, status: status || null, page: "1" })
                }
                icon={<Search className="h-4 w-4" />}
                label="Search"
              />
            </div>
          </div>
        </div>

        {/* Reuse the global table by just linking back to global page if you want deeper controls.
            For now we keep it simple here: show data + pagination. */}
        <div
          className={cn(
            "overflow-hidden rounded-3xl border bg-[var(--dash-surface)] shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)]",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-[var(--dash-border)] bg-[var(--dash-surface-2)]/60 backdrop-blur">
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Applicant</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Email</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a: any) => {
                  const name = `${a.firstName || ""} ${a.lastName || ""}`.trim() || "—";
                  return (
                    <tr
                      key={String(a.id)}
                      className={cn(
                        "border-b border-[var(--dash-border)]/70 last:border-b-0",
                        "transition hover:bg-[var(--dash-surface-2)]/45",
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[var(--dash-text)]">{name}</div>
                        <div className="mt-0.5 text-xs text-[var(--dash-muted)]">
                          {a.phone || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--dash-text)]/90">{a.email || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                            "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                          )}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--dash-muted)]">
                        {a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  );
                })}

                {!items.length ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-[var(--dash-muted)]">
                      No applications found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-[var(--dash-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--dash-muted)]">
              Page <span className="font-semibold text-[var(--dash-text)]">{meta?.page ?? 1}</span>{" "}
              of{" "}
              <span className="font-semibold text-[var(--dash-text)]">{meta?.totalPages ?? 1}</span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={!meta?.hasPrev || isPending}
                onClick={() => pushQuery({ page: String(Math.max(1, (meta.page ?? 1) - 1)) })}
                className={cn(
                  "rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                  "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
                  "hover:bg-[var(--dash-surface-2)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                )}
              >
                Prev
              </button>
              <button
                disabled={!meta?.hasNext || isPending}
                onClick={() => pushQuery({ page: String((meta.page ?? 1) + 1) })}
                className={cn(
                  "rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                  "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
                  "hover:bg-[var(--dash-surface-2)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                )}
              >
                Next
              </button>
            </div>
          </div>

          <div className="border-t border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3 text-[12px] text-[var(--dash-muted)]">
            Need resume downloads + status controls? Use the global{" "}
            <button
              type="button"
              className="font-semibold text-[var(--dash-text)] underline underline-offset-4"
              onClick={() => router.push("/admin/jobs/applications")}
            >
              Applications
            </button>{" "}
            page.
          </div>
        </div>
      </div>
    </div>
  );
}
