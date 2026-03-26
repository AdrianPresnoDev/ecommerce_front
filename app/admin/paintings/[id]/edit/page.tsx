"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PaintingForm from "../../PaintingForm";
import { adminGetPaintings } from "@/lib/api";

export default function EditPaintingPage() {
  const { id } = useParams<{ id: string }>();
  const [painting, setPainting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const apiKey = localStorage.getItem("adminApiKey") || "";
        // Fetch all paintings and find the one we need (admin list includes inactive)
        const data = await adminGetPaintings(apiKey, { limit: "500", includeInactive: "true" });
        const p = (data.paintings || []).find((x: any) => x.id === id);
        if (!p) throw new Error("Cuadro no encontrado");
        setPainting(p);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="text-stone-400 text-sm mt-4">Cargando...</p>;
  if (error) return <p className="text-red-500 text-sm mt-4">{error}</p>;

  const initial = {
    id: painting.id,
    title: painting.title || "",
    description: painting.description || "",
    technique: painting.technique || "",
    dimensions: painting.dimensions || "",
    year: painting.year ? String(painting.year) : "",
    category: painting.category || "",
    price: painting.price != null ? String(painting.price) : "",
    status: painting.status || "available",
    featured: !!painting.featured,
    active: painting.active !== false,
    imageUrls: painting.imageUrls || [],
    images: painting.images || [],
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-stone-400 mb-6">
        <Link href="/admin/paintings" className="hover:text-stone-700 transition-colors">Cuadros</Link>
        <span>›</span>
        <span className="text-stone-600">{painting.title}</span>
      </div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800 mb-6">Editar cuadro</h1>
      <PaintingForm initial={initial} />
    </div>
  );
}
