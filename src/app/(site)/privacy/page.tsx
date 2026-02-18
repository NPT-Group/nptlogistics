import { Container } from "@/app/(site)/components/layout/Container";
import Link from "next/link";

const LAST_UPDATED = "February 17, 2026";

export default function PrivacyPage() {
  return (
    <main className="bg-[color:var(--color-surface-0-light)] py-14 sm:py-16">
      <Container className="max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-6 shadow-[0_12px_32px_rgba(2,6,23,0.08)] sm:p-8">
          <h1 className="text-3xl font-semibold text-[color:var(--color-text-light)]">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-[color:var(--color-muted-light)]">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            NPT Logistics (&quot;NPT&quot;, &quot;we&quot;, &quot;our&quot;) respects your privacy.
            This policy explains how we collect, use, share, and protect personal information when
            you visit our website, request a quote, submit contact details, apply for careers, or
            use our logistics-related services.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Information we collect
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            <li>
              Contact details you provide, such as name, email, phone number, company, and shipment
              requirements.
            </li>
            <li>
              Business and shipment details needed to evaluate and execute logistics services.
            </li>
            <li>Careers-related information submitted through job and driver opportunity forms.</li>
            <li>
              Technical data such as device, browser, page interactions, and referral source when
              analytics cookies are enabled.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            How we use information
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            <li>
              Respond to quote requests, contact inquiries, and service-related communications.
            </li>
            <li>Plan, execute, and support freight operations across our service network.</li>
            <li>Provide customer support, service updates, and issue resolution.</li>
            <li>Improve website performance, conversion paths, and user experience.</li>
            <li>Maintain security, prevent misuse, and meet legal and compliance obligations.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Legal bases and consent
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            Where required by law, we process information based on contractual necessity, legitimate
            business interests, legal obligations, and your consent for optional analytics cookies.
            You can update cookie choices at any time in{" "}
            <Link
              href="/cookie-preferences"
              className="font-semibold text-[color:var(--color-brand-600)]"
            >
              Cookie Preferences
            </Link>
            .
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Data sharing
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            We do not sell personal information. We may share information with trusted service
            providers (for example, hosting, analytics, and communications providers), operational
            partners needed to deliver services, and authorities where required by law.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Retention and security
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            We retain information only for as long as necessary for the purposes outlined in this
            policy and applicable legal requirements. We maintain administrative, technical, and
            operational safeguards designed to protect personal information.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Your rights
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            Depending on your jurisdiction, you may have rights to access, correct, delete, or
            restrict processing of your information, and to withdraw consent for optional analytics.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Contact us
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            For privacy questions or requests, contact us through our{" "}
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
