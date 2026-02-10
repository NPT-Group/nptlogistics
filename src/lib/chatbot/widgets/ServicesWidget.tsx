"use client";

import React from "react";

export default function ServicesWidget(props: any) {
  const { actionProvider } = props;

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => actionProvider.scrollToSection("services")} className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50" type="button">
        View services section
      </button>

      <button onClick={() => actionProvider.startQuote()} className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50" type="button">
        Start a quote
      </button>

      <button onClick={() => actionProvider.showContact()} className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50" type="button">
        Contact an agent
      </button>
    </div>
  );
}
