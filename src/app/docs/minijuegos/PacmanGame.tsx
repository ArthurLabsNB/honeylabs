'use client'
import { useState, useRef, useEffect } from 'react'
// @ts-ignore
import { Loop, Stage, World } from 'react-game-kit'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { create } from 'zustand'

// ========== RANKING GLOBAL (con zustand + swr) ==========
const fetcher = (url: string) => fetch(url).then(r => r.json())
const useScoreStore = create((set: any) => ({
  highScore: 0,
  setHighScore: (score: number) => set({ highScore: score }),
}))

// ========== MATRIZ DEL LABERINTO ==========
const LABS_MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,1,1,2,1,2,1,2,0,1,1,2,0,1,2,0,1],
  [1,2,1,0,1,1,2,1,2,1,2,0,1,1,2,0,1,2,0,1],
  [1,2,0,0,1,1,2,1,2,1,2,0,1,1,2,0,1,2,0,1],
  [1,1,1,0,1,1,2,1,2,1,2,0,1,1,2,0,1,2,0,1],
  [1,0,0,0,1,1,2,0,2,0,2,0,1,1,2,0,1,2,0,1],
  [1,0,1,0,1,1,2,1,2,1,2,0,1,1,2,0,1,2,0,1],
  [1,0,0,0,1,1,2,1,2,1,2,0,1,1,2,0,1,2,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]
const SIZE = 24

// ========== POSICIÓN INICIAL ==========
const START_POS = { x: 1, y: 1 }

// ========== DIRECCIONES ==========
const DIRS = {
  ArrowUp:    { x:  0, y: -1 },
  ArrowDown:  { x:  0, y:  1 },
  ArrowLeft:  { x: -1, y:  0 },
  ArrowRight: { x:  1, y:  0 },
}

// ========== PACMAN SPRITE ==========
function PacmanSprite({ x, y, direction, mouthOpen }: { x: number, y: number, direction: string, mouthOpen: boolean }) {
  let rotate = 0
  if (direction === 'ArrowUp') rotate = -90
  if (direction === 'ArrowDown') rotate = 90
  if (direction === 'ArrowLeft') rotate = 180
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x * SIZE,
        top: y * SIZE,
        width: SIZE,
        height: SIZE,
        zIndex: 2,
        pointerEvents: 'none',
      }}
      animate={{ rotate }}
      transition={{ type: "tween", duration: 0.08 }}
    >
      <svg width={SIZE} height={SIZE} viewBox="0 0 24 24">
        <motion.path
          d={
            mouthOpen
              ? "M12,12 L24,6 A12,12 0 1,1 24,18 Z"
              : "M12,12 L24,10 A12,12 0 1,1 24,14 Z"
          }
          fill="#ffe066"
          stroke="#ffd23b"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 0.28 }}
        />
        <circle cx="16" cy="9" r="1.2" fill="#22223b" />
      </svg>
    </motion.div>
  )
}

function MazeBoard({ maze, pos, mouthOpen, direction }: any) {
  return (
    <div
      style={{
        width: `${maze[0].length * SIZE}px`,
        height: `${maze.length * SIZE}px`,
        background: '#181325',
        borderRadius: 12,
        position: 'relative',
        boxShadow: '0 6px 24px #0007, 0 0 0 2px #ffd23b33',
      }}
      className="select-none"
    >
      {maze.map((row: number[], y: number) =>
        row.map((cell: number, x: number) => (
          <div
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: x * SIZE,
              top: y * SIZE,
              width: SIZE,
              height: SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            {cell === 1 && (
              <div className="bg-[#373353] rounded"
                style={{ width: SIZE-4, height: SIZE-4, boxShadow: 'inset 0 0 4px #000a' }}
              />
            )}
            {cell === 2 && (
              <motion.div
                className="rounded-full bg-miel mx-auto"
                style={{ width: 8, height: 8, boxShadow: '0 0 4px #ffd23b99' }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        ))
      )}
      <PacmanSprite x={pos.x} y={pos.y} mouthOpen={mouthOpen} direction={direction} />
    </div>
  )
}

// ========== COMPONENTE PRINCIPAL ==========
export default function PacmanGame() {
  const [maze, setMaze] = useState(LABS_MAZE.map(row => [...row]))
  const [pos, setPos] = useState(START_POS)
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(true)
  const [mouthOpen, setMouthOpen] = useState(true)
  const [direction, setDirection] = useState<'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'>('ArrowRight')
  const [submitError, setSubmitError] = useState('')
  const boardRef = useRef<HTMLDivElement>(null)

  // --- MOVIMIENTO & COMIDA ---
  useEffect(() => {
    if (!running) return
    const handle = (e: KeyboardEvent) => {
      if (!(e.key in DIRS)) return
      e.preventDefault()
      setDirection(e.key as any)
      const { x, y } = pos
      const nx = x + DIRS[e.key as keyof typeof DIRS].x
      const ny = y + DIRS[e.key as keyof typeof DIRS].y
      if (maze[ny]?.[nx] !== 1) {
        setPos({ x: nx, y: ny })
        if (maze[ny][nx] === 2) {
          const newMaze = maze.map(r => [...r])
          newMaze[ny][nx] = 0
          setMaze(newMaze)
          setScore(s => s + 10)
        }
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [pos, maze, running])

  // --- ANIMACIÓN DE BOCA ---
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => setMouthOpen(m => !m), 120)
    return () => clearInterval(interval)
  }, [running])

  // --- VICTORIA Y RANKING ---
  useEffect(() => {
    if (maze.flat().filter(v => v === 2).length === 0 && running) {
      setRunning(false)
      // Guardar en ranking solo si hay score > 0 y endpoint disponible
      if (score > 0) {
        fetch('/api/pacman/score', {
          method: 'POST',
          body: JSON.stringify({ score }),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(async res => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            setSubmitError(data?.error || 'Error al guardar tu puntaje.')
          }
        })
        .catch(() => setSubmitError('No se pudo conectar al servidor de ranking.'))
      }
    }
  }, [maze, running, score])

  // --- REINICIO ---
  const restart = () => {
    setMaze(LABS_MAZE.map(row => [...row]))
    setPos(START_POS)
    setScore(0)
    setDirection('ArrowRight')
    setRunning(true)
    setSubmitError('')
  }

  // --- RANKING (opcional) ---
  const { data: ranking, error: rankingError } = useSWR('/api/pacman/ranking', fetcher)

  // --- Foco inicial ---
  useEffect(() => { boardRef.current?.focus() }, [])

  return (
    <Loop>
      <Stage
        width={maze[0].length * SIZE}
        height={maze.length * SIZE}
        style={{
          background: '#181325',
          borderRadius: 12,
          boxShadow: '0 6px 24px #0007, 0 0 0 2px #ffd23b33',
          position: 'relative',
        }}
      >
        <World>
          <div
            ref={boardRef}
            tabIndex={0}
            style={{
              width: maze[0].length * SIZE,
              height: maze.length * SIZE,
              outline: 'none',
              position: 'relative',
            }}
            onClick={() => boardRef.current?.focus()}
          >
            <MazeBoard maze={maze} pos={pos} mouthOpen={mouthOpen} direction={direction} />
          </div>
        </World>
      </Stage>
      <div className="flex flex-col items-center mt-3">
        <span className="text-miel font-bold">Puntaje: {score}</span>
        {!running && (
          <motion.span
            className="text-green-400 font-bold animate-bounce"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            ¡Victoria!
          </motion.span>
        )}
        <button
          onClick={restart}
          className="mt-2 px-4 py-1 bg-miel text-[#22223b] font-bold rounded shadow hover:scale-105 transition"
        >
          Reiniciar
        </button>
        <p className="mt-2 text-zinc-400 text-xs">
          Usa las flechas para mover a Pac-Man.<br />
          Come todos los puntos miel para ganar.
        </p>
        {/* Ranking Global */}
        <div className="w-full mt-2">
          <h4 className="text-sm text-miel mb-1 font-bold">Ranking 🏆</h4>
          {rankingError && (
            <span className="text-red-500 text-xs">Error al cargar ranking.</span>
          )}
          <ul>
            {ranking?.top?.length ? ranking.top.map((item: any, i: number) => (
              <li key={i} className="flex items-center py-1">
                <span className="mr-2 font-bold">{i + 1}.</span>
                <span className="mr-2">{item.usuario?.nombre || "Anónimo"}</span>
                <span className="ml-auto font-bold text-miel">{item.puntaje}</span>
              </li>
            )) : !rankingError && (
              <li className="text-xs text-zinc-400">Cargando...</li>
            )}
          </ul>
          {submitError && (
            <div className="text-xs text-red-500 mt-2">{submitError}</div>
          )}
        </div>
      </div>
    </Loop>
  )
}
