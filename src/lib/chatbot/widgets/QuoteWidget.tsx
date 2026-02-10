"use client";

const SERVICES = [
  { label: "LTL", value: "LTL" },
  { label: "FTL", value: "FTL" },
  { label: "Air freight", value: "AIR" },
  { label: "Ocean freight", value: "OCEAN" },
  { label: "Customs", value: "CUSTOMS" },
  { label: "Warehousing", value: "WAREHOUSE" },
  { label: "Not sure", value: "OTHER" },
] as const;

export default function QuoteWidget(props: any) {
  const { actionProvider } = props;

  return (
    <div className="flex flex-wrap gap-2">
      {SERVICES.map((s) => (
        <button
          key={s.value}
          onClick={() => actionProvider.prefillAndGoToQuote({ service: s.value })}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
          type="button"
        >
          {s.label}
        </button>
      ))}

      <button onClick={() => actionProvider.showContact()} className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50" type="button">
        Contact an agent
      </button>
    </div>
  );
}
