export interface OpenMaterialOptions {
  setSelectedId: (id: string) => void
  setUnidadSel: (u: any) => void
}

export function openMaterial(id: string | null, opts: OpenMaterialOptions) {
  if (!id) return
  opts.setSelectedId(id)
  opts.setUnidadSel(null)
}
