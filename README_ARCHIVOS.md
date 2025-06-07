# Documentación de Archivos y Análisis del Proyecto HoneyLabs

Este documento resume la estructura actual del repositorio, las tecnologías empleadas y las posibles extensiones futuras de HoneyLabs.

## Sistemas y Lenguajes
- **Frontend:** Next.js 15 sobre React 19 y TypeScript.
- **Backend:** API Routes de Next.js con Prisma ORM.
- **Base de Datos:** PostgreSQL administrada con PgAdmin.
- **Estilos:** TailwindCSS y CSS Modules.
- **Servidor y Despliegue:** Vercel para la aplicación y GitHub como control de versiones.

## Metodología
El desarrollo se realiza en GitHub usando dos ramas principales:
1. `main` para el código estable.
2. `features` para nuevas funcionalidades.

A lo largo del proyecto se han registrado más de 300 commits entre actualizaciones y correcciones. Cada cambio significativo se documenta en el archivo `CHANGELOG.md` y se versiona desde el `README.md`.

## Secciones del Proyecto
El código fuente se encuentra en `src/app` y se organiza por páginas y rutas:
- `(auth)/login` y `(auth)/registro` – Pantallas de autenticación y registro.
- `dashboard` – Área privada con widgets, alertas, almacenes y módulo de facturación.
- `ayuda`, `acerca`, `contacto` – Información general y soporte al usuario.
- `configuracion` – Preferencias y perfil del usuario.
- `estado` – Consulta del estado del sistema.
- `docs` – Ejemplos y minijuegos usados como pruebas.
- `wiki` – Base de conocimiento en construcción.

Dentro de `dashboard` existen subsecciones como `almacenes`, `admin`, `network` y `app-center` que amplían la funcionalidad. Cada una cuenta con su propio `layout.tsx` y componentes dedicados.

## Funciones Actuales
- Gestión básica de usuarios y sesiones con JWT.
- Consulta y administración de almacenes.
- Sidebar dinámico con menús de herramientas.
- Widgets configurables en el dashboard.
- Módulo de plantillas y alertas.
- Soporte para minijuegos en la sección de documentación.

## Funciones Planeadas
- Control detallado de inventarios y operaciones en almacenes.
- Panel administrativo con roles y permisos avanzados.
- Sistema de notificaciones y recordatorios.
- Expansión de la wiki con guías completas.
- Integración de reportes y gráficas con Chart.js.

## Librerías Principales
- `@prisma/client` y `prisma` para el ORM.
- `react-hook-form` y `zod` para validaciones.
- `bcryptjs` y `jsonwebtoken` para la autenticación.
- `zustand` para manejo de estado ligero.
- `chart.js` y `react-chartjs-2` para gráficas.
- `framer-motion` y `@react-spring/web` para animaciones.

## Conclusión
HoneyLabs se mantiene modular para crecer a futuro. El uso de GitHub, control de versiones semántico y un pipeline de despliegue en Vercel asegura un desarrollo ordenado y colaborativo.
