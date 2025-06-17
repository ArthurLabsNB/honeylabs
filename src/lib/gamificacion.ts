export interface Logro {
  id: number
  nombre: string
  descripcion: string
  puntos: number
}

const logros: Logro[] = [
  { id: 1, nombre: 'Primer Panel', descripcion: 'Crea tu primer panel de pizarra', puntos: 100 },
  { id: 2, nombre: 'Colaborador', descripcion: 'Invita a un compañero a tu pizarra', puntos: 150 },
  { id: 3, nombre: 'Explorador', descripcion: 'Visita la sección de wiki', puntos: 50 },
]

export function getLogros(): Logro[] {
  return logros
}
