export const dynamic = 'force-dynamic';

import { getPaintings, getCollections } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import FeaturedGallery from "@/components/FeaturedGallery";
import AboutSection from "@/components/AboutSection";
import CollectionsSection from "@/components/CollectionsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

export default async function HomePage() {
  let featured: any[] = [];
  let allPaintings: any[] = [];
  let collections: any[] = [];

  try {
    const [featuredRes, allRes, collectionsRes] = await Promise.all([
      getPaintings({ featured: "true", limit: "4" }),
      getPaintings({ limit: "50" }),
      getCollections(),
    ]);
    featured = featuredRes.paintings || [];
    allPaintings = allRes.paintings || [];
    collections = collectionsRes || [];
  } catch {
    // API not available at build time
  }

  return (
    <>
      <HeroSection />
      <FeaturedGallery paintings={featured.length > 0 ? featured : allPaintings.slice(0, 4)} />
      <AboutSection />
      <CollectionsSection collections={collections} />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
