import SnakeGame from './minijuegos/SnakeGame'
const MINIJUEGOS: Record<string, React.FC<any>> = {
  PACMAN: PacmanGame,
  TETRIS01: TetrisGame,
  SNAKE: SnakeGame, // Nuevo juego
  // ...
}
