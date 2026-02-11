"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { NAV } from "@/config/navigation";
import { cn } from "@/lib/cn";

const footerLink = cn(
  "text-sm text-[color:var(--color-footer-muted)] transition-colors",
  "hover:text-[color:var(--color-footer-hover)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer-bg)]",
);

/** Flatten solution categories into a short list of primary links for footer */

function getSolutionsFooterLinks() {
  const links: { label: string; href: string }[] = [
    { label: "View all solutions", href: "/#solutions" },
  ];
  NAV.solutions.categories.forEach((cat) => {
    cat.links.forEach((l) => {
      links.push({ label: l.label, href: l.href });
    });
  });
  return links;
}

const SOLUTIONS_LINKS = getSolutionsFooterLinks();

export function SiteFooter() {
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
        {/* Corner gradient overlays so the orbs read clearly */}
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
        {/* Single row: five equal columns so nothing wraps */}
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-5 lg:gap-8">
          {/* Solutions */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-[color:var(--color-footer-text)]/90 uppercase">
              Solutions
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SOLUTIONS_LINKS.slice(0, 8).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {SOLUTIONS_LINKS.length > 8 && (
                <li>
                  <Link href="/#solutions" className={footerLink}>
                    All solutions →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-[color:var(--color-footer-text)]/90 uppercase">
              Industries
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href={NAV.industries.intro.ctaHref} className={footerLink}>
                  {NAV.industries.intro.ctaLabel}
                </Link>
              </li>
              {NAV.industries.links.map((l) => (
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
              {NAV.company.links.map((l) => (
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
              {NAV.careers.links.map((l) => (
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

        {/* Bottom bar: name + tagline (no logo), Legal, copyright */}
        <div
          className={cn(
            "mt-12 flex flex-col gap-6 border-t border-[color:var(--color-footer-border)] pt-8",
            "sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
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
            <p className="mt-1 max-w-sm text-xs text-[color:var(--color-footer-muted)]">
              Modern logistics built on reliability, compliance, and clear communication.
            </p>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className={cn(footerLink, "text-sm")}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={cn(footerLink, "text-sm")}>
              Terms of Service
            </Link>
            <Link href="/accessibility" className={cn(footerLink, "text-sm")}>
              Accessibility
            </Link>
          </nav>
          <p className="text-sm text-[color:var(--color-footer-muted)]">
            © {new Date().getFullYear()} NPT Logistics. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
