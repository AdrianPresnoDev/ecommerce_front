"use client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { paintingUrl } from "@/lib/slugify";
import Image from "next/image";

interface Painting {
  id: string;
  title: string;
  price: number;
  status: string;
  technique?: string;
  category?: string;
  imageUrls: string[];
}

export default function FeaturedGallery({ paintings }: { paintings: Painting[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="galeria" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4">
            Obras Destacadas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cada pieza es única, creada con pasión y dedicación para convertirse en el centro de atención de tu espacio
          </p>
        </motion.div>

        {paintings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-[family-name:var(--font-playfair)]">Próximamente nuevas obras</p>
            <p className="text-sm mt-2">Vuelve pronto para descubrir la colección</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {paintings.map((painting, index) => {
              const img = painting.imageUrls?.[0];
              const sold = painting.status === "sold";
              return (
                <motion.div
                  key={painting.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredId(painting.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Link href={paintingUrl(painting)}>
                    <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
                      <div className="aspect-[3/4] relative">
                        {img ? (
                          <Image
                            src={img}
                            alt={painting.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4"
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.preventDefault()}
                            className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.preventDefault()}
                            className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </motion.button>
                        </motion.div>

                        {sold && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 uppercase tracking-widest rounded-full">
                              Vendido
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <span className="text-sm text-gray-500">{painting.category || painting.technique || ""}</span>
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl mt-1 mb-2">{painting.title}</h3>
                        <p className="text-2xl">
                          {sold ? "—" : `€${Number(painting.price).toLocaleString("es-ES")}`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <motion.a
            href="/#galeria"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors font-semibold"
          >
            Ver Toda la Colección
          </motion.a>
        </div>
      </div>
    </section>
  );
}
