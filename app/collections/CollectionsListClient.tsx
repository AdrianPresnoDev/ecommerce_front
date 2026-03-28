"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CustomArtworkModal from "@/components/CustomArtworkModal";

interface Collection {
  id: string;
  slug: string;
  title: string;
  description?: string;
  longDescription?: string;
  color?: string;
  heroImageUrl?: string;
  paintings?: any[];
}

export default function CollectionsListClient({ collections }: { collections: Collection[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showCustomOrder, setShowCustomOrder] = useState(false);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div className="absolute top-40 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-gray-200">
              <Palette className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Colecciones Exclusivas</span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl mb-6">
              Explora Mis Colecciones
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Cada colección cuenta una historia única, un viaje artístico
              que invita a descubrir diferentes expresiones y emociones
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{collections.length}</span>
                <span>colecciones únicas</span>
              </div>
              {collections.length > 0 && (
                <>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-semibold">
                      {collections.reduce((acc, c) => acc + (c.paintings?.length || 0), 0)}
                    </span>
                    <span>obras en colecciones</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {collections.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">Próximamente nuevas colecciones</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {collections.map((col, index) => (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  onMouseEnter={() => setHoveredId(col.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group"
                >
                  <Link href={`/collections/${col.slug}`}>
                    <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
                      <div className="relative h-[500px] overflow-hidden">
                        {/* Image or gradient background */}
                        {col.heroImageUrl ? (
                          <Image
                            src={col.heroImageUrl}
                            alt={col.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${col.color || "from-stone-800 to-stone-600"} transition-transform duration-700 group-hover:scale-110`} />
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Painting count badge on hover */}
                        <motion.div
                          animate={{
                            opacity: hoveredId === col.id ? 1 : 0,
                            scale: hoveredId === col.id ? 1 : 0.8,
                          }}
                          className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg"
                        >
                          <span className="text-sm font-semibold text-gray-900">
                            {col.paintings?.length || 0}{" "}
                            {(col.paintings?.length || 0) === 1 ? "obra" : "obras"}
                          </span>
                        </motion.div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                          <motion.div
                            animate={{ y: hoveredId === col.id ? -8 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-white mb-3">
                              {col.title}
                            </h2>
                            {col.description && (
                              <p className="text-lg text-white/90 mb-6 line-clamp-2">
                                {col.description}
                              </p>
                            )}
                            <motion.div
                              animate={{ x: hoveredId === col.id ? 8 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-2 text-white font-semibold"
                            >
                              <span>Explorar colección</span>
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          </motion.div>
                        </div>

                        {/* Animated border on hover */}
                        <motion.div
                          animate={{
                            opacity: hoveredId === col.id ? 1 : 0,
                          }}
                          className="absolute inset-0 border-4 border-white/30 rounded-3xl pointer-events-none"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">
              El Arte Como Experiencia
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Cada colección representa un universo creativo distinto, donde exploro diferentes técnicas,
              emociones y narrativas visuales. Mi objetivo es crear obras que no solo adornen espacios,
              sino que generen experiencias y despierten sentimientos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Técnica Única</h3>
                <p className="text-sm text-gray-600">
                  Cada obra es creada con técnicas mixtas y materiales seleccionados cuidadosamente
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Edición Limitada</h3>
                <p className="text-sm text-gray-600">
                  Piezas originales y únicas, no hay dos obras exactamente iguales
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">En Evolución</h3>
                <p className="text-sm text-gray-600">
                  Nuevas obras se añaden regularmente, sigue explorando para descubrir más
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl mb-4">
              ¿Tienes una visión especial en mente?
            </h2>
            <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Si ninguna de estas colecciones captura exactamente lo que buscas,
              estaré encantada de crear una obra personalizada solo para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                onClick={() => setShowCustomOrder(true)}
              >
                Solicitar Obra Personalizada
              </motion.button>
              <Link href="/#galeria">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
                >
                  Ver Todas las Obras
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <CustomArtworkModal isOpen={showCustomOrder} onClose={() => setShowCustomOrder(false)} />
    </div>
  );
}
