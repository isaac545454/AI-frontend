import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@next-modular-arch/http",
    "@next-modular-arch/module-registry",
    "@next-modular-arch/query",
    "@next-modular-arch/ui-data",
    "@next-modular-arch/ui-errors",
  ],
};

export default nextConfig;
