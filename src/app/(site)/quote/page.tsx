import { Metadata } from "next";
import { Container } from "../components/layout/Container";
import LogisticsQuoteForm from "../components/LogisticsQuoteForm";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Quote",
  description: "Request a logistics quote from NPT Logistics.",
};

export default function QuotePage() {
  return (
    <main
      className={cn(
        // ONE background-image with two layers: spotlight + soft navy canvas
        "bg-[radial-gradient(900px_520px_at_50%_-10%,rgba(255,255,255,0.10),transparent_65%),linear-gradient(180deg,#f1f5f9_0%,#e2e8f0_45%,#cbd5e1_100%)]",
        "py-10 sm:py-12",
      )}
    >
      <Container className="max-w-4xl px-4 sm:px-6">
        <LogisticsQuoteForm />
      </Container>
    </main>
  );
}
