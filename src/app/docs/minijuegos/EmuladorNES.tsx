"use client";
import { useEffect, useRef } from "react";
interface Props {
  rom: string;
}
export default function EmuladorNES({ rom }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const load = async () => {
      const { default: JSNES } = await import("jsnes");
      const nes = new JSNES({ onFrame: (frame: Uint8Array) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, 256, 240);
        imageData.data.set(frame);
        ctx.putImageData(imageData, 0, 0);
      }});
      const res = await fetch(`/roms/${rom}`);
      const buffer = await res.arrayBuffer();
      nes.loadROM(buffer);
    };
    load();
  }, [rom]);

  return <canvas ref={canvasRef} width={256} height={240} className="border" />;
}
