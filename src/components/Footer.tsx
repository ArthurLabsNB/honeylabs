export default function Footer() {
  return (
    <footer className="bg-amber-50 border-t border-amber-200 text-center py-6 mt-12 text-sm text-amber-700">
      <p>
        © {new Date().getFullYear()} HoneyLabs. Todos los derechos reservados.
      </p>
      <p className="text-xs text-amber-500 mt-1">
        Versión experimental para fines educativos y logísticos.
      </p>
    </footer>
  );
}
