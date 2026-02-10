"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
import { DesktopNav } from "@/components/layout/header/DesktopNav";
import { MobileNav } from "@/components/layout/header/MobileNav";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-nav-ring)] focus-visible:ring-offset-0";

export function SiteHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "border-b border-[color:var(--color-nav-border)]",
        "bg-[color:var(--color-nav-bg)]/85",
        "supports-[backdrop-filter]:bg-[color:var(--color-nav-bg)]/70",
        "backdrop-blur-md",
        "shadow-[0_1px_0_rgba(255,255,255,0.04)]",
      )}
    >
      <Container className="max-w-[1440px] px-4 sm:px-6 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo (NO hover background) */}
          <Link
            href="/"
            className={cn("flex cursor-pointer items-center rounded-md px-2 py-1.5", focusRing)}
            aria-label="NPT Logistics home"
          >
            <Image
              src="/brand/NPTlogo.png"
              alt="NPT Logistics"
              width={220}
              height={80}
              className="h-auto w-[70px] object-contain sm:w-[90px] md:w-[110px]"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <DesktopNav />

          {/* Desktop actions + Mobile hamburger */}
          <div className="flex items-center gap-2">
            {/* Desktop-only CTAs */}
            <div className="hidden items-center gap-2 lg:flex">
              {/* Track Shipment */}
              <Link
                href="/tracking"
                className={cn(
                  "hidden h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium lg:inline-flex",
                  "border border-[color:var(--color-nav-border)]",
                  "text-[color:var(--color-nav-text)]",
                  "hover:bg-[color:var(--color-nav-hover)]",
                  focusRing,
                )}
              >
                Track Shipment
              </Link>

              {/* Employee Portal */}
              <Link
                href="/employee-portal"
                className={cn(
                  "hidden h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium lg:inline-flex",
                  "border border-[color:var(--color-nav-border)]",
                  "text-[color:var(--color-nav-muted)] hover:text-[color:var(--color-nav-text)]",
                  "hover:bg-[color:var(--color-nav-hover)]",
                  focusRing,
                )}
              >
                Employee Portal
              </Link>

              {/* Request a Quote (LAST) */}
              <Link
                href="/quote"
                className={cn(
                  "inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-semibold",
                  "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                  "shadow-sm shadow-black/20",
                  focusRing,
                )}
              >
                Request a Quote
              </Link>
            </div>

            {/* Mobile only */}
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
