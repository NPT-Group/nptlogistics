// src/lib/utils/ssrFetch.ts
import { cookies, headers } from "next/headers";

export async function ssrApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const hdrs = await headers();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";

  if (!host) throw new Error("ssrApiFetch: cannot determine host from request headers");

  const origin = `${proto}://${host}`;
  const url = path.startsWith("http://") || path.startsWith("https://") ? path : new URL(path, origin).toString();

  const res = await fetch(url, {
    ...init,
    cache: init?.cache ?? "no-store",
    headers: {
      ...(init?.headers || {}),
      cookie: cookieHeader,
      "user-agent": hdrs.get("user-agent") ?? "",
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (json as any)?.message || `Request failed (${res.status})`;
    const err = new Error(msg) as Error & { status?: number; payload?: any };
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  return json as T;
}
