"use client";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function FloatingAdd({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-[var(--dashboard-accent)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
      data-oid="floating-add"
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
}
