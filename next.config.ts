import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["isomorphic-dompurify"],
  trailingSlash: false,
  webpack: (config, { dev }) => {
    if (dev && process.env.PREFIX?.includes("com.termux")) {
      // 1. Matikan disk cache untuk hindari 'Caching failed for pack'
      config.cache = { type: "memory" };
      
      // 2. Cegah Watchpack melakukan scandir hingga ke root (/)
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules",
          "**/.git",
          /^\/data\/(?!data\/com\.termux)/,
          /^\/(?!data)/, 
        ],
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
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
