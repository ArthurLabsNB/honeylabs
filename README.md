# 🍯 HoneyLabs – Plataforma Integral de Gestión de Laboratorios y Almacenes

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)

## Tabla de Contenidos

- [🍯 HoneyLabs – Plataforma Integral de Gestión de Laboratorios y Almacenes](#-honeylabs--plataforma-integral-de-gestión-de-laboratorios-y-almacenes)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Descripción](#descripción)
  - [Estado del Proyecto](#estado-del-proyecto)
  - [Características](#características)
  - [Tecnologías](#tecnologías)
  - [Instalación](#instalación)
  - [Uso](#uso)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Roadmap](#roadmap)
  - [Parches](#parches)
  - [Contribución](#contribución)
  - [Licencia](#licencia)
  - [Contacto](#contacto)

---

## Descripción

**HoneyLabs** es una plataforma integral diseñada para la gestión eficiente de laboratorios y almacenes universitarios. Permite el registro, control y seguimiento de inventarios, préstamos y devoluciones de materiales, así como la administración de usuarios y reportes de incidencias.

---

## Estado del Proyecto

🚧 **En desarrollo activo**
Actualmente se están implementando las funcionalidades principales. Se aceptan sugerencias y contribuciones.

## Version

0.1.3

---

## Características

- Registro y autenticación de usuarios
- Gestión avanzada de inventarios
- Control de préstamos y devoluciones de materiales
- Administración de usuarios y roles
- Reporte y seguimiento de incidencias
- Panel de control intuitivo
- Notificaciones y alertas

---

## Tecnologías

- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, Prisma
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Despliegue:** Vercel

---

## Instalación

Clona el repositorio y ejecuta los siguientes comandos:

```sh
git clone https://github.com/ArthurLabsNB/honeylabs.git
cd honeylabs
npm install
npm install -D prisma 
npm install prisma --save-dev
npx prisma migrate dev
npx prisma migrate deploy
vercel --prod
```

Configura las variables de entorno copiando `.env.example` a `.env` y ajustando los valores necesarios.

---

## Uso

Para iniciar el entorno de desarrollo:

```sh
npm run dev
```

La aplicación estará disponible en [honeylabs.vercel.app] por el momento hasta que se tenga un host fijo.
Entender que este repositorio solo cuenta "Funcional" la base del proyecto, no se piensa colocar completo por el momento.

---

## Estructura del Proyecto

```
honeylabs/
├── app/                # Páginas y rutas principales
├── components/         # Componentes reutilizables de React
├── lib/                # Funciones y utilidades compartidas
├── prisma/             # Esquema y migraciones de base de datos
├── public/             # Recursos estáticos (imágenes, iconos)
├── styles/             # Archivos de estilos globales
├── tests/              # Pruebas unitarias y de integración
├── .env.example        # Variables de entorno de ejemplo
└── README.md           # Este archivo
```

---

## Roadmap

- [x] Estructura inicial del proyecto
- [ ] Autenticación y registro de usuarios
- [ ] Gestión de inventario
- [ ] Control de préstamos y devoluciones
- [ ] Panel de administración
- [ ] Reporte de incidencias
- [ ] Notificaciones y alertas

## Parches
* El menú de usuario ahora también se abre al hacer clic en el avatar del dashboard.


---

## Contribución

¡Las contribuciones son bienvenidas!  
Por favor, abre un issue para reportar errores o sugerir mejoras. Para contribuir con código, crea un fork del repositorio y envía un pull request.

---

## Licencia

Este proyecto está bajo la licencia MIT.

---

## Contacto

¿Tienes dudas o sugerencias?  
Escríbenos a: logisticshoneylabs@gmail.com
O abre un [issue en GitHub](https://github.com/tu-org/honeylabs/issues)
