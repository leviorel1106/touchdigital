import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 768, 1280, 1920],
    minimumCacheTTL: 31536000,
  },
  compress: true,
};

export default nextConfig;
