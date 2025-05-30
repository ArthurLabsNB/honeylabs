'use client'
// Solo estructura, lógica real de Pacman la haremos después
export default function PacmanGame() {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold text-accent mb-2">¡Pac-Man LABS!</h3>
      <div className="bg-black rounded-md w-80 h-80 flex items-center justify-center text-white">
        [ Aquí irá el laberinto con la palabra LABS ]
      </div>
      <p className="mt-2 text-miel">Versión demo. Pronto jugable.</p>
    </div>
  )
}
