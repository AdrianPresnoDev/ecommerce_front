"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Send } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  collectionName?: string;
}

export default function CustomArtworkModal({ isOpen, onClose, collectionName }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    artworkType: collectionName || "",
    dimensions: "",
    colorPreferences: "",
    budget: "",
    description: "",
    timeline: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setForm({ name: "", email: "", phone: "", artworkType: "", dimensions: "", colorPreferences: "", budget: "", description: "", timeline: "" });
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl mb-1">
                    Obra Personalizada
                  </h2>
                  <p className="text-purple-100">Creemos juntos tu pieza única</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Palette className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-2">
                      ¡Solicitud recibida!
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Inma revisará tu solicitud y te contactará en breve para discutir los detalles.
                    </p>
                    <p className="text-sm text-gray-500">
                      Recibirás un email de confirmación en los próximos minutos.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Info banner */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
                      <div className="flex gap-3">
                        <Palette className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">¿Cómo funciona?</h3>
                          <p className="text-sm text-gray-600">
                            Completa este formulario con tu visión y preferencias. Inma se pondrá en
                            contacto contigo para discutir los detalles, compartir bocetos y acordar
                            el presupuesto final.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Contacto */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Información de Contacto</h3>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Nombre completo *</label>
                          <input
                            required
                            value={form.name}
                            onChange={set("name")}
                            placeholder="Tu nombre"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">Email *</label>
                            <input
                              required
                              type="email"
                              value={form.email}
                              onChange={set("email")}
                              placeholder="tu@email.com"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">Teléfono *</label>
                            <input
                              required
                              type="tel"
                              value={form.phone}
                              onChange={set("phone")}
                              placeholder="+34 123 456 789"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Detalles */}
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-lg">Detalles de la Obra</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">Tipo de obra *</label>
                            <select
                              required
                              value={form.artworkType}
                              onChange={set("artworkType")}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                            >
                              <option value="">Selecciona un estilo</option>
                              <option value="Abstracto">Abstracto Contemporáneo</option>
                              <option value="Retrato">Retrato Expresivo</option>
                              <option value="Paisaje">Paisaje Onírico</option>
                              <option value="Floral">Floral & Naturaleza</option>
                              <option value="Otro">Otro estilo</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Dimensiones aproximadas *
                            </label>
                            <input
                              required
                              value={form.dimensions}
                              onChange={set("dimensions")}
                              placeholder="ej: 100x80 cm"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Preferencias de color
                          </label>
                          <input
                            value={form.colorPreferences}
                            onChange={set("colorPreferences")}
                            placeholder="ej: Tonos cálidos, azules y dorados"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Presupuesto aproximado *
                            </label>
                            <select
                              required
                              value={form.budget}
                              onChange={set("budget")}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                            >
                              <option value="">Selecciona un rango</option>
                              <option value="1000-2500">€1.000 – €2.500</option>
                              <option value="2500-5000">€2.500 – €5.000</option>
                              <option value="5000-10000">€5.000 – €10.000</option>
                              <option value="10000+">Más de €10.000</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">Fecha límite</label>
                            <input
                              type="date"
                              value={form.timeline}
                              onChange={set("timeline")}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Describe tu visión *
                          </label>
                          <textarea
                            required
                            rows={6}
                            value={form.description}
                            onChange={set("description")}
                            placeholder="Cuéntame sobre tu visión, el espacio donde irá la obra, qué emociones quieres transmitir, referencias que te inspiran..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
                          />
                        </div>
                      </div>

                      {error && <p className="text-sm text-red-500">{error}</p>}

                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando solicitud...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Enviar Solicitud
                          </>
                        )}
                      </motion.button>
                      <p className="text-xs text-gray-500 text-center">
                        * Campos obligatorios. Tu información será tratada con total confidencialidad.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
