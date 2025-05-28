// src/app/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-label="Área de autenticación"
      className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-foreground)]
                 font-sans antialiased transition-colors duration-300 overflow-x-hidden
                 flex flex-col items-center justify-center px-4 sm:px-6 py-8"
    >
      {children}
    </section>
  );
}
