'use client'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PacmanGame from './minijuegos/PacmanGame'
import TetrisGame from './minijuegos/TetrisGame'
// Aquí importas los nuevos juegos cuando los crees
// import MarioGame from './minijuegos/MarioGame'
// import SnakeGame from './minijuegos/SnakeGame'
// etc.

const MINIJUEGOS: Record<string, React.FC<any>> = {
  PACMAN: PacmanGame,
  TETRIS01: TetrisGame,
  // MARIO: MarioGame,
  // SNAKE: SnakeGame,
  // ...etc.
}

export default function MinijuegoLoader() {
  const [codigo, setCodigo] = useState('')
  const [juegoKey, setJuegoKey] = useState<string | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Enfoca el input automáticamente cuando no hay minijuego seleccionado
  useEffect(() => {
    if (!juegoKey && inputRef.current) {
      inputRef.current.focus()
    }
  }, [juegoKey])

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
    <div className="flex flex-col items-center justify-center min-h-64 rounded-xl bg-[#19171f] shadow-lg p-2">
      <AnimatePresence>
        {!JuegoComp ? (
          <motion.form
            key="panel-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", duration: 0.38 }}
            onSubmit={handleSubmit}
            className="w-full max-w-xs flex flex-col items-center gap-4"
          >
            <motion.input
              ref={inputRef}
              className="border border-zinc-700 bg-[#181325] text-zinc-300 rounded-lg p-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-miel transition"
              placeholder="Ingrese código..."
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              autoComplete="off"
              aria-label="Código secreto"
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px #ffe06688" }}
            />
            <motion.button
              type="submit"
              className="px-4 py-2 rounded bg-miel text-[#181325] font-bold transition hover:scale-105 shadow"
              whileHover={{ scale: 1.08 }}
            >
              Jugar
            </motion.button>
            {error && (
              <motion.p
                className="text-red-400 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="panel-juego"
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", duration: 0.38 }}
            className="w-full flex flex-col items-center"
          >
            <button
              onClick={() => { setJuegoKey(null); setCodigo('') }}
              className="mb-2 self-start px-3 py-1 rounded bg-miel text-[#22223b] font-bold text-xs shadow hover:scale-105 transition"
            >
              &larr; Cambiar minijuego
            </button>
            <JuegoComp />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
