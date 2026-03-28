"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  adminCreateCollection, adminUpdateCollection,
  adminGetCollectionImageUploadUrl, adminSetCollectionHeroImage,
  adminGetCollections, adminGetPaintings,
  adminGetCollectionPaintings, adminAddPaintingToCollection, adminRemovePaintingFromCollection,
} from "@/lib/api";

interface Props {
  initialData?: {
    id: string; title: string; slug: string; description?: string;
    longDescription?: string; color?: string; heroImageUrl?: string;
    active: boolean; sortOrder: number;
  };
}

const GRADIENT_PRESETS = [
  { label: "Piedra", value: "from-stone-800 to-stone-600" },
  { label: "Violeta", value: "from-violet-900 to-violet-700" },
  { label: "Ámbar", value: "from-amber-800 to-amber-600" },
  { label: "Esmeralda", value: "from-emerald-900 to-emerald-700" },
  { label: "Azul", value: "from-blue-900 to-blue-700" },
  { label: "Rosa", value: "from-rose-900 to-rose-700" },
  { label: "Pizarra", value: "from-slate-800 to-slate-600" },
  { label: "Índigo", value: "from-indigo-900 to-indigo-700" },
];

export default function CollectionForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    longDescription: initialData?.longDescription || "",
    color: initialData?.color || "from-stone-800 to-stone-600",
    active: initialData?.active ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
  });
  const [heroUrl, setHeroUrl] = useState(initialData?.heroImageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paintings management (only in edit mode)
  const [colPaintings, setColPaintings] = useState<any[]>([]);
  const [allPaintings, setAllPaintings] = useState<any[]>([]);
  const [paintingsLoaded, setPaintingsLoaded] = useState(false);
  const [paintingsTab, setPaintingsTab] = useState(false);
  const [search, setSearch] = useState("");

  function getKey() { return localStorage.getItem("adminApiKey") || ""; }

  async function loadPaintings() {
    if (paintingsLoaded || !initialData?.id) return;
    try {
      const [inCol, all] = await Promise.all([
        adminGetCollectionPaintings(getKey(), initialData.id),
        adminGetPaintings(getKey(), { limit: "200" }),
      ]);
      setColPaintings(inCol || []);
      setAllPaintings(all.paintings || []);
      setPaintingsLoaded(true);
    } catch (e: any) { alert("Error cargando cuadros: " + e.message); }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const colId = initialData?.id;
      if (!colId) { alert("Guarda la colección primero para subir imagen."); return; }
      const { uploadUrl, key } = await adminGetCollectionImageUploadUrl(getKey(), colId, file.type);
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      const updated = await adminSetCollectionHeroImage(getKey(), colId, key);
      setHeroUrl(updated.heroImageUrl || "");
    } catch (e: any) { setError("Error subiendo imagen: " + e.message); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) };
      if (isEdit && initialData) {
        await adminUpdateCollection(getKey(), initialData.id, payload);
        router.push("/admin/collections");
      } else {
        const created = await adminCreateCollection(getKey(), payload);
        router.push(`/admin/collections/${created.id}/edit`);
      }
    } catch (e: any) { setError(e.message); setSaving(false); }
  }

  async function addPainting(paintingId: string) {
    try {
      const updated = await adminAddPaintingToCollection(getKey(), initialData!.id, paintingId);
      setColPaintings(updated || []);
    } catch (e: any) { alert("Error: " + e.message); }
  }

  async function removePainting(paintingId: string) {
    try {
      const updated = await adminRemovePaintingFromCollection(getKey(), initialData!.id, paintingId);
      setColPaintings(updated || []);
    } catch (e: any) { alert("Error: " + e.message); }
  }

  const inColIds = new Set(colPaintings.map((p: any) => p.id));
  const available = allPaintings.filter(p =>
    !inColIds.has(p.id) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || !search)
  );

  return (
    <div className="max-w-2xl">
      <div className="flex gap-1 mb-6 border-b border-stone-200">
        <button onClick={() => setPaintingsTab(false)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${!paintingsTab ? "border-stone-800 text-stone-800" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
          Datos de la colección
        </button>
        {isEdit && (
          <button onClick={() => { setPaintingsTab(true); loadPaintings(); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${paintingsTab ? "border-stone-800 text-stone-800" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
            Cuadros ({colPaintings.length})
          </button>
        )}
      </div>

      {!paintingsTab && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-1">Título *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-1">Descripción corta (para la tarjeta)</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-1">Descripción larga (página de colección)</label>
            <textarea rows={3} value={form.longDescription} onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400 resize-none" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-2">Color de fondo de la tarjeta</label>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENT_PRESETS.map(p => (
                <button key={p.value} type="button" onClick={() => setForm(f => ({ ...f, color: p.value }))}
                  className={`h-10 rounded-lg bg-gradient-to-br ${p.value} flex items-end p-1.5 transition-all ${form.color === p.value ? "ring-2 ring-offset-1 ring-stone-800 scale-105" : "opacity-70 hover:opacity-100"}`}>
                  <span className="text-white text-xs font-medium leading-none">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-2">Imagen de portada (hero)</label>
              <div className="flex items-center gap-4">
                {heroUrl ? (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-stone-200">
                    <Image src={heroUrl} alt="Hero" fill className="object-cover" />
                  </div>
                ) : (
                  <div className={`w-24 h-16 rounded-lg bg-gradient-to-br ${form.color} flex items-center justify-center`}>
                    <span className="text-white text-xs opacity-60">Sin imagen</span>
                  </div>
                )}
                <div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="text-sm border border-stone-300 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50">
                    {uploading ? "Subiendo..." : heroUrl ? "Cambiar imagen" : "Subir imagen"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-1">Orden</label>
              <input type="number" min="0" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400" />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 rounded accent-stone-800" />
                <span className="text-sm text-stone-700">Visible en la web</span>
              </label>
            </div>
          </div>

          {!isEdit && (
            <p className="text-xs text-stone-400 bg-stone-50 p-3 rounded-lg">
              Tras crear la colección podrás subir la imagen de portada y añadir cuadros.
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-stone-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50">
              {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear colección"}
            </button>
            <button type="button" onClick={() => router.push("/admin/collections")}
              className="text-stone-500 hover:text-stone-800 text-sm px-4 py-2.5 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {paintingsTab && isEdit && (
        <div className="space-y-6">
          {/* En la colección */}
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">En esta colección ({colPaintings.length})</h3>
            {colPaintings.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 text-center border border-dashed border-stone-200 rounded-lg">
                No hay cuadros en esta colección todavía.
              </p>
            ) : (
              <div className="space-y-2">
                {colPaintings.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 bg-white border border-stone-200 rounded-lg p-3">
                    <div className="w-10 h-10 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                      {p.imageUrls?.[0]
                        ? <Image src={p.imageUrls[0]} alt={p.title} width={40} height={40} className="object-cover w-full h-full" />
                        : <div className="w-full h-full bg-stone-200" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{p.title}</p>
                      <p className="text-xs text-stone-400">{p.status} · {Number(p.price).toLocaleString("es-ES")} €</p>
                    </div>
                    <button onClick={() => removePainting(p.id)}
                      className="text-xs text-red-500 border border-red-200 px-2.5 py-1 rounded hover:bg-red-50 transition-colors flex-shrink-0">
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Añadir cuadros */}
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Añadir cuadros</h3>
            <input type="text" placeholder="Buscar por título..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-stone-400" />
            {available.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 text-center border border-dashed border-stone-200 rounded-lg">
                {search ? "No hay resultados." : "Todos los cuadros ya están en esta colección."}
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {available.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-lg p-3">
                    <div className="w-10 h-10 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                      {p.imageUrls?.[0]
                        ? <Image src={p.imageUrls[0]} alt={p.title} width={40} height={40} className="object-cover w-full h-full" />
                        : <div className="w-full h-full bg-stone-200" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-700 truncate">{p.title}</p>
                      <p className="text-xs text-stone-400">{p.status} · {Number(p.price).toLocaleString("es-ES")} €</p>
                    </div>
                    <button onClick={() => addPainting(p.id)}
                      className="text-xs text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded hover:bg-emerald-50 transition-colors flex-shrink-0">
                      + Añadir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
