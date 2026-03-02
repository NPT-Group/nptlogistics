import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NPT Logistics",
    short_name: "NPT",
    description:
      "Reliable freight transportation across North America for complex, time-critical, and compliance-sensitive shipments.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070a12",
    theme_color: "#070a12",
    categories: ["business", "logistics", "transportation"],
    icons: [
      {
        src: "/brand/NPTlogo2.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/nptLogo-glow.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
