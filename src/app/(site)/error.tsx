"use client";

import * as React from "react";
import Link from "next/link";

function pickMessage(error: unknown) {
  const e = error as any;

  // Your ssrApiFetch throws Error with { status, payload }
  const apiMsg = e?.payload?.message || e?.payload?.error || e?.message;

  // Nice fallbacks by status if we have it
  const status = typeof e?.status === "number" ? e.status : undefined;

  if (status === 404) return apiMsg || "We couldn’t find what you were looking for.";
  if (status === 401) return apiMsg || "You’re not authorized to view this page.";
  if (status === 403) return apiMsg || "Access denied.";
  if (status === 429) return apiMsg || "Too many requests. Please try again shortly.";

  return apiMsg || "Something went wrong. Please try again.";
}

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = React.useMemo(() => pickMessage(error), [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[28px] border border-slate-200/70 bg-white p-7 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>

          <p className="mt-2 text-sm text-slate-600">{message}</p>

          {/* Optional: show digest in dev/support */}
          {error?.digest ? (
            <p className="mt-2 text-xs text-slate-400">Error ID: {error.digest}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => reset()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Try again
            </button>

            <Link
              href="/"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
