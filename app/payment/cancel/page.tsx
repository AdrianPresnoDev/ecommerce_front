import Link from "next/link";

export const metadata = {
  title: "Pago cancelado | Inma Álvarez",
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-lg p-10 text-center">
        <div className="text-6xl mb-6">😕</div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl mb-3 text-gray-800">
          Pago no completado
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          El proceso de pago ha sido cancelado. La obra ha quedado libre de nuevo.
          Puedes volver a intentarlo cuando quieras.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block border-2 border-black text-black px-8 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
          >
            Volver a la galería
          </Link>
          <Link
            href="/contact"
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  );
}
