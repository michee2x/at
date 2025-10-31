import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "atlaze.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i5.walmartimages.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i2.walmartimages.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
