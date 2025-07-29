export function parseObservaciones(value?: string | null): Record<string, unknown> | null {
  if (!value) return null
  try {
    const obj = JSON.parse(value)
    return obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : null
  } catch {
    return null
  }
}
