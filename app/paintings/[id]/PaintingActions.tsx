"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Tag, X, Loader2 } from "lucide-react";
import OfferModal from "@/components/OfferModal";
import { createCheckout } from "@/lib/api";

interface Painting {
  id: string;
  title: string;
  price: number;
}

export default function PaintingActions({ painting }: { painting: Painting }) {
  const [showOffer, setShowOffer]       = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyerName, setBuyerName]       = useState("");
  const [buyerEmail, setBuyerEmail]     = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { url } = await createCheckout({
        paintingId: painting.id,
        buyerName,
        buyerEmail,
      });
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Error al iniciar el pago");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBuyModal(true)}
          className="w-full bg-black text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          Comprar · €{Number(painting.price).toLocaleString("es-ES")}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowOffer(true)}
          className="w-full border-2 border-purple-600 text-purple-600 py-4 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Tag className="w-5 h-5" />
          Proponer Precio
        </motion.button>
      </div>

      {/* Modal compra directa */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowBuyModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl">Completar compra</h2>
                <button onClick={() => setShowBuyModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-1 text-sm">{painting.title}</p>
              <p className="text-2xl font-bold mb-6">€{Number(painting.price).toLocaleString("es-ES")}</p>

              <form onSubmit={handleBuy} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Redirigiendo a pago...</>
                  ) : (
                    <>Continuar al pago seguro →</>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center">Pago procesado de forma segura por Stripe</p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showOffer && (
        <OfferModal
          paintingId={painting.id}
          paintingTitle={painting.title}
          listedPrice={Number(painting.price)}
          onClose={() => setShowOffer(false)}
        />
      )}
    </>
  );
}
