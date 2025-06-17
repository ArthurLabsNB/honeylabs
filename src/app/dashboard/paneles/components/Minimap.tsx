"use client";
import { useEffect, useRef } from "react";
import type { Layout } from "react-grid-layout";

interface Props {
  layout: Layout[];
  zoom: number;
  containerRef: React.RefObject<HTMLDivElement>;
  gridSize: number;
}

const GRID_WIDTH = 1600;
const COLS = 12;
const ROW_HEIGHT_DEFAULT = 95;

export default function Minimap({ layout, zoom, containerRef, gridSize }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = gridSize || ROW_HEIGHT_DEFAULT;
    const maxY = layout.reduce(
      (m, it) => Math.max(m, (it.y + (it.h || 1)) * size),
      0,
    );
    const scaleX = canvas.width / (GRID_WIDTH * zoom);
    const scaleY = canvas.height / (maxY * zoom || 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    layout.forEach((it) => {
      const x = it.x * (GRID_WIDTH / COLS) * scaleX;
      const y = it.y * size * scaleY;
      const w = (it.w || 1) * (GRID_WIDTH / COLS) * scaleX;
      const h = (it.h || 1) * size * scaleY;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    });
    if (containerRef.current) {
      const { scrollLeft, scrollTop, clientWidth, clientHeight } = containerRef.current;
      ctx.strokeStyle = 'yellow';
      ctx.strokeRect(scrollLeft * scaleX, scrollTop * scaleY, clientWidth * scaleX, clientHeight * scaleY);
    }
  }, [layout, zoom, gridSize]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = canvas.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;

    const size = gridSize || ROW_HEIGHT_DEFAULT;
    const maxY = layout.reduce(
      (m, it) => Math.max(m, (it.y + (it.h || 1)) * size),
      0,
    );
    const boardWidth = GRID_WIDTH * zoom;
    const boardHeight = maxY * zoom;

    container.scrollTo({
      left: xPct * boardWidth - container.clientWidth / 2,
      top: yPct * boardHeight - container.clientHeight / 2,
      behavior: "smooth",
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={150}
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-black/40 rounded shadow cursor-pointer z-40"
    />
  );
}
