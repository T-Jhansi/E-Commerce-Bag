import { HeroBanner } from "@/components/HeroBanner";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductGridSection } from "@/components/ProductGridSection";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { ValueProps } from "@/components/ValueProps";
import { BrandStory } from "@/components/BrandStory";
import { Newsletter } from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <HeroBanner />
      <CategoryShowcase />
      <ProductGridSection
        title="Best Sellers & Expedition Picks"
        subtitle="Proven favorites designed for intense daily travel, boardrooms, and weekend trips."
        tag="North Pole Essentials"
      />
      <PromotionalBanner />
      <ValueProps />
      <BrandStory />
      <Newsletter />
    </main>
  );
}
