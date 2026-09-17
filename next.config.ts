import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.higgsfield.ai" },
      { protocol: "https", hostname: "assets.higgsfield.ai" },
      { protocol: "https", hostname: "static.higgsfield.ai" },
      { protocol: "https", hostname: "d2ol7oe51mr4n9.cloudfront.net" },
    ],
  },
};

export default nextConfig;
