import { securityHeaders } from './lib/securityHeaders';

/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  distDir: '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
