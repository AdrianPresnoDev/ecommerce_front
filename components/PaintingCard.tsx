"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface Painting {
  id: string;
  title: string;
  technique?: string;
  dimensions?: string;
  price: number;
  status: string;
  category?: string;
  imageUrls: string[];
}

export default function PaintingCard({ painting }: { painting: Painting }) {
  const img = painting.imageUrls?.[0];
  const sold = painting.status === "sold";
  const reserved = painting.status === "reserved";
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/paintings/${painting.id}`}
      className="painting-card group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="aspect-[3/4] relative">
          {img ? (
            <Image
              src={img}
              alt={painting.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100">
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
            animate={{ opacity: hovered && !sold && !reserved ? 1 : 0 }}
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
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white/90 text-gray-800 text-xs font-bold px-4 py-1.5 uppercase tracking-widest rounded-full shadow">
                Vendido
              </span>
            </div>
          )}
          {reserved && !sold && (
            <div className="absolute inset-0 bg-amber-900/30 flex items-center justify-center">
              <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 uppercase tracking-widest rounded-full shadow">
                Reservado
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <span className="text-sm text-gray-500">{painting.category || painting.technique || ""}</span>
          <h3 className="font-[family-name:var(--font-playfair)] text-xl mt-1 mb-2 group-hover:text-gray-600 transition-colors">
            {painting.title}
          </h3>
          <p className="text-2xl">
            {sold ? <span className="text-base text-gray-400">Vendido</span> : reserved ? <span className="text-base text-amber-600 font-medium">Reservado</span> : `€${Number(painting.price).toLocaleString("es-ES")}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
