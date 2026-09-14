import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 768, 1280, 1920],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  // Files under /public are served uncached by default, which makes the films
  // re-download on every visit. A month of caching with background revalidation
  // keeps repeat visits instant; rename a file to push a replacement out sooner.
  async headers() {
    return [
      {
        source:
          "/:dir(showreel|portfolio|robot-film|atmosphere|portrait|before-after|posts|pic|studio|icons)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
