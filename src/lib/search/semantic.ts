const dic: Record<string, string[]> = {
  almacen: ['bodega', 'depósito'],
  usuario: ['persona', 'miembro'],
}

export function busquedaSemantica(q: string, textos: string[]): string[] {
  const sin = dic[q.toLowerCase()] || []
  const termino = q.toLowerCase()
  return textos.filter(t => {
    const l = t.toLowerCase()
    return l.includes(termino) || sin.some(s => l.includes(s))
  })
}
