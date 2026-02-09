// src/lib/utils/blog/metadata.ts
import type { Metadata } from "next";

export function nptTitle(pageTitle?: string | null) {
  const t = String(pageTitle ?? "").trim();
  return t ? `NPT Logistics - ${t}` : "NPT Logistics";
}

export function nptMetadata(opts: { title?: string | null; description?: string | null; noIndex?: boolean }): Metadata {
  const description = opts.description ? String(opts.description).trim() : undefined;

  return {
    title: nptTitle(opts.title),
    ...(description ? { description } : {}),
    ...(opts.noIndex
      ? {
          robots: { index: false, follow: false },
        }
      : {}),
  };
}
