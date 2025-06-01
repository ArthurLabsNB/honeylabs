'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ================== MATRIZ FIEL PACMAN ARCADE ==================
const MAZE = [
  // 0: vacío/túnel, 1: pared, 2: punto, 3: power pellet, 4: puerta jaula
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,1,2,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,3,1],
  [1,2,1,1,1,2,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,2,2,1,2,2,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,2,2,2,1],
  [1,1,1,1,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1,1,1,1],
  [1,1,1,1,2,1,1,1,2,2,2,1,1,4,1,1,2,2,2,1,1,1,2,1,1,1,1],
  [0,2,2,2,2,1,1,1,2,1,2,1,2,2,2,1,2,1,2,1,1,1,2,2,2,2,0],
  [1,1,1,1,2,1,1,1,2,1,2,1,2,2,2,1,2,1,2,1,1,1,2,1,1,1,1],
  [1,1,1,1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,1,1,2,1],
  [1,3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1],
  [1,1,1,2,1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1,2,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const MAZE_W = MAZE[0].length, MAZE_H = MAZE.length;
const CELL_SIZE = 20;
const PACMAN_SPEED = 130;    // Más fluido
const GHOST_SPEED = 110;
const INITIAL_LIVES = 3;

const DIRS = {
  w: { x:  0, y: -1 },
  s: { x:  0, y:  1 },
  a: { x: -1, y:  0 },
  d: { x:  1, y:  0 }
};
type DirKey = keyof typeof DIRS;
const DIR_KEYS: DirKey[] = ["w","a","s","d"];
function reverseDir(dir: DirKey): DirKey {
  if (dir === "w") return "s";
  if (dir === "s") return "w";
  if (dir === "a") return "d";
  if (dir === "d") return "a";
  return dir;
}
function warp(x: number, y: number) {
  if (y === 8 && x < 0) return { x: MAZE_W-1, y };
  if (y === 8 && x >= MAZE_W) return { x: 0, y };
  return { x, y };
}
function dist(a: {x:number,y:number}, b:{x:number,y:number}) {
  return Math.abs(a.x-b.x) + Math.abs(a.y-b.y);
}
function randInt(n: number) { return Math.floor(Math.random()*n); }

const GHOST_COLORS = ["#e94f4f", "#44c8ff", "#febd39", "#a274f7"];
const GHOST_NAMES = ["Blinky", "Pinky", "Inky", "Clyde"];
const FANTASY_MESSAGES = [
  "¡Hoy sí te atrapo!", "¿Eso es todo?", "Corre, cobarde...", "Ñam Ñam...",
  "¡No eres rival!", "¿Otra vuelta más?", "Mira mamá, ¡sin manos!", "¿Tienes miedo?",
  "Glub glub...", "PacMan, ¿te perdiste?", "Mi turno de comer", "Me aburro..."
];
const GHOST_BEHAVIOR = [
  (g: Ghost, p: any, gs: Ghost[]) => ({ tx: p.x, ty: p.y }),
  (g: Ghost, p: any, gs: Ghost[], pd: DirKey) => {
    const d = DIRS[pd]; return { tx: p.x + 4*d.x, ty: p.y + 4*d.y };
  },
  (g: Ghost, p: any, gs: Ghost[], pd: DirKey) => {
    const b = gs[0] || p; const d = DIRS[pd];
    return { tx: p.x + 2*d.x + (p.x - b.x), ty: p.y + 2*d.y + (p.y - b.y) };
  },
  (g: Ghost, p: any) => {
    if (dist(g, p) < 8) return { tx: 1, ty: MAZE_H-2 };
    return { tx: p.x, ty: p.y };
  }
];
type Ghost = {
  x:number, y:number, dir:DirKey, color:string, name:string, vulnerable:boolean, 
  message?:string, msgTimeout?:number, scatter?:boolean, home?:boolean
};

function nextGhostMove(
  ghost: Ghost, ghosts: Ghost[], maze: number[][], pacman: {x:number, y:number, dir:DirKey},
  vulnerable: boolean
): Ghost {
  if (!ghost.message && Math.random() < 0.018) {
    ghost.message = FANTASY_MESSAGES[randInt(FANTASY_MESSAGES.length)];
    ghost.msgTimeout = Date.now() + randInt(2000)+1200;
  }
  if (ghost.message && Date.now() > (ghost.msgTimeout||0)) ghost.message = "";

  let { tx, ty } = GHOST_BEHAVIOR[GHOST_NAMES.indexOf(ghost.name)]?.(ghost, pacman, ghosts, pacman.dir) ?? { tx: pacman.x, ty: pacman.y };
  if (vulnerable || ghost.scatter || Math.random() < 0.05) {
    tx = randInt(MAZE_W-2)+1; ty = Math.random()<.5?1:MAZE_H-2;
    if (Math.random()<.5) tx = 1;
    ghost.scatter = true;
  } else {
    ghost.scatter = false;
  }
  let options = DIR_KEYS.map(dk => {
    const nx = ghost.x + DIRS[dk].x, ny = ghost.y + DIRS[dk].y;
    if (
      maze[ny]?.[nx] !== 1 &&
      (maze[ny]?.[nx] !== undefined) &&
      !(reverseDir(ghost.dir) === dk && randInt(5)<4)
    ) {
      const { x, y } = warp(nx, ny);
      return { dk, dist: Math.hypot(x-tx, y-ty) + Math.random()*0.2 };
    }
    return null;
  }).filter(Boolean) as { dk: DirKey, dist: number }[];
  if (!options.length) return ghost;
  options.sort((a, b) => a.dist - b.dist);
  const move = options[0].dk;
  const { x, y } = warp(ghost.x + DIRS[move].x, ghost.y + DIRS[move].y);
  return { ...ghost, x, y, dir: move, scatter: ghost.scatter, message: ghost.message, msgTimeout: ghost.msgTimeout };
}

// Pacman moderno (más redondo, boca animada)
function PacmanSprite({ x, y, mouthOpen, direction, size }: { x: number, y: number, mouthOpen: boolean, direction: string, size:number }) {
  let rotate = 0;
  if (direction === 'w') rotate = -90;
  if (direction === 's') rotate = 90;
  if (direction === 'a') rotate = 180;
  // SVG Pro, redondo y con sombra
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x * size,
        top: y * size,
        width: size, height: size, zIndex: 10, pointerEvents: 'none',
        filter: "drop-shadow(0 0 12px #ffe066cc)"
      }}
      animate={{ rotate }}
      transition={{ type: "tween", duration: 0.5 }}
    >
      <svg width={size} height={size} viewBox="0 0 88 88">
        <motion.path
          d={mouthOpen
            ? "M44,44 L88,22 A36,36 0 1,1 88,66 Z"
            : "M44,244 L88,33 A36,36 0 1,1 88,55 Z"
          }
          fill="#ffe066"
          stroke="#ffd23b"
          strokeWidth="1.4"
          animate={{ rotate: [0, 13, 0] }}
          transition={{ repeat: Infinity, duration: 0.19 }}
        />
        <circle cx="62" cy="32" r="5" fill="#22223b" />
      </svg>
    </motion.div>
  )
}

function GhostSprite({ g, size }: { g: Ghost, size:number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: g.x * size,
        top: g.y * size,
        width: size, height: size, zIndex: 9, pointerEvents: 'none',
        filter: g.vulnerable ? "brightness(1.5) blur(0.5px)" : "none"
      }}
      animate={{ scale: [1, 1.14, 1], y: [0, 2, 0] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M4 20 L4 8 Q12 1, 20 8 L20 20 Q18 18, 16 20 Q14 18, 12 20 Q10 18, 8 20 Q6 18, 4 20 Z"
          fill={g.vulnerable ? "#fff" : g.color} stroke={g.vulnerable ? "#70cfff" : "#222"} strokeWidth="1.2"/>
        <circle cx="8.5" cy="12" r="2" fill="#fff" />
        <circle cx="15.5" cy="12" r="2" fill="#fff" />
        <circle cx="9" cy="12" r="1" fill="#222" />
        <circle cx="16" cy="12" r="1" fill="#222" />
        {g.vulnerable && (
          <ellipse cx="12" cy="17" rx="4" ry="1.5" fill="#70cfff" />
        )}
      </svg>
      <AnimatePresence>
      {g.message && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale:0.95 }}
          animate={{ opacity: 1, y: -8, scale:1 }}
          exit={{ opacity: 0, y: 0, scale:0.92 }}
          transition={{ duration: 0.22 }}
          style={{
            position: "absolute", left: "50%", top: -18, transform: "translateX(-50%)",
            minWidth: 38, fontSize: 11, background: "#fff", color: "#333", borderRadius: 6,
            padding: "2px 7px", boxShadow: "0 1px 6px #0002", pointerEvents: "none", fontFamily: "Nunito, sans-serif", fontWeight: 700,
            border: "1.5px solid #ffe066"
          }}>
          {g.message}
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  )
}

function MazeBoard({ maze, pos, ghosts, mouthOpen, direction, size }: any) {
  return (
    <div
      style={{
        width: `${maze[0].length * size}px`,
        height: `${maze.length * size}px`,
        background: '#181325',
        borderRadius: 22,
        position: 'relative',
        boxShadow: '0 6px 24px #0009, 0 0 0 2px #ffd23b77',
        touchAction: 'none',
        overflow: 'hidden',
        margin: '0 auto',
        border: "4px solid #ffe06655",
        filter: "blur(0.5px) contrast(1.05)"
      }}
      className="select-none"
    >
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
              zIndex: 1,
              boxSizing: 'border-box',
            }}
          >
            {cell === 1 && (
              <div style={{
                width: size-3,
                height: size-3,
                background: '#171c2c',
                border: `2.5px solid #ffe066bb`,
                borderRadius: 8,
                boxShadow: 'inset 0 0 10px #ffe066aa, 0 0 3px #ffe06666'
              }}/>
            )}
            {cell === 2 && (
              <motion.div
                style={{
                  width: size > 20 ? 8 : 6,
                  height: size > 20 ? 8 : 6,
                  background: '#ffe066',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px #ffe066cc'
                }}
                animate={{ scale: [1, 1.26, 1] }}
                transition={{ duration: 0.67, repeat: Infinity }}
              />
            )}
            {cell === 3 && (
              <motion.div
                style={{
                  width: size > 18 ? 15 : 10,
                  height: size > 18 ? 15 : 10,
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 0 16px #ffe066ee'
                }}
                animate={{ scale: [1, 1.22, 1] }}
                transition={{ duration: 0.64, repeat: Infinity }}
              />
            )}
            {cell === 4 && (
              <div style={{
                width: size-8,
                height: 6,
                marginTop: size/2-3,
                background: '#ffd23b',
                borderRadius: 2,
                boxShadow: '0 0 8px #ffd23baa',
              }}/>
            )}
          </div>
        ))
      )}
      <PacmanSprite x={pos.x} y={pos.y} mouthOpen={mouthOpen} direction={direction} size={size} />
      {ghosts.map((g: Ghost, i: number) => (
        <GhostSprite key={i} g={g} size={size} />
      ))}
    </div>
  );
}

export default function PacmanGamePRO() {
  const [size, setSize] = useState(CELL_SIZE);
  useEffect(() => {
    function calcSize() {
      let s = Math.floor(Math.min(window.innerWidth*0.97/MAZE_W, window.innerHeight*0.8/MAZE_H));
      s = Math.max(18, Math.min(s, 40));
      setSize(s);
    }
    calcSize();
    window.addEventListener('resize', calcSize);
    return () => window.removeEventListener('resize', calcSize);
  }, []);
  const [maze, setMaze] = useState(MAZE.map(row => [...row]));
  const [pos, setPos] = useState({ x: 13, y: 15, dir: "d" as DirKey });
  const [pendingDir, setPendingDir] = useState<DirKey>("d");
  const [mouthOpen, setMouthOpen] = useState(true);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [running, setRunning] = useState(true);
  const [ghosts, setGhosts] = useState<Ghost[]>(GHOST_NAMES.map((name, i) => ({
    x: 13 + (i%2), y: 10 + (i>1?2:0), dir: "w" as DirKey, color: GHOST_COLORS[i], name, vulnerable: false, message:""
  })));
  const [vulnerable, setVulnerable] = useState(false);
  const [vulnerableUntil, setVulnerableUntil] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [touchStart, setTouchStart] = useState<{x:number,y:number}|null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      let nextDir = pendingDir;
      let nx = pos.x + DIRS[nextDir].x, ny = pos.y + DIRS[nextDir].y;
      let {x: wx, y: wy} = warp(nx, ny);
      if (maze[wy]?.[wx] !== 1 && maze[wy]?.[wx] !== undefined) {
        setPos(p => ({ x: wx, y: wy, dir: nextDir }));
        if (maze[wy][wx] === 2 || maze[wy][wx] === 3) {
          const newMaze = maze.map(r=>[...r]);
          if (maze[wy][wx] === 3) {
            setVulnerable(true);
            setVulnerableUntil(Date.now()+7200);
            setGhosts(gs=>gs.map(g=>({ ...g, vulnerable: true })));
          }
          newMaze[wy][wx] = 0;
          setMaze(newMaze);
          setScore(s => s + (maze[wy][wx] === 3 ? 50 : 10));
        }
      } else {
        let prev = pos.dir;
        nx = pos.x + DIRS[prev].x; ny = pos.y + DIRS[prev].y;
        let {x: wx2, y: wy2} = warp(nx, ny);
        if (maze[wy2]?.[wx2] !== 1 && maze[wy2]?.[wx2] !== undefined)
          setPos(p => ({ x: wx2, y: wy2, dir: prev }));
      }
    }, PACMAN_SPEED);
    return () => clearInterval(timer);
  }, [maze, pos, pendingDir, running]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (!running) return;
      const k = e.key.toLowerCase() as DirKey;
      if (DIRS[k]) setPendingDir(k);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [running]);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
    function handleTouchEnd(e: TouchEvent) {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      setTouchStart(null);
      if (Math.abs(dx) < 16 && Math.abs(dy) < 16) return;
      let move: DirKey | null = null;
      if (Math.abs(dx) > Math.abs(dy)) move = dx > 0 ? 'd' : 'a';
      else move = dy > 0 ? 's' : 'w';
      if (move) setPendingDir(move);
    }
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, running]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setMouthOpen(m => !m), 90);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setGhosts(gs => gs.map((g,i) =>
        nextGhostMove(g, gs, maze, pos, vulnerable)
      ));
    }, GHOST_SPEED);
    return () => clearInterval(timer);
  }, [maze, pos, running, vulnerable]);

  useEffect(() => {
    if (!vulnerable) return;
    const left = vulnerableUntil - Date.now();
    if (left > 0) {
      const timer = setTimeout(() => setVulnerable(false), left);
      return () => clearTimeout(timer);
    }
    setVulnerable(false);
    setGhosts(gs => gs.map(g=>({...g, vulnerable: false })));
  }, [vulnerable, vulnerableUntil]);

  useEffect(() => {
    if (!running) return;
    let eaten = -1;
    for (let i=0; i<ghosts.length; ++i) {
      const g = ghosts[i];
      if (g.x === pos.x && g.y === pos.y) {
        if (g.vulnerable) eaten = i;
        else {
          setLives(v => v-1);
          setRunning(false);
          setTimeout(()=>{
            if (lives > 1) {
              setPos({ x: 13, y: 15, dir: "d" });
              setGhosts(GHOST_NAMES.map((name, i) => ({
                x: 13 + (i%2), y: 10 + (i>1?2:0), dir: "w" as DirKey, color: GHOST_COLORS[i], name, vulnerable: false
              })));
              setRunning(true);
            } else {
              setGameOver(true);
            }
          }, 1300);
          return;
        }
      }
    }
    if (eaten>=0) {
      setGhosts(gs =>
        gs.map((gg,j) => j===eaten ? { ...gg, x: 13+(j%2), y: 10+(j>1?2:0), dir: "w", vulnerable:false, home:true } : gg)
      );
      setScore(s=>s+200);
    }
    if (maze.flat().every(c=>c!==2 && c!==3)) {
      setVictory(true);
      setRunning(false);
    }
  }, [ghosts, pos, maze, running, lives]);

  const restart = () => {
    setMaze(MAZE.map(row=>[...row]));
    setPos({ x: 13, y: 15, dir: "d" });
    setPendingDir("d");
    setScore(0);
    setLives(INITIAL_LIVES);
    setRunning(true);
    setGameOver(false);
    setVictory(false);
    setGhosts(GHOST_NAMES.map((name, i) => ({
      x: 13 + (i%2), y: 10 + (i>1?2:0), dir: "w" as DirKey, color: GHOST_COLORS[i], name, vulnerable: false
    })));
    setVulnerable(false);
    setVulnerableUntil(0);
  }

  useEffect(() => { boardRef.current?.focus(); }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-3xl font-extrabold text-yellow-300 drop-shadow mb-2">Pac-Man PRO!</h3>
      <div
        ref={boardRef}
        tabIndex={0}
        style={{
          outline: 'none',
          width: `${MAZE_W * size}px`,
          height: `${MAZE_H * size}px`,
          background: '#181325',
          borderRadius: 22,
          position: 'relative',
          boxShadow: '0 6px 24px #0007, 0 0 0 2px #ffd23b77',
          touchAction: 'none',
          margin: '0 auto',
          transition: "box-shadow .3s"
        }}
        className="mb-2 grid"
        onClick={() => boardRef.current?.focus()}
      >
        <MazeBoard maze={maze} pos={pos} ghosts={ghosts} mouthOpen={mouthOpen} direction={pos.dir} size={size} />
        <AnimatePresence>
        {!running && !gameOver && !victory &&
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale:0.8 }}
            style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
              background: "#000b", borderRadius: 22, zIndex: 19, color: "#ffe066",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 38,
              textShadow: "0 4px 16px #000"
            }}>
            <span>¡Perdiste una vida!</span>
          </motion.div>
        }
        {gameOver &&
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale:0.8 }}
            style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
              background: "#000c", borderRadius: 22, zIndex: 19, color: "#ff3e3e",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 38,
              textShadow: "0 4px 22px #000"
            }}>
            <span>GAME OVER</span>
          </motion.div>
        }
        {victory &&
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0, scale:0.9 }}
            style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
              background: "#ffe066f5", borderRadius: 22, zIndex: 19, color: "#222",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 35,
              textShadow: "0 2px 8px #fff"
            }}>
            <span>¡Victoria! 🎉</span>
          </motion.div>
        }
        </AnimatePresence>
      </div>
      <div className="flex gap-6 items-center mb-2">
        <span className="text-yellow-300 font-bold text-xl">Puntos: {score}</span>
        <span className="text-blue-300 font-bold text-lg">Vidas: {lives}</span>
      </div>
      <button
        onClick={restart}
        className="mt-1 px-6 py-2 bg-yellow-300 text-[#22223b] text-lg font-bold rounded-lg shadow-lg hover:scale-105 transition-all"
      >
        Reiniciar
      </button>
      <p className="mt-2 text-zinc-400 text-xs text-center">
        Usa <b>WASD</b> para moverte.<br />
        ¡Evita a los fantasmas y come todos los puntos!<br />
        Los fantasmas dicen cosas si se aburren... 😈
      </p>
    </div>
  );
}