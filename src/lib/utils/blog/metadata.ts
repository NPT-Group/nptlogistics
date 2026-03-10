// src/lib/utils/blog/metadata.ts
import type { Metadata } from "next";
import { SITE_DEFAULT_OG_IMAGE, SITE_NAME, toAbsoluteUrl } from "@/lib/seo/site";

export function nptTitle(pageTitle?: string | null) {
  const t = String(pageTitle ?? "").trim();
  return t || SITE_NAME;
}

export function nptMetadata(opts: {
  title?: string | null;
  description?: string | null;
  noIndex?: boolean;
  canonicalPath?: string;
  ogImage?: string | null;
}): Metadata {
  const description = opts.description ? String(opts.description).trim() : undefined;
  const title = nptTitle(opts.title);
  const image = opts.ogImage ? String(opts.ogImage) : SITE_DEFAULT_OG_IMAGE;

  return {
    title,
    ...(description ? { description } : {}),
    ...(opts.canonicalPath
      ? {
          alternates: { canonical: opts.canonicalPath },
          openGraph: {
            title,
            description,
            url: toAbsoluteUrl(opts.canonicalPath),
            images: [image],
            siteName: SITE_NAME,
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
          },
        }
      : {}),
    ...(opts.noIndex
      ? {
          robots: { index: false, follow: false },
        }
      : {}),
  };
}
