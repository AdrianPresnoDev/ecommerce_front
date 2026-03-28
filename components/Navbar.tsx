"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-playfair)] text-2xl text-gray-900"
          >
            Inma Álvarez
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-700">
            <a href="/#galeria" className="hover:text-gray-900 transition-colors">Galería</a>
            <a href="/#sobre" className="hover:text-gray-900 transition-colors">Sobre Mí</a>
            <a href="/#colecciones" className="hover:text-gray-900 transition-colors">Colecciones</a>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">Contacto</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4 text-sm text-gray-700">
            <a href="/#galeria" onClick={() => setOpen(false)}>Galería</a>
            <a href="/#sobre" onClick={() => setOpen(false)}>Sobre Mí</a>
            <a href="/#colecciones" onClick={() => setOpen(false)}>Colecciones</a>
            <Link href="/contact" onClick={() => setOpen(false)}>Contacto</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
