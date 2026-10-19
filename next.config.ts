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


  // ─── Security & Source Maps ────────────────────────────────────────────────
  // Disable browser source maps in production to keep source code private (Point 16)
  productionBrowserSourceMaps: false,

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
        // Manifest files should NOT be aggressively cached so updates propagate immediately
        source: "/:path*manifest*.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // Comprehensive Security headers for all pages and APIs (Point 19)
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
