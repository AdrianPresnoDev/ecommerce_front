"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminGetCollections } from "@/lib/api";
import CollectionForm from "../../CollectionForm";

export default function EditCollectionPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = localStorage.getItem("adminApiKey") || "";
    adminGetCollections(key).then(cols => {
      const col = (cols || []).find((c: any) => c.id === id);
      setData(col || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="text-stone-400 text-sm">Cargando...</p>;
  if (!data) return <p className="text-red-500 text-sm">Colección no encontrada.</p>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800 mb-6">
        Editar: {data.title}
      </h1>
      <CollectionForm initialData={data} />
    </div>
  );
}
