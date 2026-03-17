"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";
import { getSiteSearchResults } from "@/lib/search/siteSearch";
import { HEADER_HEIGHT_PX, focusRingNav } from "./constants";

type SearchBubbleVariant = "desktop" | "mobile";

export function SearchBubbleBase({
  open,
  onOpenChange,
  triggerRef,
  variant,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  variant: SearchBubbleVariant;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const shellRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  const isDesktop = variant === "desktop";
  const results = React.useMemo(
    () => getSiteSearchResults(query, isDesktop ? 6 : 7),
    [query, isDesktop],
  );

  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), isDesktop ? 40 : 50);
    return () => window.clearTimeout(id);
  }, [open, isDesktop]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (triggerRef?.current?.contains(target)) return;
      if (!shellRef.current?.contains(target)) onOpenChange(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onOpenChange, triggerRef]);

  React.useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runNavigation = React.useCallback(
    (href: string, label: string, index: number) => {
      trackCtaClick({
        ctaId: isDesktop ? "header_search_result_open" : "nav_mobile_search_result_open",
        location: isDesktop ? "header_search_bubble" : "nav_mobile:search_bubble",
        destination: href,
        label: `${label} (${index + 1})`,
      });
      onOpenChange(false);
      setQuery("");
      setActiveIndex(0);
      router.push(href);
    },
    [isDesktop, onOpenChange, router],
  );

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const choice = results[activeIndex] ?? results[0];
      if (!choice) return;
      runNavigation(choice.href, choice.label, activeIndex);
    },
    [activeIndex, results, runNavigation],
  );

  const wrapperClass = isDesktop
    ? "fixed inset-x-0 z-[65] hidden justify-center px-6 lg:flex"
    : "fixed inset-x-0 z-[66] px-3 lg:hidden";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={wrapperClass}
          style={{ top: HEADER_HEIGHT_PX + (isDesktop ? 10 : 8) }}
          initial={{ opacity: 0, y: -8, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.99 }}
          transition={{ duration: isDesktop ? 0.22 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={shellRef}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-white/22",
              "bg-[linear-gradient(130deg,rgba(15,23,42,0.96),rgba(30,41,59,0.95),rgba(15,23,42,0.96))]",
              "backdrop-blur-[28px] backdrop-saturate-[190%]",
              "shadow-[0_24px_64px_rgba(2,6,23,0.52),inset_0_1px_0_rgba(255,255,255,0.30)]",
              isDesktop ? "w-full max-w-[760px] p-3" : "p-2.5",
            )}
          >
            <form onSubmit={onSubmit} className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/55"
                aria-hidden
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isDesktop
                    ? "Search services, equipment, industries, locations..."
                    : "Search site..."
                }
                className={cn(
                  "w-full rounded-xl border border-white/28 text-sm text-white placeholder:text-white/52",
                  "bg-[linear-gradient(120deg,rgba(15,23,42,0.94),rgba(30,41,59,0.92))]",
                  "outline-none transition-colors focus:border-[color:var(--color-brand-500)]/70",
                  isDesktop ? "h-11 pr-14 pl-9" : "h-10 pr-12 pl-9",
                )}
                aria-label={isDesktop ? "Site search" : "Mobile site search"}
              />
              <button
                type="submit"
                className={cn(
                  "absolute top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md px-2.5 text-[11px] font-semibold",
                  "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                  isDesktop ? "right-2 h-7" : "right-1.5 h-7",
                  focusRingNav,
                )}
              >
                Go
              </button>
            </form>

            <div
              className={cn(
                "mt-2 overflow-auto rounded-xl border border-white/14 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(17,24,39,0.95))] p-1",
                isDesktop ? "max-h-[300px]" : "max-h-[56vh]",
              )}
            >
              {query.trim().length === 0 ? (
                <div className="flex items-center gap-2 px-2 py-2 text-[12px] text-white/68">
                  <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-brand-500)]" aria-hidden />
                  {isDesktop
                    ? "Smart search: try flatbed, step deck, hazmat, or toronto."
                    : "Try flatbed, step deck, hazmat, or toronto."}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={`${result.href}-${result.label}`}
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => runNavigation(result.href, result.label, idx)}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2 text-left transition",
                          isActive
                            ? "border-[color:var(--color-brand-500)]/60 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))]"
                            : "border-transparent bg-transparent hover:border-white/16 hover:bg-white/[0.05]",
                        )}
                      >
                        <div className="text-sm font-semibold text-white">{result.label}</div>
                        <div className="mt-0.5 text-[12px] text-white/65">
                          {result.description ?? result.href}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-white/16 bg-white/[0.06] px-3 py-2 text-[12px] text-white/72">
                  {isDesktop
                    ? "No direct match found. Try broader terms like truckload, cross-border, or quote."
                    : "No direct match found."}
                  <div className="mt-1">
                    <Link
                      href="/#solutions"
                      onClick={() => onOpenChange(false)}
                      className="font-semibold text-[color:var(--color-brand-500)] hover:underline"
                    >
                      Browse solutions
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

