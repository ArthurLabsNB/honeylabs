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
} from "lucide-react";
import { useDashboardUI } from "../../ui";
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
  SIDEBAR_ALMACENES_WIDTH,
  NAVBAR_HEIGHT,
} from "../../constants";

export default function AlmacenesSidebar() {
  // Lo ideal es que esto venga del context global de dashboard
  const { sidebarGlobalVisible = true, sidebarGlobalCollapsed } =
    useDashboardUI();

  const sidebarLeft = sidebarGlobalVisible
    ? sidebarGlobalCollapsed
      ? SIDEBAR_GLOBAL_COLLAPSED_WIDTH
      : SIDEBAR_GLOBAL_WIDTH
    : 0;

  return (
    <aside
      style={{
        left: sidebarLeft,
        width: SIDEBAR_ALMACENES_WIDTH,
        minWidth: SIDEBAR_ALMACENES_WIDTH,
        top: NAVBAR_HEIGHT,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
      className={`
        fixed z-40
        border-r border-[var(--dashboard-border)]
        bg-[var(--dashboard-sidebar)]
        flex flex-col gap-2 transition-all duration-300
      `}
      data-oid="b5knf_k"
    >
      {/* Título de sección */}
      <span
        className="mb-2 px-2 py-1 font-bold text-xs text-[var(--dashboard-accent)] uppercase tracking-widest"
        data-oid="iqp9yz-"
      >
        Almacenes
      </span>
      {/* Navegación principal */}
      <nav
        className="flex flex-col gap-1 text-sm font-medium"
        data-oid="vu5vixb"
      >
        <Link
          href="/dashboard/almacenes"
          className="sidebar-link"
          data-oid="jgk:tqr"
        >
          <Warehouse className="w-4 h-4 mr-2 inline-block" data-oid=".9.07d1" />
          Todos mis almacenes
        </Link>
        <Link
          href="/dashboard/almacenes/favoritos"
          className="sidebar-link"
          data-oid="m7ezcp0"
        >
          <Star className="w-4 h-4 mr-2 inline-block" data-oid="03.lial" />
          Favoritos
        </Link>
        <Link
          href="/dashboard/almacenes/compartidos"
          className="sidebar-link"
          data-oid="kd2.4hs"
        >
          <Users className="w-4 h-4 mr-2 inline-block" data-oid="gw6mw:x" />
          Compartidos conmigo
        </Link>
        <Link
          href="/dashboard/almacenes/archivados"
          className="sidebar-link"
          data-oid="tpsj37f"
        >
          <Archive className="w-4 h-4 mr-2 inline-block" data-oid="rrf6g_e" />
          Archivados
        </Link>
      </nav>

      <hr
        className="my-3 border-[var(--dashboard-border)]"
        data-oid="txa1cnv"
      />

      <span
        className="px-2 py-1 font-bold text-xs text-[var(--dashboard-muted)] uppercase tracking-widest"
        data-oid="x-1fbkb"
      >
        Operaciones
      </span>
      <nav className="flex flex-col gap-1 text-sm" data-oid="tejrd9e">
        <Link
          href="/dashboard/almacenes/pendientes"
          className="sidebar-link"
          data-oid="--u:of-"
        >
          <Inbox className="w-4 h-4 mr-2 inline-block" data-oid="vzlcmax" />
          Tareas y pendientes
        </Link>
        <Link
          href="/dashboard/almacenes/categorias"
          className="sidebar-link"
          data-oid="d-f8n4k"
        >
          <Layers className="w-4 h-4 mr-2 inline-block" data-oid="ydrtzml" />
          Categorías y ubicaciones
        </Link>
        <Link
          href="/dashboard/almacenes/plantillas"
          className="sidebar-link"
          data-oid="a52z9y4"
        >
          <FolderKanban
            className="w-4 h-4 mr-2 inline-block"
            data-oid=".a75tb7"
          />
          Plantillas y bancos
        </Link>
        <Link
          href="/dashboard/almacenes/importaciones"
          className="sidebar-link"
          data-oid="d.qo1na"
        >
          <FileUp className="w-4 h-4 mr-2 inline-block" data-oid="_.12w5u" />
          Importaciones recientes
        </Link>
        <Link
          href="/dashboard/almacenes/exportaciones"
          className="sidebar-link"
          data-oid="2s2n8k0"
        >
          <FileDown className="w-4 h-4 mr-2 inline-block" data-oid="05e3c8h" />
          Exportaciones recientes
        </Link>
      </nav>

      <hr
        className="my-3 border-[var(--dashboard-border)]"
        data-oid="ikje0ee"
      />

      <span
        className="px-2 py-1 font-bold text-xs text-[var(--dashboard-muted)] uppercase tracking-widest"
        data-oid="057nd0:"
      >
        Reportes y Alertas
      </span>
      <nav className="flex flex-col gap-1 text-sm" data-oid="u99cw0j">
        <Link
          href="/dashboard/almacenes/reportes"
          className="sidebar-link"
          data-oid="g26.kgo"
        >
          <FileBarChart
            className="w-4 h-4 mr-2 inline-block"
            data-oid="bkh:xm_"
          />
          Analíticas y reportes
        </Link>
        <Link
          href="/dashboard/almacenes/alertas"
          className="sidebar-link"
          data-oid="v40_::y"
        >
          <AlertTriangle
            className="w-4 h-4 mr-2 inline-block"
            data-oid="4nxe-pn"
          />
          Alertas / Bajo stock
        </Link>
        <Link
          href="/dashboard/almacenes/notificaciones"
          className="sidebar-link"
          data-oid="wi5t.we"
        >
          <Bell className="w-4 h-4 mr-2 inline-block" data-oid="ex:3xey" />
          Notificaciones
        </Link>
      </nav>

      <hr
        className="my-3 border-[var(--dashboard-border)]"
        data-oid="c5nb2yi"
      />

      <span
        className="px-2 py-1 font-bold text-xs text-[var(--dashboard-muted)] uppercase tracking-widest"
        data-oid="ip73m1d"
      >
        Avanzado
      </span>
      <nav className="flex flex-col gap-1 text-sm" data-oid="_8xcd9s">
        <Link
          href="/dashboard/almacenes/auditorias"
          className="sidebar-link"
          data-oid="9uel6at"
        >
          <BookMarked
            className="w-4 h-4 mr-2 inline-block"
            data-oid="bo31u8:"
          />
          Auditorías
        </Link>
        <Link
          href="/dashboard/almacenes/integraciones"
          className="sidebar-link"
          data-oid="2j5bf_7"
        >
          <Zap className="w-4 h-4 mr-2 inline-block" data-oid=".4owihq" />
          Integraciones y API
        </Link>
        <Link
          href="/dashboard/almacenes/ajustes"
          className="sidebar-link"
          data-oid="l_sbux:"
        >
          <Settings className="w-4 h-4 mr-2 inline-block" data-oid="ot9nowg" />
          Configuración avanzada
        </Link>
        <Link
          href="/dashboard/almacenes/ayuda"
          className="sidebar-link"
          data-oid="q49vd0y"
        >
          <HelpCircle
            className="w-4 h-4 mr-2 inline-block"
            data-oid="q3btevl"
          />
          Ayuda / Soporte
        </Link>
      </nav>

      <div className="mt-auto" data-oid="ux:tnvk" />
    </aside>
  );
}
