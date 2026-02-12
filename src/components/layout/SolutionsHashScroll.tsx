"use client";

import React from "react";

const TARGET_HASH = "#solutions";

function normalizePath(path: string) {
  if (!path) return "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

function scrollToSolutions(behavior: ScrollBehavior) {
  const target = document.getElementById("solutions");
  if (!target) return false;
  target.scrollIntoView({ behavior, block: "start", inline: "nearest" });
  return true;
}

export function SolutionsHashScroll() {
  React.useEffect(() => {
    const handleHashRoute = (behavior: ScrollBehavior) => {
      if (window.location.hash !== TARGET_HASH) return;

      // Double RAF ensures layout is stable before scrolling.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSolutions(behavior);
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

      if (url.hash !== TARGET_HASH || url.origin !== window.location.origin) return;

      const currentPath = normalizePath(window.location.pathname);
      const linkPath = normalizePath(url.pathname || "/");
      if (currentPath !== linkPath) return;

      // Same-page hash click should always scroll, even repeatedly.
      event.preventDefault();
      scrollToSolutions("smooth");
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

