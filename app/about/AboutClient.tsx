"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Palette, Heart, Sparkles, Quote, Calendar, MapPin, Mail, ArrowRight, BookOpen, Users, Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ContactModal from "@/components/ContactModal";
import CustomArtworkModal from "@/components/CustomArtworkModal";

// Default content (same as backend DEFAULT_ABOUT)
const DEFAULT: any = {
  hero: {
    imageUrl: "https://images.unsplash.com/photo-1752649936390-561408d22108?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    name: "Inma Álvarez",
    subtitle: "Pintora contemporánea. Transformando emociones en color y textura desde 2010.",
    location: "Madrid, España",
    yearsExperience: "15+",
    worksCount: "500+",
  },
  quote: "El arte no es solo lo que ves, sino lo que haces sentir a los demás. Cada pincelada es un puente entre mi alma y el mundo",
  story: {
    title: "Mi Viaje Creativo",
    photos: ["", "", "", ""],
    paragraphs: [
      "Desde niña, los colores han sido mi lenguaje...",
      "Estudié Bellas Artes en Madrid...",
      "Hoy, cada obra que creo es un diálogo...",
      "Mi mayor satisfacción es saber que mis obras...",
    ],
  },
  values: [
    { title: "Pasión Auténtica", description: "Cada obra nace desde la emoción genuina y el compromiso total con el proceso creativo." },
    { title: "Innovación Constante", description: "Experimento con nuevas técnicas y materiales para evolucionar constantemente mi expresión artística." },
    { title: "Conexión Humana", description: "Creo arte que conecta con las personas, que genera conversaciones y despierta emociones." },
  ],
  milestones: [
    { year: "2010", title: "Los Inicios", description: "Primera exposición individual en Madrid." },
    { year: "2014", title: "Reconocimiento Internacional", description: "Participación en la Bienal de Arte Contemporáneo de Barcelona." },
    { year: "2018", title: "Evolución Artística", description: "Desarrollo de mi técnica mixta característica." },
    { year: "2022", title: "Expansión Digital", description: "Lanzamiento de mi plataforma online." },
    { year: "2026", title: "Nueva Era", description: "Más de 500 obras creadas." },
  ],
  exhibitions: [
    { year: 2025, title: "Colores del Alma", location: "Museo Nacional de Arte, Madrid" },
    { year: 2024, title: "Abstracción Contemporánea", location: "Galería de Arte Moderno, Barcelona" },
    { year: 2023, title: "Texturas Emocionales", location: "Centro Cultural, Valencia" },
    { year: 2022, title: "Expresiones Urbanas", location: "Art Fair, Lisboa" },
  ],
};

const VALUE_ICONS = [Heart, Lightbulb, Users];

export default function AboutClient({ content }: { content: any }) {
  const [showContact, setShowContact] = useState(false);
  const [showCustomOrder, setShowCustomOrder] = useState(false);

  const c = content || DEFAULT;
  const hero = c.hero || DEFAULT.hero;
  const values = c.values || DEFAULT.values;
  const milestones = c.milestones || DEFAULT.milestones;
  const exhibitions = c.exhibitions || DEFAULT.exhibitions;
  const story = c.story || DEFAULT.story;
  const paragraphs = story.paragraphs || DEFAULT.story.paragraphs;
  const storyPhotos = story.photos || DEFAULT.story.photos || [];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {hero.imageUrl ? (
          <Image src={hero.imageUrl} alt={hero.name} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-stone-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
                <Palette className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">Mi Historia</span>
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-white mb-6">{hero.name}</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">{hero.subtitle}</p>
              <div className="flex flex-wrap gap-6 text-white/80">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /><span>{hero.location}</span></div>
                <div className="flex items-center gap-2"><Award className="w-5 h-5" /><span>{hero.yearsExperience} años de experiencia</span></div>
                <div className="flex items-center gap-2"><Sparkles className="w-5 h-5" /><span>{hero.worksCount} obras creadas</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <Quote className="w-16 h-16 text-purple-300 mx-auto mb-6" />
            <blockquote className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-gray-800 mb-8 leading-relaxed">
              &ldquo;{c.quote || DEFAULT.quote}&rdquo;
            </blockquote>
            <p className="text-xl text-gray-600">— {hero.name}</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-6">{story.title}</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                {paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => setShowContact(true)} className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Mail className="w-5 h-5" />Contactar
                </button>
                <Link href="/collections" className="border-2 border-black text-black px-8 py-4 rounded-full font-semibold hover:bg-black hover:text-white transition-colors flex items-center gap-2">
                  <Palette className="w-5 h-5" />Ver Mis Obras
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-stone-200">
                    {(storyPhotos[0] || hero.imageUrl) && <Image src={storyPhotos[0] || hero.imageUrl} alt="Proceso creativo" fill className="object-cover hover:scale-110 transition-transform duration-500" sizes="25vw" />}
                  </div>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-stone-200">
                    {storyPhotos[1] && <Image src={storyPhotos[1]} alt="En el estudio" fill className="object-cover hover:scale-110 transition-transform duration-500" sizes="25vw" />}
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-stone-200">
                    {storyPhotos[2] && <Image src={storyPhotos[2]} alt="Obra en progreso" fill className="object-cover hover:scale-110 transition-transform duration-500" sizes="25vw" />}
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-stone-200">
                    {(storyPhotos[3] || hero.imageUrl) && <Image src={storyPhotos[3] || hero.imageUrl} alt="Estudio" fill className="object-cover hover:scale-110 transition-transform duration-500" sizes="25vw" />}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4">Mis Valores</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Los principios que guían mi práctica artística y definen cada obra que creo</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v: any, i: number) => {
              const Icon = VALUE_ICONS[i] || Heart;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4">{v.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{v.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Mi Trayectoria</span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4">Hitos Importantes</h2>
            <p className="text-xl text-gray-600">Momentos clave que han definido mi carrera artística</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-pink-200 to-purple-200 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((m: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-0 md:pl-24">
                  <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hidden md:flex text-sm">
                    {String(m.year).slice(-2)}
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow">
                    <div className="md:hidden text-2xl font-bold text-purple-600 mb-2">{m.year}</div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-3">{m.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4">Exposiciones Recientes</h2>
            <p className="text-xl text-gray-300">Lugares donde mi trabajo ha sido exhibido</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exhibitions.map((ex: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg px-4 py-2 text-center flex-shrink-0">
                    <div className="text-2xl font-bold">{ex.year}</div>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-2">{ex.title}</h3>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{ex.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <BookOpen className="w-12 h-12 mb-6" />
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl mb-4">¿Tienes una visión especial?</h3>
                <p className="text-lg text-purple-100 mb-6">Trabajemos juntos para crear una obra única que capture tu esencia y transforme tu espacio.</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCustomOrder(true)} className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                  Solicitar Obra Personalizada<ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <Palette className="w-12 h-12 mb-6" />
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl mb-4">Explora mi galería</h3>
                <p className="text-lg text-gray-300 mb-6">Descubre todas mis colecciones y encuentra la pieza perfecta que hable a tu corazón.</p>
                <Link href="/collections">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                    Ver Colecciones<ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <CustomArtworkModal isOpen={showCustomOrder} onClose={() => setShowCustomOrder(false)} />
    </div>
  );
}
