export const dynamic = 'force-dynamic';

import { getCollections } from "@/lib/api";
import CollectionsListClient from "./CollectionsListClient";

export const metadata = {
  title: "Colecciones | Inma Álvarez",
  description: "Explora todas las colecciones de Inma Álvarez. Arte contemporáneo que transforma espacios en experiencias únicas.",
};

export default async function CollectionsPage() {
  let collections: any[] = [];
  try {
    collections = await getCollections();
  } catch {
    // API not available
  }

  return <CollectionsListClient collections={collections} />;
}
