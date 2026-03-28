import Link from "next/link";

export const metadata = {
  title: "Pago completado | Inma Álvarez",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-lg p-10 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl mb-3 text-emerald-700">
          ¡Compra completada!
        </h1>
        <p className="text-gray-600 mb-2 leading-relaxed">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Nos pondremos en contacto contigo para coordinar el envío de la obra.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
        >
          Volver a la galería
        </Link>
      </div>
    </div>
  );
}
