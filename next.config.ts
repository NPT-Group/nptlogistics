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
  },
};

export default nextConfig;
