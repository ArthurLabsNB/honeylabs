// src/app/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`
          bg-[var(--color-background)] text-[var(--color-foreground)]
          font-sans antialiased transition-colors duration-300
          overflow-x-hidden
        `}
      >
        {children}
      </body>
    </html>
  );
}
