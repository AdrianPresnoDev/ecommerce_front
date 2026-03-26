"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  adminCreatePainting,
  adminUpdatePainting,
  adminGetImageUploadUrl,
  adminAddImageKey,
  adminRemoveImageKey,
} from "@/lib/api";

interface PaintingData {
  id?: string;
  title: string;
  description: string;
  technique: string;
  dimensions: string;
  year: string;
  category: string;
  price: string;
  status: string;
  featured: boolean;
  active: boolean;
  imageUrls: string[];
  images: string[]; // S3 keys
}

const CATEGORIES = ["Paisaje", "Retrato", "Abstracto", "Floral", "Marino", "Urbano", "Otro"];

const empty: PaintingData = {
  title: "", description: "", technique: "", dimensions: "",
  year: "", category: "", price: "", status: "available",
  featured: false, active: true, imageUrls: [], images: [],
};

export default function PaintingForm({ initial }: { initial?: Partial<PaintingData> & { id?: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<PaintingData>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function getKey() { return localStorage.getItem("adminApiKey") || ""; }
  function set(k: keyof PaintingData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }
  function toggle(k: "featured" | "active") {
    setForm(f => ({ ...f, [k]: !f[k] }));
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!form.id) { setError("Guarda el cuadro primero antes de subir imágenes."); return; }
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const { uploadUrl, key } = await adminGetImageUploadUrl(getKey(), form.id, file.type);
        await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        const result = await adminAddImageKey(getKey(), form.id, key);
        setForm(f => ({
          ...f,
          imageUrls: result.painting?.imageUrls || [...f.imageUrls, URL.createObjectURL(file)],
          images: result.painting?.images || [...f.images, key],
        }));
      }
    } catch (e: any) {
      setError("Error subiendo imagen: " + e.message);
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(key: string) {
    if (!form.id) return;
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      const result = await adminRemoveImageKey(getKey(), form.id, key);
      setForm(f => ({
        ...f,
        imageUrls: result.painting?.imageUrls || f.imageUrls.filter((_, i) => f.images[i] !== key),
        images: result.painting?.images || f.images.filter(k => k !== key),
      }));
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        technique: form.technique || undefined,
        dimensions: form.dimensions || undefined,
        year: form.year ? Number(form.year) : undefined,
        category: form.category || undefined,
        price: Number(form.price),
        status: form.status,
        featured: form.featured,
        active: form.active,
      };
      if (form.id) {
        await adminUpdatePainting(getKey(), form.id, payload);
        router.push("/admin/paintings");
      } else {
        const result = await adminCreatePainting(getKey(), payload);
        // After create, redirect to edit so user can upload images
        router.push(`/admin/paintings/${result.painting.id}/edit`);
      }
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  }

  const isEdit = !!form.id;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-5">

        {/* Title + Year */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Título *</label>
            <input required value={form.title} onChange={set("title")}
              className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Año</label>
            <input value={form.year} onChange={set("year")} type="number" min="1900" max="2099"
              className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>
        </div>

        {/* Technique + Dimensions + Category */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Técnica</label>
            <input value={form.technique} onChange={set("technique")} placeholder="Óleo, acuarela..."
              className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Medidas</label>
            <input value={form.dimensions} onChange={set("dimensions")} placeholder="50×70 cm"
              className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Categoría</label>
            <select value={form.category} onChange={set("category")}
              className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400">
              <option value="">— Sin categoría —</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Descripción</label>
          <textarea value={form.description} onChange={set("description")} rows={3}
            placeholder="Cuéntanos algo sobre esta obra..."
            className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400 resize-none" />
        </div>

        {/* Price + Status */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Precio (€) *</label>
            <input required value={form.price} onChange={set("price")} type="number" min="0" step="1"
              className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Estado</label>
            <select value={form.status} onChange={set("status")}
              className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400">
              <option value="available">Disponible</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2 pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={() => toggle("featured")}
                className="rounded" />
              <span className="text-sm text-stone-600">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={() => toggle("active")}
                className="rounded" />
              <span className="text-sm text-stone-600">Visible</span>
            </label>
          </div>
        </div>

        {/* Images — only shown when editing */}
        {isEdit && (
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-wide mb-2 block">Imágenes</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {form.imageUrls.map((url, i) => (
                <div key={i} className="relative aspect-square bg-stone-100 rounded overflow-hidden group">
                  <Image src={url} alt={`img ${i + 1}`} fill className="object-cover" sizes="120px" />
                  <button
                    type="button"
                    onClick={() => removeImage(form.images[i])}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="aspect-square border-2 border-dashed border-stone-300 rounded flex flex-col items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-500 transition-colors disabled:opacity-50 text-xs gap-1"
              >
                {uploading ? "Subiendo..." : (<><span className="text-2xl leading-none">+</span><span>Añadir</span></>)}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleUpload(e.target.files)}
            />
            <p className="text-xs text-stone-400">La primera imagen es la principal. Formatos: JPG, PNG, WebP.</p>
          </div>
        )}

        {!isEdit && (
          <p className="text-xs text-stone-400 bg-stone-50 rounded p-3">
            Guarda el cuadro para después poder subir imágenes.
          </p>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-stone-800 text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear cuadro"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/paintings")}
          className="px-4 py-2.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
