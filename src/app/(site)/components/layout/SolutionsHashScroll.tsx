"use client";

import React from "react";
import { usePathname } from "next/navigation";

const HOME_PATH = "/";
const ABOUT_US_PATH = "/about-us";
const ABOUT_FAQS_PATH = "/about-us/faqs";
const HOME_TOP_HASH = "#top";
const ABOUT_HERO_HASH = "#about-hero";
const HASH_TARGETS = {
  "#solutions": "solutions",
  "#industries": "industries",
} as const;

function normalizePath(path: string) {
  if (!path) return "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

function normalizeHash(hash: string) {
  return hash.toLowerCase();
}

function getMappedHashTargetId(hash: string) {
  const normalizedHash = normalizeHash(hash) as keyof typeof HASH_TARGETS;
  return HASH_TARGETS[normalizedHash];
}

function getRawHashId(hash: string) {
  if (!hash || hash === "#") return null;
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function getHashTargetId(hash: string) {
  // First honor explicit mapped anchors (homepage sections).
  const mapped = getMappedHashTargetId(hash);
  if (mapped) return mapped;

  // Fallback: if hash points to an existing id (service pages), use it.
  const rawId = getRawHashId(hash);
  if (!rawId) return null;
  const target = document.getElementById(rawId);
  return target ? rawId : null;
}

function isHomeTopLink(pathname: string, hash: string) {
  const normalizedPath = normalizePath(pathname);
  const normalizedHash = normalizeHash(hash);
  return (
    normalizedPath === HOME_PATH && (normalizedHash === "" || normalizedHash === HOME_TOP_HASH)
  );
}

function isAboutUsTopLink(pathname: string, hash: string) {
  const normalizedPath = normalizePath(pathname);
  const normalizedHash = normalizeHash(hash);
  return (
    normalizedPath === ABOUT_US_PATH &&
    (normalizedHash === "" || normalizedHash === ABOUT_HERO_HASH)
  );
}

function isFaqsTopLink(pathname: string, hash: string) {
  const normalizedPath = normalizePath(pathname);
  const normalizedHash = normalizeHash(hash);
  return normalizedPath === ABOUT_FAQS_PATH && normalizedHash === "";
}

function prefersReducedMotion(): boolean {
  // Guard for older browsers + SSR safety (though this is client-only)
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveScrollBehavior(preferred: ScrollBehavior): ScrollBehavior {
  // If user prefers reduced motion, never animate scroll.
  if (preferred === "smooth" && prefersReducedMotion()) return "auto";
  return preferred;
}

function scrollToElementById(id: string, behavior: ScrollBehavior) {
  const target = document.getElementById(id);
  if (!target) return false;
  const serviceShell = target.closest?.("[data-service-shell]") as HTMLElement | null;
  if (serviceShell) {
    const style = getComputedStyle(serviceShell);
    const headerH = parseFloat(style.getPropertyValue("--service-header-h")) || 0;
    const subnavH = parseFloat(style.getPropertyValue("--service-subnav-h")) || 0;
    const top = window.scrollY + target.getBoundingClientRect().top - (headerH + subnavH);
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
    return true;
  }

  target.scrollIntoView({ behavior, block: "start", inline: "nearest" });
  return true;
}

function scrollToHomeTop(behavior: ScrollBehavior) {
  window.scrollTo({ top: 0, left: 0, behavior });
}

export function SolutionsHashScroll() {
  const pathname = usePathname();

  // Same-page hash and initial load: scroll to hash target (homepage #solutions/#industries, about #locations-network/#safety-compliance, etc.)
  React.useEffect(() => {
    const handleHashRoute = (behavior: ScrollBehavior) => {
      const targetId = getHashTargetId(window.location.hash);
      if (!targetId) return;

      const resolved = resolveScrollBehavior(behavior);

      // Double RAF ensures layout is stable before scrolling (e.g. about page sections in DOM).
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToElementById(targetId, resolved);
        });
      });
    };

    const onHashChange = () => handleHashRoute("smooth");

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const currentPath = normalizePath(window.location.pathname);
      const linkPath = normalizePath(url.pathname || "/");
      if (currentPath !== linkPath) return;

      const hashTargetId = getHashTargetId(url.hash);
      if (hashTargetId) {
        // Same-page hash click: scroll (home #solutions, about #locations-network, etc.).
        event.preventDefault();
        scrollToElementById(hashTargetId, resolveScrollBehavior("smooth"));
        return;
      }

      if (isHomeTopLink(url.pathname, url.hash)) {
        // Clicking the logo/home on the homepage should always return to hero top.
        event.preventDefault();
        scrollToHomeTop(resolveScrollBehavior("smooth"));
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
        return;
      }

      if (isAboutUsTopLink(url.pathname, url.hash)) {
        // On the about page, clicking "About us" in the nav should scroll to the top.
        event.preventDefault();
        scrollToHomeTop(resolveScrollBehavior("smooth"));
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
        return;
      }

      if (isFaqsTopLink(url.pathname, url.hash)) {
        // On the FAQ page, clicking "FAQs" in the nav should scroll to the top.
        event.preventDefault();
        scrollToHomeTop(resolveScrollBehavior("smooth"));
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    };

    // Initial route: don't animate to avoid jank on load.
    handleHashRoute("auto");

    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  // After client navigation to a path with a hash (e.g. /about-us#locations-network), scroll to the section.
  // Next.js soft nav may not fire hashchange; pathname change ensures we run once the about page is mounted.
  const prevPathnameRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    const currentPath = normalizePath(pathname ?? "");
    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = currentPath;
    // Only run when pathname actually changed (client nav), not on initial mount.
    if (prevPath === null || prevPath === currentPath) return;
    if (typeof window === "undefined" || !window.location.hash) return;

    const normalizedPath = currentPath;
    if (
      normalizedPath !== ABOUT_US_PATH &&
      normalizedPath !== ABOUT_FAQS_PATH &&
      normalizedPath !== HOME_PATH
    )
      return;

    const targetId = getHashTargetId(window.location.hash);
    if (!targetId) return;

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToElementById(targetId, resolveScrollBehavior("smooth"));
      });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
