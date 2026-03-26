"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminGetPaintings, adminUpdatePainting, adminDeletePainting } from "@/lib/api";

interface Painting {
  id: string;
  title: string;
  price: number;
  status: string;
  technique?: string;
  dimensions?: string;
  category?: string;
  featured: boolean;
  active: boolean;
  imageUrls: string[];
  sortOrder: number;
}

export default function AdminPaintingsPage() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  function getKey() {
    return localStorage.getItem("adminApiKey") || "";
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetPaintings(getKey(), { limit: "200", includeInactive: "true" });
      setPaintings(data.paintings || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggle(id: string, field: "featured" | "active", current: boolean) {
    try {
      await adminUpdatePainting(getKey(), id, { [field]: !current });
      setPaintings(ps => ps.map(p => p.id === id ? { ...p, [field]: !current } : p));
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  async function setStatus(id: string, status: string) {
    try {
      await adminUpdatePainting(getKey(), id, { status });
      setPaintings(ps => ps.map(p => p.id === id ? { ...p, status } : p));
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  async function deletePainting(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    try {
      await adminDeletePainting(getKey(), id);
      setPaintings(ps => ps.filter(p => p.id !== id));
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setDeleting(null);
    }
  }

  const statusColors: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700",
    reserved: "bg-amber-100 text-amber-700",
    sold: "bg-stone-100 text-stone-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800">Cuadros</h1>
        <Link
          href="/admin/paintings/new"
          className="bg-stone-800 text-white px-4 py-2 text-sm font-semibold rounded hover:bg-stone-700 transition-colors"
        >
          + Nuevo cuadro
        </Link>
      </div>

      {loading && <p className="text-stone-400 text-sm">Cargando...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && paintings.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <p>No hay cuadros todavía.</p>
          <Link href="/admin/paintings/new" className="text-stone-600 underline mt-2 inline-block text-sm">
            Crear el primero
          </Link>
        </div>
      )}

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        {paintings.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center gap-4 p-4 ${i > 0 ? "border-t border-stone-100" : ""} ${!p.active ? "opacity-50" : ""}`}
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded bg-stone-100 flex-shrink-0 overflow-hidden relative">
              {p.imageUrls?.[0] ? (
                <Image src={p.imageUrls[0]} alt={p.title} fill className="object-cover" sizes="56px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">Sin foto</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-800 truncate">{p.title}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {p.technique && <span className="text-xs text-stone-400">{p.technique}</span>}
                {p.dimensions && <span className="text-xs text-stone-400">{p.dimensions}</span>}
                {p.category && <span className="text-xs text-stone-400">· {p.category}</span>}
              </div>
            </div>

            {/* Price */}
            <div className="text-sm font-semibold text-stone-700 w-20 text-right">
              {Number(p.price).toLocaleString("es-ES")} €
            </div>

            {/* Status */}
            <select
              value={p.status}
              onChange={e => setStatus(p.id, e.target.value)}
              className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColors[p.status] || "bg-stone-100 text-stone-500"}`}
            >
              <option value="available">Disponible</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
            </select>

            {/* Toggles */}
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => toggle(p.id, "featured", p.featured)}
                title={p.featured ? "Quitar destacado" : "Destacar"}
                className={`transition-colors ${p.featured ? "text-amber-500" : "text-stone-300 hover:text-amber-400"}`}
              >
                ★
              </button>
              <button
                onClick={() => toggle(p.id, "active", p.active)}
                title={p.active ? "Ocultar" : "Mostrar"}
                className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                  p.active
                    ? "border-emerald-300 text-emerald-600 hover:bg-red-50 hover:border-red-300 hover:text-red-500"
                    : "border-stone-300 text-stone-400 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {p.active ? "Visible" : "Oculto"}
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/paintings/${p.id}/edit`}
                className="text-xs text-stone-500 hover:text-stone-800 underline transition-colors"
              >
                Editar
              </Link>
              <button
                onClick={() => deletePainting(p.id, p.title)}
                disabled={deleting === p.id}
                className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {deleting === p.id ? "..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
