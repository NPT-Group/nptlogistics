import type { NextConfig } from "next";

const imageDomains =
  process.env.NEXT_IMAGE_DOMAINS?.split(",")
    .map((d) => d.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageDomains.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
    qualities: [70, 74, 75, 84, 90],
  },

  async redirects() {
    return [
      {
        source: "/who-we-are",
        destination: "/about-us",
        permanent: true,
      },

      // Legacy service URLs from old site
      {
        source: "/service/road-freight",
        destination: "/services/truckload",
        permanent: true,
      },
      {
        source: "/service/train-freight",
        destination: "/services/cross-border",
        permanent: true,
      },
      {
        source: "/service/ocean-freight",
        destination: "/services/cross-border",
        permanent: true,
      },

      // Optional: support old singular prefix generally if you know exact mappings later
      // Add more one-by-one as you discover them in Google/Search Console.
    ];
  },
};

export default nextConfig;
