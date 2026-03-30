"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Introduce email y contraseña");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/admin/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error de autenticación");
      localStorage.setItem("adminApiKey", data.apiKey);
      router.push("/admin/paintings");
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800 mb-1 text-center">
          Admin
        </h1>
        <p className="text-stone-400 text-sm text-center mb-6">Panel de administración</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-stone-500 mb-1 block uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
              placeholder="tu@email.com"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 mb-1 block uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 text-white py-2.5 text-sm font-semibold uppercase tracking-wider rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
