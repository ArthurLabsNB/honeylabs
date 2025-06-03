// src/app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label="Área de autenticación"
      className="
        min-h-screen w-full
        bg-[var(--color-background)] text-[var(--color-foreground)]
        font-sans antialiased transition-colors duration-300 overflow-x-hidden
        flex flex-col items-center justify-center
        px-4 sm:px-6 py-8
        relative
      "
      tabIndex={-1} // Accesibilidad: permite salto con tab al inicio de layout
      data-oid="kycia8i"
    >
      {/* Espacio para un posible logo */}
      {/* <div className="mb-8">
         <Logo width={64} height={64} />
        </div> */}
      {children}
      {/* Pie de página opcional para branding o links legales */}
      {/* <footer className="mt-12 text-xs text-center text-gray-400">HoneyLabs &copy; {new Date().getFullYear()}</footer> */}
    </section>
  );
}
