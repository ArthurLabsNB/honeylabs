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
    const data = (await res.json()) as { success?: boolean }
    return !!data.success
  } catch {
    return false
  }
}
