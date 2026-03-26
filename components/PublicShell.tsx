"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-stone-400">
          <p>© {new Date().getFullYear()} Galería de Arte. Todos los derechos reservados.</p>
          <p className="mt-1">Cuadros originales pintados a mano · Envío a toda España</p>
        </div>
      </footer>
    </>
  );
}
