"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) { setError("Introduce la clave de administrador"); return; }
    localStorage.setItem("adminApiKey", key.trim());
    router.push("/admin/paintings");
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
              Clave de administrador
            </label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-stone-800 text-white py-2.5 text-sm font-semibold uppercase tracking-wider rounded hover:bg-stone-700 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
