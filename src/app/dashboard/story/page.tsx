"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

interface Slide {
  id: string;
  contenido: string;
}

export default function StoryPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/paneles/story")
      .then((r) => r.ok ? r.json() : { slides: [] })
      .then((d) => {
        setSlides(d.slides || []);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );

  const actual = slides[idx];

  return (
    <div className="p-4 space-y-4" data-oid="story-mode-root">
      <h1 className="text-2xl font-bold">Modo Narrador</h1>
      {actual ? (
        <div className="dashboard-card p-6 text-center text-lg">
          {actual.contenido}
        </div>
      ) : (
        <p>No hay diapositivas.</p>
      )}
      <div className="flex gap-2">
        <button
          className="dashboard-button flex-1"
          onClick={() => setIdx((v) => Math.max(v - 1, 0))}
          disabled={idx === 0}
        >
          Anterior
        </button>
        <button
          className="dashboard-button flex-1"
          onClick={() => setIdx((v) => Math.min(v + 1, slides.length - 1))}
          disabled={idx === slides.length - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
