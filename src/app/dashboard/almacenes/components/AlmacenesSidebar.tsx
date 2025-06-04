"use client";
import Link from "next/link";
import {
  Warehouse,
  Star,
  Users,
  Bell,
  Archive,
  AlertTriangle,
  FileBarChart,
  Layers,
  Settings,
  Inbox,
  FileUp,
  FileDown,
  FolderKanban,
  BookMarked,
  HelpCircle,
  Zap,
  PlusCircle,
} from "lucide-react";
import { useDashboardUI } from "../../ui"; // Ajusta el import según tu estructura

const SIDEBAR_GLOBAL_WIDTH = 256; // Debe coincidir con el layout global
const SIDEBAR_ALMACENES_WIDTH = 192;

export default function AlmacenesSidebar() {
  // Lo ideal es que esto venga del context global de dashboard
  const { sidebarGlobalVisible = true } = useDashboardUI();

  // Calcula el left dinámico según el estado global
  const sidebarLeft = sidebarGlobalVisible ? SIDEBAR_GLOBAL_WIDTH : 0;

  return (
    <aside
      style={{
        left: sidebarLeft,
        width: SIDEBAR_ALMACENES_WIDTH,
        minWidth: SIDEBAR_ALMACENES_WIDTH,
      }}
      className={`
        fixed top-0 h-screen z-40
        border-r border-[var(--dashboard-border)]
        bg-[var(--dashboard-sidebar)]
        flex flex-col gap-2 transition-all duration-300
      `}
    >
      {/* Título de sección */}
      <span className="mb-2 px-2 py-1 font-bold text-xs text-[var(--dashboard-accent)] uppercase tracking-widest">
        Almacenes
      </span>
      {/* Navegación principal */}
      <nav className="flex flex-col gap-1 text-sm font-medium">
        <Link href="/dashboard/almacenes" className="sidebar-link">
          <Warehouse className="w-4 h-4 mr-2 inline-block" />
          Todos mis almacenes
        </Link>
        <Link href="/dashboard/almacenes/favoritos" className="sidebar-link">
          <Star className="w-4 h-4 mr-2 inline-block" />
          Favoritos
        </Link>
        <Link href="/dashboard/almacenes/compartidos" className="sidebar-link">
          <Users className="w-4 h-4 mr-2 inline-block" />
          Compartidos conmigo
        </Link>
        <Link href="/dashboard/almacenes/archivados" className="sidebar-link">
          <Archive className="w-4 h-4 mr-2 inline-block" />
          Archivados
        </Link>
      </nav>

      <hr className="my-3 border-[var(--dashboard-border)]" />

      <span className="px-2 py-1 font-bold text-xs text-[var(--dashboard-muted)] uppercase tracking-widest">
        Notificaciones y Alertas
      </span>
      <nav className="flex flex-col gap-1 text-sm">
        <Link href="/dashboard/almacenes/alertas" className="sidebar-link">
          <AlertTriangle className="w-4 h-4 mr-2 inline-block" />
          Alertas / Bajo stock
        </Link>
        <Link href="/dashboard/almacenes/notificaciones" className="sidebar-link">
          <Bell className="w-4 h-4 mr-2 inline-block" />
          Notificaciones
        </Link>
      </nav>

      <hr className="my-3 border-[var(--dashboard-border)]" />

      <span className="px-2 py-1 font-bold text-xs text-[var(--dashboard-muted)] uppercase tracking-widest">
        Gestión y Reportes
      </span>
      <nav className="flex flex-col gap-1 text-sm">
        <Link href="/dashboard/almacenes/reportes" className="sidebar-link">
          <FileBarChart className="w-4 h-4 mr-2 inline-block" />
          Analíticas y reportes
        </Link>
        <Link href="/dashboard/almacenes/categorias" className="sidebar-link">
          <Layers className="w-4 h-4 mr-2 inline-block" />
          Categorías y ubicaciones
        </Link>
        <Link href="/dashboard/almacenes/importaciones" className="sidebar-link">
          <FileUp className="w-4 h-4 mr-2 inline-block" />
          Importaciones recientes
        </Link>
        <Link href="/dashboard/almacenes/exportaciones" className="sidebar-link">
          <FileDown className="w-4 h-4 mr-2 inline-block" />
          Exportaciones recientes
        </Link>
        <Link href="/dashboard/almacenes/plantillas" className="sidebar-link">
          <FolderKanban className="w-4 h-4 mr-2 inline-block" />
          Plantillas y bancos
        </Link>
        <Link href="/dashboard/almacenes/pendientes" className="sidebar-link">
          <Inbox className="w-4 h-4 mr-2 inline-block" />
          Tareas y pendientes
        </Link>
      </nav>

      <hr className="my-3 border-[var(--dashboard-border)]" />

      <span className="px-2 py-1 font-bold text-xs text-[var(--dashboard-muted)] uppercase tracking-widest">
        Avanzado
      </span>
      <nav className="flex flex-col gap-1 text-sm">
        <Link href="/dashboard/almacenes/auditorias" className="sidebar-link">
          <BookMarked className="w-4 h-4 mr-2 inline-block" />
          Auditorías
        </Link>
        <Link href="/dashboard/almacenes/integraciones" className="sidebar-link">
          <Zap className="w-4 h-4 mr-2 inline-block" />
          Integraciones y API
        </Link>
        <Link href="/dashboard/almacenes/ajustes" className="sidebar-link">
          <Settings className="w-4 h-4 mr-2 inline-block" />
          Configuración avanzada
        </Link>
        <Link href="/dashboard/almacenes/ayuda" className="sidebar-link">
          <HelpCircle className="w-4 h-4 mr-2 inline-block" />
          Ayuda / Soporte
        </Link>
      </nav>

      {/* Botón para crear almacén fijo abajo */}
      <div className="mt-auto mb-2">
        <Link
          href="/dashboard/almacenes/nuevo"
          className="sidebar-link bg-[var(--dashboard-accent)]/20 text-[var(--dashboard-accent)] font-semibold rounded-md py-2 flex items-center justify-center gap-2 hover:bg-[var(--dashboard-accent)]/40 transition"
        >
          <PlusCircle className="w-5 h-5" />
          Crear almacén
        </Link>
      </div>
    </aside>
  );
}
