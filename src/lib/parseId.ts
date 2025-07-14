export function parseId(value?: number | string | null): number | null {
  const n = Number(value)
  return Number.isNaN(n) || n <= 0 ? null : n
}
