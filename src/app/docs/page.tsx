"use client";
import { useState, useEffect } from "react";
import MinijuegoLoader from "./MinijuegoLoader";

export default function Docs() {
  const [showMinijuego, setShowMinijuego] = useState(false);

  // Permite controles completos en el minijuego, solo bloquea lo necesario
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!showMinijuego) return;

      // No bloquear si el foco está en un input, textarea o contenteditable
      const active = document.activeElement;
      const isTyping =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);
      if (isTyping) return;

      // Solo bloquea Tab para que no cambie de foco, el resto de las teclas funcionan normal
      if (e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
      }
      // El resto (letras, números, flechas, espacio, enter, etc) permitidos normalmente
    }

    if (showMinijuego) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown, true);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown, true);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [showMinijuego]);

  // Oculta minijuego al cambiar de página
  useEffect(() => {
    const hidePanel = () => setShowMinijuego(false);
    window.addEventListener("popstate", hidePanel);
    return () => window.removeEventListener("popstate", hidePanel);
  }, []);

  // Cierra con Escape también
  useEffect(() => {
    if (!showMinijuego) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowMinijuego(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showMinijuego]);

  return (
    <div
      className="mx-auto max-w-4xl p-4 sm:p-8 space-y-8 relative"
      data-oid="aj6e:_1"
    >
      {/* --- Botón secreto para abrir minijuego --- */}
      <button
        className={`
          fixed z-50 bottom-3 right-4 w-5 h-5 rounded-full bg-zinc-700/20
          hover:bg-miel hover:scale-110 shadow-lg flex items-center justify-center
          transition-all cursor-pointer border border-transparent hover:border-miel
          p-0 m-0 select-none active:scale-95
        `}
        style={{
          fontSize: "0.6rem",
          opacity: showMinijuego ? 1 : 0.22,
          outline: "none",
          boxShadow: showMinijuego ? "0 0 10px #ffe06688" : "none",
        }}
        aria-label="Panel secreto"
        tabIndex={0}
        onClick={() => setShowMinijuego((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowMinijuego((v) => !v);
        }}
        data-oid="ejt73rd"
      >
        {/* Emoji o icono */}
        <span
          className="text-[13px] text-miel select-none pointer-events-none"
          data-oid="11rgmw_"
        >
          🐝
        </span>
      </button>

      {/* --- Panel flotante de minijuego --- */}
      {showMinijuego && (
        <div
          className="fixed z-40 inset-0 bg-[#1a1422cc] bg-opacity-80 flex items-center justify-center animate-fadeIn transition-all"
          onClick={() => setShowMinijuego(false)}
          data-oid="u7--mk9"
        >
          <div
            className="bg-[#22223b] border border-miel/40 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4 relative animate-pop flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            data-oid="4h5czl6"
          >
            <button
              className="absolute top-3 right-3 bg-miel text-[#22223b] rounded-full w-6 h-6 flex items-center justify-center font-bold shadow hover:scale-110 transition"
              title="Cerrar"
              aria-label="Cerrar"
              onClick={() => setShowMinijuego(false)}
              data-oid="ahrhm_u"
            >
              ×
            </button>
            <MinijuegoLoader data-oid="-n99g.l" />
          </div>
        </div>
      )}

      {/* --- SECCIONES DE DOCUMENTACIÓN --- */}
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="tyzbbbp"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="-:2b8el"
        >
          Manual de Usuario
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="-0c0b:z"
        >
          Aquí encontrarás el paso a paso para usar HoneyLabs de manera
          eficiente.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="bwayazd"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="sc68hkz"
        >
          Documentación Técnica
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="cewv.ur"
        >
          Referencias de arquitectura, endpoints y recursos para
          desarrolladores.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="mm37e5m"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="::cxms2"
        >
          Preguntas Frecuentes
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="rjimeb6"
        >
          Respuestas a dudas comunes sobre el uso y funcionamiento de la
          plataforma.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="j1a81:v"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="na9gnah"
        >
          Glosario
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="ubs-2af"
        >
          Definiciones de términos técnicos y logísticos utilizados en
          HoneyLabs.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="32et3:a"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="camh6:."
        >
          Guías Rápidas y Tips
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="6whb1w9"
        >
          Consejos y atajos para aprovechar al máximo todas las funciones.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="rk5-5xx"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid=":irybhf"
        >
          Contacto y Soporte
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="azjjwri"
        >
          ¿Tienes dudas o problemas? Aquí encontrarás cómo contactar al equipo
          HoneyLabs.
        </p>
      </section>
    </div>
  );
}
