"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { paintingUrl } from "@/lib/slugify";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3x3,
  LayoutList,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Palette,
} from "lucide-react";

const ITEMS_PER_PAGE = 9;

type SortOption = "newest" | "price-asc" | "price-desc" | "title";
type ViewMode = "grid" | "list";

interface Painting {
  id: string;
  slug?: string;
  title: string;
  price: number;
  status: string;
  technique?: string;
  category?: string;
  dimensions?: string;
  year?: number;
  description?: string;
  imageUrls: string[];
}

export default function AllArtworksClient({ paintings }: { paintings: Painting[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const categories = useMemo(() => Array.from(new Set(paintings.map((a) => a.category).filter(Boolean) as string[])), [paintings]);
  const techniques = useMemo(() => Array.from(new Set(paintings.map((a) => a.technique).filter(Boolean) as string[])), [paintings]);
  const years = useMemo(() => Array.from(new Set(paintings.map((a) => a.year).filter(Boolean) as number[])).sort((a, b) => b - a), [paintings]);
  const maxPrice = useMemo(() => Math.max(...paintings.map((a) => Number(a.price) || 0), 1), [paintings]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredArtworks = useMemo(() => {
    let filtered = paintings.filter((p) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category || "")) return false;
      if (selectedTechniques.length > 0 && !selectedTechniques.includes(p.technique || "")) return false;
      if (Number(p.price) < priceRange[0] || Number(p.price) > priceRange[1]) return false;
      if (onlyAvailable && p.status !== "available") return false;
      if (selectedYears.length > 0 && !selectedYears.includes(p.year || 0)) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
    }
    return filtered;
  }, [paintings, selectedCategories, selectedTechniques, priceRange, onlyAvailable, selectedYears, sortBy]);

  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArtworks = filteredArtworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [selectedCategories, selectedTechniques, priceRange, onlyAvailable, selectedYears]);

  const toggleCategory = (c: string) => setSelectedCategories((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);
  const toggleTechnique = (t: string) => setSelectedTechniques((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);
  const toggleYear = (y: number) => setSelectedYears((p) => p.includes(y) ? p.filter((x) => x !== y) : [...p, y]);
  const clearFilters = () => { setSelectedCategories([]); setSelectedTechniques([]); setPriceRange([0, maxPrice]); setOnlyAvailable(false); setSelectedYears([]); };

  const activeFiltersCount =
    selectedCategories.length +
    selectedTechniques.length +
    selectedYears.length +
    (onlyAvailable ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0);

  const FilterContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-[family-name:var(--font-playfair)]">Filtros</h3>
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="text-sm text-purple-600 hover:text-purple-700 font-semibold">Limpiar todo</button>
        )}
      </div>

      {categories.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>Categoría</span>
            {selectedCategories.length > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{selectedCategories.length}</span>}
          </h4>
          <div className="space-y-2">
            {categories.map((c) => (
              <label key={c} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleCategory(c)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-sm group-hover:text-purple-600 transition-colors">{c}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {techniques.length > 0 && (
        <div className="pt-6 border-t">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>Técnica</span>
            {selectedTechniques.length > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{selectedTechniques.length}</span>}
          </h4>
          <div className="space-y-2">
            {techniques.map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={selectedTechniques.includes(t)} onChange={() => toggleTechnique(t)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-sm group-hover:text-purple-600 transition-colors">{t}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6 border-t">
        <h4 className="font-semibold mb-3">Rango de Precio</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Mín" />
            <span className="text-gray-500">-</span>
            <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Máx" />
          </div>
          <input type="range" min="0" max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full" />
          <div className="text-sm text-gray-600 text-center">€{priceRange[0].toLocaleString("es-ES")} - €{priceRange[1].toLocaleString("es-ES")}</div>
        </div>
      </div>

      {years.length > 0 && (
        <div className="pt-6 border-t">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>Año</span>
            {selectedYears.length > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{selectedYears.length}</span>}
          </h4>
          <div className="space-y-2">
            {years.map((y) => (
              <label key={y} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={selectedYears.includes(y)} onChange={() => toggleYear(y)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-sm group-hover:text-purple-600 transition-colors">{y}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6 border-t">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
          <span className="text-sm font-semibold group-hover:text-purple-600 transition-colors">Solo obras disponibles</span>
        </label>
      </div>

      {mobile && (
        <div className="mt-8 space-y-3">
          <button onClick={() => setShowFilters(false)} className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
            Ver {filteredArtworks.length} obras
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="w-full border-2 border-gray-300 py-3 rounded-full font-semibold hover:border-gray-400 transition-colors">
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-semibold">Galería Completa</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-playfair)] mb-4">Todas las Obras</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Explora mi colección completa de {paintings.length} obras únicas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-full hover:border-gray-400 transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-semibold">Filtros</span>
              {activeFiltersCount > 0 && <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{activeFiltersCount}</span>}
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="appearance-none px-4 py-2 pr-10 border-2 border-gray-300 rounded-full hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                  <option value="newest">Más recientes</option>
                  <option value="price-asc">Precio: Menor a mayor</option>
                  <option value="price-desc">Precio: Mayor a menor</option>
                  <option value="title">Nombre A-Z</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>

              <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-full transition-colors ${viewMode === "grid" ? "bg-white shadow" : "hover:bg-gray-200"}`}>
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-full transition-colors ${viewMode === "list" ? "bg-white shadow" : "hover:bg-gray-200"}`}>
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando {currentArtworks.length} de {filteredArtworks.length} obras
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-40 bg-white rounded-2xl p-6 shadow-lg">
                  <FilterContent />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Grid / List */}
          <div className="flex-1">
            {currentArtworks.length === 0 ? (
              <div className="text-center py-20">
                <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-[family-name:var(--font-playfair)] mb-2">No se encontraron obras</h3>
                <p className="text-gray-600 mb-6">Intenta ajustar los filtros para ver más resultados</p>
                <button onClick={clearFilters} className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors">Limpiar filtros</button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArtworks.map((painting, index) => {
                  const img = painting.imageUrls?.[0];
                  const sold = painting.status === "sold";
                  const reserved = painting.status === "reserved";
                  return (
                    <motion.div key={painting.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group cursor-pointer" onMouseEnter={() => setHoveredId(painting.id)} onMouseLeave={() => setHoveredId(null)}>
                      <Link href={paintingUrl(painting)}>
                        <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
                          <div className="aspect-[3/4] relative">
                            {img ? (
                              <Image src={img} alt={painting.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100">
                                <Palette className="w-12 h-12" />
                              </div>
                            )}

                            {sold && (
                              <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">Vendido</div>
                            )}
                            {reserved && !sold && (
                              <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Reservado</div>
                            )}

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: hoveredId === painting.id && !sold && !reserved ? 1 : 0 }} className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors" onClick={(e) => e.preventDefault()}>
                                <ShoppingCart className="w-5 h-5" />
                              </motion.button>
                            </motion.div>
                          </div>

                          <div className="p-4">
                            <span className="text-sm text-gray-500">{painting.category || painting.technique || ""}</span>
                            <h3 className="text-xl font-[family-name:var(--font-playfair)] mt-1 mb-2">{painting.title}</h3>
                            <div className="flex items-center justify-between">
                              <p className="text-2xl">
                                {sold ? <span className="text-base text-gray-400">Vendido</span> : reserved ? <span className="text-base text-amber-600 font-medium">Reservado</span> : `€${Number(painting.price).toLocaleString("es-ES")}`}
                              </p>
                              {painting.year && <span className="text-xs text-gray-500">{painting.year}</span>}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {currentArtworks.map((painting, index) => {
                  const img = painting.imageUrls?.[0];
                  const sold = painting.status === "sold";
                  const reserved = painting.status === "reserved";
                  return (
                    <motion.div key={painting.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                      <Link href={paintingUrl(painting)}>
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-[4/3] md:aspect-auto relative">
                            {img ? (
                              <Image src={img} alt={painting.title} fill sizes="33vw" className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                <Palette className="w-12 h-12" />
                              </div>
                            )}
                            {sold && <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">Vendido</div>}
                            {reserved && !sold && <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Reservado</div>}
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-purple-600 font-semibold">{painting.category || ""}</span>
                                {painting.year && <span className="text-sm text-gray-500">{painting.year}</span>}
                              </div>
                              <h3 className="text-2xl font-[family-name:var(--font-playfair)] mb-3">{painting.title}</h3>
                              {painting.description && <p className="text-gray-600 mb-4 line-clamp-2">{painting.description}</p>}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {painting.technique && <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{painting.technique}</span>}
                                {painting.dimensions && <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{painting.dimensions}</span>}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-3xl font-[family-name:var(--font-playfair)]">
                                {sold ? <span className="text-lg text-gray-400">Vendido</span> : reserved ? <span className="text-lg text-amber-600">Reservado</span> : `€${Number(painting.price).toLocaleString("es-ES")}`}
                              </p>
                              <button onClick={(e) => e.preventDefault()} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                Ver detalles
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-full border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-full font-semibold transition-colors ${currentPage === page ? "bg-purple-600 text-white" : "border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600"}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-full border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween" }} className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-[family-name:var(--font-playfair)]">Filtros</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterContent mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
