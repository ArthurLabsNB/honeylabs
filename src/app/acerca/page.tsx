"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HelpCircle,
  FileText,
  Phone,
  Info,
  ShieldCheck,
  Wrench,
  BookOpen,
  BarChart2,
} from "lucide-react";

const accesos = [
  {
    nombre: "Acerca",
    ruta: "/acerca",
    icono: <Info size={32} className="text-[var(--dashboard-accent)]" />,
    descripcion: "Información general sobre la plataforma.",
  },
  {
    nombre: "Ayuda",
    ruta: "/ayuda",
    icono: <HelpCircle size={32} className="text-[var(--dashboard-accent)]" />,
    descripcion: "Centro de asistencia y preguntas frecuentes.",
  },
  {
    nombre: "Contacto",
    ruta: "/contacto",
    icono: <Phone size={32} className="text-[var(--dashboard-accent)]" />,
    descripcion: "Comunícate con nuestro equipo.",
  },
  {
    nombre: "Documentación",
    ruta: "/docs",
    icono: <FileText size={32} className="text-[var(--dashboard-accent)]" />,
    descripcion: "Guías y manuales técnicos del sistema.",
  },
  {
    nombre: "Estado",
    ruta: "/estado",
    icono: <BarChart2 size={32} className="text-[var(--dashboard-accent)]" />,
    descripcion: "Estado actual de la plataforma en tiempo real.",
  },
  {
    nombre: "Legal",
    ruta: "/legal",
    icono: <ShieldCheck size={32} className="text-[var(--dashboard-accent)]" />,
    descripcion: "Términos, condiciones y políticas legales.",
  },
  {
    nombre: "Servicios",
    ruta: "/servicios",
    icono: <Wrench size={32} className="text-[var(--dashboard-accent)]" />,
    descripcion: "Servicios y funciones adicionales.",
  },
  {
    nombre: "Wiki",
    ruta: "/wiki",
    icono: <BookOpen size={32} className="text-[var(--dashboard-accent)]" />,
    descripcion: "Base de conocimientos colaborativa.",
  },
];

export default function acerca() {
  return (
    <motion.div
      className="bg-[var(--background)] text-[var(--foreground)] px-4 py-10 sm:px-8 lg:px-20 max-w-7xl mx-auto space-y-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero visual tipo E-commerce */}
      <section className="text-center space-y-6">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-[var(--dashboard-accent)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Conoce HoneyLabs
        </motion.h1>
        <p className="text-lg text-[var(--dashboard-muted)] max-w-3xl mx-auto">
          Plataforma integral de inventarios adaptada a las necesidades educativas, empresariales y científicas.
        </p>
        <div className="mt-6 rounded-2xl overflow-hidden shadow-xl aspect-video max-w-5xl mx-auto">
          <video className="w-full h-full object-cover" autoPlay muted loop>
            <source src="/demo-video.mp4" type="video/mp4" />
            Tu navegador no soporta video.
          </video>
        </div>
      </section>

      {/* Sección de presentación comercial */}
      <section className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-5">
          <h2 className="text-3xl font-bold text-[var(--dashboard-accent)]">¿Qué es HoneyLabs?</h2>
          <p>
            Es una solución digital diseñada para transformar completamente la forma en que se gestionan los inventarios. Desde laboratorios escolares hasta cadenas logísticas institucionales, HoneyLabs se adapta a tus flujos reales, permitiendo seguimiento detallado, trazabilidad completa y análisis inmediato.
          </p>
          <p>
            Olvídate del caos de las hojas de cálculo. Con HoneyLabs puedes registrar, consultar, exportar y controlar tu inventario desde cualquier dispositivo, con una interfaz moderna, segura y pensada para cualquier usuario.
          </p>
        </div>
        <div>
          <img src="/img/inventario-preview.png" alt="Panel de ejemplo" className="rounded-xl shadow-lg border border-[var(--dashboard-border)]" />
        </div>
      </section>

      {/* Beneficios como sección de e-commerce */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-10">¿Por qué elegir HoneyLabs?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[{
            icon: "📦",
            title: "Control por unidad",
            desc: "Cada material se registra por unidad específica con detalles como peso, volumen o ubicación."
          }, {
            icon: "🔒",
            title: "Seguridad de acceso",
            desc: "Cada usuario ve solo lo que necesita. Sistema de roles y permisos completo."
          }, {
            icon: "📈",
            title: "Visualización avanzada",
            desc: "Dashboards, filtros inteligentes y exportaciones para tomar decisiones más rápido."
          }, {
            icon: "📤",
            title: "Exportación profesional",
            desc: "PDF, Excel, XML, JSON, todo desde un clic. Ideal para auditorías o reportes."
          }, {
            icon: "📸",
            title: "Multimedia integrada",
            desc: "Carga imágenes, planos, archivos y vincúlalos directamente a materiales o unidades."
          }, {
            icon: "🧠",
            title: "Preparado para IA",
            desc: "Estamos listos para integrar flujos automatizados, asistentes inteligentes y predicciones."
          }].map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="bg-[var(--dashboard-card)] border border-[var(--dashboard-border)] rounded-xl p-6 shadow hover:shadow-md transition text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-[var(--dashboard-muted)] text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA final tipo ecommerce */}
      <section className="text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">¿Listo para mejorar tu gestión?</h2>
        <p className="text-[var(--dashboard-muted)] mb-6 max-w-xl mx-auto">
          Descubre cómo HoneyLabs puede ayudarte a ahorrar tiempo, evitar errores y tener el control total de tus inventarios.
        </p>
        <Link
          href="/contacto"
          className="inline-block px-6 py-3 bg-[var(--dashboard-accent)] text-black font-semibold rounded-lg shadow hover:bg-[var(--dashboard-accent-hover)] transition"
        >
          Solicita una demo personalizada
        </Link>
      </section>

      {/* Accesos rápidos */}
      <motion.section
        className="max-w-6xl mx-auto px-6 sm:px-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center text-[var(--dashboard-accent)] mb-6">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {accesos.map(({ nombre, ruta, icono, descripcion }, i) => (
            <Link key={ruta} href={ruta}>
              <motion.div
                className="bg-[var(--dashboard-card)] shadow-md hover:shadow-xl transition-all rounded-xl p-6 text-center border border-[var(--dashboard-border)] hover:border-[var(--dashboard-accent)] focus-visible:ring-2 focus-visible:ring-[var(--dashboard-accent)] cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                tabIndex={0}
              >
                <div className="mb-3 flex justify-center">{icono}</div>
                <p className="font-semibold text-[var(--dashboard-text)]">
                  {nombre}
                </p>
                <p className="text-sm text-[var(--dashboard-muted)]">
                  {descripcion}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
