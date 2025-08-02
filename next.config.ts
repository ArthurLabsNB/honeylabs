import nextPWA from 'next-pwa';
import validateEnv from './lib/validateEnv';

validateEnv();

/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''


const withPWA = nextPWA({
  dest: 'public',
  disable:
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_ENABLE_PWA !== 'true',
});

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com vitals.vercel-insights.com va.vercel-scripts.com http://localhost:*",
  "frame-src 'self' https://www.google.com https://www.gstatic.com",
  "connect-src 'self' https://*.googleapis.com https://www.google.com https://www.gstatic.com http://localhost:*",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
].join('; ');

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
    return [{
      source: '/(.*)',
      headers: [{
        key: 'Content-Security-Policy',
        value: csp,
      }],
    }];
  },
};

export default withPWA(nextConfig);
