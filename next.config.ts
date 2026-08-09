import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["isomorphic-dompurify"],
  trailingSlash: false,
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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
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
  async headers() {
    const cspDirectives = {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        "*.vercel-storage.com",
        "*.googletagmanager.com",
        "*.google-analytics.com",
        "static.cloudflareinsights.com",
      ],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["*", "blob:", "data:"],
      "font-src": ["'self'", "data:", "fonts.gstatic.com"],
      "connect-src": ["*"],
      "media-src": ["*"],
      "object-src": ["'none'"],
      "frame-src": [
        "'self'",
        "*.youtube.com",
        "youtube.com",
        "*.tiktok.com",
        "*.instagram.com",
        "*.googletagmanager.com",
      ],
      "worker-src": ["'self'", "blob:"],
      "upgrade-insecure-requests": [],
    };

    const cspHeader = Object.entries(cspDirectives)
      .map(([key, values]) => `${key} ${values.join(" ")}`.trim())
      .join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
