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
    ],
  },
};

export default nextConfig;



/**
 * 
 * <Image
        src="/home/sub-category-images/9de1d476284efe9d2ad81e59cc9f3e0a1f996df2.png"
        alt="Sub Category"
        fill
        sizes="(max-width: 768px) 100vw, 
               (max-width: 1200px) 50vw, 
               33vw"
        className="object-cover rounded-lg"
        priority
      />
    </div>
 */