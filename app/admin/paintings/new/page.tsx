"use client";
import Link from "next/link";
import PaintingForm from "../PaintingForm";

export default function NewPaintingPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-stone-400 mb-6">
        <Link href="/admin/paintings" className="hover:text-stone-700 transition-colors">Cuadros</Link>
        <span>›</span>
        <span className="text-stone-600">Nuevo cuadro</span>
      </div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800 mb-6">Nuevo cuadro</h1>
      <PaintingForm />
    </div>
  );
}
