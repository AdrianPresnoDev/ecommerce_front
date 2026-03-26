import Link from "next/link";
import Image from "next/image";

interface Painting {
  id: string;
  title: string;
  technique?: string;
  dimensions?: string;
  price: number;
  status: string;
  imageUrls: string[];
}

export default function PaintingCard({ painting }: { painting: Painting }) {
  const img = painting.imageUrls?.[0];
  const sold = painting.status === "sold";

  return (
    <Link href={`/paintings/${painting.id}`} className="painting-card group block">
      <div className="relative overflow-hidden rounded-sm bg-stone-100 aspect-[3/4]">
        {img ? (
          <Image
            src={img}
            alt={painting.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {sold && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-stone-700 text-xs font-semibold px-3 py-1 uppercase tracking-widest rounded-full">
              Vendido
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 pb-1">
        <h3 className="font-[family-name:var(--font-playfair)] text-base text-stone-800 group-hover:text-stone-600 transition-colors leading-snug">
          {painting.title}
        </h3>
        {painting.technique && (
          <p className="text-xs text-stone-400 mt-0.5">{painting.technique}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-stone-700 font-semibold">
            {sold ? "—" : `${Number(painting.price).toLocaleString("es-ES")} €`}
          </span>
          {painting.dimensions && (
            <span className="text-xs text-stone-400">{painting.dimensions}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
