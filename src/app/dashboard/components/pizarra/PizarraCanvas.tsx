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
    >
      <PizarraSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PizarraNavbar onClose={handleClose} onToggleFullscreen={toggleFullscreen} fullscreen={fullscreen} />
        <div ref={canvasRef} className="flex-1 overflow-auto p-4" />
      </div>
    </div>
  );
}
