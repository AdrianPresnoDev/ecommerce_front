"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetCollections, adminDeleteCollection, adminUpdateCollection } from "@/lib/api";
import Image from "next/image";

interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  color?: string;
  heroImageUrl?: string;
  active: boolean;
  sortOrder: number;
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  function getKey() { return localStorage.getItem("adminApiKey") || ""; }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetCollections(getKey());
      setCollections(data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar la colección "${title}"? Los cuadros NO se eliminan.`)) return;
    setDeleting(id);
    try {
      await adminDeleteCollection(getKey(), id);
      await load();
    } catch (e: any) { alert("Error: " + e.message); }
    finally { setDeleting(null); }
  }

  async function toggleActive(col: Collection) {
    try {
      await adminUpdateCollection(getKey(), col.id, { active: !col.active });
      await load();
    } catch (e: any) { alert("Error: " + e.message); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800">Colecciones</h1>
        <Link href="/admin/collections/new"
          className="bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-stone-700 transition-colors">
          + Nueva colección
        </Link>
      </div>

      {loading && <p className="text-stone-400 text-sm">Cargando...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && collections.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <p>No hay colecciones todavía. Crea la primera.</p>
        </div>
      )}

      <div className="space-y-3">
        {collections.map(col => (
          <div key={col.id} className="bg-white rounded-lg border border-stone-200 p-4 flex items-center gap-4">
            {/* Hero image thumbnail */}
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
              {col.heroImageUrl ? (
                <Image src={col.heroImageUrl} alt={col.title} width={56} height={56} className="object-cover w-full h-full" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${col.color || "from-stone-400 to-stone-600"}`} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-stone-800 truncate">{col.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.active ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"}`}>
                  {col.active ? "Activa" : "Oculta"}
                </span>
              </div>
              {col.description && <p className="text-xs text-stone-500 truncate">{col.description}</p>}
              <p className="text-xs text-stone-400 mt-0.5">/{col.slug}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggleActive(col)}
                className="text-xs text-stone-500 hover:text-stone-800 border border-stone-200 px-2.5 py-1.5 rounded transition-colors">
                {col.active ? "Ocultar" : "Publicar"}
              </button>
              <Link href={`/admin/collections/${col.id}/edit`}
                className="text-xs text-stone-700 border border-stone-300 px-2.5 py-1.5 rounded hover:bg-stone-50 transition-colors">
                Editar
              </Link>
              <button onClick={() => handleDelete(col.id, col.title)}
                disabled={deleting === col.id}
                className="text-xs text-red-500 border border-red-200 px-2.5 py-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-40">
                {deleting === col.id ? "..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
