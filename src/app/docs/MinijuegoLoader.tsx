'use client'
import { useState, useRef, useEffect } from 'react'
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
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Animación: foco automático cuando cambias de juego
  useEffect(() => {
    if (!juegoKey && inputRef.current) {
      inputRef.current.focus()
    }
  }, [juegoKey])

  const JuegoComp = juegoKey ? MINIJUEGOS[juegoKey] : null

  return (
    <div className="flex flex-col items-center justify-center min-h-64 rounded-xl bg-[#19171f] shadow-lg">
      {!JuegoComp ? (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xs flex flex-col items-center gap-4 p-0 transition-all duration-300"
        >
          <input
            ref={inputRef}
            className="border border-zinc-700 bg-[#181325] text-zinc-300 rounded-lg p-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-miel transition"
            placeholder="Ingrese código..."
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            autoComplete="off"
            aria-label="Código secreto"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-miel text-[#181325] font-bold transition hover:scale-105 shadow"
          >
            Jugar
          </button>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </form>
      ) : (
        <div className="w-full flex flex-col items-center animate-fadeIn">
          <button
            onClick={() => { setJuegoKey(null); setCodigo('') }}
            className="mb-2 self-start px-3 py-1 rounded bg-miel text-[#22223b] font-bold text-xs shadow hover:scale-105 transition"
          >
            &larr; Cambiar minijuego
          </button>
          <JuegoComp />
        </div>
      )}
    </div>
  )
}
