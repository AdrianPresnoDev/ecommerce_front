import type { NextConfig } from "next";

const BACKEND = process.env.INTERNAL_API_URL || 'http://52.51.114.68:8082';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND}/api/:path*` },
      { source: '/admin/api/:path*', destination: `${BACKEND}/admin/api/:path*` },
      { source: '/webhooks/:path*', destination: `${BACKEND}/webhooks/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
