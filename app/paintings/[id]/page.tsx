import { getPainting } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PaintingActions from "./PaintingActions";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const p = await getPainting(id);
    return { title: `${p.title} | Galería de Arte`, description: p.description || `${p.technique} · ${p.dimensions}` };
  } catch {
    return { title: "Cuadro | Galería de Arte" };
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-stone-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-stone-700 transition-colors">Galería</Link>
        <span>›</span>
        {painting.category && (
          <>
            <Link href={`/?category=${painting.category}`} className="hover:text-stone-700 transition-colors">{painting.category}</Link>
            <span>›</span>
          </>
        )}
        <span className="text-stone-600">{painting.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Imágenes */}
        <div className="space-y-3">
          {images.length > 0 ? (
            <>
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-stone-100">
                <Image src={images[0]} alt={painting.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1, 5).map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-sm overflow-hidden bg-stone-100">
                      <Image src={url} alt={`${painting.title} ${i + 2}`} fill className="object-cover" sizes="25vw" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-[4/5] rounded-sm bg-stone-100 flex items-center justify-center text-stone-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1" />
                <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1" />
                <path d="M21 15l-5-5L5 21" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-stone-800 leading-tight mb-2">
            {painting.title}
          </h1>

          {painting.year && <p className="text-stone-400 text-sm mb-5">{painting.year}</p>}

          {/* Precio */}
          <div className="mb-6">
            {sold ? (
              <span className="inline-block bg-stone-100 text-stone-500 px-4 py-2 rounded-full text-sm font-medium">Vendido</span>
            ) : reserved ? (
              <span className="inline-block bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">Reservado</span>
            ) : (
              <span className="text-3xl font-bold text-stone-800">{Number(painting.price).toLocaleString("es-ES")} €</span>
            )}
          </div>

          {/* Detalles técnicos */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {painting.technique && (
              <div className="bg-stone-50 rounded p-3">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">Técnica</p>
                <p className="text-stone-700 font-medium">{painting.technique}</p>
              </div>
            )}
            {painting.dimensions && (
              <div className="bg-stone-50 rounded p-3">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">Medidas</p>
                <p className="text-stone-700 font-medium">{painting.dimensions}</p>
              </div>
            )}
            {painting.category && (
              <div className="bg-stone-50 rounded p-3">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">Categoría</p>
                <p className="text-stone-700 font-medium">{painting.category}</p>
              </div>
            )}
          </div>

          {/* Descripción */}
          {painting.description && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-2">Sobre la obra</h2>
              <p className="text-stone-600 leading-relaxed">{painting.description}</p>
            </div>
          )}

          {/* Acciones (client component por el modal) */}
          {!sold && !reserved && (
            <PaintingActions painting={painting} />
          )}

          {/* Info envío */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-xs text-stone-400 space-y-1.5">
            <p>✓ Obra original firmada por la artista</p>
            <p>✓ Certificado de autenticidad incluido</p>
            <p>✓ Embalaje especial para obras de arte</p>
            <p>✓ Envío a toda España · Entrega en 5-10 días</p>
          </div>
        </div>
      </div>
    </div>
  );
}
