import { describe, it, expect } from 'vitest';

import config from '../next.config';

describe('security headers', () => {
  it('CSP incluye frame-src para Google', async () => {
    const res = await config.headers();
    const csp = res[0].headers.find(h => h.key === 'Content-Security-Policy')?.value ?? '';
    expect(csp).toContain("frame-src 'self' https://www.google.com https://www.gstatic.com");
  });
});
