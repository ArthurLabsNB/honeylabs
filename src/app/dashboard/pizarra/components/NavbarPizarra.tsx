"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NavbarPizarra() {
  return (
    <header
      className="dashboard-navbar flex items-center px-8 py-2 justify-between fixed top-0 left-0 right-0 z-20 shadow bg-[var(--dashboard-navbar)]"
      style={{ minHeight: "70px", width: "100%" }}
    >
      <div className="flex gap-4 items-center">
        <Link
          href="/dashboard"
          className="p-3 rounded-lg transition hover:bg-white/15 hover:backdrop-blur-sm focus:bg-white/25 active:bg-white/25"
        >
          <ArrowLeft className="w-6 h-6 text-[var(--dashboard-accent)]" />
        </Link>
        <span className="font-extrabold text-lg tracking-widest select-none">
          Pizarra
        </span>
      </div>
    </header>
  );
}
