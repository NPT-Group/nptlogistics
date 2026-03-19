// src/app/quote/page.tsx
import type { Metadata } from "next";

import QuoteClient from "./QuoteClient";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Request a logistics quote from NPT Logistics.",
  alternates: {
    canonical: "/quote",
  },
};

export default function QuotePage() {
  return <QuoteClient />;
}
