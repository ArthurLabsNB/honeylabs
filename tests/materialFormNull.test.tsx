import { describe, it, expect, vi } from 'vitest'
import React from 'react'
(global as any).React = React
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('../src/components/Toast', () => ({ useToast: () => ({ show: vi.fn() }) }))
vi.mock('../src/hooks/useUnidades', () => ({ __esModule: true, default: () => ({ unidades: [] }) }))
vi.mock('../src/hooks/useArchivosMaterial', () => ({ __esModule: true, default: () => ({ archivos: [], eliminar: vi.fn(), mutate: vi.fn() }) }))
vi.mock('../src/hooks/useObjectUrl', () => ({ __esModule: true, default: () => null }))

import MaterialForm from '../src/app/dashboard/almacenes/components/MaterialForm'

function noop() {}

describe('MaterialForm', () => {
  it('renderiza placeholder con material nulo', () => {
    const html = renderToStaticMarkup(
      <MaterialForm
        material={null}
        onChange={noop}
        onGuardar={noop}
        onCancelar={noop}
        onDuplicar={noop}
        onEliminar={noop}
      />
    )
    expect(html).toContain('Selecciona o crea un material')
  })
})
