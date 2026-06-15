import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components enables `use cache` + Partial Prerendering, so the
  // worldcup routes prerender a static shell at build time and refresh the
  // tournament data on a fixed interval (see lib/tournament/data.ts).
  cacheComponents: true,
};

export default nextConfig;
