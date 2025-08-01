import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['books.google.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
