// next.config.js or next.config.ts (you're using TypeScript)

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatar.iran.liara.run", // for avatar fallback
      "f4ne4e55o2zd.share.zrok.io", // for your storage API
    ],
  },
};

export default nextConfig;
