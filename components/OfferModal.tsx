"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { submitOffer } from "@/lib/api";

interface Props {
  paintingId: string;
  paintingTitle: string;
  listedPrice: number;
  onClose: () => void;
}

export default function OfferModal({ paintingId, paintingTitle, listedPrice, onClose }: Props) {
  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    offeredPrice: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const offerValue = parseFloat(form.offeredPrice) || 0;
  const difference = offerValue - listedPrice;
  const percentageDiff = listedPrice > 0 ? ((difference / listedPrice) * 100).toFixed(1) : "0";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await submitOffer(paintingId, {
        buyerName: form.buyerName,
        buyerEmail: form.buyerEmail,
        buyerPhone: form.buyerPhone || undefined,
        offeredPrice: Number(form.offeredPrice),
        message: form.message || undefined,
      });
      setSuccess(res.message || "¡Oferta enviada! Te avisaremos por email.");
    } catch (err: any) {
      setError(err.message || "Error al enviar la oferta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <Tag className="w-7 h-7" />
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl">Proponer Precio</h2>
            </div>
            <p className="text-sm text-white/90">{paintingTitle}</p>
          </div>

          {success ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">✉️</div>
              <p className="text-gray-800 font-semibold text-lg mb-2">{success}</p>
              <p className="text-gray-500 text-sm mb-6">Recibirás un email con la respuesta de Inma.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Price info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio de la obra:</span>
                  <span className="font-bold text-lg">€{listedPrice.toLocaleString("es-ES")}</span>
                </div>
              </div>

              {/* Offer price */}
              <div>
                <label className="block text-sm font-semibold mb-2">Tu Oferta (€) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">€</span>
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={form.offeredPrice}
                    onChange={set("offeredPrice")}
                    placeholder="Introduce tu precio"
                    className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                  />
                </div>
                {offerValue > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 flex items-center gap-2 text-sm ${
                      difference > 0 ? "text-green-600" : difference < 0 ? "text-orange-600" : "text-gray-500"
                    }`}
                  >
                    {difference > 0 ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>+€{Math.abs(difference).toLocaleString("es-ES")} ({percentageDiff}% más)</span>
                      </>
                    ) : difference < 0 ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>-€{Math.abs(difference).toLocaleString("es-ES")} ({Math.abs(parseFloat(percentageDiff))}% menos)</span>
                      </>
                    ) : (
                      <span>Precio igual al actual</span>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre *</label>
                  <input
                    required
                    value={form.buyerName}
                    onChange={set("buyerName")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Teléfono</label>
                  <input
                    value={form.buyerPhone}
                    onChange={set("buyerPhone")}
                    type="tel"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  required
                  type="email"
                  value={form.buyerEmail}
                  onChange={set("buyerEmail")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2">Mensaje para la Artista (Opcional)</label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  rows={3}
                  placeholder="Cuéntale a Inma por qué te interesa esta obra..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm resize-none"
                />
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {offerValue < listedPrice
                    ? "Tu oferta será revisada por Inma Álvarez. Recibirás una respuesta por email en breve."
                    : "Al ofrecer un precio igual o superior, la artista será notificada de inmediato."}
                </p>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-semibold text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold text-sm disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar Oferta"}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
