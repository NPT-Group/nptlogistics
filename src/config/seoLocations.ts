export type SeoLocationPage = {
  slug: string;
  city: string;
  region: string;
  country: "Canada" | "United States" | "Mexico";
  title: string;
  metaDescription: string;
  intro: string;
  serviceHighlights: string[];
  topLanes: Array<{ label: string; href: string }>;
};

export type SeoPriority = "P1" | "P2" | "P3";

const SEO_LOCATION_PRIORITY: Record<string, SeoPriority> = {
  "toronto-on": "P1",
  "milton-on": "P1",
  "montreal-qc": "P1",
  "chicago-il": "P1",
  "dallas-tx": "P1",
  "houston-tx": "P1",
  "laredo-tx": "P1",
  "monterrey-nl": "P1",
  "detroit-mi": "P2",
  "buffalo-ny": "P2",
  "port-huron-mi": "P2",
};

export const SEO_LOCATIONS: SeoLocationPage[] = [
  {
    slug: "milton-on",
    city: "Milton",
    region: "ON",
    country: "Canada",
    title: "Freight and Trucking Company in Milton, Ontario",
    metaDescription:
      "NPT Logistics provides truckload, LTL, and cross-border freight shipping in Milton, Ontario with lane-level execution across North America.",
    intro:
      "NPT supports shippers in Milton with truckload, LTL, and cross-border freight execution from Ontario into major U.S. and Mexico corridors.",
    serviceHighlights: [
      "Truckload and LTL capacity for Ontario distribution and outbound lanes",
      "Cross-border lane planning from Ontario to U.S. Midwest and Texas",
      "Temperature-controlled and time-sensitive freight support",
    ],
    topLanes: [
      { label: "Milton, ON to Dallas, TX freight", href: "/lanes/milton-on-to-dallas-tx" },
      { label: "Milton, ON to Houston, TX freight", href: "/lanes/milton-on-to-houston-tx" },
      { label: "Milton, ON to Chicago, IL freight", href: "/lanes/milton-on-to-chicago-il" },
    ],
  },
  {
    slug: "toronto-on",
    city: "Toronto",
    region: "ON",
    country: "Canada",
    title: "Toronto Freight Shipping and Logistics Services",
    metaDescription:
      "Freight shipping from Toronto, Ontario across Canada, the U.S., and Mexico with truckload, LTL, intermodal, and cross-border logistics.",
    intro:
      "For Toronto-area shippers, NPT delivers compliance-first freight movement with proactive execution and route-specific planning.",
    serviceHighlights: [
      "Cross-border freight from Toronto into U.S. production and retail hubs",
      "FTL and LTL mode selection based on shipment profile and timing",
      "Truckload alternatives for cost-sensitive long-haul lanes",
    ],
    topLanes: [
      { label: "Toronto, ON to Dallas, TX freight", href: "/lanes/toronto-on-to-dallas-tx" },
      { label: "Toronto, ON to Chicago, IL freight", href: "/lanes/toronto-on-to-chicago-il" },
      { label: "Toronto, ON to Monterrey, NL freight", href: "/lanes/toronto-on-to-monterrey-nl" },
    ],
  },
  {
    slug: "montreal-qc",
    city: "Montreal",
    region: "QC",
    country: "Canada",
    title: "Montreal Freight and Cross-Border Trucking",
    metaDescription:
      "Montreal freight logistics with truckload, LTL, and cross-border shipping to major North America destinations.",
    intro:
      "NPT helps Montreal shippers execute high-reliability freight movement into U.S. Northeast, Midwest, and Mexico-bound corridors.",
    serviceHighlights: [
      "FTL and LTL support for Quebec outbound freight",
      "Cross-border customs-ready lane coordination",
      "Expedited and specialized freight options",
    ],
    topLanes: [
      { label: "Montreal, QC to Houston, TX freight", href: "/lanes/montreal-qc-to-houston-tx" },
      { label: "Montreal, QC to Chicago, IL freight", href: "/lanes/montreal-qc-to-chicago-il" },
      { label: "Montreal, QC to Dallas, TX freight", href: "/lanes/montreal-qc-to-dallas-tx" },
    ],
  },
  {
    slug: "laredo-tx",
    city: "Laredo",
    region: "TX",
    country: "United States",
    title: "Laredo Cross-Border Freight Logistics",
    metaDescription:
      "Cross-border trucking and freight logistics in Laredo, Texas for U.S.-Mexico and Canada-Mexico supply chain lanes.",
    intro:
      "Laredo is a critical cross-border gateway. NPT supports freight programs requiring disciplined customs handoffs and milestone control.",
    serviceHighlights: [
      "U.S.-Mexico lane execution through border gateway workflows",
      "Hazmat and specialized equipment support where required",
      "Real-time status updates for border-sensitive timelines",
    ],
    topLanes: [
      { label: "Laredo, TX to Monterrey, NL freight", href: "/lanes/laredo-tx-to-monterrey-nl" },
      { label: "Laredo, TX to Mexico City freight", href: "/lanes/laredo-tx-to-mexico-city-cdmx" },
      { label: "Laredo, TX to Toronto, ON freight", href: "/lanes/laredo-tx-to-toronto-on" },
    ],
  },
  {
    slug: "houston-tx",
    city: "Houston",
    region: "TX",
    country: "United States",
    title: "Houston Freight Shipping and Truckload Services",
    metaDescription:
      "Truckload, LTL, and cross-border freight shipping in Houston, Texas with North America lane coverage.",
    intro:
      "NPT supports Houston freight operations with scalable capacity and controlled execution for domestic and cross-border lanes.",
    serviceHighlights: [
      "FTL, LTL, and truckload support for Texas distribution",
      "Cross-border freight planning to and from Mexico",
      "Temperature-controlled freight support for sensitive cargo",
    ],
    topLanes: [
      { label: "Houston, TX to Dallas, TX freight", href: "/lanes/houston-tx-to-dallas-tx" },
      { label: "Houston, TX to Monterrey, NL freight", href: "/lanes/houston-tx-to-monterrey-nl" },
      { label: "Houston, TX to Montreal, QC freight", href: "/lanes/houston-tx-to-montreal-qc" },
    ],
  },
  {
    slug: "dallas-tx",
    city: "Dallas",
    region: "TX",
    country: "United States",
    title: "Dallas Freight Company for North America Shipping",
    metaDescription:
      "Freight transportation from Dallas, Texas with truckload, LTL, and cross-border logistics support.",
    intro:
      "NPT helps Dallas-area shippers move freight with dependable lane execution to Canada, Mexico, and major U.S. markets.",
    serviceHighlights: [
      "Truckload and LTL solutions for long-haul and regional lanes",
      "Cross-border shipping from Texas into Mexico and Canada corridors",
      "Expedited and specialized freight options",
    ],
    topLanes: [
      { label: "Dallas, TX to Toronto, ON freight", href: "/lanes/dallas-tx-to-toronto-on" },
      { label: "Dallas, TX to Houston, TX freight", href: "/lanes/dallas-tx-to-houston-tx" },
      { label: "Dallas, TX to Monterrey, NL freight", href: "/lanes/dallas-tx-to-monterrey-nl" },
    ],
  },
  {
    slug: "chicago-il",
    city: "Chicago",
    region: "IL",
    country: "United States",
    title: "Chicago Freight and Logistics Provider",
    metaDescription:
      "Chicago freight shipping services for truckload, LTL, and cross-border transportation across North America.",
    intro:
      "NPT supports Chicago freight lanes with mode-fit recommendations and execution discipline for manufacturing and retail networks.",
    serviceHighlights: [
      "LTL and FTL support for Midwest inbound and outbound flows",
      "Cross-border moves connecting Midwest with Ontario and Quebec",
      "Truckload support for selected long-haul corridors",
    ],
    topLanes: [
      { label: "Chicago, IL to Toronto, ON freight", href: "/lanes/chicago-il-to-toronto-on" },
      { label: "Chicago, IL to Milton, ON freight", href: "/lanes/chicago-il-to-milton-on" },
      { label: "Chicago, IL to Montreal, QC freight", href: "/lanes/chicago-il-to-montreal-qc" },
    ],
  },
  {
    slug: "detroit-mi",
    city: "Detroit",
    region: "MI",
    country: "United States",
    title: "Detroit Cross-Border Freight and Trucking Services",
    metaDescription:
      "Cross-border freight shipping in Detroit, Michigan for truckload and LTL freight lanes between the U.S. and Canada.",
    intro:
      "Detroit is one of the most important U.S.-Canada truck gateways. NPT supports Detroit freight with customs-aware lane planning and dependable cross-border execution.",
    serviceHighlights: [
      "Truckload and LTL support for Michigan-Ontario freight programs",
      "Customs-ready execution for appointment-sensitive border freight",
      "Cross-border visibility and milestone communication",
    ],
    topLanes: [
      { label: "Detroit, MI to Toronto, ON freight", href: "/lanes/detroit-mi-to-toronto-on" },
      { label: "Toronto, ON to Detroit, MI freight", href: "/lanes/toronto-on-to-detroit-mi" },
      { label: "Chicago, IL to Toronto, ON freight", href: "/lanes/chicago-il-to-toronto-on" },
    ],
  },
  {
    slug: "buffalo-ny",
    city: "Buffalo",
    region: "NY",
    country: "United States",
    title: "Buffalo Cross-Border Freight and Logistics Services",
    metaDescription:
      "Cross-border freight shipping in Buffalo, New York for truckload and LTL freight between the U.S. Northeast and Ontario.",
    intro:
      "Buffalo is a high-frequency U.S.-Canada border market. NPT supports shippers with coordinated customs handoffs and reliable regional lane execution.",
    serviceHighlights: [
      "Truckload and LTL support for New York-Ontario freight lanes",
      "Cross-border customs coordination for short-haul freight",
      "Reliable milestone tracking and delivery communication",
    ],
    topLanes: [
      { label: "Buffalo, NY to Toronto, ON freight", href: "/lanes/buffalo-ny-to-toronto-on" },
      { label: "Toronto, ON to Buffalo, NY freight", href: "/lanes/toronto-on-to-buffalo-ny" },
      { label: "Toronto, ON to Chicago, IL freight", href: "/lanes/toronto-on-to-chicago-il" },
    ],
  },
  {
    slug: "port-huron-mi",
    city: "Port Huron",
    region: "MI",
    country: "United States",
    title: "Port Huron Freight and Cross-Border Trucking Support",
    metaDescription:
      "Cross-border freight shipping in Port Huron, Michigan for truckload and LTL gateway movements between Ontario and the U.S.",
    intro:
      "Port Huron is a strategic Ontario-Michigan border gateway. NPT supports freight teams with customs-sensitive planning and controlled cross-border execution.",
    serviceHighlights: [
      "Gateway-focused truckload and LTL support for Ontario lanes",
      "Customs-ready workflows for border-critical shipments",
      "Operational visibility for pickup, crossing, and delivery milestones",
    ],
    topLanes: [
      { label: "Port Huron, MI to Milton, ON freight", href: "/lanes/port-huron-mi-to-milton-on" },
      { label: "Milton, ON to Port Huron, MI freight", href: "/lanes/milton-on-to-port-huron-mi" },
      { label: "Milton, ON to Chicago, IL freight", href: "/lanes/milton-on-to-chicago-il" },
    ],
  },
  {
    slug: "livermore-ca",
    city: "Livermore",
    region: "CA",
    country: "United States",
    title: "Livermore Freight and Trucking Services",
    metaDescription:
      "Freight logistics in Livermore, California for truckload, intermodal, and cross-border shipping lanes.",
    intro:
      "NPT supports Livermore and California freight programs with lane-level coordination across U.S., Canadian, and Mexico markets.",
    serviceHighlights: [
      "West-coast outbound truckload freight planning",
      "Cross-border lane support for Mexico and Canada-bound freight",
      "Specialized and project freight options",
    ],
    topLanes: [
      { label: "Livermore, CA to Dallas, TX freight", href: "/lanes/livermore-ca-to-dallas-tx" },
      { label: "Livermore, CA to Houston, TX freight", href: "/lanes/livermore-ca-to-houston-tx" },
      { label: "Livermore, CA to Toronto, ON freight", href: "/lanes/livermore-ca-to-toronto-on" },
    ],
  },
  {
    slug: "miami-fl",
    city: "Miami",
    region: "FL",
    country: "United States",
    title: "Miami Freight Shipping and Logistics Support",
    metaDescription:
      "Miami freight and trucking services by NPT Logistics for domestic and cross-border North America shipping.",
    intro:
      "NPT helps Miami-area teams execute reliable freight movement with mode-fit planning and transparent operations communication.",
    serviceHighlights: [
      "Truckload and LTL support for Southeast freight lanes",
      "Time-sensitive shipment planning and escalation workflows",
      "Cross-border and multimodal routing support",
    ],
    topLanes: [
      { label: "Miami, FL to Toronto, ON freight", href: "/lanes/miami-fl-to-toronto-on" },
      { label: "Miami, FL to Dallas, TX freight", href: "/lanes/miami-fl-to-dallas-tx" },
      { label: "Miami, FL to Monterrey, NL freight", href: "/lanes/miami-fl-to-monterrey-nl" },
    ],
  },
  {
    slug: "monterrey-nl",
    city: "Monterrey",
    region: "NL",
    country: "Mexico",
    title: "Monterrey Freight and Cross-Border Logistics",
    metaDescription:
      "Cross-border freight shipping in Monterrey, Mexico with lane coverage to U.S. and Canada destinations.",
    intro:
      "NPT supports Monterrey freight operations with customs-aware handoffs and controlled execution for North America trade lanes.",
    serviceHighlights: [
      "U.S.-Mexico and Canada-Mexico lane support",
      "Cross-border compliance coordination from dispatch through delivery",
      "Truckload, LTL, and specialized freight options",
    ],
    topLanes: [
      { label: "Monterrey, NL to Laredo, TX freight", href: "/lanes/monterrey-nl-to-laredo-tx" },
      { label: "Monterrey, NL to Houston, TX freight", href: "/lanes/monterrey-nl-to-houston-tx" },
      { label: "Monterrey, NL to Toronto, ON freight", href: "/lanes/monterrey-nl-to-toronto-on" },
    ],
  },
];

export function getSeoLocationSlugs() {
  return SEO_LOCATIONS.map((x) => x.slug);
}

export function getSeoLocationBySlug(slug: string) {
  return SEO_LOCATIONS.find((x) => x.slug === slug);
}

export function getSeoLocationPriority(slug: string): SeoPriority {
  return SEO_LOCATION_PRIORITY[slug] ?? "P2";
}

