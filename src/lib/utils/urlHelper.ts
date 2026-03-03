// src/lib/utils/urlHelper.ts
import { NextRequest } from "next/server";

/**
 * Derives the public-facing site origin from a NextRequest.
 *
 * Works for:
 * - localhost (http)
 * - production https
 * - reverse proxies (x-forwarded-proto / x-forwarded-host)
 *
 * Always returns an origin like:
 *   https://example.com
 *   http://localhost:3000
 */
export function getSiteUrlFromRequest(req: NextRequest): string {
  // 1) Prefer Next.js computed origin
  const origin = req.nextUrl?.origin;
  if (origin && origin !== "null") return origin;

  // 2) Reverse proxy headers
  const h = req.headers;
  const proto = (h.get("x-forwarded-proto") || "").split(",")[0].trim();
  const forwardedHost = (h.get("x-forwarded-host") || "").split(",")[0].trim();

  if (proto && forwardedHost) {
    return `${proto}://${forwardedHost}`;
  }

  // 3) Fallback to host header
  const host = (h.get("host") || "").trim();
  if (host) {
    const scheme = host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";

    return `${scheme}://${host}`;
  }

  // 4) Last resort
  return "http://localhost:3000";
}
