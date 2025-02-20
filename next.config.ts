import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "",
        port: "",
        pathname: "/output/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/static/output/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/token",
        destination: "https://app.vectorshift.ai/api/token",
      },
    ];
  },
};

export default nextConfig;
