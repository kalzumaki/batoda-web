import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        pathname: "/**", // allows any image path
      },
      {
        protocol: "https",
        hostname: "f4ne4e55o2zd.share.zrok.io",
        pathname: "/**", // allows any image path
      },
    ],
  },
};

export default nextConfig;
