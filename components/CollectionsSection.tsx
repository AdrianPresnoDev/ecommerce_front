"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  color?: string;
  heroImageUrl?: string;
}

export default function CollectionsSection({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null;

  return (
    <section id="colecciones" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4">
            Colecciones
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestras diferentes colecciones, cada una con su propia personalidad y estilo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col, index) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Link href={`/collections/${col.slug}`}>
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                  {col.heroImageUrl ? (
                    <Image src={col.heroImageUrl} alt={col.title} fill className="object-cover" />
                  ) : null}
                  <div className={`absolute inset-0 bg-gradient-to-br ${col.color || "from-stone-800 to-stone-600"} ${col.heroImageUrl ? "opacity-70" : ""}`} />
                  <div className="relative h-full p-8 flex flex-col justify-end text-white">
                    <div className="space-y-2 mb-4">
                      <h3 className="font-[family-name:var(--font-playfair)] text-3xl">{col.title}</h3>
                      {col.description && <p className="text-lg opacity-90">{col.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                      <span className="font-medium">Explorar colección</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
