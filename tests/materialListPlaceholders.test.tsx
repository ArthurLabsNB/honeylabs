import { describe, it, expect, vi } from 'vitest'
import React from 'react'
;(global as any).React = React
import { renderToStaticMarkup } from 'react-dom/server'
import MaterialList from '../src/app/dashboard/almacenes/components/MaterialList'

vi.mock('../src/components/Toast', () => ({ useToast: () => ({ show: vi.fn() }) }))

describe('MaterialList placeholders', () => {
  it('muestra placeholders cuando falta informacion', () => {
    const html = renderToStaticMarkup(
      <MaterialList
        materiales={[{ id: '1', nombre: 'Test', cantidad: 0 } as any]}
        selectedId={null}
        onSeleccion={() => {}}
        busqueda=""
        setBusqueda={() => {}}
        orden="nombre"
        setOrden={() => {}}
        onNuevo={async () => ({})}
        onDuplicar={() => {}}
        onEliminar={async () => ({})}
      />,
    )
    expect(html).toContain('Unidad: Sin especificar')
    expect(html).toContain('Ubicación: Sin especificar')
    expect(html).toContain('Lote: Sin especificar')
  })
})
