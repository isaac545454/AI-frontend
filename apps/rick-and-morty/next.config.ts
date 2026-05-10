import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/rick-and-morty",
  transpilePackages: [
    "@next-modular-arch/http",
    "@next-modular-arch/query",
    "@next-modular-arch/ui-data",
    "@next-modular-arch/ui-errors",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "rickandmortyapi.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
