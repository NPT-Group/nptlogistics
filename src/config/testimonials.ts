// src/config/testimonials.ts

export type TestimonialItem =
  | {
      type: "video";
      id: "npt-youtube";
      eyebrow: string;
      title: string;
      description?: string;
      youtubeUrl: string;
      channelUrl?: string;
    }
  | {
      type: "testimonial";
      id: string;
      rating: 1 | 2 | 3 | 4 | 5;
      quote: string;
      name: string;
      meta?: string; // company / role optional
    };

export type PartnerLogo = {
  src: string;
  alt: string;
};

export const TRUST_PROOF_SECTION = {
  id: "trust-proof",
  kicker: "Trust & Proof",
  title: "Proof in Every Mile. Trusted on Every Load",
  description:
    "NPT ensures effective, dependable, and proactive communication and accountability from pick-up to final delivery. Additionally, provide sustainable supply chain solutions that link businesses with customers across the globe.",
} as const;

export const TRUST_PROOF_ITEMS: TestimonialItem[] = [
  {
    type: "video",
    id: "npt-youtube",
    eyebrow: "Featured Testimonial",
    title: "Watch NPT in Action",
    description: "A quick look at how our team executes with speed, control, and consistency.",
    youtubeUrl: "https://www.youtube.com/watch?v=mQv-1GA-HYo",
    channelUrl: "https://www.youtube.com/@SSPGroupofCompanies",
  },
  {
    type: "testimonial",
    id: "ben-horther",
    rating: 5,
    quote:
      "Our partnership with NPT has been excellent. They are consistently on time, provide clear updates, and step up quickly on special projects. They are one of our most reliable carrier partners in Canada.",
    name: "Ben Horther",
  },
  {
    type: "testimonial",
    id: "douglas-brown",
    rating: 5,
    quote:
      "We booked a Thursday pickup for Saturday delivery, then our customer needed one unit a day early. Sam and Raj adjusted fast and delivered on Friday. Service and communication were excellent.",
    name: "Douglas Brown",
  },
  {
    type: "testimonial",
    id: "richard-bucher",
    rating: 5,
    quote:
      "Great team to work with. They are consistently on time, their updates are dependable, and they are our first choice for Mexico-bound shipments.",
    name: "Richard Bucher",
  },
  {
    type: "testimonial",
    id: "jeff-smith",
    rating: 5,
    quote:
      "Great company. We hired them for an oversized shipment and their team supported both loading and unloading with their own equipment. They are now a preferred partner for cross-border freight.",
    name: "Jeff Smith",
  },

  // You can add more later (or placeholders):
  // {
  //   type: "testimonial",
  //   id: "placeholder-1",
  //   rating: 5,
  //   quote: "Lorem ipsum ...",
  //   name: "Name Here",
  //   meta: "Company / Role",
  // },
];

export const TRUST_PARTNER_LOGOS: PartnerLogo[] = [
  { src: "/_optimized/partners/CTPAT-icon.webp", alt: "CTPAT" },
  { src: "/_optimized/partners/smartWay-icon.webp", alt: "SmartWay" },
  { src: "/_optimized/partners/ACI-icon.webp", alt: "ACI" },
  { src: "/_optimized/partners/CSA-icon.webp", alt: "CSA" },
  { src: "/_optimized/partners/pip-icon.webp", alt: "PIP" },
  { src: "/_optimized/partners/Haccp-icon.webp", alt: "HACCP" },
  { src: "/_optimized/partners/ccc-icon.webp", alt: "CCC" },
  { src: "/_optimized/partners/Fast-free-secure-icon.webp", alt: "FAST" },
  { src: "/_optimized/partners/Ace-icon.webp", alt: "ACE" },
];
