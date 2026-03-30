import type { MetadataRoute } from "next";

const BASE = "https://inmaalvarez.es";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/paintings`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Fetch paintings for dynamic URLs
  let paintingPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`http://52.51.114.68:8082/api/v1/paintings?limit=500`, { cache: "no-store" });
    const data = await res.json();
    const paintings = data?.paintings ?? data ?? [];
    paintingPages = paintings.map((p: any) => ({
      url: `${BASE}/paintings/${p.slug || p.id}`,
      lastModified: new Date(p.updatedAt || p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {}

  // Fetch collections for dynamic URLs
  let collectionPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`http://52.51.114.68:8082/api/v1/collections`, { cache: "no-store" });
    const collections = await res.json();
    collectionPages = (collections ?? []).map((c: any) => ({
      url: `${BASE}/collections/${c.slug}`,
      lastModified: new Date(c.updatedAt || c.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticPages, ...paintingPages, ...collectionPages];
}
