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
    icono: <Info size={32} className="text-amber-600" />,
    descripcion: "Información general sobre la plataforma.",
  },
  {
    nombre: "Ayuda",
    ruta: "/ayuda",
    icono: <HelpCircle size={32} className="text-amber-600" />,
    descripcion: "Centro de asistencia y preguntas frecuentes.",
  },
  {
    nombre: "Contacto",
    ruta: "/contacto",
    icono: <Phone size={32} className="text-amber-600" />,
    descripcion: "Comunícate con nuestro equipo.",
  },
  {
    nombre: "Documentación",
    ruta: "/docs",
    icono: <FileText size={32} className="text-amber-600" />,
    descripcion: "Guías y manuales técnicos del sistema.",
  },
  {
    nombre: "Estado",
    ruta: "/estado",
    icono: <BarChart2 size={32} className="text-amber-600" />,
    descripcion: "Estado actual de la plataforma en tiempo real.",
  },
  {
    nombre: "Legal",
    ruta: "/legal",
    icono: <ShieldCheck size={32} className="text-amber-600" />,
    descripcion: "Términos, condiciones y políticas legales.",
  },
  {
    nombre: "Servicios",
    ruta: "/servicios",
    icono: <Wrench size={32} className="text-amber-600" />,
    descripcion: "Servicios y funciones adicionales.",
  },
  {
    nombre: "Wiki",
    ruta: "/wiki",
    icono: <BookOpen size={32} className="text-amber-600" />,
    descripcion: "Base de conocimientos colaborativa.",
  },
];

export default function Acerca() {
  return (
    <motion.div
      className="bg-white dark:bg-black text-gray-800 dark:text-gray-100 px-4 py-10 sm:px-8 lg:px-20 max-w-7xl mx-auto space-y-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero con video */}
      <section className="text-center space-y-6">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-amber-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Bienvenido a HoneyLabs
        </motion.h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          La plataforma moderna para gestión de inventarios en instituciones educativas, científicas y empresariales.
        </p>
        <div className="mt-6 rounded-2xl overflow-hidden shadow-lg aspect-video max-w-4xl mx-auto">
          <video className="w-full h-full object-cover" autoPlay muted loop>
            <source src="/demo-video.mp4" type="video/mp4" />
            Tu navegador no soporta video.
          </video>
        </div>
      </section>

      {/* Preguntas clave */}
      <section className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-2">¿Qué es HoneyLabs?</h2>
          <p>
            HoneyLabs es un sistema inteligente para digitalizar y centralizar la gestión de almacenes, materiales
            y unidades, permitiendo control total de inventarios desde cualquier dispositivo, de forma clara,
            segura y moderna.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">¿Para qué sirve realmente?</h2>
          <p>
            Sirve para registrar cada material o unidad con detalle (peso, estado, ubicación, archivos), organizarlos
            por almacenes, aplicar filtros, visualizar historial de movimientos y exportar en múltiples formatos (PDF,
            Excel, XML).
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">¿Qué lo hace especial o único?</h2>
          <p>
            Su enfoque modular, experiencia de usuario limpia, generación automática de QR y escalabilidad lo
            convierten en una solución potente que no depende de licencias costosas ni infraestructuras complejas.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">¿Qué funciones y beneficios ofrece?</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Gestión de materiales y unidades por almacén</li>
            <li>Historial de movimientos con respaldo</li>
            <li>Carga de documentos e imágenes por unidad</li>
            <li>Roles y permisos personalizados por usuario</li>
            <li>Exportación en múltiples formatos</li>
            <li>Visualización rápida y responsiva</li>
            <li>Interfaz amigable para cualquier tipo de usuario</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">¿A quién le puede servir?</h2>
          <p>
            Está pensado para laboratorios escolares, universidades, departamentos de materiales, instituciones
            gubernamentales, PYMEs logísticas, técnicos de campo y centros de innovación.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">¿Por qué confiar en este sistema?</h2>
          <p>
            Porque ha sido diseñado desde necesidades reales, optimizado para uso cotidiano, construido con tecnologías
            modernas (Next.js, PostgreSQL, Tailwind), y proyectado a futuro con módulos de inteligencia artificial y
            automatización.
          </p>
        </div>
      </section>

      {/* Accesos rápidos */}
      <motion.section
        className="max-w-6xl mx-auto px-6 sm:px-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center text-amber-700 mb-6">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {accesos.map(({ nombre, ruta, icono, descripcion }, i) => (
            <Link key={ruta} href={ruta}>
              <motion.div
                className="bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all rounded-xl p-6 text-center border border-gray-100 dark:border-gray-800 hover:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                tabIndex={0}
              >
                <div className="mb-3 flex justify-center">{icono}</div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {nombre}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
