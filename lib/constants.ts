// src/lib/constants.ts

export const SESSION_COOKIE = 'hl_session';

export const isProd = process.env.NODE_ENV === 'production';
export const isDev = !isProd;

// 7 días (en segundos). Úsalo al setear la cookie (maxAge).
export const SESSION_MAX_AGE = Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 24 * 7);

// Opciones de cookie para NextResponse.cookies.set
export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProd,                          // en localhost debe ser false
  sameSite: (isProd ? 'strict' : 'lax') as const, // si usas SSO/cross-site, cambia a 'lax'
  path: '/',
  ...(isProd && process.env.COOKIE_DOMAIN
    ? { domain: process.env.COOKIE_DOMAIN }
    : {}),
} as const;

// (Opcional) ReCAPTCHA
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
export const RECAPTCHA_BYPASS = process.env.RECAPTCHA_BYPASS === '1';
