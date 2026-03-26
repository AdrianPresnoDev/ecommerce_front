"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-wide text-stone-800">
          Galería de Arte
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-stone-600">
          <Link href="/" className="hover:text-stone-900 transition-colors">Galería</Link>
          <Link href="/?category=Paisaje" className="hover:text-stone-900 transition-colors">Paisajes</Link>
          <Link href="/?category=Retrato" className="hover:text-stone-900 transition-colors">Retratos</Link>
          <Link href="/?category=Abstracto" className="hover:text-stone-900 transition-colors">Abstracto</Link>
          <Link href="/?category=Floral" className="hover:text-stone-900 transition-colors">Floral</Link>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <div className="w-5 h-0.5 bg-stone-700 mb-1" />
          <div className="w-5 h-0.5 bg-stone-700 mb-1" />
          <div className="w-5 h-0.5 bg-stone-700" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-[#faf8f5] px-4 py-4 flex flex-col gap-4 text-sm text-stone-600">
          <Link href="/" onClick={() => setOpen(false)}>Galería</Link>
          <Link href="/?category=Paisaje" onClick={() => setOpen(false)}>Paisajes</Link>
          <Link href="/?category=Retrato" onClick={() => setOpen(false)}>Retratos</Link>
          <Link href="/?category=Abstracto" onClick={() => setOpen(false)}>Abstracto</Link>
          <Link href="/?category=Floral" onClick={() => setOpen(false)}>Floral</Link>
        </div>
      )}
    </header>
  );
}
