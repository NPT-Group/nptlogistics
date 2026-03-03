// src/app/(site)/services/[service]/_components/ServiceSubnav.tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import type { ServicePageModel } from "@/config/services";
import { SERVICE_SUBNAV_TOP_PX } from "../../_constants";

const EQUIPMENT_META = {
  "dry-van": { code: "DV", hint: "Enclosed standard freight" },
  flatbed: { code: "FB", hint: "Open-deck securement freight" },
  "rgn-oversize": { code: "RGN", hint: "Permit and heavy-haul freight" },
  "roll-tite-conestoga": { code: "CON", hint: "Covered-deck protection" },
  expedited: { code: "EXP", hint: "Priority timeline execution" },
  "specialized-vehicle-programs": { code: "SVP", hint: "Constraint-controlled transport" },
  "canada-us": { code: "CAUS", hint: "Cross-border lane execution" },
  "mexico-cross-border": { code: "MEX", hint: "Border handoff control" },
  "ocean-freight": { code: "OCN", hint: "FCL and LCL planning" },
  "air-freight": { code: "AIR", hint: "Priority international cargo" },
  "warehousing-distribution": { code: "W&D", hint: "Inventory and outbound flow control" },
  "managed-capacity": { code: "MNG", hint: "Procurement and optimization governance" },
  "dedicated-contract": { code: "DED", hint: "Embedded capacity and SLA execution" },
  "project-oversize-programs": { code: "PRJ", hint: "Permit and project-control logistics" },
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

export function ServiceSubnav({
  model,
  sections: sectionOverrides,
}: {
  model: ServicePageModel;
  sections?: NonNullable<ServicePageModel["sections"]>;
}) {
  const sections = sectionOverrides ?? model.sections ?? [];
  const ids = React.useMemo(() => sections.map((s) => `section-${s.key}`), [sections]);
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
    const isDesktopSticky = window.matchMedia("(min-width: 768px)").matches;
    return headerH + (isDesktopSticky ? subnavH : 0);
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

  const subnavAuraClass =
    model.key === "cross-border"
      ? "bg-[radial-gradient(560px_140px_at_50%_-18%,rgba(2,132,199,0.24),transparent_66%)]"
      : model.key === "expedited-specialized"
        ? "bg-[radial-gradient(560px_150px_at_50%_-18%,rgba(217,70,239,0.23),transparent_67%)]"
      : model.key === "value-added"
        ? "bg-[radial-gradient(560px_140px_at_50%_-18%,rgba(5,150,105,0.26),transparent_66%)]"
        : "bg-[radial-gradient(500px_130px_at_50%_-20%,rgba(220,38,38,0.24),transparent_65%)]";

  const subnavShellClass =
    model.key === "value-added"
      ? "bg-[linear-gradient(120deg,rgba(16,185,129,0.11),rgba(79,70,229,0.07),rgba(255,255,255,0.03))] shadow-[0_20px_50px_rgba(2,6,23,0.46),inset_0_1px_0_rgba(255,255,255,0.2)]"
      : model.key === "expedited-specialized"
        ? "bg-[linear-gradient(120deg,rgba(217,70,239,0.11),rgba(244,63,94,0.08),rgba(255,255,255,0.03))] shadow-[0_20px_50px_rgba(2,6,23,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]"
      : "bg-[linear-gradient(120deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] shadow-[0_20px_50px_rgba(2,6,23,0.42),inset_0_1px_0_rgba(255,255,255,0.24)]";

  const subnavGridClass =
    model.key === "expedited-specialized"
      ? "relative grid gap-2 sm:grid-cols-2 lg:grid-cols-2"
      : "relative grid gap-2 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div
      id="service-subnav"
      ref={barRef}
      className={cn(
        "z-30 border-y border-white/10 bg-[color:var(--color-footer-bg)]/95 backdrop-blur transition-all duration-300 md:sticky",
        isPinned && "bg-[color:var(--color-footer-bg)]/98 backdrop-blur-md",
      )}
      style={{ top: SERVICE_SUBNAV_TOP_PX }}
    >
      <Container
        className={cn(
          "site-page-container",
          isPinned ? "py-2.5 sm:py-3" : "py-3 sm:py-4",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10",
            subnavShellClass,
            "p-1.5 sm:p-2",
          )}
          role="tablist"
          aria-label={model.subnavLabel}
        >
          {/* Premium radial gradient overlay */}
          <div className={cn("pointer-events-none absolute inset-0", subnavAuraClass)} aria-hidden="true" />

          <div className={subnavGridClass}>
            {sections.map((s, i) => {
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
                    "focus-ring-dark",
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
