// src/app/estado/page.tsx
import { apiPath } from '@lib/api'

interface EstadoData {
  status: 'ok' | 'maintenance'
}

export default async function EstadoPage() {
  const res = await fetch(apiPath('/api/status'), { cache: 'no-store' })
  const data = (await res.json()) as EstadoData
  const now = new Date().toLocaleString()
  const ok = data.status === 'ok'
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-amber-700">Estado del sistema</h1>
      <p className="text-zinc-600 mb-4">
        Consulta aquí el estado actual de los servicios y funcionalidades de
        HoneyLabs. Si algún servicio presenta problemas, aparecerá una
        notificación en esta sección.
      </p>
      {ok ? (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-700 font-semibold">
          Todos los sistemas funcionan normalmente. Última actualización: {now}
        </div>
      ) : (
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-orange-700 font-semibold">
          El sistema se encuentra en mantenimiento. Última actualización: {now}
        </div>
      )}
    </main>
  )
}
