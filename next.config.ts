import { securityHeaders } from './lib/securityHeaders';
import nextPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''


const withPWA = nextPWA({
  dest: 'public',
  disable:
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_ENABLE_PWA !== 'true',
});

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

export default withPWA(nextConfig);
