import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/pokemon",
  transpilePackages: [
    "@next-modular-arch/http",
    "@next-modular-arch/query",
    "@next-modular-arch/ui-data",
    "@next-modular-arch/ui-errors",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
