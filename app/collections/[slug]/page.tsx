export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { getPaintings } from "@/lib/api";
import { getCollectionBySlug } from "@/lib/collections";
import CollectionClient from "./CollectionClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Colección | Inma Álvarez" };
  return {
    title: `${collection.title} | Inma Álvarez`,
    description: collection.longDescription,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) notFound();

  let paintings: any[] = [];
  try {
    const res = await getPaintings({ category: collection.category, limit: "100" });
    paintings = res.paintings || [];
  } catch {
    // API not available at build time
  }

  return <CollectionClient collection={collection} paintings={paintings} />;
}
