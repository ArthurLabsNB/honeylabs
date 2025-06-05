export async function jsonOrNull(res: Response) {
  const type = res.headers.get('content-type') ?? ''
  if (type.includes('application/json')) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }
  return null
}

