"use client";
import { useState } from "react";
import PanelMinijuegos from "./minijuegos/PanelMinijuegos";

export default function DocumentosPage() {
  const [mostrarJuegos, setMostrarJuegos] = useState(false);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-8 relative">
      <button
        className="fixed z-50 bottom-3 right-4 w-5 h-5 rounded-full bg-zinc-700/20 hover:bg-miel hover:scale-110 shadow-lg flex items-center justify-center transition-all cursor-pointer border border-transparent hover:border-miel p-0 m-0 select-none active:scale-95"
        style={{ fontSize: "0.6rem", opacity: mostrarJuegos ? 1 : 0.22, outline: "none", boxShadow: mostrarJuegos ? "0 0 10px #ffe06688" : "none" }}
        aria-label="Panel secreto"
        tabIndex={0}
        onClick={() => setMostrarJuegos((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setMostrarJuegos((v) => !v);
        }}
      >
        <span className="text-[0.8125rem] text-miel select-none pointer-events-none">🐝</span>
      </button>

      {mostrarJuegos && (
        <div
          className="fixed z-40 inset-0 bg-[#1a1422cc] bg-opacity-80 flex items-center justify-center animate-fadeIn transition-all"
          onClick={() => setMostrarJuegos(false)}
        >
          <div
            className="bg-[#22223b] border border-miel/40 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4 relative animate-pop flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 bg-miel text-[#22223b] rounded-full w-6 h-6 flex items-center justify-center font-bold shadow hover:scale-110 transition"
              title="Cerrar"
              aria-label="Cerrar"
              onClick={() => setMostrarJuegos(false)}
            >
              ×
            </button>
            <PanelMinijuegos />
          </div>
        </div>
      )}

      {/* --- SECCIONES DE DOCUMENTACIÓN --- */}
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="8r8gu9n"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="ob:1oyq"
        >
          Manual de Usuario
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="nwabwuo"
        >
          Aquí encontrarás el paso a paso para usar HoneyLabs de manera
          eficiente.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="nlmkx-j"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="lykdkj-"
        >
          Documentación Técnica
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="4d6vku:"
        >
          Referencias de arquitectura, endpoints y recursos para
          desarrolladores.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="ai7xji3"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="3lujq8l"
        >
          Preguntas Frecuentes
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="wyquan0"
        >
          Respuestas a dudas comunes sobre el uso y funcionamiento de la
          plataforma.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="6t98pb8"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="j-eb:nm"
        >
          Glosario
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="q3zc-ey"
        >
          Definiciones de términos técnicos y logísticos utilizados en
          HoneyLabs.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="379.po:"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="24.he6j"
        >
          Guías Rápidas y Tips
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="67v_5ex"
        >
          Consejos y atajos para aprovechar al máximo todas las funciones.
        </p>
      </section>
      <section
        className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow"
        data-oid="...ymfe"
      >
        <h2
          className="text-lg font-bold text-amber-700 mb-1"
          data-oid="elq1b2a"
        >
          Contacto y Soporte
        </h2>
        <p
          className="text-zinc-600 dark:text-zinc-300 text-sm"
          data-oid="k43:2op"
        >
          ¿Tienes dudas o problemas? Aquí encontrarás cómo contactar al equipo
          HoneyLabs.
        </p>
      </section>
    </div>
  );
}
