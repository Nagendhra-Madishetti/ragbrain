import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server (.next/standalone) for a slim Docker image (Phase 5 deploy).
  output: "standalone",
};

export default nextConfig;
