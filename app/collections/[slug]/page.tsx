export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { getCollection } from "@/lib/api";
import CollectionClient from "./CollectionClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const collection = await getCollection(slug);
    if (!collection) return { title: "Colección | Inma Álvarez" };
    return {
      title: `${collection.title} | Inma Álvarez`,
      description: collection.longDescription || collection.description,
    };
  } catch {
    return { title: "Colección | Inma Álvarez" };
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let collection: any = null;
  try {
    collection = await getCollection(slug);
  } catch {
    // ignore
  }

  if (!collection) notFound();

  const paintings = collection.paintings || [];

  return <CollectionClient collection={collection} paintings={paintings} />;
}
