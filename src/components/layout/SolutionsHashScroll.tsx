"use client";

import React from "react";

const HOME_PATH = "/";
const HOME_TOP_HASH = "#top";
const HASH_TARGETS = {
  "#solutions": "solutions",
} as const;

function normalizePath(path: string) {
  if (!path) return "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

function scrollToElementById(id: string, behavior: ScrollBehavior) {
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({ behavior, block: "start", inline: "nearest" });
  return true;
}

function scrollToHomeTop(behavior: ScrollBehavior) {
  window.scrollTo({ top: 0, left: 0, behavior });
}

function normalizeHash(hash: string) {
  return hash.toLowerCase();
}

function getHashTargetId(hash: string) {
  const normalizedHash = normalizeHash(hash) as keyof typeof HASH_TARGETS;
  return HASH_TARGETS[normalizedHash];
}

function isHomeTopLink(pathname: string, hash: string) {
  const normalizedPath = normalizePath(pathname);
  const normalizedHash = normalizeHash(hash);
  return normalizedPath === HOME_PATH && (normalizedHash === "" || normalizedHash === HOME_TOP_HASH);
}

export function SolutionsHashScroll() {
  React.useEffect(() => {
    const handleHashRoute = (behavior: ScrollBehavior) => {
      const targetId = getHashTargetId(window.location.hash);
      if (!targetId) return;

      // Double RAF ensures layout is stable before scrolling.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToElementById(targetId, behavior);
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
        // Same-page hash click should always scroll, even repeatedly.
        event.preventDefault();
        scrollToElementById(hashTargetId, "smooth");
        return;
      }

      if (isHomeTopLink(url.pathname, url.hash)) {
        // Clicking the logo/home on the homepage should always return to hero top.
        event.preventDefault();
        scrollToHomeTop("smooth");
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    };

    handleHashRoute("auto");
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}

