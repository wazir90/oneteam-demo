import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/oneteam-demo",
  images: { unoptimized: true },
};

export default nextConfig;
