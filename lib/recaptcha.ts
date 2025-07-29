export async function verifyRecaptcha(token: string | null): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })
    const data = (await res.json()) as { success?: boolean; score?: number }
    return !!data.success && (data.score ?? 0) > 0.5
  } catch {
    return false
  }
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  if (typeof window === 'undefined') return null
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  if (!siteKey || !window.grecaptcha) return null
  return new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action })
        .then((t: string) => resolve(t))
        .catch(() => resolve(null))
    })
  })
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (key: string, opts: { action: string }) => Promise<string>
    }
  }
}
