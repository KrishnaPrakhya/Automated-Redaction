import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "afe9-34-145-120-41.ngrok-free.app",
        port: "", 
        pathname: "/output/**", 
      },
    ],
  },
};

export default nextConfig;
