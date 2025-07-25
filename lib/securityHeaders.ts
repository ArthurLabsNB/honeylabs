const dev = process.env.NODE_ENV !== 'production';

export const ContentSecurityPolicy = dev
  ? `
    default-src 'self' http://localhost:*;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' vitals.vercel-insights.com va.vercel-scripts.com http://localhost:*;
    style-src 'self' 'unsafe-inline';
    img-src 'self' http: https: data: blob:;
    connect-src 'self' http://localhost:* ws://localhost:*;
    frame-src 'self' https://www.google.com http://localhost:*;
    object-src 'none';
  `
  : `
    default-src 'self';
    script-src 'self' 'unsafe-inline' vitals.vercel-insights.com va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' https: data: blob:;
    connect-src 'self';
    frame-src 'self' https://www.google.com;
    object-src 'none';
  `;

export const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: dev ? 'SAMEORIGIN' : 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];
