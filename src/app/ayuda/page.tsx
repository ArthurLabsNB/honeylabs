"use client";

import Link from "next/link";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CubeIcon,
  CreditCardIcon,
  CodeBracketSquareIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const categories = [
  {
    title: "Primeros pasos",
    description:
      "Crea tu organización, invita a tu equipo y configura tus primeros almacenes.",
    href: "/docs/getting-started",
    icon: DocumentTextIcon,
  },
  {
    title: "Inventario",
    description:
      "Registra materiales, gestiona unidades y realiza auditorías con flujos claros.",
    href: "/docs/inventario",
    icon: CubeIcon,
  },
  {
    title: "Facturación",
    description:
      "Emite facturas, tickets y notas de crédito directamente desde HoneyLabs.",
    href: "/docs/billing",
    icon: CreditCardIcon,
  },
  {
    title: "API & Webhooks",
    description: "Conecta HoneyLabs con tus sistemas ERP, BI o e-commerce.",
    href: "/docs/api",
    icon: CodeBracketSquareIcon,
  },
];

const faqs = [
  {
    q: "¿Cómo restablezco mi contraseña?",
    a: "Haz clic en “¿Olvidaste tu contraseña?” en la pantalla de inicio de sesión. Recibirás un correo con un enlace válido por 15 minutos para definir una nueva contraseña.",
  },
  {
    q: "¿Se puede usar HoneyLabs sin conexión a internet?",
    a: "Sí. Gracias a nuestro modo PWA offline, puedes continuar registrando movimientos. La información se sincroniza automáticamente cuando la conexión regresa.",
  },
  {
    q: "¿Cómo obtengo soporte prioritario?",
    a: "Los planes Enterprise incluyen un SLA de 99,9 % y línea telefónica directa 24/7. Contacta a ventas@honeylabs.app para más detalles.",
  },
  {
    q: "¿Dónde verifico el estado de los servicios?",
    a: "Visita status.honeylabs.app para comprobar en tiempo real la disponibilidad de nuestra API, base de datos y CDN.",
  },
];

export default function Ayuda() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Encabezado */}
      <header className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-amber-700">
          Centro de Ayuda HoneyLabs
        </h1>
        <p className="text-gray-600">
          Encuentra respuestas, guías y recursos para dominar la plataforma.
        </p>

        {/* Buscador */}
        <div className="relative max-w-xl">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar en la documentación..."
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            aria-label="Buscar en la documentación"
          />
        </div>
      </header>

      {/* Categorías */}
      <section aria-labelledby="categorias">
        <h2 id="categorias" className="sr-only">
          Categorías
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-amber-600 hover:shadow-md"
            >
              <Icon className="h-8 w-8 text-amber-600 group-hover:text-amber-700" />
              <span className="mt-2 text-lg font-semibold text-gray-800 group-hover:text-amber-700">
                {title}
              </span>
              <span className="text-sm text-gray-600">{description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section aria-labelledby="faqs">
        <h2 id="faqs" className="text-xl font-semibold text-gray-800 mb-4">
          Preguntas frecuentes
        </h2>
        <div className="space-y-2">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="rounded-lg border border-gray-200 p-4 open:bg-gray-50"
            >
              <summary className="cursor-pointer font-medium text-gray-800">
                {q}
              </summary>
              <p className="mt-2 text-sm text-gray-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Soporte */}
      <section aria-labelledby="soporte">
        <h2 id="soporte" className="text-xl font-semibold text-gray-800 mb-4">
          ¿Necesitas más ayuda?
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <EnvelopeIcon className="h-6 w-6 text-amber-600" />
            <div>
              <h3 className="font-medium text-gray-800">Correo electrónico</h3>
              <p className="text-sm text-gray-600">
                <a href="mailto:soporte@honeylabs.app" className="underline">
                  soporte@honeylabs.app
                </a>
                <br />
                Tiempo de respuesta promedio: 4 h hábiles.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-amber-600" />
            <div>
              <h3 className="font-medium text-gray-800">Chat en vivo</h3>
              <p className="text-sm text-gray-600">
                Disponible lun-vie, 09:00-18:00 (GMT-6).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PhoneIcon className="h-6 w-6 text-amber-600" />
            <div>
              <h3 className="font-medium text-gray-800">Teléfono</h3>
              <p className="text-sm text-gray-600">
                +52 442 123 4567
                <br />Soporte crítico 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="pt-10 border-t text-xs text-gray-500">
        © {new Date().getFullYear()} HoneyLabs — Hecho con ❤ en México
      </footer>
    </main>
  );
}
