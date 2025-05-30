import MinijuegoLoader from './MinijuegoLoader'

export default function Docs() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-8">
      {/* 1. Panel de minijuegos oculto */}
      <section
        className="rounded-lg border border-dashed border-zinc-600 bg-[#19171f] p-4 sm:p-6 mb-2 opacity-80 hover:opacity-100 transition group shadow-lg relative"
        tabIndex={-1}
      >
        {/* Pequeño “disclaimer” para quien lo descubra */}
        <div className="absolute top-2 right-3 text-xs text-zinc-400 italic opacity-60 group-hover:opacity-100 select-none">
          {/* Un emoji muy sutil, opcional */}
          {/* 🕹️ */}
        </div>
        <h2 className="text-lg font-semibold text-zinc-400 mb-1 select-none">
          {/* Título muy discreto */}
          Panel Experimental
        </h2>
        <p className="text-xs text-zinc-500 mb-3 select-none">
          {/* Descripción muy minimalista */}
          Acceso restringido para pruebas y utilidades avanzadas.
        </p>
        <MinijuegoLoader />
      </section>

      {/* 2. Manual de Usuario */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Manual de Usuario</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">Aquí encontrarás el paso a paso para usar HoneyLabs de manera eficiente.</p>
      </section>

      {/* 3. Documentación Técnica */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Documentación Técnica</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">Referencias de arquitectura, endpoints, y recursos para desarrolladores.</p>
      </section>

      {/* 4. Preguntas Frecuentes (FAQ) */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Preguntas Frecuentes</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">Respuestas a dudas comunes sobre el uso y funcionamiento de la plataforma.</p>
      </section>

      {/* 5. Glosario */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Glosario</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">Definiciones de términos técnicos y logísticos utilizados en HoneyLabs.</p>
      </section>

      {/* 6. Guías Rápidas y Tips */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Guías Rápidas y Tips</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">Consejos y atajos para aprovechar al máximo todas las funciones.</p>
      </section>

      {/* 7. Contacto y Soporte */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Contacto y Soporte</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">¿Tienes dudas o problemas? Aquí encontrarás cómo contactar al equipo HoneyLabs.</p>
      </section>
    </div>
  )
}
