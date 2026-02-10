import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div>
            <div className="text-base font-semibold">NPT Logistics</div>
            <p className="mt-3 text-sm text-white/70">
              Modern logistics built on reliability, compliance, and clear communication.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/solutions" className="hover:text-white">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-white">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/company" className="hover:text-white">
                  Company
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Actions</div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/quote" className="hover:text-white">
                  Request a Quote
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Legal</div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-white">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-sm text-white/60">
          © {new Date().getFullYear()} NPT Logistics. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
