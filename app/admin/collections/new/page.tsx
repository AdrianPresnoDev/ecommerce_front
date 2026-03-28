"use client";
import CollectionForm from "../CollectionForm";

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-800 mb-6">Nueva colección</h1>
      <CollectionForm />
    </div>
  );
}
