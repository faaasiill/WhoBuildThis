import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    images: {
        domains: ["picsum.photos"],

        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.taggbox.com",
            },
            {
                protocol: "https",
                hostname: "cdn.logojoy.com",
            },
            {
                protocol: "https",
                hostname: "i.pinimg.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
