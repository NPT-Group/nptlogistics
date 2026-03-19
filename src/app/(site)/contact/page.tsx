// src/app/contact/page.tsx
import type { Metadata } from "next";

import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with NPT Logistics.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
