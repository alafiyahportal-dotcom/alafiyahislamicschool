import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Output ─────────────────────────────────────────────────────────────────
  // Standalone output: smaller Docker image, faster cold-start
  output: "standalone",

  // ─── Runtime ────────────────────────────────────────────────────────────────
  // Gzip/Brotli compression for all HTTP responses
  compress: true,

  // Remove X-Powered-By header (minor security + less overhead)
  poweredByHeader: false,

  // ─── Images ─────────────────────────────────────────────────────────────────
  images: {
    // Serve modern formats — browser picks the best it supports
    formats: ["image/avif", "image/webp"],
    // Aggressive caching: 30 days in browser, 1 year on CDN
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },


  // ─── Headers ────────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Cache public images for 7 days
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Cache icons and logos for 30 days
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, immutable",
          },
        ],
      },
      {
        // Security headers for all pages
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
