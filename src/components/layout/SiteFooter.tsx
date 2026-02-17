// src/components/layout/SiteFooter.tsx

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { NAV } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { CookiePreferencesButton } from "./footer/CookiePreferencesButton";
import { FooterLegalLane } from "./footer/FooterLegalLane";

const footerLink = cn(
  "text-sm text-[color:var(--color-footer-muted)] transition-colors",
  "hover:text-[color:var(--color-footer-hover)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer-bg)]",
);

type FooterLink = { label: string; href: string };

function normalizeLinks(links: readonly { label: string; href: string }[]): FooterLink[] {
  return links
    .filter((l) => typeof l?.label === "string" && l.label && typeof l?.href === "string" && l.href)
    .map((l) => ({ label: l.label, href: l.href }));
}

/**
 * Curated footer “top 8” solutions, ordered for conversion + clarity.
 * Falls back to flattened NAV if anything is missing.
 */
function getSolutionsFooterLinks(): FooterLink[] {
  const flattened: FooterLink[] = [];
  NAV.solutions.categories.forEach((cat) => {
    cat.links.forEach((l) => {
      if (l?.label && l?.href) flattened.push({ label: l.label, href: l.href });
    });
  });

  const curatedOrder: FooterLink[] = [
    { label: "Truckload (TL)", href: "/services/truckload" },
    { label: "Less-Than-Truckload (LTL)", href: "/services/ltl" },
    { label: "Intermodal", href: "/services/intermodal" },
    { label: "Specialized & Time-Sensitive", href: "/services/specialized" },
    { label: "Hazardous Materials (HAZMAT)", href: "/services/hazmat" },
    { label: "Temperature-Controlled", href: "/services/temperature-controlled" },
    { label: "Cross-Border & Global", href: "/services/cross-border" },
    { label: "Logistics & Value-Added", href: "/services/value-added" },
  ];

  const flattenedByHref = new Map(flattened.map((l) => [l.href, l]));
  const curated = curatedOrder
    .map((c) => flattenedByHref.get(c.href) ?? c)
    .filter((l) => l.label && l.href);

  // If NAV changes and curated becomes invalid, fallback to first 8 flattened.
  if (curated.length < 6) return flattened.slice(0, 8);

  // De-dupe by href, keep order.
  const seen = new Set<string>();
  return curated.filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true)));
}

const SOLUTIONS_LINKS = getSolutionsFooterLinks();

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative overflow-hidden",
        "bg-[color:var(--color-footer-bg)]",
        "border-t border-[color:var(--color-footer-border)]",
      )}
    >
      {/* Gradient orbs — visible warmth top-right and bottom-left */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className={cn(
            "absolute -top-20 -right-20 h-72 w-72 rounded-full",
            "bg-[color:var(--color-brand-600)]/12 blur-[70px]",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-24 -left-24 h-80 w-80 rounded-full",
            "bg-[color:var(--color-brand-600)]/10 blur-[80px]",
          )}
        />
        <div
          className={cn(
            "absolute top-0 right-0 h-48 w-64 bg-gradient-to-bl from-[color:var(--color-brand-600)]/8 to-transparent",
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 h-56 w-72 bg-gradient-to-tr from-[color:var(--color-brand-600)]/6 to-transparent",
          )}
        />
      </div>

      {/* Top edge line */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          "bg-gradient-to-r from-transparent via-white/15 to-transparent",
        )}
        aria-hidden="true"
      />

      <Container className="relative max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-6">
        {/* Footer navigation (desktop only, unchanged layout) */}
        <nav aria-label="Footer">
          <div className="hidden gap-8 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-8 xl:grid-cols-5 xl:gap-8">
            {/* Solutions */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-[color:var(--color-footer-text)]/90 uppercase">
                Solutions
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/#solutions" className={footerLink}>
                    View all solutions →
                  </Link>
                </li>
                {normalizeLinks(SOLUTIONS_LINKS).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-[color:var(--color-footer-text)]/90 uppercase">
                Industries
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/#industries" className={footerLink}>
                    View all industries →
                  </Link>
                </li>
                {normalizeLinks(NAV.industries.links).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={footerLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-[color:var(--color-footer-text)]/90 uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-2.5">
                {normalizeLinks(NAV.company.links).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={footerLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Careers */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-[color:var(--color-footer-text)]/90 uppercase">
                Careers
              </h3>
              <ul className="mt-4 space-y-2.5">
                {normalizeLinks(NAV.careers.links).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={footerLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick actions */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-[color:var(--color-footer-text)]/90 uppercase">
                Quick actions
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/tracking" className={footerLink}>
                    Track Shipment
                  </Link>
                </li>
                <li>
                  <Link href="/employee-portal" className={footerLink}>
                    Employee Portal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quote"
                    className={cn(
                      "inline-flex text-sm font-semibold text-[color:var(--color-brand-500)]",
                      "hover:text-[color:var(--color-brand-500)]",
                      "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer-bg)] focus-visible:outline-none",
                    )}
                  >
                    Request a Quote →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Bottom bar (client island only for measuring lane width + trucks) */}
        <FooterLegalLane
          className={cn(
            "relative mt-4 flex flex-col items-center gap-5 overflow-visible pt-6 text-center",
            "sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6 sm:pt-8 sm:text-left",
          )}
        >
          <div className="min-w-0">
            <Link
              href="/"
              className={cn(
                "text-sm font-semibold text-[color:var(--color-footer-text)]",
                "hover:text-[color:var(--color-footer-hover)]",
                "focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer-bg)] focus-visible:outline-none",
              )}
            >
              NPT Logistics
            </Link>
            <p className="mt-1 max-w-sm text-xs text-[color:var(--color-footer-muted)] sm:max-w-none">
              Modern logistics built on reliability, compliance, and clear communication.
            </p>
          </div>

          <nav
            aria-label="Legal"
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start"
          >
            <Link href="/privacy" className={cn(footerLink, "text-sm")}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={cn(footerLink, "text-sm")}>
              Terms of Service
            </Link>
            <Link href="/cookies" className={cn(footerLink, "text-sm")}>
              Cookie Policy
            </Link>
            <CookiePreferencesButton className={cn(footerLink, "text-sm")} />
            <Link href="/accessibility" className={cn(footerLink, "text-sm")}>
              Accessibility
            </Link>
          </nav>

          <p className="text-sm text-[color:var(--color-footer-muted)]">
            © {year} NPT Logistics. All rights reserved.
          </p>
        </FooterLegalLane>
      </Container>
    </footer>
  );
}
