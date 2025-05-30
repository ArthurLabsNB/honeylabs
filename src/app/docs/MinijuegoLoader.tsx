'use client'
import { useState } from 'react'
import PacmanGame from './minijuegos/PacmanGame'
import TetrisGame from './minijuegos/TetrisGame'

const MINIJUEGOS: Record<string, React.FC<any>> = {
  PACMAN: PacmanGame,
  TETRIS01: TetrisGame,
  // Puedes agregar más minijuegos aquí
}

export default function MinijuegoLoader() {
  const [codigo, setCodigo] = useState('')
  const [juegoKey, setJuegoKey] = useState<string | null>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const key = codigo.trim().toUpperCase()
    if (MINIJUEGOS[key]) {
      setJuegoKey(key)
      setError('')
    } else {
      setError('Código inválido o minijuego no disponible.')
    }
  }

  const JuegoComp = juegoKey ? MINIJUEGOS[juegoKey] : null

  return (
    <div className="flex flex-col items-center justify-center min-h-80 rounded-xl bg-[#22223b] p-6 shadow-xl">
      {!JuegoComp ? (
        <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-miel mb-2">Introduce un código de minijuego</h2>
          <input
            className="border border-miel rounded-lg p-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Ej: PACMAN"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-accent text-[#181325] font-bold transition hover:scale-105"
          >
            Jugar
          </button>
          {error && <p className="text-red-400">{error}</p>}
        </form>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <button
            onClick={() => { setJuegoKey(null); setCodigo('') }}
            className="mb-4 self-start px-3 py-1 rounded bg-miel text-[#22223b] font-bold transition hover:scale-105"
          >
            &larr; Cambiar minijuego
          </button>
          <JuegoComp />
        </div>
      )}
    </div>
  )
}
