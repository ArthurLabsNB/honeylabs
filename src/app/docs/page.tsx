import MinijuegoLoader from './MinijuegoLoader'

export default function Docs() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-8">
      {/* 1. Panel de minijuegos oculto (easter egg style) */}
      <section
        className="
          relative
          w-full
          h-6
          my-1
          select-none
          group
          flex items-center
          opacity-30
          hover:opacity-100 focus-within:opacity-100
          transition-opacity
          bg-transparent
          cursor-pointer
          rounded
        "
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* Invisible trigger para accesibilidad */}
        <div className="absolute inset-0 z-10" tabIndex={0} />
        {/* Loader solo se muestra al hover/focus */}
        <div
          className="
            w-full
            absolute left-0 top-0 z-20
            pointer-events-none
            group-hover:pointer-events-auto
            group-focus-within:pointer-events-auto
            transition-all
            duration-300
            scale-95
            group-hover:scale-100
            group-focus-within:scale-100
          "
        >
          <div className="mx-auto w-full max-w-sm">
            <MinijuegoLoader />
          </div>
        </div>
      </section>

      {/* 2. Manual de Usuario */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Manual de Usuario</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">
          Aquí encontrarás el paso a paso para usar HoneyLabs de manera eficiente.
        </p>
      </section>

      {/* 3. Documentación Técnica */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Documentación Técnica</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">
          Referencias de arquitectura, endpoints, y recursos para desarrolladores.
        </p>
      </section>

      {/* 4. Preguntas Frecuentes (FAQ) */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Preguntas Frecuentes</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">
          Respuestas a dudas comunes sobre el uso y funcionamiento de la plataforma.
        </p>
      </section>

      {/* 5. Glosario */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Glosario</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">
          Definiciones de términos técnicos y logísticos utilizados en HoneyLabs.
        </p>
      </section>

      {/* 6. Guías Rápidas y Tips */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Guías Rápidas y Tips</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">
          Consejos y atajos para aprovechar al máximo todas las funciones.
        </p>
      </section>

      {/* 7. Contacto y Soporte */}
      <section className="rounded-lg bg-white/70 dark:bg-[#22223b]/80 p-4 shadow">
        <h2 className="text-lg font-bold text-amber-700 mb-1">Contacto y Soporte</h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm">
          ¿Tienes dudas o problemas? Aquí encontrarás cómo contactar al equipo HoneyLabs.
        </p>
      </section>
    </div>
  )
}
