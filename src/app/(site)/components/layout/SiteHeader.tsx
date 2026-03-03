"use client";

import Link from "next/link";
import { Container } from "@/app/(site)/components/layout/Container";
import { LogoImage } from "@/components/media/LogoImage";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";
import { DesktopNav } from "./header/DesktopNav";
import { MobileNav } from "./header/MobileNav";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-nav-ring)] focus-visible:ring-offset-0";

export function SiteHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 isolate",
        "border-b border-[color:var(--color-nav-border)]",
        "bg-[color:var(--color-nav-bg)]/85",
        "supports-[backdrop-filter]:bg-[color:var(--color-nav-bg)]/70",
        "backdrop-blur-md",
        "shadow-[0_1px_0_rgba(255,255,255,0.04)]",
      )}
    >
      <Link
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only",
          "fixed top-4 left-4 z-[60]",
          "rounded-md bg-white px-4 py-2 text-sm font-semibold text-black",
          focusRing,
        )}
      >
        Skip to content
      </Link>

      <Container className="site-page-container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo (NO hover background) */}
          <Link
            href="/"
            onClick={() =>
              trackCtaClick({
                ctaId: "header_home_logo",
                location: "site_header:brand",
                destination: "/",
                label: "NPT Logistics",
              })
            }
            className={cn("flex cursor-pointer items-center rounded-md px-2 py-1.5", focusRing)}
            aria-label="NPT Logistics home"
          >
            <LogoImage
              src="/brand/NPTlogo2.png"
              alt="NPT Logistics"
              width={220}
              height={80}
              className="h-auto w-[50px] object-contain sm:w-[50px] md:w-[50px]"
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
                onClick={() =>
                  trackCtaClick({
                    ctaId: "header_track_shipment",
                    location: "site_header:actions",
                    destination: "/tracking",
                    label: "Track Shipment",
                  })
                }
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
                onClick={() =>
                  trackCtaClick({
                    ctaId: "header_employee_portal",
                    location: "site_header:actions",
                    destination: "/employee-portal",
                    label: "Employee Portal",
                  })
                }
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
                onClick={() =>
                  trackCtaClick({
                    ctaId: "header_request_quote",
                    location: "site_header:actions",
                    destination: "/quote",
                    label: "Request a Quote",
                  })
                }
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
