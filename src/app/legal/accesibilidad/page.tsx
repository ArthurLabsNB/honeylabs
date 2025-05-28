// src/app/legal/accesibilidad/page.tsx
export default function AccesibilidadPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-amber-700">Accesibilidad</h1>
      <p className="text-zinc-700 dark:text-zinc-300 mb-6">
        Trabajamos para que HoneyLabs sea accesible para todas las personas. Aquí encontrarás información sobre nuestras políticas de accesibilidad.
      </p>
      <p className="text-sm text-zinc-500">
        Última actualización: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
