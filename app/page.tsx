import { getPaintings } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import FeaturedGallery from "@/components/FeaturedGallery";
import AboutSection from "@/components/AboutSection";
import CollectionsSection from "@/components/CollectionsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

export default async function HomePage() {
  let featured: any[] = [];
  let allPaintings: any[] = [];

  try {
    const [featuredRes, allRes] = await Promise.all([
      getPaintings({ featured: "true", limit: "4" }),
      getPaintings({ limit: "50" }),
    ]);
    featured = featuredRes.paintings || [];
    allPaintings = allRes.paintings || [];
  } catch {
    // API not available at build time
  }

  return (
    <>
      <HeroSection />
      <FeaturedGallery paintings={featured.length > 0 ? featured : allPaintings.slice(0, 4)} />
      <AboutSection />
      <CollectionsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
