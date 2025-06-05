"use client";
import { useEffect, useRef, useState } from "react";
import PizarraNavbar from "./PizarraNavbar";
import PizarraSidebar from "./PizarraSidebar";

interface Props {
  onClose: () => void;
}

export default function PizarraCanvas({ onClose }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem("pizarra_content");
    if (saved && canvasRef.current) {
      canvasRef.current.innerHTML = saved;
    }
  }, []);

  // Save state on unmount or mode change
  const saveState = () => {
    if (canvasRef.current) {
      localStorage.setItem("pizarra_content", canvasRef.current.innerHTML);
    }
  };

  useEffect(() => {
    return () => {
      saveState();
    };
  }, []);

  const toggleFullscreen = () => {
    setFullscreen((f) => {
      const next = !f;
      saveState();
      return next;
    });
  };

  const handleClose = () => {
    saveState();
    onClose();
  };

  return (
    <div
      className={`pizarra-overlay fixed inset-0 z-50 flex bg-[var(--dashboard-bg)] ${fullscreen ? "pizarra-full" : ""}`}
      data-oid="6u2:.k9"
    >
      <PizarraSidebar data-oid="ku3x-_w" />
      <div className="flex-1 flex flex-col overflow-hidden" data-oid="cdbj72o">
        <PizarraNavbar
          onClose={handleClose}
          onToggleFullscreen={toggleFullscreen}
          fullscreen={fullscreen}
          data-oid=":ok0xtj"
        />

        <div
          ref={canvasRef}
          className="flex-1 overflow-auto p-4"
          data-oid="vx060vl"
        />
      </div>
    </div>
  );
}
