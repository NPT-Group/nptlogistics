export type SeoLanePage = {
  slug: string;
  originLabel: string;
  destinationLabel: string;
  title: string;
  metaDescription: string;
  intro: string;
  bestFor: string[];
  relatedServices: Array<{ label: string; href: string }>;
  relatedLocations: Array<{ label: string; href: string }>;
};

export type SeoPriority = "P1" | "P2" | "P3";

const SEO_LANE_PRIORITY: Record<string, SeoPriority> = {
  "toronto-on-to-dallas-tx": "P1",
  "milton-on-to-dallas-tx": "P1",
  "milton-on-to-houston-tx": "P1",
  "toronto-on-to-chicago-il": "P1",
  "chicago-il-to-toronto-on": "P1",
  "laredo-tx-to-monterrey-nl": "P1",
  "houston-tx-to-monterrey-nl": "P1",
  "monterrey-nl-to-laredo-tx": "P1",
  "dallas-tx-to-toronto-on": "P1",
  "dallas-tx-to-monterrey-nl": "P1",
};

export const SEO_LANES: SeoLanePage[] = [
  {
    slug: "toronto-on-to-dallas-tx",
    originLabel: "Toronto, ON",
    destinationLabel: "Dallas, TX",
    title: "Freight Shipping from Toronto, ON to Dallas, TX",
    metaDescription:
      "Truckload, LTL, and cross-border freight shipping from Toronto to Dallas with customs-ready execution and lane visibility.",
    intro:
      "NPT supports Toronto to Dallas freight movement with mode-fit planning, cross-border handoff discipline, and proactive exception control.",
    bestFor: [
      "Ontario to Texas truckload freight",
      "Cross-border LTL shipments with appointment windows",
      "Temperature-sensitive freight with consistent transit handling",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
      { label: "LTL service", href: "/services/ltl" },
    ],
    relatedLocations: [
      { label: "Toronto freight services", href: "/locations/toronto-on" },
      { label: "Dallas freight services", href: "/locations/dallas-tx" },
    ],
  },
  {
    slug: "milton-on-to-dallas-tx",
    originLabel: "Milton, ON",
    destinationLabel: "Dallas, TX",
    title: "Freight Shipping from Milton, ON to Dallas, TX",
    metaDescription:
      "Cross-border trucking and freight logistics from Milton, Ontario to Dallas, Texas for FTL, LTL, and time-sensitive freight.",
    intro:
      "This lane is a high-demand Ontario-to-Texas corridor. NPT coordinates customs workflows and execution controls from pickup through delivery.",
    bestFor: [
      "Milton to Dallas full truckload freight",
      "Cross-border LTL consolidation",
      "Expedited shipments for tight production timelines",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Expedited and specialized", href: "/services/expedited-specialized" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Milton freight services", href: "/locations/milton-on" },
      { label: "Dallas freight services", href: "/locations/dallas-tx" },
    ],
  },
  {
    slug: "milton-on-to-houston-tx",
    originLabel: "Milton, ON",
    destinationLabel: "Houston, TX",
    title: "Freight Shipping from Milton, ON to Houston, TX",
    metaDescription:
      "Ontario to Houston freight shipping with truckload, LTL, and cross-border lane coordination.",
    intro:
      "NPT manages Milton to Houston freight with customs-ready routing, controlled handoffs, and clear milestone communication.",
    bestFor: [
      "Ontario outbound truckload freight into Texas",
      "LTL freight requiring disciplined appointment coordination",
      "Industrial and manufacturing shipments",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "LTL service", href: "/services/ltl" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Milton freight services", href: "/locations/milton-on" },
      { label: "Houston freight services", href: "/locations/houston-tx" },
    ],
  },
  {
    slug: "montreal-qc-to-houston-tx",
    originLabel: "Montreal, QC",
    destinationLabel: "Houston, TX",
    title: "Freight Shipping from Montreal, QC to Houston, TX",
    metaDescription:
      "Cross-border freight shipping from Montreal to Houston for truckload, LTL, and specialized freight.",
    intro:
      "For Montreal to Houston freight, NPT aligns border, transit, and delivery controls to reduce variability on long-haul lanes.",
    bestFor: [
      "Quebec to Texas FTL freight lanes",
      "Cross-border LTL shipments",
      "Specialized freight requiring route-aware planning",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Montreal freight services", href: "/locations/montreal-qc" },
      { label: "Houston freight services", href: "/locations/houston-tx" },
    ],
  },
  {
    slug: "laredo-tx-to-monterrey-nl",
    originLabel: "Laredo, TX",
    destinationLabel: "Monterrey, NL",
    title: "Cross-Border Freight from Laredo, TX to Monterrey, NL",
    metaDescription:
      "U.S.-Mexico cross-border freight shipping from Laredo to Monterrey with customs and border execution support.",
    intro:
      "Laredo to Monterrey is a core gateway lane. NPT manages border-critical workflows with compliance-first handoffs and timeline control.",
    bestFor: [
      "U.S.-Mexico truckload freight lanes",
      "Cross-border LTL and customs-sensitive shipments",
      "Manufacturing and automotive freight corridors",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
      { label: "Hazmat service", href: "/services/hazmat" },
    ],
    relatedLocations: [
      { label: "Laredo freight services", href: "/locations/laredo-tx" },
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
    ],
  },
  {
    slug: "houston-tx-to-monterrey-nl",
    originLabel: "Houston, TX",
    destinationLabel: "Monterrey, NL",
    title: "Cross-Border Freight from Houston, TX to Monterrey, NL",
    metaDescription:
      "Cross-border freight and trucking from Houston to Monterrey for industrial, manufacturing, and retail supply chains.",
    intro:
      "NPT supports Houston to Monterrey freight with predictable handoffs and customs-aware execution from dispatch to delivery.",
    bestFor: [
      "Texas to Mexico truckload freight",
      "Border-sensitive manufacturing lanes",
      "Expedited cross-border freight programs",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Expedited and specialized", href: "/services/expedited-specialized" },
    ],
    relatedLocations: [
      { label: "Houston freight services", href: "/locations/houston-tx" },
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
    ],
  },
  {
    slug: "chicago-il-to-toronto-on",
    originLabel: "Chicago, IL",
    destinationLabel: "Toronto, ON",
    title: "Freight Shipping from Chicago, IL to Toronto, ON",
    metaDescription:
      "Cross-border freight shipping from Chicago to Toronto with truckload and LTL options for North America supply chains.",
    intro:
      "NPT executes Chicago to Toronto lanes with preplanned customs workflows, lane-level visibility, and appointment reliability.",
    bestFor: [
      "Midwest to Ontario truckload freight",
      "LTL freight requiring delivery appointment control",
      "Automotive and manufacturing shipments",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "LTL service", href: "/services/ltl" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Chicago freight services", href: "/locations/chicago-il" },
      { label: "Toronto freight services", href: "/locations/toronto-on" },
    ],
  },
  {
    slug: "dallas-tx-to-toronto-on",
    originLabel: "Dallas, TX",
    destinationLabel: "Toronto, ON",
    title: "Freight Shipping from Dallas, TX to Toronto, ON",
    metaDescription:
      "Texas to Ontario freight shipping with cross-border truckload and LTL services from Dallas to Toronto.",
    intro:
      "NPT supports Dallas to Toronto freight with customs-ready planning, compliance checkpoints, and route-level execution discipline.",
    bestFor: [
      "Texas-to-Canada truckload freight",
      "LTL freight with border coordination requirements",
      "Retail and consumer goods replenishment lanes",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Dallas freight services", href: "/locations/dallas-tx" },
      { label: "Toronto freight services", href: "/locations/toronto-on" },
    ],
  },
  {
    slug: "livermore-ca-to-dallas-tx",
    originLabel: "Livermore, CA",
    destinationLabel: "Dallas, TX",
    title: "Freight Shipping from Livermore, CA to Dallas, TX",
    metaDescription:
      "California to Texas freight shipping with truckload, intermodal, and specialized service support.",
    intro:
      "NPT supports Livermore to Dallas freight lanes with mode-fit recommendations and execution controls for long-haul flows.",
    bestFor: [
      "West-coast to Texas truckload lanes",
      "Intermodal options for cost-sensitive freight",
      "Specialized freight requiring route planning",
    ],
    relatedServices: [
      { label: "Intermodal service", href: "/services/intermodal" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Livermore freight services", href: "/locations/livermore-ca" },
      { label: "Dallas freight services", href: "/locations/dallas-tx" },
    ],
  },
  {
    slug: "miami-fl-to-toronto-on",
    originLabel: "Miami, FL",
    destinationLabel: "Toronto, ON",
    title: "Freight Shipping from Miami, FL to Toronto, ON",
    metaDescription:
      "Florida to Ontario freight shipping with cross-border logistics support for FTL and LTL shipments.",
    intro:
      "NPT supports Miami to Toronto freight with customs-aware route planning and clear milestone communication for every move.",
    bestFor: [
      "Southeast U.S. to Ontario truckload shipments",
      "Cross-border LTL freight programs",
      "Temperature-controlled and expedited freight",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Temperature-controlled service", href: "/services/temperature-controlled" },
    ],
    relatedLocations: [
      { label: "Miami freight services", href: "/locations/miami-fl" },
      { label: "Toronto freight services", href: "/locations/toronto-on" },
    ],
  },
  {
    slug: "toronto-on-to-monterrey-nl",
    originLabel: "Toronto, ON",
    destinationLabel: "Monterrey, NL",
    title: "Cross-Border Freight from Toronto, ON to Monterrey, NL",
    metaDescription:
      "Canada to Mexico cross-border freight shipping from Toronto to Monterrey with lane-level planning and customs support.",
    intro:
      "NPT coordinates Toronto to Monterrey freight lanes with integrated cross-border workflows across Canada, the U.S., and Mexico.",
    bestFor: [
      "Canada-Mexico truckload lanes",
      "Automotive and industrial freight corridors",
      "Cross-border freight requiring controlled handoffs",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
      { label: "Automotive logistics", href: "/industries/automotive" },
    ],
    relatedLocations: [
      { label: "Toronto freight services", href: "/locations/toronto-on" },
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
    ],
  },
  {
    slug: "milton-on-to-chicago-il",
    originLabel: "Milton, ON",
    destinationLabel: "Chicago, IL",
    title: "Freight Shipping from Milton, ON to Chicago, IL",
    metaDescription:
      "Cross-border freight shipping from Milton to Chicago for truckload and LTL freight lanes.",
    intro:
      "NPT supports Milton to Chicago lanes with customs-ready handoffs and appointment-first execution controls.",
    bestFor: [
      "Ontario to Midwest truckload shipments",
      "Cross-border LTL programs",
      "Manufacturing and retail replenishment freight",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "LTL service", href: "/services/ltl" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Milton freight services", href: "/locations/milton-on" },
      { label: "Chicago freight services", href: "/locations/chicago-il" },
    ],
  },
  {
    slug: "toronto-on-to-chicago-il",
    originLabel: "Toronto, ON",
    destinationLabel: "Chicago, IL",
    title: "Freight Shipping from Toronto, ON to Chicago, IL",
    metaDescription:
      "Toronto to Chicago freight shipping with cross-border truckload and LTL support.",
    intro:
      "NPT provides Toronto to Chicago lane coverage with customs discipline and real-time operational visibility.",
    bestFor: [
      "Cross-border truckload and LTL freight",
      "Ontario-to-Midwest manufacturing lanes",
      "Retail and distribution shipment flows",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
      { label: "LTL service", href: "/services/ltl" },
    ],
    relatedLocations: [
      { label: "Toronto freight services", href: "/locations/toronto-on" },
      { label: "Chicago freight services", href: "/locations/chicago-il" },
    ],
  },
  {
    slug: "montreal-qc-to-chicago-il",
    originLabel: "Montreal, QC",
    destinationLabel: "Chicago, IL",
    title: "Freight Shipping from Montreal, QC to Chicago, IL",
    metaDescription:
      "Cross-border freight logistics from Montreal to Chicago for truckload and LTL freight.",
    intro:
      "NPT supports Montreal to Chicago lanes with compliance-first border workflows and predictable transit execution.",
    bestFor: [
      "Quebec to Midwest truckload shipments",
      "Cross-border LTL lane optimization",
      "Industrial and automotive freight",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Montreal freight services", href: "/locations/montreal-qc" },
      { label: "Chicago freight services", href: "/locations/chicago-il" },
    ],
  },
  {
    slug: "montreal-qc-to-dallas-tx",
    originLabel: "Montreal, QC",
    destinationLabel: "Dallas, TX",
    title: "Freight Shipping from Montreal, QC to Dallas, TX",
    metaDescription:
      "Montreal to Dallas freight shipping with cross-border truckload and LTL lane support.",
    intro:
      "NPT executes Montreal to Dallas freight with route-level planning, customs coordination, and proactive status updates.",
    bestFor: [
      "Long-haul Canada to Texas truckload lanes",
      "Cross-border LTL shipments",
      "Expedited freight with strict delivery windows",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Expedited and specialized", href: "/services/expedited-specialized" },
    ],
    relatedLocations: [
      { label: "Montreal freight services", href: "/locations/montreal-qc" },
      { label: "Dallas freight services", href: "/locations/dallas-tx" },
    ],
  },
  {
    slug: "laredo-tx-to-mexico-city-cdmx",
    originLabel: "Laredo, TX",
    destinationLabel: "Mexico City, CDMX",
    title: "Cross-Border Freight from Laredo, TX to Mexico City, CDMX",
    metaDescription:
      "U.S.-Mexico freight shipping from Laredo to Mexico City with customs and border execution support.",
    intro:
      "NPT helps shippers move Laredo to Mexico City freight with secure cross-border handoffs and disciplined exception management.",
    bestFor: [
      "U.S.-Mexico truckload freight corridors",
      "Cross-border LTL with customs-sensitive documentation",
      "Time-sensitive freight into central Mexico",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Laredo freight services", href: "/locations/laredo-tx" },
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
    ],
  },
  {
    slug: "laredo-tx-to-toronto-on",
    originLabel: "Laredo, TX",
    destinationLabel: "Toronto, ON",
    title: "Freight Shipping from Laredo, TX to Toronto, ON",
    metaDescription:
      "Cross-border freight shipping from Laredo to Toronto for truckload and LTL North America lanes.",
    intro:
      "NPT supports Laredo to Toronto freight with integrated corridor planning for Mexico-U.S.-Canada supply chains.",
    bestFor: [
      "Three-country supply chain lanes",
      "Cross-border truckload freight",
      "Compliance-sensitive long-haul freight",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Intermodal service", href: "/services/intermodal" },
    ],
    relatedLocations: [
      { label: "Laredo freight services", href: "/locations/laredo-tx" },
      { label: "Toronto freight services", href: "/locations/toronto-on" },
    ],
  },
  {
    slug: "houston-tx-to-milton-on",
    originLabel: "Houston, TX",
    destinationLabel: "Milton, ON",
    title: "Freight Shipping from Houston, TX to Milton, ON",
    metaDescription:
      "Houston to Milton freight shipping with cross-border truckload and LTL logistics support.",
    intro:
      "NPT executes Houston to Milton freight with border-ready planning and controlled lane operations.",
    bestFor: [
      "Texas to Ontario truckload freight",
      "Cross-border LTL shipments with delivery appointments",
      "Industrial and manufacturing lane support",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "LTL service", href: "/services/ltl" },
    ],
    relatedLocations: [
      { label: "Houston freight services", href: "/locations/houston-tx" },
      { label: "Milton freight services", href: "/locations/milton-on" },
    ],
  },
  {
    slug: "houston-tx-to-montreal-qc",
    originLabel: "Houston, TX",
    destinationLabel: "Montreal, QC",
    title: "Freight Shipping from Houston, TX to Montreal, QC",
    metaDescription:
      "Cross-border freight shipping from Houston to Montreal for truckload and LTL lanes.",
    intro:
      "NPT supports Houston to Montreal freight with customs-aligned execution and proactive milestone communication.",
    bestFor: [
      "Texas to Quebec truckload lanes",
      "Cross-border LTL and mixed shipment programs",
      "Temperature-controlled freight options",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Temperature-controlled service", href: "/services/temperature-controlled" },
    ],
    relatedLocations: [
      { label: "Houston freight services", href: "/locations/houston-tx" },
      { label: "Montreal freight services", href: "/locations/montreal-qc" },
    ],
  },
  {
    slug: "dallas-tx-to-milton-on",
    originLabel: "Dallas, TX",
    destinationLabel: "Milton, ON",
    title: "Freight Shipping from Dallas, TX to Milton, ON",
    metaDescription:
      "Dallas to Milton freight shipping with cross-border truckload and LTL support across North America lanes.",
    intro:
      "NPT coordinates Dallas to Milton freight with customs-ready planning and high-visibility execution.",
    bestFor: [
      "Texas to Ontario truckload freight",
      "Cross-border LTL programs",
      "Expedited freight requiring route control",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Expedited and specialized", href: "/services/expedited-specialized" },
    ],
    relatedLocations: [
      { label: "Dallas freight services", href: "/locations/dallas-tx" },
      { label: "Milton freight services", href: "/locations/milton-on" },
    ],
  },
  {
    slug: "dallas-tx-to-monterrey-nl",
    originLabel: "Dallas, TX",
    destinationLabel: "Monterrey, NL",
    title: "Cross-Border Freight from Dallas, TX to Monterrey, NL",
    metaDescription:
      "Cross-border freight shipping from Dallas to Monterrey for truckload, LTL, and industrial lanes.",
    intro:
      "NPT supports Dallas to Monterrey lanes with border-sensitive coordination and disciplined transit management.",
    bestFor: [
      "U.S.-Mexico truckload lanes",
      "Cross-border manufacturing freight",
      "LTL freight with customs requirements",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Dallas freight services", href: "/locations/dallas-tx" },
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
    ],
  },
  {
    slug: "chicago-il-to-milton-on",
    originLabel: "Chicago, IL",
    destinationLabel: "Milton, ON",
    title: "Freight Shipping from Chicago, IL to Milton, ON",
    metaDescription:
      "Chicago to Milton freight shipping with cross-border truckload and LTL lane support.",
    intro:
      "NPT executes Chicago to Milton freight with customs-ready handoffs and appointment-compliant delivery planning.",
    bestFor: [
      "Midwest to Ontario truckload freight",
      "Cross-border LTL consolidation",
      "Retail and automotive lane programs",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "LTL service", href: "/services/ltl" },
    ],
    relatedLocations: [
      { label: "Chicago freight services", href: "/locations/chicago-il" },
      { label: "Milton freight services", href: "/locations/milton-on" },
    ],
  },
  {
    slug: "chicago-il-to-montreal-qc",
    originLabel: "Chicago, IL",
    destinationLabel: "Montreal, QC",
    title: "Freight Shipping from Chicago, IL to Montreal, QC",
    metaDescription:
      "Cross-border freight shipping from Chicago to Montreal with truckload and LTL support.",
    intro:
      "NPT supports Chicago to Montreal freight lanes with border-compliant controls and transparent in-transit updates.",
    bestFor: [
      "Midwest to Quebec truckload freight",
      "Cross-border LTL programs",
      "Manufacturing and consumer goods lanes",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Chicago freight services", href: "/locations/chicago-il" },
      { label: "Montreal freight services", href: "/locations/montreal-qc" },
    ],
  },
  {
    slug: "livermore-ca-to-houston-tx",
    originLabel: "Livermore, CA",
    destinationLabel: "Houston, TX",
    title: "Freight Shipping from Livermore, CA to Houston, TX",
    metaDescription:
      "California to Texas freight shipping from Livermore to Houston with truckload and intermodal options.",
    intro:
      "NPT supports Livermore to Houston freight with mode-fit planning, long-haul execution discipline, and milestone visibility.",
    bestFor: [
      "West coast to Texas truckload lanes",
      "Intermodal alternatives for cost-efficiency",
      "Industrial and project freight movement",
    ],
    relatedServices: [
      { label: "Intermodal service", href: "/services/intermodal" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Livermore freight services", href: "/locations/livermore-ca" },
      { label: "Houston freight services", href: "/locations/houston-tx" },
    ],
  },
  {
    slug: "livermore-ca-to-toronto-on",
    originLabel: "Livermore, CA",
    destinationLabel: "Toronto, ON",
    title: "Freight Shipping from Livermore, CA to Toronto, ON",
    metaDescription:
      "Cross-border freight shipping from Livermore to Toronto with truckload and intermodal support.",
    intro:
      "NPT executes Livermore to Toronto freight through coordinated long-haul cross-border planning and proactive exception control.",
    bestFor: [
      "California to Ontario truckload freight",
      "Cross-border intermodal and multimodal planning",
      "Specialized freight requiring route discipline",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Intermodal service", href: "/services/intermodal" },
    ],
    relatedLocations: [
      { label: "Livermore freight services", href: "/locations/livermore-ca" },
      { label: "Toronto freight services", href: "/locations/toronto-on" },
    ],
  },
  {
    slug: "miami-fl-to-dallas-tx",
    originLabel: "Miami, FL",
    destinationLabel: "Dallas, TX",
    title: "Freight Shipping from Miami, FL to Dallas, TX",
    metaDescription:
      "Domestic freight shipping from Miami to Dallas with truckload, LTL, and expedited support.",
    intro:
      "NPT supports Miami to Dallas freight with controlled lane execution, schedule reliability, and scalable capacity.",
    bestFor: [
      "Southeast to Texas truckload freight",
      "LTL and partial shipments",
      "Time-sensitive freight requiring expedited handling",
    ],
    relatedServices: [
      { label: "Truckload service", href: "/services/truckload" },
      { label: "LTL service", href: "/services/ltl" },
      { label: "Expedited and specialized", href: "/services/expedited-specialized" },
    ],
    relatedLocations: [
      { label: "Miami freight services", href: "/locations/miami-fl" },
      { label: "Dallas freight services", href: "/locations/dallas-tx" },
    ],
  },
  {
    slug: "miami-fl-to-monterrey-nl",
    originLabel: "Miami, FL",
    destinationLabel: "Monterrey, NL",
    title: "Cross-Border Freight from Miami, FL to Monterrey, NL",
    metaDescription:
      "Cross-border freight shipping from Miami to Monterrey for truckload, LTL, and industrial cargo lanes.",
    intro:
      "NPT supports Miami to Monterrey freight with customs-sensitive handoffs and corridor-specific execution workflows.",
    bestFor: [
      "U.S.-Mexico long-haul truckload lanes",
      "Cross-border LTL and expedited freight",
      "Industrial, retail, and manufacturing cargo",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Expedited and specialized", href: "/services/expedited-specialized" },
    ],
    relatedLocations: [
      { label: "Miami freight services", href: "/locations/miami-fl" },
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
    ],
  },
  {
    slug: "monterrey-nl-to-laredo-tx",
    originLabel: "Monterrey, NL",
    destinationLabel: "Laredo, TX",
    title: "Cross-Border Freight from Monterrey, NL to Laredo, TX",
    metaDescription:
      "Cross-border freight shipping from Monterrey to Laredo for Northbound U.S. and Canada freight corridors.",
    intro:
      "NPT manages Monterrey to Laredo freight with border-gateway precision and proactive customs coordination.",
    bestFor: [
      "Mexico to U.S. truckload freight",
      "Cross-border LTL with customs documentation",
      "Automotive and industrial supply chain moves",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
    ],
    relatedLocations: [
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
      { label: "Laredo freight services", href: "/locations/laredo-tx" },
    ],
  },
  {
    slug: "monterrey-nl-to-houston-tx",
    originLabel: "Monterrey, NL",
    destinationLabel: "Houston, TX",
    title: "Cross-Border Freight from Monterrey, NL to Houston, TX",
    metaDescription:
      "Cross-border freight shipping from Monterrey to Houston with customs-ready truckload and LTL support.",
    intro:
      "NPT supports Monterrey to Houston freight with integrated border workflows and disciplined milestone tracking.",
    bestFor: [
      "Mexico to Texas truckload freight",
      "Cross-border LTL consolidation",
      "Time-sensitive manufacturing freight",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "LTL service", href: "/services/ltl" },
    ],
    relatedLocations: [
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
      { label: "Houston freight services", href: "/locations/houston-tx" },
    ],
  },
  {
    slug: "monterrey-nl-to-toronto-on",
    originLabel: "Monterrey, NL",
    destinationLabel: "Toronto, ON",
    title: "Cross-Border Freight from Monterrey, NL to Toronto, ON",
    metaDescription:
      "Cross-border freight shipping from Monterrey to Toronto across Mexico, U.S., and Canada freight corridors.",
    intro:
      "NPT executes Monterrey to Toronto freight with multi-border handoff discipline and full lane visibility.",
    bestFor: [
      "Mexico to Canada truckload corridors",
      "Three-country cross-border lane programs",
      "Automotive and industrial supply chain freight",
    ],
    relatedServices: [
      { label: "Cross-border shipping", href: "/services/cross-border" },
      { label: "Truckload service", href: "/services/truckload" },
      { label: "Automotive logistics", href: "/industries/automotive" },
    ],
    relatedLocations: [
      { label: "Monterrey freight services", href: "/locations/monterrey-nl" },
      { label: "Toronto freight services", href: "/locations/toronto-on" },
    ],
  },
];

export function getSeoLaneSlugs() {
  return SEO_LANES.map((x) => x.slug);
}

export function getSeoLaneBySlug(slug: string) {
  return SEO_LANES.find((x) => x.slug === slug);
}

export function getSeoLanePriority(slug: string): SeoPriority {
  return SEO_LANE_PRIORITY[slug] ?? "P2";
}

