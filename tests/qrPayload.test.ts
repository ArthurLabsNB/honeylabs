import { describe, it, expect } from 'vitest'
import { encodeQR, decodeQR } from '../src/lib/qr'
import { buildQRPayload } from '../src/lib/buildQRPayload'

const file = (name: string) => ({ name }) as any

describe('buildQRPayload', () => {
  it('incluye nombres de archivos de material', () => {
    const material = {
      id: 1,
      codigoQR: 'abc',
      miniatura: file('img.png'),
      archivosPrevios: [
        { nombre: 'Manual', archivoNombre: 'manual.pdf' },
        { archivoNombre: 'spec.pdf' },
      ],
    }
    const payload = buildQRPayload('material', material)
    expect(payload.miniatura).toBe('img.png')
    expect(payload.archivosPrevios).toEqual(['manual.pdf', 'spec.pdf'])
    const decoded = decodeQR(encodeQR(payload))
    expect(decoded).toEqual(payload)
  })

  it('funciona con unidades', () => {
    const unidad = {
      id: 2,
      codigoQR: 'u1',
      imagen: file('u.png'),
      archivosPrevios: [{ archivoNombre: 'ficha.pdf' }],
    }
    const payload = buildQRPayload('unidad', unidad)
    expect(payload.imagen).toBe('u.png')
    expect(payload.archivosPrevios).toEqual(['ficha.pdf'])
    expect(decodeQR(encodeQR(payload))).toEqual(payload)
  })

  it('extrae nombres de documentos de almacén', () => {
    const almacen = {
      id: 3,
      codigoUnico: 'x1',
      documentos: [{ nombre: 'rules.docx', url: 'a' }],
    }
    const payload = buildQRPayload('almacen', almacen)
    expect(payload.documentos).toEqual(['rules.docx'])
    expect(decodeQR(encodeQR(payload))).toEqual(payload)
  })
})
