// next.config.js or next.config.ts (you're using TypeScript)

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatar.iran.liara.run",             // for avatar fallback
      "zna0brw6skqo.share.zrok.io",        // for your storage API
    ],
  },
};

export default nextConfig;
