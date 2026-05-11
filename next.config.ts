import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
    useLightningcss: true,
    lightningCssFeatures: {
      include: ["light-dark", "oklab-colors"],
      exclude: ["nesting"],
    },
  },
};

export default nextConfig;
