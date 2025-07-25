import { describe, it, expect, vi } from 'vitest'
import React from 'react'
(global as any).React = React
import { renderToStaticMarkup } from 'react-dom/server'

import MaterialList from '../src/app/dashboard/almacenes/components/MaterialList'

vi.mock('../src/components/Toast', () => ({ useToast: () => toast }))

const toast = { show: vi.fn() }

function renderList(id: string, onEliminar: any) {
  const elems: any[] = []
  const orig = React.createElement
  const spy = vi
    .spyOn(React, 'createElement')
    .mockImplementation((type: any, props: any, ...children: any[]) => {
      const el = orig(type as any, props, ...children)
      elems.push(el)
      return el
    })

  renderToStaticMarkup(
    <MaterialList
      materiales={[{ id, nombre: 'x', cantidad: 0, lote: '' } as any]}
      selectedId={null}
      onSeleccion={() => {}}
      busqueda=""
      setBusqueda={() => {}}
      orden="nombre"
      setOrden={() => {}}
      onNuevo={async () => {}}
      onDuplicar={() => {}}
      onEliminar={onEliminar}
    />,
  )
  spy.mockRestore()
  const btn = elems.find(e => e.props?.onClick && e.props.children === 'Borrar')
  return btn?.props.onClick
}

describe('MaterialList', () => {
  it('no elimina con id inválido', () => {
    const remove = vi.fn()
    const click = renderList('abc', remove)
    expect(click).toBeTypeOf('function')
    click({ stopPropagation() {} })
    expect(remove).not.toHaveBeenCalled()
    expect(toast.show).toHaveBeenCalledWith('ID inválido', 'error')
  })
})
