export interface NodoDiagrama {
  id: string
  x: number
  y: number
}

export interface Diagrama {
  nodos: NodoDiagrama[]
}

export function optimizarDiagrama(diagrama: Diagrama): Diagrama {
  const nuevos = [...diagrama.nodos].sort((a, b) => a.id.localeCompare(b.id))
  return { nodos: nuevos.map((n, i) => ({ ...n, x: i * 100, y: i * 50 })) }
}
