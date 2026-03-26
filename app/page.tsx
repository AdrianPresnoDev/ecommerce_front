import { getPaintings } from "@/lib/api";
import PaintingCard from "@/components/PaintingCard";

const CATEGORIES = ["Paisaje", "Retrato", "Abstracto", "Floral", "Marino", "Urbano"];

interface SearchParams { category?: string }

export default async function GalleryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { category } = await searchParams;

  let featured: any[] = [];
  let paintings: any[] = [];

  try {
    const [featuredRes, allRes] = await Promise.all([
      getPaintings({ featured: "true", limit: "3" }),
      getPaintings({ limit: "50", ...(category ? { category } : {}) }),
    ]);
    featured = featuredRes.paintings || [];
    paintings = allRes.paintings || [];
  } catch {
    // API no disponible en build time
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-28 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-400 mb-4">Arte original</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold leading-tight mb-6">
            Cada cuadro,<br />una historia única
          </h1>
          <p className="text-stone-300 max-w-md mx-auto text-lg mb-8">
            Pinturas originales hechas a mano. Encuentra la obra que hable contigo.
          </p>
          <a href="#galeria"
            className="inline-block bg-white text-stone-900 px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-stone-100 transition-colors rounded-full">
            Ver galería
          </a>
        </div>
      </section>

      {/* Destacados */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800 whitespace-nowrap">Obras destacadas</h2>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((p: any) => <PaintingCard key={p.id} painting={p} />)}
          </div>
        </section>
      )}

      {/* Galería principal */}
      <section id="galeria" className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800 whitespace-nowrap">
            {category ? category : "Toda la colección"}
          </h2>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a href="/"
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              !category ? "bg-stone-800 text-white border-stone-800" : "border-stone-300 text-stone-600 hover:border-stone-500"
            }`}>
            Todas
          </a>
          {CATEGORIES.map(cat => (
            <a key={cat} href={`/?category=${cat}`}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === cat ? "bg-stone-800 text-white border-stone-800" : "border-stone-300 text-stone-600 hover:border-stone-500"
              }`}>
              {cat}
            </a>
          ))}
        </div>

        {paintings.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-lg font-[family-name:var(--font-playfair)]">No hay obras disponibles en este momento</p>
            <p className="text-sm mt-2">Vuelve pronto para descubrir las novedades</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {paintings.map((p: any) => <PaintingCard key={p.id} painting={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
