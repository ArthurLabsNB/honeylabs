const DISABLED = process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA === 'true'

export function isRecaptchaEnabled(): boolean {
  return !DISABLED
}

export async function verifyRecaptcha(token: string | null): Promise<boolean> {
  if (DISABLED) return true
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
    if (!data.success) return false
    if (typeof data.score === 'number') return data.score > 0.5
    return true
  } catch {
    return false
  }
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  if (DISABLED) return null
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
