import { describe, it, expect } from 'vitest'
import { openMaterial } from '../src/app/dashboard/almacenes/utils/openMaterial'
function createOpts() {
  let sel: string | null = null
  const calls: string[] = []
  return {
    opts: {
      setSelectedId: (id: string) => {
        sel = id
        calls.push('setSelectedId')
      },
      setUnidadSel: () => {
        calls.push('setUnidadSel')
      },
    },
    get selected() {
      return sel
    },
    get calls() {
      return calls
    },
  }
}

describe('openMaterial', () => {
  it('actualiza selectedId y limpia unidad', () => {
    const ctx = createOpts()
    openMaterial('m1', ctx.opts)
    expect(ctx.selected).toBe('m1')
    expect(ctx.calls).toEqual(['setSelectedId', 'setUnidadSel'])
  })
})
