-- CreateTable
CREATE TABLE "PuntajePacman" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajePacman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeMario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeMario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeSnake" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "longitud" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeSnake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeTetris" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "lineas" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeTetris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajePingPong" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "rondas" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajePingPong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeBreakout" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeBreakout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeFlappyBee" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "distancia" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeFlappyBee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajeSpaceShooter" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "enemigos" INTEGER NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuntajeSpaceShooter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PuntajePacman" ADD CONSTRAINT "PuntajePacman_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeMario" ADD CONSTRAINT "PuntajeMario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeSnake" ADD CONSTRAINT "PuntajeSnake_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeTetris" ADD CONSTRAINT "PuntajeTetris_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajePingPong" ADD CONSTRAINT "PuntajePingPong_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeBreakout" ADD CONSTRAINT "PuntajeBreakout_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeFlappyBee" ADD CONSTRAINT "PuntajeFlappyBee_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajeSpaceShooter" ADD CONSTRAINT "PuntajeSpaceShooter_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
