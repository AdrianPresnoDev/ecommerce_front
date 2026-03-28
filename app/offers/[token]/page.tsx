import { getOfferStatus } from "@/lib/api";
import Link from "next/link";
import PayOfferButton from "./PayOfferButton";

export const dynamic = "force-dynamic";

const STATUS_INFO: Record<string, { title: string; color: string; icon: string }> = {
  pending:   { title: "Oferta pendiente",    color: "text-amber-600",  icon: "⏳" },
  accepted:  { title: "¡Oferta aceptada!",   color: "text-emerald-600", icon: "✅" },
  rejected:  { title: "Oferta rechazada",    color: "text-red-500",    icon: "❌" },
  countered: { title: "Hay una contraoferta", color: "text-blue-600",  icon: "💬" },
  paid:      { title: "Oferta pagada",       color: "text-emerald-700", icon: "🎉" },
  expired:   { title: "Oferta expirada",     color: "text-stone-400",  icon: "🕐" },
};

export default async function OfferStatusPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let offer: any;
  let err: string | null = null;

  try {
    offer = await getOfferStatus(token);
  } catch (e: any) {
    err = e.status === 404 ? "No encontramos esta oferta." : "Error al cargar la oferta.";
  }

  if (err) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-stone-400">{err}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-stone-600 underline">Volver a la galería</Link>
      </div>
    );
  }

  const st = STATUS_INFO[offer.status] || { title: offer.status, color: "text-stone-600", icon: "📋" };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-lg border border-stone-200 p-8 text-center">
        <div className="text-5xl mb-4">{st.icon}</div>
        <h1 className={`font-[family-name:var(--font-playfair)] text-2xl mb-2 ${st.color}`}>{st.title}</h1>

        <div className="text-sm text-stone-500 space-y-1 mt-4 mb-6">
          <p><span className="font-medium text-stone-700">{offer.paintingTitle}</span></p>
          <p>Tu oferta: <span className="font-semibold text-stone-700">{Number(offer.offeredPrice).toLocaleString("es-ES")} €</span></p>
        </div>

        {offer.status === "countered" && offer.counterPrice && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-blue-500 uppercase tracking-wide mb-1">Contraoferta</p>
            <p className="text-xl font-bold text-blue-700">{Number(offer.counterPrice).toLocaleString("es-ES")} €</p>
            {offer.sellerNote && <p className="text-sm text-stone-600 mt-2 italic">"{offer.sellerNote}"</p>}
            <p className="text-xs text-stone-400 mt-3">Para aceptar esta contraoferta, responde al email que recibiste.</p>
          </div>
        )}

        {offer.status === "accepted" && (
          <div className="bg-emerald-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-emerald-700">
              ¡Enhorabuena! La artista ha aceptado tu oferta.
              {offer.sellerNote && ` "${offer.sellerNote}"`}
            </p>
            <PayOfferButton offerToken={token} />
          </div>
        )}

        {offer.status === "rejected" && offer.sellerNote && (
          <div className="bg-stone-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-stone-600 italic">"{offer.sellerNote}"</p>
          </div>
        )}

        {offer.status === "pending" && (
          <p className="text-sm text-stone-500 mb-6">
            Tu oferta está siendo revisada. Te avisaremos por email en cuanto haya novedades.
          </p>
        )}

        <Link
          href="/"
          className="inline-block border border-stone-300 text-stone-600 px-6 py-2 text-sm rounded hover:bg-stone-50 transition-colors"
        >
          Ver más obras
        </Link>
      </div>
    </div>
  );
}
