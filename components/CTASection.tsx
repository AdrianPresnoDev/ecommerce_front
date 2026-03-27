"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al suscribirse");
      setSuccess(data.message);
      setEmail("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl">
            Mantente Inspirado
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Suscríbete para recibir novedades sobre nuevas obras, colecciones exclusivas y consejos sobre arte
          </p>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-green-400 text-lg font-medium"
            >
              <CheckCircle className="w-6 h-6" />
              <span>{success}</span>
            </motion.div>
          ) : (
            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico"
                    className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-semibold whitespace-nowrap disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Suscribirme"}
                </motion.button>
              </div>
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            </form>
          )}

          <p className="text-sm text-gray-400">
            No spam. Solo contenido de valor sobre arte y creatividad.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
