import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'ui-avatars.com',
      'books.google.com',
      'lh3.googleusercontent.com',
      'neelkanthpublishers.com',
    ],
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
