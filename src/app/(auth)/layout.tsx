// src/app/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // ⚠️ Importante: Si tu layout raíz (src/app/layout.tsx) ya define <html> y <body>,
  // solo retorna un <div> o <section> aquí para evitar conflictos.
  // Si este archivo se usa como layout raíz (sin otro layout superior), puedes incluir <html> y <body>.

  return (
    <div
      className={`
        min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]
        font-sans antialiased transition-colors duration-300
        overflow-x-hidden flex flex-col items-center justify-center
      `}
    >
      {children}
    </div>
  );
}
