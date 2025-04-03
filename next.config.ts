import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["geo-albers-usa-territories"], // 👈 Force transpilation

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'frontend-take-home.fetch.com',
 
      },
    ],
  }
};

export default nextConfig;
