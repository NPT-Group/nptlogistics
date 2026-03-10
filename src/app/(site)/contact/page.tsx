import type { Metadata } from "next";
import { Container } from "../components/layout/Container";
import { companyAbout } from "@/config/company";
import { COMPANY_CONTACT, SITE_NAME, SITE_URL, toAbsoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact NPT Logistics for freight quotes, lane planning, and cross-border shipping support across Canada, the United States, and Mexico.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact NPT Logistics",
    description:
      "Speak with NPT Logistics about truckload, LTL, intermodal, cross-border, and temperature-controlled freight.",
    url: `${SITE_URL}/contact`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact NPT Logistics",
    description:
      "Request freight support and quote guidance for North America shipping lanes.",
  },
};

function ContactJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact NPT Logistics",
    url: toAbsoluteUrl("/contact"),
    about: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      email: COMPANY_CONTACT.email,
      telephone: COMPANY_CONTACT.phoneE164,
      areaServed: ["Canada", "United States", "Mexico"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function ContactPage() {
  return (
    <main className="bg-[color:var(--color-surface-0)] py-12 sm:py-14">
      <ContactJsonLd />
      <Container className="site-page-container max-w-5xl">
        <div className="rounded-3xl border border-[color:var(--color-border-light)] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-3xl">
            Contact NPT Logistics
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            Reach our operations team for freight quotes, lane planning, cross-border coordination,
            and capacity support across North America.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] p-4">
              <h2 className="text-sm font-semibold text-[color:var(--color-text-light)]">Email</h2>
              <a
                href={`mailto:${COMPANY_CONTACT.email}`}
                className="mt-2 inline-flex text-sm font-medium text-[color:var(--color-text-light)] underline underline-offset-4"
              >
                {COMPANY_CONTACT.email}
              </a>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] p-4">
              <h2 className="text-sm font-semibold text-[color:var(--color-text-light)]">Phone</h2>
              <a
                href={`tel:${COMPANY_CONTACT.phoneE164}`}
                className="mt-2 inline-flex text-sm font-medium text-[color:var(--color-text-light)] underline underline-offset-4"
              >
                {COMPANY_CONTACT.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-[color:var(--color-text-light)]">
              Network coverage
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-muted-light)]">
              We operate across Canada, the United States, and Mexico with core hubs in:
            </p>
            <p className="mt-2 text-sm text-[color:var(--color-text-light)]">
              {companyAbout.locationsNetwork.yards.map((y) => y.label).join(" • ")}
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
