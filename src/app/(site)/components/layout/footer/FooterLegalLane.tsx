// src/components/layout/footer/FooterLegalLane.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function FooterLegalLane({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const laneRef = React.useRef<HTMLDivElement | null>(null);
  const [laneWidth, setLaneWidth] = React.useState(1200);
  const [isMotionPaused, setIsMotionPaused] = React.useState(false);

  React.useEffect(() => {
    const el = laneRef.current;
    if (!el) return;

    const update = () => setLaneWidth(el.clientWidth || 1200);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={laneRef}
      style={
        {
          "--footer-lane-width": `${laneWidth}px`,
        } as React.CSSProperties
      }
      className={cn("relative", className)}
    >
      {/* Divider line (unchanged visual) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/34 to-transparent"
        aria-hidden="true"
      />

      {/* Trucks (explicitly aria-hidden) */}
      <div
        className="footer-legal-truck footer-legal-truck-right pointer-events-none absolute top-0 left-0 z-10 hidden sm:block"
        style={{ animationPlayState: isMotionPaused ? "paused" : "running" }}
        aria-hidden="true"
      >
        <Image
          src="/brand/footerTruckMovingRight.png"
          alt=""
          width={140}
          height={50}
          className="h-[30px] w-auto object-contain opacity-95 drop-shadow-[0_6px_12px_rgba(2,6,23,0.45)]"
        />
      </div>

      <div
        className="footer-legal-truck footer-legal-truck-left pointer-events-none absolute top-0 left-0 z-10 hidden sm:block"
        style={{ animationPlayState: isMotionPaused ? "paused" : "running" }}
        aria-hidden="true"
      >
        <Image
          src="/brand/footerTruckMovingLeft.png"
          alt=""
          width={140}
          height={50}
          className="h-[30px] w-auto object-contain opacity-90 drop-shadow-[0_6px_10px_rgba(2,6,23,0.42)]"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsMotionPaused((prev) => !prev)}
        className={cn(
          "absolute top-0 right-0 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-[color:var(--color-footer-bg)] px-2.5 py-1 text-[10px] font-semibold text-[color:var(--color-footer-muted)] shadow-[0_6px_18px_rgba(2,6,23,0.35)] transition-colors",
          "hover:text-[color:var(--color-footer-text)] sm:inline-flex",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer-bg)]",
        )}
        aria-pressed={isMotionPaused}
        aria-label={isMotionPaused ? "Resume footer lane motion" : "Pause footer lane motion"}
      >
        {isMotionPaused ? "Play motion" : "Pause motion"}
      </button>

      {children}

      <style jsx>{`
        .footer-legal-truck {
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
        }

        .footer-legal-truck-right {
          animation: footerTruckRight 20s linear infinite;
        }
        .footer-legal-truck-left {
          animation: footerTruckLeft 18s linear infinite;
        }

        @keyframes footerTruckRight {
          0% {
            transform: translate3d(-170px, -96%, 0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translate3d(calc(var(--footer-lane-width) + 10px), -96%, 0);
            opacity: 0;
          }
        }

        @keyframes footerTruckLeft {
          0% {
            transform: translate3d(calc(var(--footer-lane-width) + 10px), -96%, 0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translate3d(-170px, -96%, 0);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-legal-truck-right,
          .footer-legal-truck-left {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
