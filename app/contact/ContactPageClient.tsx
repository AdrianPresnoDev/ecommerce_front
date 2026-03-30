"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock, Send,
  MessageCircle, Palette,
} from "lucide-react";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

import Image from "next/image";

const STUDIO_IMG = "https://images.unsplash.com/photo-1771440047988-766001f543a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const contactInfo = [
  { icon: Mail,  label: "Email",   value: "inmaalsa@gmail.com",     link: "mailto:inmaalsa@gmail.com" },
  { icon: Phone, label: "Teléfono", value: "+34 639 928 647",          link: "tel:+34639928647" },
  { icon: MapPin, label: "Estudio", value: "Madrid, España",           link: "https://maps.google.com/?q=Madrid,España" },
  { icon: Clock, label: "Horario",  value: "Lun – Vie: 10:00 – 18:00", link: null },
];

const faqs = [
  { question: "¿Puedo visitar tu estudio?",              answer: "Sí, acepto visitas con cita previa. Contáctame para coordinar un día y hora." },
  { question: "¿Realizas envíos internacionales?",        answer: "Sí, envío mis obras a todo el mundo. Los costos de envío se calculan según el destino y el tamaño de la obra." },
  { question: "¿Cuánto tarda una obra personalizada?",    answer: "Dependiendo de la complejidad, una obra personalizada puede tardar entre 2 y 6 semanas." },
  { question: "¿Ofreces certificado de autenticidad?",   answer: "Todas mis obras incluyen un certificado de autenticidad firmado por mí." },
];

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const messageWithSubject = form.subject
        ? `[${form.subject}] ${form.message}`
        : form.message;
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: messageWithSubject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-gray-200">
              <MessageCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Hablemos</span>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl mb-6">
              Conectemos
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              ¿Tienes preguntas sobre una obra? ¿Quieres encargar una pieza personalizada?
              Estoy aquí para ayudarte
            </p>
          </motion.div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                {info.link ? (
                  <a
                    href={info.link}
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{info.label}</h3>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </a>
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{info.label}</h3>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Image */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl mb-4">Envíame un Mensaje</h2>
              <p className="text-lg text-gray-600 mb-8">
                Completa el formulario y te responderé lo antes posible. Normalmente respondo en menos de 24 horas.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
                    <input type="text" required value={form.name} onChange={set("name")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input type="email" required value={form.email} onChange={set("email")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="tu@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono (opcional)</label>
                  <input type="tel" value={form.phone} onChange={set("phone")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+34 600 000 000" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Asunto *</label>
                  <select required value={form.subject} onChange={set("subject")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                    <option value="">Selecciona un asunto</option>
                    <option value="Consulta sobre una obra">Consulta sobre una obra específica</option>
                    <option value="Obra personalizada">Solicitar obra personalizada</option>
                    <option value="Consulta envío">Consulta sobre envío</option>
                    <option value="Consulta precios">Consulta sobre precios</option>
                    <option value="Visita al estudio">Agendar visita al estudio</option>
                    <option value="Colaboración">Propuesta de colaboración</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje *</label>
                  <textarea required rows={6} value={form.message} onChange={set("message")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Cuéntame más sobre tu consulta..." />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
                )}

                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">¡Mensaje enviado!</p>
                      <p className="text-sm text-green-700">Te responderé lo antes posible.</p>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {submitting ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Enviando...</>
                  ) : (
                    <><Send className="w-5 h-5" />Enviar Mensaje</>
                  )}
                </motion.button>

                <p className="text-sm text-gray-500 text-center">
                  Al enviar este formulario, aceptas que te contacte para responder tu consulta
                </p>
              </form>
            </motion.div>

            {/* Image + Social */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-8">
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src={STUDIO_IMG} alt="Estudio de Inma Álvarez" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8">
                <Palette className="w-12 h-12 mb-4 text-purple-400" />
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4">¿Prefieres las redes sociales?</h3>
                <p className="text-gray-300 mb-6">
                  También puedes contactarme a través de mis redes sociales.
                  Comparto regularmente mi proceso creativo y nuevas obras.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: IconInstagram, href: "https://www.instagram.com/inmaalvarezsanemeterio/" },
                    { icon: IconFacebook,  href: "https://www.facebook.com/inmaalvarezsanemeterio" },
                  ].map(({ icon: Icon, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-gray-600">Respuestas a las consultas más comunes</p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
            <p className="text-gray-600 mb-4">¿No encuentras la respuesta que buscas?</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Envíame tu pregunta
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
