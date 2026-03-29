import { getPaintings } from "@/lib/api";
import AllArtworksClient from "./AllArtworksClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galería Completa | Inma Álvarez",
  description: "Explora la colección completa de obras originales de Inma Álvarez",
};

export default async function AllArtworksPage() {
  let paintings: any[] = [];
  try {
    paintings = await getPaintings({ limit: "500" });
  } catch {}

  return <AllArtworksClient paintings={paintings} />;
}
