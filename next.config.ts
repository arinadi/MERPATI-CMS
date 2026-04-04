import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["isomorphic-dompurify"],
  trailingSlash: false,
  webpack: (config, { dev }) => {
    if (dev && process.env.PREFIX?.includes("com.termux")) {
      // 1. Matikan disk cache untuk hindari 'Caching failed for pack'
      config.cache = { type: "memory" };
      
      // 2. Cegah Watchpack melakukan scandir dengan pola glob string
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
        ],
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
