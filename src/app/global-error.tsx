'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RotateCcw, AlertTriangle } from 'lucide-react'
import { error as logError } from '@lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logError('GlobalError', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)] p-6">
      <div className="max-w-md text-center space-y-6">
        <AlertTriangle className="w-16 h-16 mx-auto text-red-500" />
        <h2 className="text-2xl font-semibold">Algo salió mal</h2>
        <p className="text-sm">
          Puede que tu conexión haya fallado o que nuestros servidores estén experimentando problemas.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-black rounded-md"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}

