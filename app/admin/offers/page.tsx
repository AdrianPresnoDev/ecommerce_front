"use client";
import { useEffect, useState } from "react";
import { adminGetOffers, adminRespondOffer } from "@/lib/api";

interface Offer {
  id: string;
  paintingId: string;
  paintingTitle?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  offeredPrice: number;
  listedPrice?: number;
  message?: string;
  status: string;
  sellerNote?: string;
  counterPrice?: number;
  createdAt: string;
  expiresAt?: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pendiente",  color: "bg-amber-100 text-amber-700" },
  accepted:  { label: "Aceptada",   color: "bg-emerald-100 text-emerald-700" },
  rejected:  { label: "Rechazada",  color: "bg-red-100 text-red-500" },
  countered: { label: "Contraoferta", color: "bg-blue-100 text-blue-700" },
  paid:      { label: "Pagada",     color: "bg-emerald-200 text-emerald-800" },
  expired:   { label: "Expirada",   color: "bg-stone-100 text-stone-400" },
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState<string | null>(null);
  const [respondForm, setRespondForm] = useState<{
    action: "accept" | "reject" | "counter";
    sellerNote: string;
    counterPrice: string;
  } | null>(null);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  function getKey() { return localStorage.getItem("adminApiKey") || ""; }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetOffers(getKey(), { limit: "200" });
      setOffers(data.offers || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openRespond(offerId: string, action: "accept" | "reject" | "counter") {
    setActiveOfferId(offerId);
    setRespondForm({ action, sellerNote: "", counterPrice: "" });
  }

  async function submitRespond(offerId: string) {
    if (!respondForm) return;
    setResponding(offerId);
    try {
      const payload: any = {
        action: respondForm.action,
        sellerNote: respondForm.sellerNote || undefined,
      };
      if (respondForm.action === "counter") {
        if (!respondForm.counterPrice) { alert("Introduce el precio de la contraoferta"); setResponding(null); return; }
        payload.counterPrice = Number(respondForm.counterPrice);
      }
      await adminRespondOffer(getKey(), offerId, payload);
      setActiveOfferId(null);
      setRespondForm(null);
      await load();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setResponding(null);
    }
  }

  const pending = offers.filter(o => o.status === "pending");
  const rest = offers.filter(o => o.status !== "pending");

  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800 mb-6">Ofertas recibidas</h1>

      {loading && <p className="text-stone-400 text-sm">Cargando...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && offers.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <p>No hay ofertas todavía.</p>
        </div>
      )}

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3 flex items-center gap-2">
            Pendientes
            <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>
          </h2>
          <div className="space-y-3">
            {pending.map(o => <OfferCard key={o.id} offer={o} onRespond={openRespond} />)}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">Historial</h2>
          <div className="space-y-2">
            {rest.map(o => <OfferCard key={o.id} offer={o} onRespond={openRespond} />)}
          </div>
        </section>
      )}

      {/* Respond modal */}
      {activeOfferId && respondForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => { setActiveOfferId(null); setRespondForm(null); }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg text-stone-800 mb-4">
              {respondForm.action === "accept" && "Aceptar oferta"}
              {respondForm.action === "reject" && "Rechazar oferta"}
              {respondForm.action === "counter" && "Hacer contraoferta"}
            </h3>

            {respondForm.action === "counter" && (
              <div className="mb-4">
                <label className="text-xs text-stone-500 mb-1 block uppercase tracking-wide">Tu precio (€) *</label>
                <input
                  type="number" min="1" step="1"
                  value={respondForm.counterPrice}
                  onChange={e => setRespondForm(f => f ? { ...f, counterPrice: e.target.value } : f)}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs text-stone-500 mb-1 block uppercase tracking-wide">Mensaje al comprador (opcional)</label>
              <textarea
                rows={3}
                value={respondForm.sellerNote}
                onChange={e => setRespondForm(f => f ? { ...f, sellerNote: e.target.value } : f)}
                placeholder="Añade una nota personal..."
                className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-stone-400 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => submitRespond(activeOfferId)}
                disabled={responding === activeOfferId}
                className={`flex-1 py-2.5 text-sm font-semibold rounded transition-colors disabled:opacity-50 ${
                  respondForm.action === "reject"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-stone-800 text-white hover:bg-stone-700"
                }`}
              >
                {responding === activeOfferId ? "Enviando..." : "Confirmar"}
              </button>
              <button
                onClick={() => { setActiveOfferId(null); setRespondForm(null); }}
                className="flex-1 py-2.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OfferCard({ offer, onRespond }: {
  offer: Offer;
  onRespond: (id: string, action: "accept" | "reject" | "counter") => void;
}) {
  const st = STATUS_LABELS[offer.status] || { label: offer.status, color: "bg-stone-100 text-stone-500" };
  const isPending = offer.status === "pending";
  const date = new Date(offer.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
            <span className="text-xs text-stone-400">{date}</span>
          </div>
          <p className="font-medium text-stone-800 text-sm truncate">
            {offer.paintingTitle || offer.paintingId}
          </p>
          <div className="mt-1 flex items-center gap-3 text-sm flex-wrap">
            <span className="font-semibold text-stone-700">
              {Number(offer.offeredPrice).toLocaleString("es-ES")} €
            </span>
            {offer.listedPrice && (
              <span className="text-stone-400 text-xs">
                (precio: {Number(offer.listedPrice).toLocaleString("es-ES")} €)
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-stone-500 space-y-0.5">
            <p>{offer.buyerName} · {offer.buyerEmail}{offer.buyerPhone ? ` · ${offer.buyerPhone}` : ""}</p>
            {offer.message && <p className="italic text-stone-400">"{offer.message}"</p>}
          </div>
          {offer.sellerNote && (
            <p className="mt-2 text-xs text-stone-500 bg-stone-50 rounded p-2">
              Tu respuesta: "{offer.sellerNote}"
            </p>
          )}
          {offer.counterPrice && (
            <p className="mt-1 text-xs text-blue-600 font-medium">
              Contraoferta: {Number(offer.counterPrice).toLocaleString("es-ES")} €
            </p>
          )}
        </div>

        {isPending && (
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <button
              onClick={() => onRespond(offer.id, "accept")}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700 transition-colors"
            >
              Aceptar
            </button>
            <button
              onClick={() => onRespond(offer.id, "counter")}
              className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600 transition-colors"
            >
              Contraoferta
            </button>
            <button
              onClick={() => onRespond(offer.id, "reject")}
              className="px-3 py-1.5 border border-red-300 text-red-500 text-xs font-semibold rounded hover:bg-red-50 transition-colors"
            >
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
