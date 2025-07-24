// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
vi.mock('../src/lib/qrImage', () => ({ decodeQRImageFile: vi.fn().mockResolvedValue('42') }))
import * as qrImage from '../src/lib/qrImage'

;(global as any).React = React

let push: ReturnType<typeof vi.fn>
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
  delete (navigator as any).mediaDevices
})

describe('ScanPage fallback', () => {
  it('muestra input si no hay cámara', async () => {
    push = vi.fn()
    ;(navigator as any).mediaDevices = {
      enumerateDevices: vi.fn().mockResolvedValue([]),
    }
    const { default: ScanPage } = await import('../src/app/dashboard/almacenes/scan/page')
    const { getAllByLabelText } = render(<ScanPage />)
    await waitFor(() => {
      expect(getAllByLabelText('Subir QR')[0]).toBeTruthy()
    })
  })

  it('decodifica imagen y redirige', async () => {
    push = vi.fn()
    ;(navigator as any).mediaDevices = {
      enumerateDevices: vi.fn().mockResolvedValue([]),
    }
    const { default: ScanPage } = await import('../src/app/dashboard/almacenes/scan/page')
    const { getAllByLabelText } = render(<ScanPage />)
    const file = new File(['test'], 'qr.png', { type: 'image/png' })
    const inputs = getAllByLabelText('Subir QR')
    inputs.forEach((inp) => fireEvent.change(inp, { target: { files: [file] } }))
    await waitFor(() => {
      expect(qrImage.decodeQRImageFile).toHaveBeenCalled()
    })
  })
})
