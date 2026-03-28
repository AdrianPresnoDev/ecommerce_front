"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { adminGetAbout, adminUpdateAbout, adminGetAboutImageUploadUrl } from "@/lib/api";

export default function AdminAboutPage() {
  const [tab, setTab] = useState<"hero" | "story" | "values" | "trajectory">("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Hero + quote
  const [hero, setHero] = useState({ imageUrl: "", name: "", subtitle: "", location: "", yearsExperience: "", worksCount: "" });
  const [quote, setQuote] = useState("");

  // Story
  const [storyTitle, setStoryTitle] = useState("");
  const [paragraphs, setParagraphs] = useState(["", "", "", ""]);

  // Values
  const [values, setValues] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);

  // Milestones + exhibitions
  const [milestones, setMilestones] = useState<{ year: string; title: string; description: string }[]>([]);
  const [exhibitions, setExhibitions] = useState<{ year: number; title: string; location: string }[]>([]);

  function getKey() { return localStorage.getItem("adminApiKey") || ""; }

  useEffect(() => {
    adminGetAbout(getKey()).then((data: any) => {
      if (!data) return;
      setHero(data.hero || hero);
      setQuote(data.quote || "");
      setStoryTitle(data.story?.title || "");
      setParagraphs(data.story?.paragraphs || ["", "", "", ""]);
      setValues(data.values || values);
      setMilestones(data.milestones || []);
      setExhibitions(data.exhibitions || []);
    }).catch(() => {}).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { uploadUrl, imageUrl } = await adminGetAboutImageUploadUrl(getKey(), file.type);
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setHero(h => ({ ...h, imageUrl }));
    } catch (e: any) { setError("Error subiendo imagen: " + e.message); }
    finally { setUploading(false); }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await adminUpdateAbout(getKey(), {
        hero,
        quote,
        story: { title: storyTitle, paragraphs },
        values,
        milestones,
        exhibitions,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  const tabClass = (t: string) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-stone-800 text-stone-800" : "border-transparent text-stone-400 hover:text-stone-600"}`;

  if (loading) return <p className="text-stone-400 text-sm">Cargando...</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800">Sobre Mí — Contenido</h1>
        <div className="flex items-center gap-3">
          {success && <span className="text-emerald-600 text-sm font-medium">Guardado</span>}
          {error && <span className="text-red-500 text-sm">{error}</span>}
          <button onClick={save} disabled={saving} className="bg-stone-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar todo"}
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-stone-200 overflow-x-auto">
        <button onClick={() => setTab("hero")} className={tabClass("hero")}>Presentación</button>
        <button onClick={() => setTab("story")} className={tabClass("story")}>Mi Historia</button>
        <button onClick={() => setTab("values")} className={tabClass("values")}>Valores</button>
        <button onClick={() => setTab("trajectory")} className={tabClass("trajectory")}>Trayectoria</button>
      </div>

      {/* HERO + QUOTE TAB */}
      {tab === "hero" && (
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-2">Imagen de portada</label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                {hero.imageUrl ? <Image src={hero.imageUrl} alt="Hero" fill className="object-cover" /> : <div className="w-full h-full bg-stone-200" />}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="text-sm border border-stone-300 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50">
                  {uploading ? "Subiendo..." : hero.imageUrl ? "Cambiar imagen" : "Subir imagen"}
                </button>
                <p className="text-xs text-stone-400 mt-1">O pega una URL directamente abajo</p>
              </div>
            </div>
            <input value={hero.imageUrl} onChange={e => setHero(h => ({ ...h, imageUrl: e.target.value }))} placeholder="https://..." className="mt-2 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
          </div>

          {[
            { label: "Nombre", field: "name" },
            { label: "Subtítulo (bajo el nombre)", field: "subtitle" },
            { label: "Ubicación", field: "location" },
            { label: "Años de experiencia (ej: 15+)", field: "yearsExperience" },
            { label: "Obras creadas (ej: 500+)", field: "worksCount" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-1">{label}</label>
              <input value={(hero as any)[field]} onChange={e => setHero(h => ({ ...h, [field]: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400" />
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-1">Cita destacada</label>
            <textarea rows={3} value={quote} onChange={e => setQuote(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400 resize-none" />
          </div>
        </div>
      )}

      {/* STORY TAB */}
      {tab === "story" && (
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-1">Título de la sección</label>
            <input value={storyTitle} onChange={e => setStoryTitle(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400" />
          </div>
          {paragraphs.map((p, i) => (
            <div key={i}>
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-500 block mb-1">Párrafo {i + 1}</label>
              <textarea rows={4} value={p} onChange={e => { const arr = [...paragraphs]; arr[i] = e.target.value; setParagraphs(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400 resize-none" />
            </div>
          ))}
        </div>
      )}

      {/* VALUES TAB */}
      {tab === "values" && (
        <div className="space-y-6">
          {values.map((v, i) => (
            <div key={i} className="border border-stone-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Valor {i + 1}</p>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Título</label>
                <input value={v.title} onChange={e => { const arr = [...values]; arr[i] = { ...arr[i], title: e.target.value }; setValues(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Descripción</label>
                <textarea rows={2} value={v.description} onChange={e => { const arr = [...values]; arr[i] = { ...arr[i], description: e.target.value }; setValues(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400 resize-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRAJECTORY TAB */}
      {tab === "trajectory" && (
        <div className="space-y-8">
          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-stone-700">Hitos / Timeline</h3>
              <button onClick={() => setMilestones(m => [...m, { year: "", title: "", description: "" }])} className="text-xs text-emerald-600 border border-emerald-200 px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors">+ Añadir hito</button>
            </div>
            <div className="space-y-4">
              {milestones.map((m, i) => (
                <div key={i} className="border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Hito {i + 1}</span>
                    <button onClick={() => setMilestones(ms => ms.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Año</label>
                      <input value={m.year} onChange={e => { const arr = [...milestones]; arr[i] = { ...arr[i], year: e.target.value }; setMilestones(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Título</label>
                      <input value={m.title} onChange={e => { const arr = [...milestones]; arr[i] = { ...arr[i], title: e.target.value }; setMilestones(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Descripción</label>
                    <textarea rows={2} value={m.description} onChange={e => { const arr = [...milestones]; arr[i] = { ...arr[i], description: e.target.value }; setMilestones(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400 resize-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exhibitions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-stone-700">Exposiciones</h3>
              <button onClick={() => setExhibitions(e => [...e, { year: new Date().getFullYear(), title: "", location: "" }])} className="text-xs text-emerald-600 border border-emerald-200 px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors">+ Añadir exposición</button>
            </div>
            <div className="space-y-4">
              {exhibitions.map((ex, i) => (
                <div key={i} className="border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Exposición {i + 1}</span>
                    <button onClick={() => setExhibitions(es => es.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Año</label>
                      <input type="number" value={ex.year} onChange={e => { const arr = [...exhibitions]; arr[i] = { ...arr[i], year: Number(e.target.value) }; setExhibitions(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Título</label>
                      <input value={ex.title} onChange={e => { const arr = [...exhibitions]; arr[i] = { ...arr[i], title: e.target.value }; setExhibitions(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Lugar</label>
                    <input value={ex.location} onChange={e => { const arr = [...exhibitions]; arr[i] = { ...arr[i], location: e.target.value }; setExhibitions(arr); }} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
