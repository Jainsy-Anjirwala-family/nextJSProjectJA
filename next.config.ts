import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // enables static HTML export
  // distDir: 'out',  // optional, Next.js defaults to 'out' for static export
  images: {
    remotePatterns: [], // optional, only if you have remote images
    // remove localPatterns if pointing to API routes (won't work in static export)
  },
};

export default nextConfig;
