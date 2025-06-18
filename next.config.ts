import { securityHeaders } from './lib/securityHeaders';
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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

export default withNextIntl(nextConfig);
