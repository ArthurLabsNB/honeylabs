const dev = process.env.NODE_ENV !== 'production';

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com vitals.vercel-insights.com va.vercel-scripts.com${dev ? ' http://localhost:*' : ''}`,
  `frame-src 'self' https://www.google.com https://www.gstatic.com${dev ? ' http://localhost:*' : ''}`,
  `connect-src 'self' https://*.googleapis.com https://www.google.com https://www.gstatic.com${dev ? ' http://localhost:*' : ''}`,
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
].join('; ');

export const ContentSecurityPolicy = csp;

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
