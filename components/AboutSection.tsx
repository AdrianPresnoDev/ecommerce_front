"use client";
import { motion } from "framer-motion";
import { Award, Palette, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { icon: Palette, value: "500+", label: "Obras Creadas" },
  { icon: Users, value: "300+", label: "Clientes Satisfechos" },
  { icon: Award, value: "15+", label: "Años de Experiencia" },
];

export default function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1752649937419-45f8210078d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHdvbWFuJTIwcGFpbnRlciUyMHN0dWRpb3xlbnwxfHx8fDE3NzQ1MzA4ODJ8MA&ixlib=rb-4.1.0&q=80&w=800"
                alt="Inma Álvarez en su estudio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-black text-white p-8 rounded-2xl shadow-xl max-w-xs">
              <p className="text-lg italic">
                "Cada pincelada cuenta una historia, cada color evoca una emoción"
              </p>
              <p className="mt-2 font-[family-name:var(--font-playfair)]">— Inma Álvarez</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-6">
              Sobre la Artista
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Soy Inma Álvarez, pintora contemporánea con más de 15 años transformando emociones en arte.
              Mi trabajo se caracteriza por la fusión de técnicas clásicas con expresiones modernas,
              creando piezas que dialogan con el espacio y las personas que lo habitan.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Cada obra nace de un proceso intuitivo donde los colores y texturas se encuentran para
              contar historias únicas. Mi objetivo es que cada pieza no solo decore, sino que
              inspire y genere conversaciones.
            </p>

            <div className="grid grid-cols-3 gap-8 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                  <div className="font-[family-name:var(--font-playfair)] text-3xl mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-black text-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-colors font-semibold"
              >
                Conoce Mi Historia
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
