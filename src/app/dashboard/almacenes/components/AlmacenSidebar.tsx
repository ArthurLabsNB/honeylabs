"use client";

import { 
  Warehouse,
  Star,
  Users,
  Archive,
  Inbox,
  Layers,
  FolderKanban,
  FileUp,
  FileDown,
  BookOpen,
  Box,
  Settings,
  Tag,
  FileText,
  History
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- Estilos base ---
const menuItemStyle = "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 text-gray-300 transition-colors";
const sectionStyle = "mb-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider";

function MenuLink({ 
  href, 
  icon: Icon, 
  label 
}: { 
  href: string, 
  icon: any, 
  label: string 
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`${menuItemStyle} ${
        isActive 
          ? "bg-[var(--dashboard-accent)]/10 text-white font-medium" 
          : "hover:text-white"
      }`}
    >
      <Icon 
        className={`w-5 h-5 ${isActive ? "text-[var(--dashboard-accent)]" : "text-gray-400"}`} 
      />
      <span>{label}</span>
    </Link>
  );
}

export default function AlmacenSidebar({ 
  mode = "list" 
}: { 
  mode?: "list" | "detail" 
}) {
  // --- Sidebar modo detalle (vista de un almacén específico) ---
  if (mode === "detail") {
    return (
      <aside className="w-64 h-full overflow-y-auto bg-[var(--dashboard-sidebar)] border-r border-[var(--dashboard-border)] py-4">
        <div className="space-y-6">
          <div>
            <h3 className={sectionStyle}>Navegación</h3>
            <nav className="space-y-1 px-3">
              <MenuLink href="#" icon={Box} label="Inventario" />
              <MenuLink href="#categorias" icon={Tag} label="Categorías" />
              <MenuLink href="#ubicaciones" icon={Layers} label="Ubicaciones" />
              <MenuLink href="#movimientos" icon={History} label="Movimientos" />
              <MenuLink href="#reportes" icon={FileText} label="Reportes" />
            </nav>
          </div>
          
          <div>
            <h3 className={sectionStyle}>Configuración</h3>
            <nav className="space-y-1 px-3">
              <MenuLink href="#usuarios" icon={Users} label="Usuarios" />
              <MenuLink href="#configuracion" icon={Settings} label="Ajustes" />
            </nav>
          </div>
        </div>
      </aside>
    );
  }

  // --- Sidebar modo lista (todos los almacenes) ---
  return (
    <aside className="w-64 h-full overflow-y-auto bg-[var(--dashboard-sidebar)] border-r border-[var(--dashboard-border)] py-6">
      <div className="space-y-8">
        {/* Sección: Almacenes */}
        <section>
          <h3 className={sectionStyle}>Mis almacenes</h3>
          <nav className="space-y-1 px-3">
            <MenuLink 
              href="/dashboard/almacenes" 
              icon={Warehouse} 
              label="Todos mis almacenes" 
            />
            <MenuLink 
              href="/dashboard/almacenes/favoritos" 
              icon={Star} 
              label="Favoritos" 
            />
            <MenuLink 
              href="/dashboard/almacenes/compartidos" 
              icon={Users} 
              label="Compartidos conmigo" 
            />
            <MenuLink 
              href="/dashboard/almacenes/archivados" 
              icon={Archive} 
              label="Archivados" 
            />
          </nav>
        </section>

        {/* Sección: Operaciones */}
        <section>
          <h3 className={sectionStyle}>Operaciones</h3>
          <nav className="space-y-1 px-3">
            <MenuLink 
              href="/dashboard/almacenes/pendientes" 
              icon={Inbox} 
              label="Tareas y pendientes" 
            />
            <MenuLink 
              href="/dashboard/almacenes/categorias" 
              icon={Tag} 
              label="Categorías" 
            />
            <MenuLink 
              href="/dashboard/almacenes/plantillas" 
              icon={FolderKanban} 
              label="Plantillas" 
            />
          </nav>
        </section>

        {/* Sección: Herramientas */}
        <section>
          <h3 className={sectionStyle}>Herramientas</h3>
          <nav className="space-y-1 px-3">
            <MenuLink 
              href="/dashboard/almacenes/importaciones" 
              icon={FileUp} 
              label="Importar" 
            />
            <MenuLink 
              href="/dashboard/almacenes/exportaciones" 
              icon={FileDown} 
              label="Exportar" 
            />
          </nav>
        </section>
      </div>
    </aside>
  );
}
