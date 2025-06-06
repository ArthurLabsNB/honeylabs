"use client";
import { useEffect, useRef, useState } from "react";
import PizarraNavbar from "./PizarraNavbar";
import PizarraSidebar from "./PizarraSidebar";

const STORAGE_KEY = "pizarra_content";

const sanitizeHTML = (html: string) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("script").forEach((el) => el.remove());
  return template.innerHTML;
};

interface Props {
  onClose: () => void;
}

export default function PizarraCanvas({ onClose }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && canvasRef.current) {
      let html = saved;
      try {
        const parsed = JSON.parse(saved) as { html?: string };
        if (parsed && typeof parsed.html === "string") {
          html = parsed.html;
        }
      } catch {
        // previous versions stored raw HTML
      }
      canvasRef.current.innerHTML = sanitizeHTML(html);
    }
  }, []);

  // Save state on unmount or mode change
  const saveState = () => {
    if (canvasRef.current) {
      const payload = JSON.stringify({ html: canvasRef.current.innerHTML });
      localStorage.setItem(STORAGE_KEY, payload);
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
