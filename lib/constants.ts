export const SESSION_COOKIE = 'hl_session'

const isProd = process.env.NODE_ENV === 'production'

export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'strict' : 'lax') as const,
  path: '/',
  ...(isProd && process.env.COOKIE_DOMAIN
    ? { domain: process.env.COOKIE_DOMAIN }
    : {}),
}
