"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María González",
    role: "Diseñadora de Interiores",
    content: "Las obras de Inma han transformado completamente el ambiente de mis proyectos. Sus clientes siempre quedan encantados con la calidad y originalidad de cada pieza.",
    rating: 5,
  },
  {
    name: "Carlos Ruiz",
    role: "Coleccionista",
    content: "Llevo años siguiendo el trabajo de Inma. Su evolución artística es fascinante y cada obra cuenta una historia única. Una inversión que vale cada euro.",
    rating: 5,
  },
  {
    name: "Laura Mendoza",
    role: "Propietaria de Galería",
    content: "Inma es una artista excepcional. Su técnica impecable combinada con su visión contemporánea crea piezas que se venden solas. Altamente recomendada.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4">
            Lo Que Dicen Mis Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La satisfacción de quienes confían en mi arte es mi mayor inspiración
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 p-8 rounded-2xl"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{t.content}"</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-[family-name:var(--font-playfair)] text-lg">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
