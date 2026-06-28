import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — produces a fully static /out folder.
  // Deploy to Netlify by dragging /out onto netlify.com, or via Git.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
