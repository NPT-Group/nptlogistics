import { Container } from "@/app/(site)/components/layout/Container";
import Link from "next/link";

const LAST_UPDATED = "February 17, 2026";

export default function TermsPage() {
  return (
    <main className="bg-[color:var(--color-surface-0-light)] py-14 sm:py-16">
      <Container className="max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-6 shadow-[0_12px_32px_rgba(2,6,23,0.08)] sm:p-8">
          <h1 className="text-3xl font-semibold text-[color:var(--color-text-light)]">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-[color:var(--color-muted-light)]">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            These Terms of Service govern your use of the NPT Logistics website. By accessing or
            using this website, you agree to these terms and applicable laws.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Website use
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            <li>Use this website for lawful business and informational purposes only.</li>
            <li>
              Do not attempt unauthorized access, disruption, scraping, or misuse of site content.
            </li>
            <li>
              Information submitted through forms must be accurate and submitted with proper
              authority.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Quotes, services, and contracts
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            Website content does not constitute a binding service offer. Freight service terms,
            pricing, liabilities, transit commitments, and operating obligations are defined in
            signed customer agreements, rate confirmations, and related operational documents.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Intellectual property
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            All website content, branding, visuals, and materials are owned by NPT Logistics or used
            with permission. Reproduction, republication, or distribution without prior written
            consent is prohibited.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Disclaimers and limitation of liability
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            This website is provided &quot;as is&quot; without warranties of any kind. To the extent
            permitted by law, NPT Logistics is not liable for indirect, incidental, or consequential
            losses arising from website use. Nothing in these terms limits liabilities that cannot
            be excluded under applicable law.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Third-party links
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            This website may link to third-party resources. NPT Logistics is not responsible for the
            content, availability, or practices of third-party websites.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Governing law and updates
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            These terms are governed by applicable laws in relevant jurisdictions where NPT
            Logistics operates. We may update these terms periodically by posting revised versions
            on this page.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Contact
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            For service terms and legal inquiries, contact us via our{" "}
            <Link href="/contact" className="font-semibold text-[color:var(--color-brand-600)]">
              contact page
            </Link>
            .
          </p>
        </div>
      </Container>
    </main>
  );
}
