import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/jsonplaceholder",
  transpilePackages: [
    "@next-modular-arch/http",
    "@next-modular-arch/query",
    "@next-modular-arch/ui-data",
    "@next-modular-arch/ui-errors",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "i.picsum.photos", pathname: "/**" },
    ],
  },
};

export default nextConfig;
