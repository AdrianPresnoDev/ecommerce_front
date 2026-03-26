"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const collections = [
  {
    title: "Abstracto Contemporáneo",
    description: "Expresiones libres de color y forma que desafían la percepción",
    color: "from-purple-500 to-pink-500",
    category: "Abstracto",
  },
  {
    title: "Retratos Expresivos",
    description: "Capturando la esencia y emoción de la figura humana",
    color: "from-blue-500 to-cyan-500",
    category: "Retrato",
  },
  {
    title: "Paisajes Oníricos",
    description: "Naturaleza reimaginada con una paleta vibrante",
    color: "from-green-500 to-emerald-500",
    category: "Paisaje",
  },
  {
    title: "Floral & Naturaleza",
    description: "La belleza orgánica transformada en pintura",
    color: "from-rose-400 to-orange-400",
    category: "Floral",
  },
];

export default function CollectionsSection() {
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
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Link href={`/?category=${col.category}`}>
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${col.color}`} />
                  <div className="relative h-full p-8 flex flex-col justify-end text-white">
                    <div className="space-y-2 mb-4">
                      <h3 className="font-[family-name:var(--font-playfair)] text-3xl">{col.title}</h3>
                      <p className="text-lg opacity-90">{col.description}</p>
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
