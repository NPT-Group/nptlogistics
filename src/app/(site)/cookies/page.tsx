import { Container } from "@/app/(site)/components/layout/Container";
import Link from "next/link";

const LAST_UPDATED = "February 17, 2026";

export default function CookiesPage() {
  return (
    <main className="bg-[color:var(--color-surface-0-light)] py-14 sm:py-16">
      <Container className="max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-6 shadow-[0_12px_32px_rgba(2,6,23,0.08)] sm:p-8">
          <h1 className="text-3xl font-semibold text-[color:var(--color-text-light)]">
            Cookie Policy
          </h1>
          <p className="mt-2 text-xs text-[color:var(--color-muted-light)]">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            This policy explains how NPT Logistics uses cookies and similar technologies on our
            website.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            What cookies we use
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            <li>
              <strong>Strictly necessary cookies:</strong> required for core site operation,
              security, and consent preference storage.
            </li>
            <li>
              <strong>Analytics cookies:</strong> used with consent to measure page engagement and
              CTA performance (for example, page views and CTA clicks).
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Why we use cookies
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            <li>Maintain safe, reliable website performance.</li>
            <li>Remember your consent and cookie preferences.</li>
            <li>Understand which pages and conversion paths work best.</li>
            <li>Improve usability and customer journey quality over time.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Managing your preferences
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            You can accept, reject, or customize optional cookies anytime through{" "}
            <Link
              href="/cookie-preferences"
              className="font-semibold text-[color:var(--color-brand-600)]"
            >
              Cookie Preferences
            </Link>
            . Essential cookies cannot be disabled because they are required for secure site
            operation.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Third-party technologies
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            Where enabled by your consent, analytics features may rely on third-party providers such
            as Google Analytics to generate aggregated performance insights.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Contact
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            For cookie and privacy questions, contact us through our{" "}
            <Link href="/contact" className="font-semibold text-[color:var(--color-brand-600)]">
              contact page
            </Link>
            .
          </p>

          <p className="mt-6 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            See also our{" "}
            <Link href="/privacy" className="font-semibold text-[color:var(--color-brand-600)]">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </Container>
    </main>
  );
}
