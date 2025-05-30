'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// =========== MATRIZ CLÁSICA PACMAN (28 x 31) ===========
// 0 = vacío/túnel, 1 = pared, 2 = punto, 3 = power pellet, 4 = puerta/jaula fantasmas
const PACMAN_MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,2,2,2,2,2,2,2,2,2,1,1,2,2,1,1,2,2,2,2,2,2,2,2,2,3,1],
  [1,2,1,1,1,1,2,1,1,1,2,1,1,2,2,1,1,2,1,1,1,1,2,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,2,1,1,2,2,1,1,2,1,1,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,1],
  [1,2,2,2,2,2,2,1,2,2,2,1,1,2,2,1,1,2,2,2,2,1,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,1,2,1,1,2,2,1,1,2,1,1,1,1,2,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,1,2,1,1,2,2,1,1,2,1,1,1,1,2,1,0,0,0,0],
  [1,1,1,1,0,1,2,2,2,2,2,1,1,2,2,1,1,2,2,2,2,1,2,1,1,1,1,1],
  [1,1,1,1,0,1,2,1,1,1,2,1,1,4,4,1,1,2,1,1,1,1,2,1,1,1,1,1],
  [1,1,1,1,0,1,2,1,1,1,2,1,1,4,4,1,1,2,1,1,1,1,2,1,1,1,1,1],
  [1,1,1,1,0,1,2,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,2,1,1,2,2,1,1,2,1,1,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,2,2,2,1,1,2,2,1,1,2,2,2,2,1,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,2,2,2,1,1,2,2,1,1,2,2,2,2,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,1,2,1,1,2,2,1,1,2,1,1,1,1,1,1,1,1,1,1],
  [1,3,2,2,2,2,2,2,2,2,2,1,1,2,2,1,1,2,2,2,2,2,2,2,2,2,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const DIRS = {
  ArrowUp:    { x:  0, y: -1 },
  ArrowDown:  { x:  0, y:  1 },
  ArrowLeft:  { x: -1, y:  0 },
  ArrowRight: { x:  1, y:  0 },
  w:          { x:  0, y: -1 },
  s:          { x:  0, y:  1 },
  a:          { x: -1, y:  0 },
  d:          { x:  1, y:  0 }
}
const START_POS = { x: 13, y: 17 }
const SIZE_BASE = 20 // Cambia esto para escalar el tamaño del tablero

type Ghost = { x: number, y: number, dir: keyof typeof DIRS, scatter?: boolean }

function randomDir() {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
  return keys[Math.floor(Math.random() * keys.length)] as keyof typeof DIRS
}

function nextGhostMove(ghost: Ghost, maze: number[][], pacman: {x:number,y:number}): Ghost {
  let scatter = ghost.scatter || false
  if (Math.random() < 0.03) scatter = !scatter
  const choices: [keyof typeof DIRS, number][] = []
  for (const key of ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'] as const) {
    const nx = ghost.x + DIRS[key].x
    const ny = ghost.y + DIRS[key].y
    if (maze[ny]?.[nx] !== 1 && maze[ny]?.[nx] !== undefined) {
      let dist = Math.abs(nx - pacman.x) + Math.abs(ny - pacman.y)
      if (scatter) dist = 999 - dist
      choices.push([key, dist])
    }
  }
  if (!choices.length) return ghost
  choices.sort((a, b) => a[1] - b[1])
  const goBest = Math.random() < 0.7
  const move = goBest ? choices[0][0] : choices[Math.floor(Math.random()*choices.length)][0]
  const nx = ghost.x + DIRS[move].x
  const ny = ghost.y + DIRS[move].y
  return { ...ghost, x: nx, y: ny, dir: move, scatter }
}

function PacmanSprite({ x, y, mouthOpen, direction, size }: { x: number, y: number, mouthOpen: boolean, direction: string, size:number }) {
  let rotate = 0
  if (direction === 'ArrowUp') rotate = -90
  if (direction === 'ArrowDown') rotate = 90
  if (direction === 'ArrowLeft') rotate = 180
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x * size,
        top: y * size,
        width: size, height: size, zIndex: 2, pointerEvents: 'none',
      }}
      animate={{ rotate }}
      transition={{ type: "tween", duration: 0.08 }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <motion.path
          d={mouthOpen
            ? "M12,12 L24,6 A12,12 0 1,1 24,18 Z"
            : "M12,12 L24,10 A12,12 0 1,1 24,14 Z"
          }
          fill="#ffe066"
          stroke="#ffd23b"
          animate={{ rotate: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 0.22 }}
        />
        <circle cx="16" cy="9" r="1.6" fill="#22223b" />
      </svg>
    </motion.div>
  )
}
function GhostSprite({ x, y, color, size }: { x: number, y: number, color: string, size:number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x * size,
        top: y * size,
        width: size, height: size, zIndex: 2, pointerEvents: 'none'
      }}
      animate={{ scale: [1, 1.12, 1], y: [0, 2, 0] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M4 20 L4 8 Q12 1, 20 8 L20 20 Q18 18, 16 20 Q14 18, 12 20 Q10 18, 8 20 Q6 18, 4 20 Z" fill={color} />
        <circle cx="8.5" cy="12" r="2" fill="#fff" />
        <circle cx="15.5" cy="12" r="2" fill="#fff" />
        <circle cx="9" cy="12" r="1" fill="#222" />
        <circle cx="16" cy="12" r="1" fill="#222" />
      </svg>
    </motion.div>
  )
}
function MazeBoard({ maze, pos, ghosts, mouthOpen, direction, size }: any) {
  // Calcula dimensiones responsivas
  return (
    <div
      style={{
        width: `${maze[0].length * size}px`,
        height: `${maze.length * size}px`,
        background: '#181325',
        borderRadius: 18,
        position: 'relative',
        boxShadow: '0 6px 24px #0007, 0 0 0 2px #0098ff66',
        touchAction: 'none',
        overflow: 'hidden',
        margin: '0 auto',
      }}
      className="select-none"
    >
      {/* Render de paredes (bordes azules con fondo) */}
      {maze.map((row: number[], y: number) =>
        row.map((cell: number, x: number) => (
          <div
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: x * size,
              top: y * size,
              width: size,
              height: size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              boxSizing: 'border-box',
            }}
          >
            {cell === 1 && (
              <div style={{
                width: size-2,
                height: size-2,
                background: '#181c2f',
                border: `2px solid #00b8ff`,
                borderRadius: 8,
                boxShadow: 'inset 0 0 6px #0090eecc, 0 0 2px #0090eeaa'
              }}/>
            )}
            {cell === 2 && (
              <motion.div
                style={{
                  width: size > 16 ? 5 : 4,
                  height: size > 16 ? 5 : 4,
                  background: '#ffe066',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px #ffe066aa'
                }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
            )}
            {cell === 3 && (
              <motion.div
                style={{
                  width: size > 16 ? 12 : 8,
                  height: size > 16 ? 12 : 8,
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 0 12px #ffe066dd'
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
            )}
            {cell === 4 && (
              <div style={{
                width: size-8,
                height: 5,
                marginTop: size/2-2,
                background: '#2bdcff',
                borderRadius: 2,
                boxShadow: '0 0 8px #2bdcff77',
              }}/>
            )}
          </div>
        ))
      )}
      <PacmanSprite x={pos.x} y={pos.y} mouthOpen={mouthOpen} direction={direction} size={size} />
      {ghosts.map((g: Ghost, i: number) => (
        <GhostSprite key={i} x={g.x} y={g.y} color={["#e94f4f", "#44c8ff", "#fcbf49", "#c08cff"][i % 4]} size={size} />
      ))}
    </div>
  )
}

// ========== PRINCIPAL ==========
export default function PacmanGame() {
  // Escalado responsivo (mobile/tablet)
  const [size, setSize] = useState(SIZE_BASE)
  useEffect(() => {
    function calcSize() {
      const ww = window.innerWidth
      // Resta margen para mobile y mantén el juego lo más grande posible pero visible
      let s = Math.floor(Math.min(ww*0.96/(PACMAN_MAZE[0].length), window.innerHeight*0.72/(PACMAN_MAZE.length)))
      s = Math.max(14, Math.min(s, 36))
      setSize(s)
    }
    calcSize()
    window.addEventListener('resize', calcSize)
    return () => window.removeEventListener('resize', calcSize)
  }, [])

  const [maze, setMaze] = useState(PACMAN_MAZE.map(row => [...row]))
  const [pos, setPos] = useState({ ...START_POS })
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(true)
  const [mouthOpen, setMouthOpen] = useState(true)
  const [direction, setDirection] = useState<keyof typeof DIRS>('ArrowRight')
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { x: 13, y: 9, dir: randomDir() },
    { x: 14, y: 9, dir: randomDir() }
  ])
  const [gameOver, setGameOver] = useState(false)
  const [touchStart, setTouchStart] = useState<{x:number,y:number}|null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  // MOVIMIENTO PACMAN
  useEffect(() => {
    if (!running) return
    const handle = (e: KeyboardEvent) => {
      const k = e.key in DIRS ? e.key : e.key.toLowerCase()
      if (!(k in DIRS)) return
      e.preventDefault()
      let nx = pos.x + DIRS[k as keyof typeof DIRS].x
      let ny = pos.y + DIRS[k as keyof typeof DIRS].y

      // Warp/túneles laterales
      if (ny === 8 && nx < 0) nx = PACMAN_MAZE[0].length - 1
      if (ny === 8 && nx >= PACMAN_MAZE[0].length) nx = 0

      if (maze[ny]?.[nx] !== 1 && maze[ny]?.[nx] !== undefined) {
        setPos({ x: nx, y: ny })
        setDirection(k as keyof typeof DIRS)
        // Comer punto
        if (maze[ny][nx] === 2 || maze[ny][nx] === 3) {
          const newMaze = maze.map(r => [...r])
          newMaze[ny][nx] = 0
          setMaze(newMaze)
          setScore(s => s + (maze[ny][nx] === 3 ? 50 : 10))
        }
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [pos, maze, running])

  // MOBILE: Swipes
  useEffect(() => {
    const el = boardRef.current
    if (!el) return
    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
    function handleTouchEnd(e: TouchEvent) {
      if (!touchStart) return
      const dx = e.changedTouches[0].clientX - touchStart.x
      const dy = e.changedTouches[0].clientY - touchStart.y
      setTouchStart(null)
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return
      let move: keyof typeof DIRS | null = null
      if (Math.abs(dx) > Math.abs(dy)) move = dx > 0 ? 'ArrowRight' : 'ArrowLeft'
      else move = dy > 0 ? 'ArrowDown' : 'ArrowUp'
      let nx = pos.x + (move ? DIRS[move].x : 0)
      let ny = pos.y + (move ? DIRS[move].y : 0)
      // Warp
      if (ny === 8 && nx < 0) nx = PACMAN_MAZE[0].length - 1
      if (ny === 8 && nx >= PACMAN_MAZE[0].length) nx = 0

      if (move && maze[ny]?.[nx] !== 1 && maze[ny]?.[nx] !== undefined) {
        setPos({ x: nx, y: ny })
        setDirection(move)
        // Comer punto
        if (maze[ny][nx] === 2 || maze[ny][nx] === 3) {
          const newMaze = maze.map(r => [...r])
          newMaze[ny][nx] = 0
          setMaze(newMaze)
          setScore(s => s + (maze[ny][nx] === 3 ? 50 : 10))
        }
      }
    }
    el.addEventListener('touchstart', handleTouchStart)
    el.addEventListener('touchend', handleTouchEnd)
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pos, maze, running, touchStart])

  // Animación boca
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => setMouthOpen(m => !m), 100)
    return () => clearInterval(interval)
  }, [running])

  // Fantasmas IA
  useEffect(() => {
    if (!running || gameOver) return
    const interval = setInterval(() => {
      setGhosts(gs =>
        gs.map(g => nextGhostMove(g, maze, pos))
      )
    }, 240)
    return () => clearInterval(interval)
  }, [maze, pos, running, gameOver])

  // Colisión Pacman/fantasma
  useEffect(() => {
    if (!running) return
    for (const g of ghosts) {
      if (g.x === pos.x && g.y === pos.y) {
        setGameOver(true)
        setRunning(false)
      }
    }
    // Victoria
    if (maze.flat().every(c => c !== 2 && c !== 3)) {
      setRunning(false)
    }
  }, [ghosts, pos, maze, running])

  // REINICIO
  const restart = () => {
    setMaze(PACMAN_MAZE.map(row => [...row]))
    setPos({ ...START_POS })
    setScore(0)
    setDirection('ArrowRight')
    setRunning(true)
    setGhosts([
      { x: 13, y: 9, dir: randomDir() },
      { x: 14, y: 9, dir: randomDir() }
    ])
    setGameOver(false)
  }

  // Foco teclado
  useEffect(() => { boardRef.current?.focus() }, [])

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-xl font-bold text-miel mb-2">¡Pac-Man LABS!</h3>
      <div
        ref={boardRef}
        tabIndex={0}
        style={{
          outline: 'none',
          width: `${PACMAN_MAZE[0].length * size}px`,
          height: `${PACMAN_MAZE.length * size}px`,
          background: '#111117',
          borderRadius: 18,
          position: 'relative',
          boxShadow: '0 6px 24px #0007, 0 0 0 2px #0098ff66',
          touchAction: 'none',
          margin: '0 auto'
        }}
        className="mb-2 grid"
        onClick={() => boardRef.current?.focus()}
      >
        <MazeBoard maze={maze} pos={pos} ghosts={ghosts} mouthOpen={mouthOpen} direction={direction} size={size} />
      </div>
      <div className="flex gap-6 items-center mb-2">
        <span className="text-miel font-bold">Puntaje: {score}</span>
        {!running && !gameOver && (
          <span className="text-green-400 font-bold animate-bounce">¡Victoria!</span>
        )}
        {gameOver && (
          <span className="text-red-400 font-bold animate-bounce">Game Over</span>
        )}
      </div>
      <button
        onClick={restart}
        className="mt-1 px-4 py-1 bg-miel text-[#22223b] font-bold rounded shadow hover:scale-105 transition"
      >
        Reiniciar
      </button>
      <p className="mt-2 text-zinc-400 text-xs text-center">
        Usa flechas o WASD para mover a Pac-Man.<br />
        Compatible con móvil (desliza para mover).<br />
        ¡Evita a los fantasmas y come todos los puntos!
      </p>
    </div>
  )
}
