"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("adminApiKey");
    if (!key && pathname !== "/admin/login") {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (!ready) return null;

  if (pathname === "/admin/login") return <>{children}</>;

  function logout() {
    localStorage.removeItem("adminApiKey");
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin navbar */}
      <header className="bg-stone-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-[family-name:var(--font-playfair)] text-lg">Admin</span>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/admin/paintings"
                className={`hover:text-stone-300 transition-colors ${
                  pathname.startsWith("/admin/paintings") ? "text-white font-medium" : "text-stone-400"
                }`}
              >
                Cuadros
              </Link>
              <Link
                href="/admin/offers"
                className={`hover:text-stone-300 transition-colors ${
                  pathname.startsWith("/admin/offers") ? "text-white font-medium" : "text-stone-400"
                }`}
              >
                Ofertas
              </Link>
              <Link
                href="/admin/collections"
                className={`hover:text-stone-300 transition-colors ${
                  pathname.startsWith("/admin/collections") ? "text-white font-medium" : "text-stone-400"
                }`}
              >
                Colecciones
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-stone-400 hover:text-stone-200 transition-colors">
              Ver galería ↗
            </Link>
            <button
              onClick={logout}
              className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
