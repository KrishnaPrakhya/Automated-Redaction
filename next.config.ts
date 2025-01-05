import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "08a8-34-80-119-132.ngrok-free.app",
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
