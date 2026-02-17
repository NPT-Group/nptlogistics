// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { AUTH_COOKIE_NAME, NEXTAUTH_SECRET, DISABLE_AUTH } from "@/config/env";
import { isAdminEmail } from "@/config/adminAuth";

type AppJWT = {
  userId?: string;
  email?: string;
  name?: string;
  picture?: string;
};

/* ───────────────────────── helpers ───────────────────────── */

async function resolveAdmin(
  req: NextRequest,
): Promise<{ isAdmin: boolean; hasInvalidAuthCookie: boolean }> {
  // Dev escape hatch (optional env)
  if (DISABLE_AUTH) {
    return { isAdmin: true, hasInvalidAuthCookie: false };
  }

  const authCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const hasAuthCookie = !!authCookie;

  const token = (await getToken({
    req: req as any,
    secret: NEXTAUTH_SECRET,
    cookieName: AUTH_COOKIE_NAME,
  })) as AppJWT | null;

  // Cookie exists but token is not valid → treat as invalid so we can clear it
  if (!token?.email || !token?.name) {
    return { isAdmin: false, hasInvalidAuthCookie: hasAuthCookie };
  }

  const isAllowed = isAdminEmail(token.email);

  return {
    isAdmin: isAllowed,
    // Cookie exists but user is NOT allowed admin → clear it
    hasInvalidAuthCookie: hasAuthCookie && !isAllowed,
  };
}

/* ───────────────────────── proxy ───────────────────────── */

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only enforce on /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // /login is publicly reachable, but redirects away if already authed admin
  if (pathname === "/login") {
    const { isAdmin, hasInvalidAuthCookie } = await resolveAdmin(req);

    if (isAdmin) {
      // Authenticated admins land on /admin/blog
      const res = NextResponse.redirect(new URL("/admin/blog", req.url));
      if (hasInvalidAuthCookie) res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }

    const res = NextResponse.next();
    if (hasInvalidAuthCookie) {
      res.cookies.delete(AUTH_COOKIE_NAME);
    }
    return res;
  }

  // If an authenticated admin manually visits /admin, redirect to /admin/blog
  if (pathname === "/admin") {
    const { isAdmin, hasInvalidAuthCookie } = await resolveAdmin(req);

    if (!isAdmin) {
      const callbackUrl = encodeURIComponent(pathname + search);
      const url = new URL(`/login?callbackUrl=${callbackUrl}`, req.url);
      const res = NextResponse.redirect(url);
      if (hasInvalidAuthCookie) res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }

    const res = NextResponse.redirect(new URL("/admin/blog", req.url));
    if (hasInvalidAuthCookie) res.cookies.delete(AUTH_COOKIE_NAME);
    return res;
  }

  // Guard all other /admin routes
  const { isAdmin, hasInvalidAuthCookie } = await resolveAdmin(req);

  if (!isAdmin) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    const url = new URL(`/login?callbackUrl=${callbackUrl}`, req.url);
    const res = NextResponse.redirect(url);

    if (hasInvalidAuthCookie) {
      res.cookies.delete(AUTH_COOKIE_NAME);
    }

    return res;
  }

  // Admin allowed → continue
  const res = NextResponse.next();
  if (hasInvalidAuthCookie) {
    res.cookies.delete(AUTH_COOKIE_NAME);
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
