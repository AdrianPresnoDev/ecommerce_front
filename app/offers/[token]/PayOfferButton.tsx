"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createCheckout } from "@/lib/api";

export default function PayOfferButton({ offerToken }: { offerToken: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const { url } = await createCheckout({ offerToken });
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Error al iniciar el pago");
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" />Redirigiendo...</>
        ) : (
          <>Pagar oferta aceptada →</>
        )}
      </button>
      {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
      <p className="text-xs text-gray-400 text-center mt-2">Pago seguro con Stripe</p>
    </div>
  );
}
