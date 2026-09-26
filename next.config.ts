import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.higgsfield.ai" },
      { protocol: "https", hostname: "assets.higgsfield.ai" },
      { protocol: "https", hostname: "static.higgsfield.ai" },
      { protocol: "https", hostname: "d2ol7oe51mr4n9.cloudfront.net" },
      // Generated images stored in the Supabase `generations` bucket.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/generations/**" },
    ],
  },
};

export default nextConfig;
