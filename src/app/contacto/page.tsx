'use client'

/* src/pages/Contacto.tsx
   Página de contacto profesional completa    – Next.js + React + Tailwind CSS
   – Iconos vía react-icons ( pnpm add react-icons)
*/

import { useState } from 'react'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from 'react-icons/fa'

export default function Contacto() {
  /* ─────────────────────────────  Formulario (demo)  ─────────────────────────── */
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ⚠️ Conecta aquí tu backend / servicio de correo
    console.table(form)
    alert('Mensaje enviado ✔️')
    setForm({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
  }

  /* ──────────────────────────────  Render  ───────────────────────────────────── */
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-14">
      {/* ╭───────────────────────  Encabezado  ─────────────────────────────╮ */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-amber-600">Contacto</h1>
        <p className="text-zinc-400">
          Estamos aquí para ayudarte. Elige el medio que prefieras o envíanos un mensaje directo.
        </p>
      </header>

      {/* ╭───────────────────────  Información de contacto  ─────────────────╮ */}
      <section className="grid lg:grid-cols-3 gap-10">
        {/* ─────────────── Columna 1: Datos generales ─────────────── */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <FaMapMarkerAlt className="text-amber-600" /> Dirección
          </h2>
          <address className="not-italic text-zinc-300 leading-relaxed">
            Av. Tecnológico s/n, Esq. Mariano Escobedo<br />
            Col. Centro Histórico, C.P. 76000<br />
            Querétaro, Qro. México
          </address>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaPhoneAlt className="text-amber-600" /> Teléfonos
            </h3>
            <p className="text-zinc-300">
              Conmutador: <a href="tel:+524422274400" className="underline">+52 (442) 227 44 00</a>
              <br />
              Soporte 24 h: <a href="tel:+5214421234567" className="underline">+52 1 442 123 4567</a>
            </p>

            <p className="flex items-center gap-2 text-zinc-300">
              <FaWhatsapp className="text-green-500" />
              <a href="https://wa.me/5214421234567" target="_blank" rel="noreferrer" className="underline">
                Escríbenos por WhatsApp
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaEnvelope className="text-amber-600" /> Correo
            </h3>
            <a
              href="mailto:honeylabs@soporte.com"
              className="underline decoration-amber-600 hover:text-amber-500 text-zinc-300"
            >
              honeylabs@soporte.com
            </a>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaClock className="text-amber-600" /> Horarios de atención
            </h3>
            <p className="text-zinc-300">
              Lunes – Viernes: 08 : 00 – 18 : 00<br />
              Sábado: 09 : 00 – 13 : 00<br />
              Soporte urgente: 24 h
            </p>
          </div>

          {/* ─────────────── Redes sociales ─────────────── */}
          <div className="pt-6">
            <h3 className="text-xl font-semibold text-white mb-3">Síguenos</h3>
            <ul className="flex gap-5 text-3xl">
              <li>
                <a
                  href="https://facebook.com/itqoficial"
                  aria-label="Facebook"
                  className="text-zinc-400 hover:text-amber-500 transition-colors"
                >
                  <FaFacebook />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/itqoficial"
                  aria-label="Twitter"
                  className="text-zinc-400 hover:text-amber-500"
                >
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/itqoficial"
                  aria-label="Instagram"
                  className="text-zinc-400 hover:text-amber-500"
                >
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/school/itq"
                  aria-label="LinkedIn"
                  className="text-zinc-400 hover:text-amber-500"
                >
                  <FaLinkedin />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ─────────────── Columna 2: Formulario ─────────────── */}
        <div className="lg:col-span-1 lg:order-last">
          <h2 className="text-2xl font-semibold text-white mb-4">Envíanos un mensaje</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              aria-label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
              className="w-full rounded bg-zinc-800 text-zinc-200 p-3 placeholder-zinc-500 focus:outline-amber-600"
            />
            <input
              aria-label="Correo"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Tu correo electrónico"
              className="w-full rounded bg-zinc-800 text-zinc-200 p-3 placeholder-zinc-500 focus:outline-amber-600"
            />
            <input
              aria-label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono (opcional)"
              className="w-full rounded bg-zinc-800 text-zinc-200 p-3 placeholder-zinc-500 focus:outline-amber-600"
            />
            <input
              aria-label="Asunto"
              name="asunto"
              value={form.asunto}
              onChange={handleChange}
              required
              placeholder="Asunto"
              className="w-full rounded bg-zinc-800 text-zinc-200 p-3 placeholder-zinc-500 focus:outline-amber-600"
            />
            <textarea
              aria-label="Mensaje"
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Cuéntanos en qué podemos ayudarte…"
              className="w-full rounded bg-zinc-800 text-zinc-200 p-3 placeholder-zinc-500 focus:outline-amber-600 resize-none"
            />
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 rounded transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </div>

        {/* ─────────────── Columna 3: Mapa ─────────────── */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold text-white mb-4">Cómo llegar</h2>
          <iframe
            title="Mapa ITQ"
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.003071646752!2d-100.37948938473777!3d20.59048368620562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d35b759cbcd3a1%3A0x728e174c92d34f89!2sTecNM%20Campus%20Quer%C3%A9taro!5e0!3m2!1ses-419!2smx!4v1721337600000"
            className="w-full h-96 rounded-lg shadow-lg border-0"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ╭───────────────────────  Footer  ────────────────────────────────╮ */}
      <footer className="text-center text-sm text-zinc-500 border-t border-zinc-800 pt-6">
        HoneyLabs © {new Date().getFullYear()} · Proyecto académico desarrollado en el TecNM /
        Instituto Tecnológico de Querétaro
      </footer>
    </main>
  )
}
