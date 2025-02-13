import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3ead-35-231-45-74.ngrok-free.app",
        port: "", 
        pathname: "/output/**", 
      },
      {
        protocol:"http",
        hostname: "127.0.0.1",
        port: "5000", 
        pathname: "/static/output/**", 
      },
    ],
  },
 
};

export default nextConfig;
