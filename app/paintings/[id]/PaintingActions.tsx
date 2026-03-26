"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Tag } from "lucide-react";
import OfferModal from "@/components/OfferModal";

interface Painting {
  id: string;
  title: string;
  price: number;
}

export default function PaintingActions({ painting }: { painting: Painting }) {
  const [showOffer, setShowOffer] = useState(false);

  return (
    <>
      <div className="space-y-3">
        {/* Añadir al carrito (Fase 2) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled
          title="Próximamente disponible"
          className="w-full bg-black text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          Añadir al Carrito · €{Number(painting.price).toLocaleString("es-ES")}
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          {/* Comprar ahora (Fase 2) */}
          <button
            disabled
            title="Próximamente disponible"
            className="w-full border-2 border-black text-black py-4 rounded-full font-semibold hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Comprar Ahora
          </button>

          {/* Proponer precio */}
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
      </div>

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
