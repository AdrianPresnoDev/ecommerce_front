"use client";
import { useState } from "react";
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
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Comprar (Fase 2 - Stripe) */}
        <button
          disabled
          title="Próximamente disponible"
          className="flex-1 bg-stone-800 text-white py-3 text-sm font-semibold uppercase tracking-wider rounded hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Comprar ahora · {Number(painting.price).toLocaleString("es-ES")} €
        </button>

        {/* Hacer oferta */}
        <button
          onClick={() => setShowOffer(true)}
          className="flex-1 border border-stone-800 text-stone-800 py-3 text-sm font-semibold uppercase tracking-wider rounded hover:bg-stone-50 transition-colors">
          Hacer una oferta
        </button>
      </div>

      <p className="text-xs text-stone-400 mt-2">
        ¿No te convence el precio? Puedes hacer una oferta por encima o por debajo.
      </p>

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
