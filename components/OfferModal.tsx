"use client";
import { useState } from "react";
import { submitOffer } from "@/lib/api";

interface Props {
  paintingId: string;
  paintingTitle: string;
  listedPrice: number;
  onClose: () => void;
}

export default function OfferModal({ paintingId, paintingTitle, listedPrice, onClose }: Props) {
  const [form, setForm] = useState({ buyerName: "", buyerEmail: "", buyerPhone: "", offeredPrice: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl leading-none">✕</button>

        <h2 className="font-[family-name:var(--font-playfair)] text-xl text-stone-800 mb-1">Hacer una oferta</h2>
        <p className="text-sm text-stone-500 mb-5">
          <span className="font-medium text-stone-700">{paintingTitle}</span> · Precio: {listedPrice.toLocaleString("es-ES")} €
        </p>

        {success ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✉️</div>
            <p className="text-stone-700 font-medium">{success}</p>
            <p className="text-stone-400 text-sm mt-2">Recibirás un email con la respuesta.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-stone-800 text-white text-sm rounded-full hover:bg-stone-700 transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-500 mb-1 block">Nombre *</label>
                <input required value={form.buyerName} onChange={set("buyerName")}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="text-xs text-stone-500 mb-1 block">Teléfono</label>
                <input value={form.buyerPhone} onChange={set("buyerPhone")} type="tel"
                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
              </div>
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1 block">Email *</label>
              <input required value={form.buyerEmail} onChange={set("buyerEmail")} type="email"
                className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1 block">Tu oferta (€) *</label>
              <input required value={form.offeredPrice} onChange={set("offeredPrice")} type="number" min="1" step="1"
                placeholder={String(listedPrice)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400" />
              <p className="text-xs text-stone-400 mt-1">Precio de venta: {listedPrice.toLocaleString("es-ES")} €</p>
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1 block">Mensaje (opcional)</label>
              <textarea value={form.message} onChange={set("message")} rows={3}
                placeholder="Cuéntanos algo sobre ti o por qué te gusta esta obra..."
                className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400 resize-none" />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" disabled={loading}
              className="mt-1 w-full bg-stone-800 text-white py-2.5 text-sm font-semibold uppercase tracking-wider rounded hover:bg-stone-700 transition-colors disabled:opacity-50">
              {loading ? "Enviando..." : "Enviar oferta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
