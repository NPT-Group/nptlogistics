// src/app/(site)/services/[service]/_components/ServiceSubnav.tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import type { ServicePageModel } from "@/config/services";
import { SERVICE_SUBNAV_TOP_PX } from "../../_constants";

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer-bg)] focus-visible:outline-none";

const EQUIPMENT_META = {
  "dry-van": { code: "DV", hint: "Enclosed standard freight" },
  flatbed: { code: "FB", hint: "Open-deck securement freight" },
  "rgn-oversize": { code: "RGN", hint: "Permit and heavy-haul freight" },
  "roll-tite-conestoga": { code: "CON", hint: "Covered-deck protection" },
} as const;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
  );
}

function findServiceShell(el: HTMLElement | null) {
  return (el?.closest?.("[data-service-shell]") as HTMLElement | null) ?? null;
}

export function ServiceSubnav({ model }: { model: ServicePageModel }) {
  const ids = React.useMemo(() => model.sections.map((s) => `section-${s.key}`), [model.sections]);
  const [activeId, setActiveId] = React.useState(ids[0] ?? "");
  const [isPinned, setIsPinned] = React.useState(false);
  const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();

  const barRef = React.useRef<HTMLDivElement | null>(null);

  const getStickyChromeOffset = React.useCallback(() => {
    const shell = findServiceShell(barRef.current);
    const source = shell ?? document.documentElement;
    const style = getComputedStyle(source);
    const headerH = parseFloat(style.getPropertyValue("--service-header-h")) || 0;
    const subnavH = parseFloat(style.getPropertyValue("--service-subnav-h")) || 0;
    return headerH + subnavH;
  }, []);

  // Measure subnav height and set CSS var on the service shell.
  React.useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const shell = findServiceShell(bar);
    if (!shell) return;

    const update = () => {
      const h = Math.round(bar.getBoundingClientRect().height || 0);
      if (h > 0) shell.style.setProperty("--service-subnav-h", `${h}px`);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  // Active section tracking (scroll spy)
  React.useEffect(() => {
    const onScroll = () => setIsPinned(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (ids.length === 0) return;

    let ticking = false;
    const updateActiveFromScroll = () => {
      const sectionEls = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));
      if (sectionEls.length === 0) return;

      const markerTop = getStickyChromeOffset() + 2;
      let nextActive = sectionEls[0].id;

      for (const el of sectionEls) {
        if (el.getBoundingClientRect().top <= markerTop) {
          nextActive = el.id;
        } else {
          break;
        }
      }

      setActiveId((prev) => (prev === nextActive ? prev : nextActive));
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveFromScroll();
        ticking = false;
      });
    };

    updateActiveFromScroll();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [ids, getStickyChromeOffset]);

  const scrollTo = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    const targetY = window.scrollY + el.getBoundingClientRect().top - getStickyChromeOffset();
    window.scrollTo({ top: Math.max(0, targetY), behavior });
  }, [getStickyChromeOffset]);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const total = ids.length;
      if (total <= 1) return;

      let next = index;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (index + 1) % total;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (index - 1 + total) % total;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = total - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      const nextId = ids[next]!;
      setActiveId(nextId);
      btnRefs.current[next]?.focus();
      scrollTo(nextId);
    },
    [ids, scrollTo],
  );

  return (
    <div
      id="service-subnav"
      ref={barRef}
      className={cn(
        "sticky z-30 border-y border-white/10 bg-[color:var(--color-footer-bg)]/95 backdrop-blur transition-all duration-300",
        isPinned && "bg-[color:var(--color-footer-bg)]/98 backdrop-blur-md",
      )}
      style={{ top: SERVICE_SUBNAV_TOP_PX }}
    >
      <Container
        className={cn(
          "max-w-[1440px] px-4 sm:px-6 lg:px-6",
          isPinned ? "py-2.5 sm:py-3" : "py-3 sm:py-4",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10",
            "bg-[linear-gradient(120deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]",
            "p-1.5 sm:p-2",
            "shadow-[0_20px_50px_rgba(2,6,23,0.42),inset_0_1px_0_rgba(255,255,255,0.24)]",
          )}
          role="tablist"
          aria-label={model.subnavLabel}
        >
          {/* Premium radial gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_130px_at_50%_-20%,rgba(220,38,38,0.24),transparent_65%)]"
            aria-hidden="true"
          />

          <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {model.sections.map((s, i) => {
              const id = `section-${s.key}`;
              const isActive = activeId === id;
              const meta = EQUIPMENT_META[s.key];

              return (
                <button
                  key={s.key}
                  ref={(el) => {
                    btnRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={id}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  onClick={() => {
                    setActiveId(id);
                    scrollTo(id);
                  }}
                  className={cn(
                    focusRing,
                    "group relative rounded-xl border px-3.5 py-2.5 text-left transition-all duration-300",
                    isActive
                      ? "border-[color:var(--color-brand-500)]/60 bg-white/[0.14] shadow-[0_10px_28px_rgba(2,6,23,0.34)]"
                      : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex h-5 min-w-7 items-center justify-center rounded-md px-1.5 text-[10px] font-semibold tracking-wide",
                            isActive
                              ? "bg-[color:var(--color-brand-500)]/20 text-[color:var(--color-brand-500)]"
                              : "bg-white/10 text-white/70",
                          )}
                        >
                          {meta?.code ?? `0${i + 1}`}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-semibold tracking-tight transition-colors sm:text-[15px]",
                            isActive ? "text-white" : "text-white/82 group-hover:text-white",
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-[11px] leading-tight",
                          isActive ? "text-white/78" : "text-white/52 group-hover:text-white/70",
                        )}
                      >
                        {meta?.hint}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "mt-0.5 text-[11px] font-medium tracking-wide uppercase",
                        isActive ? "text-white/85" : "text-white/45",
                      )}
                    >
                      {`0${i + 1}`}
                    </span>
                  </div>

                  <div className="mt-2 h-[2px] w-full rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-[color:var(--color-brand-500)]"
                      initial={false}
                      animate={{
                        width: isActive ? "100%" : "0%",
                        opacity: isActive ? 1 : 0.5,
                      }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.45,
                        ease: "easeInOut",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
