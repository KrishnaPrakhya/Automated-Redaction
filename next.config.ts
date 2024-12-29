import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c67e-34-82-126-81.ngrok-free.app",
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
