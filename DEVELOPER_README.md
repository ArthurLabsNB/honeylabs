# HoneyLabs Developer Overview

Este documento resume los archivos y directorios clave del proyecto para que cualquier programador pueda ubicarse rápidamente.

## Tecnologías
- **Frontend:** Next.js 15 con React 19 y TypeScript.
- **Estilos:** TailwindCSS y CSS Modules.
- **Backend:** API Routes de Next.js y Prisma ORM sobre PostgreSQL.
- **Otros:** Zustand para estado, bcryptjs para hashing y JWT para autenticación.

## Frontend
- **src/app/** – Páginas y rutas. Aquí se encuentran las vistas de la aplicación.
  - **layout.tsx** – Diseño raíz con proveedores y estilos globales.
  - **page.tsx** – Página principal pública.
  - **dashboard/** – Contiene el panel privado y sus componentes.
    - **page.tsx** – Vista principal del dashboard. Maneja widgets y su disposición.
    - **components/** – NavbarDashboard, Sidebar y otros elementos reutilizables.
  - **configuracion/** – Página de configuración y perfil de usuario.
- **src/components/** – Componentes generales como `Navbar`, `Footer`, `UserMenu` y layouts condicionales.
- **public/** – Recursos estáticos como imágenes y logos.

## Backend
- **src/app/api/** – Endpoints que resuelven la lógica de servidor.
  - **login/** – Manejo de autenticación (login, logout y verificación de sesión).
  - **dashboard/layout/** – Guarda la distribución de widgets del usuario.
  - **preferences/** – Nuevo endpoint para obtener y actualizar preferencias generales.
  - **perfil/** – Permite consultar y actualizar datos de perfil.
- **lib/** – Utilidades compartidas.
  - **auth.ts** – Obtiene el usuario actual desde la cookie de sesión.
  - **prisma.ts** – Inicializa Prisma Client.
  - **constants.ts** – Valores globales usados en varias partes del código.
- **prisma/** – Esquema y migraciones de base de datos.

## Otros Archivos
- **next.config.ts** – Configuración de Next.js.
- **tsconfig.json** – Opciones de compilación de TypeScript.
- **package.json** – Dependencias y scripts disponibles.

Este resumen sirve como guía rápida de la estructura del proyecto y los principales archivos que lo componen.
