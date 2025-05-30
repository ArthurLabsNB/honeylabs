'use client'
import { useEffect, useRef, useState } from 'react'

// ========== MATRIZ DEL LABERINTO "LABS" ==========
// 0: camino, 1: muro, 2: punto
const LABS_MAZE = [
  // L   A   B   S   (cada bloque son 5x5)
  // 20 cols x 15 rows aprox
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

// ========== POSICIÓN INICIAL ==========
const START_POS = { x: 1, y: 1 }

const SIZE = 24 // px por celda

// ========== DIRECCIONES ==========
const DIRS = {
  ArrowUp:    { x:  0, y: -1 },
  ArrowDown:  { x:  0, y:  1 },
  ArrowLeft:  { x: -1, y:  0 },
  ArrowRight: { x:  1, y:  0 },
}

export default function PacmanGame() {
  const [pos, setPos] = useState(START_POS)
  const [maze, setMaze] = useState(LABS_MAZE.map(row => [...row])) // Copia profunda
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(true)
  const boardRef = useRef<HTMLDivElement>(null)

  // ========== MOVIMIENTO ==========
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (!running) return
      const dir = DIRS[e.key as keyof typeof DIRS]
      if (!dir) return
      const nx = pos.x + dir.x
      const ny = pos.y + dir.y
      if (maze[ny]?.[nx] !== 1) {
        // Comer punto
        if (maze[ny][nx] === 2) {
          const newMaze = maze.map(r => [...r])
          newMaze[ny][nx] = 0
          setMaze(newMaze)
          setScore(s => s + 10)
        }
        setPos({ x: nx, y: ny })
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [pos, maze, running])

  // ========== VICTORIA ==========
  useEffect(() => {
    if (maze.flat().filter(v => v === 2).length === 0) {
      setRunning(false)
    }
  }, [maze])

  // ========== REINICIO ==========
  function restart() {
    setMaze(LABS_MAZE.map(row => [...row]))
    setPos(START_POS)
    setScore(0)
    setRunning(true)
  }

  // ========== RENDER ==========
  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-xl font-bold text-miel mb-2">¡Pac-Man LABS!</h3>
      <div
        ref={boardRef}
        tabIndex={0}
        style={{
          outline: 'none',
          width: `${LABS_MAZE[0].length * SIZE}px`,
          height: `${LABS_MAZE.length * SIZE}px`,
          background: '#161313',
          borderRadius: 12,
          position: 'relative',
          boxShadow: '0 6px 24px #0007, 0 0 0 2px #ffd23b33'
        }}
        className="mb-2 grid"
        onClick={() => boardRef.current?.focus()}
      >
        {/* Render cells */}
        {maze.map((row, y) => row.map((cell, x) => (
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
              justifyContent: 'center'
            }}
          >
            {cell === 1 && (
              <div className="bg-[#373353] rounded" style={{ width: SIZE-4, height: SIZE-4, boxShadow: 'inset 0 0 4px #000a' }} />
            )}
            {cell === 2 && (
              <div className="rounded-full bg-miel mx-auto" style={{ width: 8, height: 8, boxShadow: '0 0 4px #ffd23b99' }} />
            )}
            {/* Pacman */}
            {pos.x === x && pos.y === y && (
              <div style={{
                width: SIZE-6,
                height: SIZE-6,
                background: 'radial-gradient(circle at 65% 35%, #fffbe7 85%, #ffd23b 100%)',
                borderRadius: '50%',
                boxShadow: '0 0 8px #ffd23b99',
                position: 'absolute'
              }}>
                {/* Puedes añadir una "boca" SVG si quieres */}
              </div>
            )}
          </div>
        )))}
      </div>
      <div className="flex gap-6 items-center mb-2">
        <span className="text-miel font-bold">Puntaje: {score}</span>
        {!running && (
          <span className="text-green-400 font-bold animate-bounce">¡Victoria!</span>
        )}
      </div>
      <button
        onClick={restart}
        className="mt-1 px-4 py-1 bg-miel text-[#22223b] font-bold rounded shadow hover:scale-105 transition"
      >
        Reiniciar
      </button>
      <p className="mt-2 text-zinc-400 text-xs">
        Usa las flechas para mover a Pac-Man.<br />
        Come todos los puntos miel para ganar.
      </p>
    </div>
  )
}
