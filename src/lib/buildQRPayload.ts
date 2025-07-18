export type QRObjectType = 'material' | 'unidad' | 'almacen'

function isFileLike(val: any): val is { name: string } {
  return (
    val &&
    typeof val === 'object' &&
    typeof val.name === 'string'
  )
}

function mapValue(v: any): any {
  if (isFileLike(v)) return v.name
  if (Array.isArray(v)) return v.map(mapValue)
  if (v && typeof v === 'object') {
    if ('archivoNombre' in v && typeof v.archivoNombre === 'string') {
      return v.archivoNombre
    }
    if ('nombre' in v && typeof v.nombre === 'string') {
      return v.nombre
    }
  }
  return v
}

export function buildQRPayload<T extends Record<string, any>>(tipo: QRObjectType, obj: T): Record<string, any> {
  const out: Record<string, any> = { tipo }
  for (const [k, v] of Object.entries(obj)) {
    out[k] = mapValue(v)
  }
  return out
}
