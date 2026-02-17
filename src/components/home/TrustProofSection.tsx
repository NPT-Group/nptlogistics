"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
import {
  TRUST_PROOF_ITEMS,
  TRUST_PARTNER_LOGOS,
  TRUST_PROOF_SECTION,
  type TestimonialItem,
} from "@/config/testimonials";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return v;
    // support youtu.be
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    // support /shorts/<id> and /embed/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    const shortsIdx = parts.indexOf("shorts");
    if (shortsIdx !== -1 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    const embedIdx = parts.indexOf("embed");
    if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
  } catch {
    // noop
  }
  return "";
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "text-[18px] leading-none",
            i < rating ? "text-[color:var(--color-brand-500)]" : "text-black/12",
          )}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: Extract<TestimonialItem, { type: "testimonial" }> }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl",
        "border border-black/20 bg-[#efefef]",
        "shadow-[0_14px_28px_rgba(2,6,23,0.14)]",
      )}
    >
      <div className="relative flex h-full min-h-[190px] flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate text-[14px] font-semibold text-[color:var(--color-text-light)]">
            {item.name}
          </div>
          <Stars rating={item.rating} />
        </div>
        <blockquote className="mt-4 line-clamp-4 text-[13px] leading-relaxed text-[color:var(--color-muted-light)] sm:text-[14px]">
          “{item.quote}”
        </blockquote>
        <div className="mt-auto pt-4 text-xs text-[color:var(--color-muted-light)]">
          Trusted shipper feedback
        </div>
      </div>
    </div>
  );
}

function VideoCard({
  item,
  isActive,
}: {
  item: Extract<TestimonialItem, { type: "video" }>;
  isActive: boolean;
}) {
  const ytId = React.useMemo(() => getYouTubeId(item.youtubeUrl), [item.youtubeUrl]);
  const channelHref = item.channelUrl ?? item.youtubeUrl;

  // Autoplay requires mute. Loop requires playlist=ID.
  const embedSrc = React.useMemo(() => {
    if (!ytId || !isActive) return "";
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: ytId,
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });
    return `https://www.youtube.com/embed/${ytId}?${params.toString()}`;
  }, [isActive, ytId]);
  const thumbnailSrc = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "";

  const [hovered, setHovered] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const copyResetTimeoutRef = React.useRef<number | null>(null);

  const openYoutube = React.useCallback(() => {
    window.open(item.youtubeUrl, "_blank", "noopener,noreferrer");
  }, [item.youtubeUrl]);

  const copyLink = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(item.youtubeUrl);
      setCopied(true);
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
      copyResetTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copyResetTimeoutRef.current = null;
      }, 1200);
    } catch {
      openYoutube();
    }
  }, [item.youtubeUrl, openYoutube]);
  React.useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-black",
        "shadow-[0_18px_36px_rgba(2,6,23,0.24)]",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={openYoutube}
      role="group"
      aria-label="Featured video"
    >
      <div className="relative aspect-video w-full">
        {isActive && embedSrc ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedSrc}
            title={item.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : thumbnailSrc ? (
          <>
            <img
              src={thumbnailSrc}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white">
                ▶
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/60">
            Video unavailable
          </div>
        )}

        {/* Clean default caption (like screenshot 2) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/82 via-black/26 to-transparent px-6 pt-8 pb-5 max-sm:px-4 max-sm:pt-6 max-sm:pb-4">
          <div className="text-[20px] leading-[1.08] font-bold text-white/95 max-sm:text-[22px]">
            {item.title}
          </div>
          {item.description ? (
            <div className="mt-1.5 text-[13px] text-white/88 max-sm:text-[11px]">
              {item.description}
            </div>
          ) : null}
        </div>

        {/* Hover top controls (inspired by screenshot 3) */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex items-center justify-between bg-black/78 px-4 py-2.5 text-white transition-opacity duration-200",
            hovered ? "opacity-100" : "opacity-0",
          )}
        >
          <a
            href={channelHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "pointer-events-auto inline-flex items-center gap-2 truncate text-sm font-semibold",
              "cursor-pointer hover:text-white/90",
              focusRing,
            )}
          >
            <Image
              src="/brand/NPTlogo2.png"
              alt="NPT logo"
              width={16}
              height={16}
              className="h-4 w-4 rounded-sm object-contain"
            />
            <span className="truncate">NPT Logistics</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyLink}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-white/22 px-2.5 text-xs font-semibold hover:bg-white/12",
                focusRing,
              )}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrustProofSection() {
  const reduceMotion = useReducedMotion();
  const pointerStartRef = React.useRef<{ x: number; y: number; pointerType: string } | null>(null);
  const orderedItems = React.useMemo(
    () =>
      [...TRUST_PROOF_ITEMS].sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === "video" ? -1 : 1;
      }),
    [],
  );
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const total = orderedItems.length;
  const hasMultiple = total > 1;
  const getLoopedIndex = React.useCallback(
    (value: number) => {
      if (total === 0) return 0;
      return (value + total) % total;
    },
    [total],
  );
  const goPrev = React.useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setIndex((prev) => getLoopedIndex(prev - 1));
  }, [getLoopedIndex, total]);
  const goNext = React.useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setIndex((prev) => getLoopedIndex(prev + 1));
  }, [getLoopedIndex, total]);
  const setDirectIndex = React.useCallback(
    (next: number) => {
      if (total <= 1) return;
      const normalized = getLoopedIndex(next);
      if (normalized === index) return;
      const forward = (normalized - index + total) % total;
      const backward = (index - normalized + total) % total;
      setDirection(forward <= backward ? 1 : -1);
      setIndex(normalized);
    },
    [getLoopedIndex, index, total],
  );
  const leftIndex = React.useMemo(() => getLoopedIndex(index - 1), [getLoopedIndex, index]);
  const rightIndex = React.useMemo(() => getLoopedIndex(index + 1), [getLoopedIndex, index]);
  const activeItem = orderedItems[index];
  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("button,a,input,textarea,select,label")) return;
      pointerStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        pointerType: e.pointerType,
      };
    },
    [hasMultiple],
  );
  const onPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;
      const start = pointerStartRef.current;
      pointerStartRef.current = null;
      if (!start) return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const minSwipe = start.pointerType === "mouse" ? 56 : 44;
      // trigger only intentional horizontal swipes
      if (Math.abs(dx) < minSwipe || Math.abs(dx) <= Math.abs(dy)) return;

      window.getSelection()?.removeAllRanges();
      if (dx > 0) goPrev();
      else goNext();
    },
    [goNext, goPrev, hasMultiple],
  );
  const onPointerCancel = React.useCallback(() => {
    pointerStartRef.current = null;
  }, []);

  return (
    <section id={TRUST_PROOF_SECTION.id} className="relative overflow-hidden bg-white">
      {/* Light premium continuity from Tracking section */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(920px 500px at 16% 18%, rgba(220,38,38,0.08), transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 580px at 85% 112%, rgba(180,83,9,0.08), transparent 66%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.92))]" />
      </div>

      <Container className="relative max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-6 lg:py-20">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />
          <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
            {TRUST_PROOF_SECTION.kicker}
          </div>
          <h2 className="mt-2 text-[30px] font-semibold text-[color:var(--color-text-light)] sm:text-[38px] lg:text-[2.6rem] lg:whitespace-nowrap">
            {TRUST_PROOF_SECTION.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            {TRUST_PROOF_SECTION.description}
          </p>
        </div>

        {/* Carousel */}
        <motion.div
          className="mt-10 select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onDragStart={(e) => e.preventDefault()}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4">
            <div className="text-sm text-[color:var(--color-muted-light)]">
              {index + 1} / {orderedItems.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={!hasMultiple}
                className={cn(
                  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-semibold",
                  "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] shadow-[0_8px_20px_rgba(2,6,23,0.08)]",
                  "transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-brand-500)]/45 hover:text-[color:var(--color-brand-600)] hover:shadow-[0_12px_24px_rgba(2,6,23,0.12)]",
                  "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:border-[color:var(--color-border-light)] disabled:hover:text-[color:var(--color-text-light)] disabled:hover:shadow-[0_8px_20px_rgba(2,6,23,0.08)]",
                  focusRing,
                )}
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!hasMultiple}
                className={cn(
                  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-semibold",
                  "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] shadow-[0_8px_20px_rgba(2,6,23,0.08)]",
                  "transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-brand-500)]/45 hover:text-[color:var(--color-brand-600)] hover:shadow-[0_12px_24px_rgba(2,6,23,0.12)]",
                  "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:border-[color:var(--color-border-light)] disabled:hover:text-[color:var(--color-text-light)] disabled:hover:shadow-[0_8px_20px_rgba(2,6,23,0.08)]",
                  focusRing,
                )}
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          </div>

          <div className="mx-auto mt-5 max-w-[1120px]">
            <div className="hidden items-center justify-center gap-5 md:flex">
              {orderedItems[leftIndex] ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`left-${orderedItems[leftIndex].id}`}
                    className="w-[250px] shrink-0"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16, scale: 0.9 }}
                    animate={
                      reduceMotion ? { opacity: 0.68 } : { opacity: 0.68, x: 0, scale: 0.92 }
                    }
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16, scale: 0.9 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    {orderedItems[leftIndex].type === "video" ? (
                      <VideoCard item={orderedItems[leftIndex]} isActive={false} />
                    ) : (
                      <TestimonialCard item={orderedItems[leftIndex]} />
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : null}
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={activeItem?.id ?? "active-empty"}
                  custom={direction}
                  className="w-[460px] shrink-0 md:-mx-2"
                  initial={reduceMotion ? { x: 0 } : { x: direction > 0 ? 22 : -22 }}
                  animate={{ x: 0 }}
                  exit={reduceMotion ? { x: 0 } : { x: direction > 0 ? -22 : 22 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeItem?.type === "video" ? (
                    <VideoCard item={activeItem} isActive={true} />
                  ) : activeItem ? (
                    <TestimonialCard item={activeItem} />
                  ) : null}
                </motion.div>
              </AnimatePresence>
              {orderedItems[rightIndex] ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`right-${orderedItems[rightIndex].id}`}
                    className="w-[250px] shrink-0"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16, scale: 0.9 }}
                    animate={
                      reduceMotion ? { opacity: 0.68 } : { opacity: 0.68, x: 0, scale: 0.92 }
                    }
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16, scale: 0.9 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    {orderedItems[rightIndex].type === "video" ? (
                      <VideoCard item={orderedItems[rightIndex]} isActive={false} />
                    ) : (
                      <TestimonialCard item={orderedItems[rightIndex]} />
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : null}
            </div>

            <div className="mx-auto w-full max-w-[420px] md:hidden">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={`mobile-${activeItem?.id ?? "active-empty"}`}
                  custom={direction}
                  initial={reduceMotion ? { x: 0 } : { x: direction > 0 ? 18 : -18 }}
                  animate={{ x: 0 }}
                  exit={reduceMotion ? { x: 0 } : { x: direction > 0 ? -18 : 18 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeItem?.type === "video" ? (
                    <VideoCard item={activeItem} isActive={true} />
                  ) : activeItem ? (
                    <TestimonialCard item={activeItem} />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Small dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {orderedItems.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDirectIndex(i)}
                disabled={!hasMultiple}
                className={cn(
                  focusRing,
                  "h-2.5 rounded-full transition-all duration-200",
                  i === index
                    ? "w-6 bg-[color:var(--color-brand-500)]"
                    : "w-2.5 bg-[color:var(--color-border-light)] hover:bg-[color:var(--color-muted-light)]/45",
                  "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[color:var(--color-border-light)]",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Partner / certification marquee */}
        <div className="mt-12 border-t border-[color:var(--color-border-light)]/70 pt-10">
          <div className="mx-auto mb-5 max-w-3xl text-center">
            <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
              Certifications & Partners
            </div>
            <div className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted-light)]">
              Verified credentials and partner programs that reinforce secure, compliant execution.
            </div>
          </div>

          <MarqueeLogos />
        </div>
      </Container>
    </section>
  );
}

function MarqueeLogos() {
  // Duplicate list for seamless loop
  const items = [...TRUST_PARTNER_LOGOS, ...TRUST_PARTNER_LOGOS];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "border border-white/65 bg-white/82",
        "shadow-[0_14px_38px_rgba(2,6,23,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]",
        "backdrop-blur-xl",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_260px_at_96%_100%,rgba(220,38,38,0.09),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-14 w-[86%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(15,23,42,0.34),rgba(30,41,59,0.14),transparent_74%)] blur-lg"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-10 w-[56%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(2,8,24,0.36),rgba(2,8,24,0.14),transparent_72%)] blur-md"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(2,8,24,0.98)] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-px w-[94%] -translate-x-1/2 bg-gradient-to-r from-[rgba(30,41,59,0.08)] via-transparent to-[rgba(30,41,59,0.08)]"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="marquee-track flex items-center gap-10 px-8 py-7 sm:gap-12 sm:py-8">
          {items.map((logo, idx) => (
            <div
              key={`${logo.src}-${idx}`}
              className={cn(
                "flex items-center justify-center",
                "h-10 w-[140px] sm:h-12 sm:w-[160px]",
                "opacity-85 transition-opacity hover:opacity-100",
              )}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={220}
                height={90}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Edge fades for premium look */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
      </div>

      <style jsx>{`
        .marquee-track {
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
