export type RolArea = 'lectura' | 'edicion' | 'comentarios'

export function puede(area: RolArea, permisos: RolArea[]): boolean {
  return permisos.includes(area)
}
