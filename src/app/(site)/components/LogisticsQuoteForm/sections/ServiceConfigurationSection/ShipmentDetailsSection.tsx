// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/ShipmentDetailsSection.tsx
"use client";

import type { ReactNode } from "react";

export function ShipmentDetailsSection({ children }: { children: ReactNode }) {
  return (
    <section className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-neutral-900">Shipment details</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Provide the basic details for your shipment.
        </p>
      </div>

      {children}
    </section>
  );
}
