export const dynamic = 'force-dynamic';

import { getPainting, getPaintings } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ImageGallery from "./ImageGallery";
import PaintingActions from "./PaintingActions";
import { Check, Truck, Award, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const p = await getPainting(id);
    return {
      title: `${p.title} | Inma Álvarez`,
      description: p.description || `${p.technique} · ${p.dimensions}`,
    };
  } catch {
    return { title: "Obra | Inma Álvarez" };
  }
}

export default async function PaintingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let painting: any;
  try {
    painting = await getPainting(id);
  } catch {
    notFound();
  }

  const images: string[] = painting.imageUrls || [];
  const sold = painting.status === "sold";
  const reserved = painting.status === "reserved";

  // Related paintings (same category, different id)
  let related: any[] = [];
  try {
    const res = await getPaintings({ limit: "20", ...(painting.category ? { category: painting.category } : {}) });
    related = (res.paintings || []).filter((p: any) => p.id !== painting.id).slice(0, 3);
  } catch {
    // ignore
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={images} title={painting.title} />
          </div>

          {/* Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{painting.category || painting.technique}</span>
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-2">
                {painting.title}
              </h1>
              <p className="text-gray-600">
                por <span className="font-semibold">Inma Álvarez</span>
                {painting.year && ` • ${painting.year}`}
              </p>

              <div className="mt-4">
                {sold ? (
                  <span className="inline-block bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-medium">
                    Vendido
                  </span>
                ) : reserved ? (
                  <span className="inline-block bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                    Reservado
                  </span>
                ) : (
                  <span className="font-[family-name:var(--font-playfair)] text-4xl">
                    €{Number(painting.price).toLocaleString("es-ES")}
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            {!sold && !reserved && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Disponible · Pieza única original</span>
              </div>
            )}

            {/* Description */}
            {painting.description && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-2">Sobre la Obra</h3>
                  <p className="text-gray-700 leading-relaxed">{painting.description}</p>
                </div>
              </div>
            )}

            {/* Technical details */}
            <div className="border-t border-b border-gray-200 py-6 space-y-3 text-sm">
              {painting.technique && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Técnica:</span>
                  <span className="font-semibold">{painting.technique}</span>
                </div>
              )}
              {painting.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensiones:</span>
                  <span className="font-semibold">{painting.dimensions}</span>
                </div>
              )}
              {painting.year && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Año:</span>
                  <span className="font-semibold">{painting.year}</span>
                </div>
              )}
              {painting.category && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-semibold">{painting.category}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {!sold && !reserved && (
              <PaintingActions painting={{ id: painting.id, title: painting.title, price: Number(painting.price) }} />
            )}

            {/* Shipping & certificate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Truck className="w-5 h-5 mt-1 text-gray-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Envío Asegurado</h4>
                  <p className="text-xs text-gray-600">Embalaje profesional y seguro de transporte incluido</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Award className="w-5 h-5 mt-1 text-gray-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Certificado de Autenticidad</h4>
                  <p className="text-xs text-gray-600">Firmado y numerado por la artista</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related artworks */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl mb-8">Obras Relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((p: any) => (
                <Link key={p.id} href={`/paintings/${p.id}`} className="group">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                    {p.imageUrls?.[0] ? (
                      <Image
                        src={p.imageUrls[0]}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                          <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
                          <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-1">{p.title}</h3>
                  <p className="text-gray-600">€{Number(p.price).toLocaleString("es-ES")}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
