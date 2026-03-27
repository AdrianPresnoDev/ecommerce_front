"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  SlidersHorizontal,
  Grid3x3,
  Grid2x2,
  Heart,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import { Collection } from "@/lib/collections";
import ContactModal from "@/components/ContactModal";
import CustomArtworkModal from "@/components/CustomArtworkModal";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";
type ViewMode = "grid-3" | "grid-4";

interface Painting {
  id: string;
  title: string;
  price: number;
  imageUrls: string[];
  year?: number;
  dimensions?: string;
  category?: string;
  status: string;
  featured?: boolean;
}

interface Props {
  collection: Collection;
  paintings: Painting[];
}

export default function CollectionClient({ collection, paintings }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-3");
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [showCustomOrder, setShowCustomOrder] = useState(false);

  // Filter
  let filtered = paintings.filter((p) => p.status !== "sold");
  if (priceMin) filtered = filtered.filter((p) => p.price >= Number(priceMin));
  if (priceMax) filtered = filtered.filter((p) => p.price <= Number(priceMax));

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return (b.year ?? 0) - (a.year ?? 0);
      default:
        // featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div
        className={`relative h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br ${collection.color}`}
      >
        <div className="absolute inset-0 opacity-20">
          <Image
            src={collection.heroImage}
            alt={collection.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/#colecciones"
              className="mb-6 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </Link>

            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl mb-6">
              {collection.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              {collection.longDescription}
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <span className="font-semibold">{paintings.length}</span>
              <span>obras disponibles</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 pb-6 border-b border-gray-200"
        >
          <p className="text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{sorted.length}</span> obras
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border-2 border-gray-200 rounded-full px-6 py-2 pr-10 font-semibold text-sm hover:border-gray-300 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="featured">Destacadas</option>
                <option value="newest">Más Recientes</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode("grid-3")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "grid-3" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
                title="Vista 3 columnas"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid-4")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "grid-4" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
                title="Vista 4 columnas"
              >
                <Grid2x2 className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-2 border-gray-200 rounded-full px-6 py-2 font-semibold text-sm hover:border-gray-300 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-12 p-6 bg-gray-50 rounded-2xl overflow-hidden"
          >
            <h3 className="font-semibold mb-4">Filtrar por precio</h3>
            <div className="flex gap-4 max-w-sm">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-600">Mínimo (€)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-600">Máximo (€)</label>
                <input
                  type="number"
                  placeholder="Sin límite"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div
          className={`grid grid-cols-1 ${
            viewMode === "grid-3"
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "md:grid-cols-2 lg:grid-cols-4"
          } gap-8`}
        >
          {sorted.map((painting, index) => (
            <motion.div
              key={painting.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
              onMouseEnter={() => setHoveredId(painting.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={`/paintings/${painting.id}`}>
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="aspect-[3/4] relative">
                    {painting.imageUrls?.[0] ? (
                      <Image
                        src={painting.imageUrls[0]}
                        alt={painting.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                          <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
                          <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === painting.id ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6"
                    >
                      <div className="flex gap-2 mb-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Heart className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors"
                          onClick={(e) => e.preventDefault()}
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Status badge */}
                    {painting.status === "reserved" ? (
                      <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Reservado
                      </div>
                    ) : painting.featured ? (
                      <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Destacada
                      </div>
                    ) : null}
                  </div>

                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-1 group-hover:text-gray-600 transition-colors">
                      {painting.title}
                    </h3>
                    {painting.year && (
                      <p className="text-sm text-gray-500 mb-3">{painting.year}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-playfair)] text-2xl">
                        €{Number(painting.price).toLocaleString("es-ES")}
                      </span>
                      {painting.dimensions && (
                        <span className="text-sm text-gray-500">{painting.dimensions}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sorted.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">No se encontraron obras en esta colección</p>
            <Link href="/#colecciones" className="text-black underline hover:no-underline">
              Explorar otras colecciones
            </Link>
          </div>
        )}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-[family-name:var(--font-playfair)] text-3xl mb-4">
              ¿Buscas algo específico?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Si no encuentras la obra perfecta o deseas una pieza personalizada de esta colección,
              Inma estará encantada de crear algo único para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setShowCustomOrder(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Solicitar Obra Personalizada
              </motion.button>
              <motion.button
                onClick={() => setShowContact(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-black text-black px-8 py-4 rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
              >
                Contactar a Inma
              </motion.button>
            </div>

            <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
            <CustomArtworkModal
              isOpen={showCustomOrder}
              onClose={() => setShowCustomOrder(false)}
              collectionName={collection.category}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
