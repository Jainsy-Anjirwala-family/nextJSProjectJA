import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [], // if you need remote images
    // allow local images served via API route with query string
    localPatterns: [
      {
        // pattern to allow your API route images
        pathname: "/api/service/image",
      },
    ],
  },
};

export default nextConfig;
