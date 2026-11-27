import { ProductCategory } from "./types";

export interface SubcategoryMeta {
  slug: string;
  label: string;
}

export interface CategoryMeta {
  id: ProductCategory;
  slug: string;
  name: string;
  highlight: string;
  description: string;
  image: string;
  subcategories: SubcategoryMeta[];
}

export const CATEGORY_META: Record<ProductCategory, CategoryMeta> = {
  Backpacks: {
    id: "Backpacks",
    slug: "backpacks",
    name: "Backpacks",
    highlight: "Daily Carry",
    description: "Ergonomic air-mesh systems and tear-resistant ballistic fabrics for commutes and campus.",
    image: "/products/backpacks.jpg",
    subcategories: [
      { slug: "laptop-commuter-packs", label: "Laptop & commuter packs" },
      { slug: "everyday-daypacks", label: "Everyday daypacks" },
      { slug: "water-resistant-series", label: "Water-resistant series" },
    ],
  },
  Travel: {
    id: "Travel",
    slug: "travel",
    name: "Travel",
    highlight: "Go the Distance",
    description: "Duffels and trolleys built for weekend trips, treks, and international gates.",
    image: "/products/travel.jpg",
    subcategories: [
      { slug: "weekender-duffels", label: "Weekender duffels" },
      { slug: "hard-shell-trolleys", label: "Hard-shell trolleys" },
      { slug: "expedition-luggage", label: "Expedition luggage" },
    ],
  },
  "Laptop Bags": {
    id: "Laptop Bags",
    slug: "laptop-bags",
    name: "Laptop Bags",
    highlight: "Boardroom Grade",
    description: "Drop-safe laptop compartments in messenger and sleeve formats for work on the move.",
    image: "/products/laptop-bags.jpg",
    subcategories: [
      { slug: "messenger-bags", label: "Messenger bags" },
      { slug: "slim-sleeves", label: "Slim sleeves" },
      { slug: "commuter-totes", label: "Commuter totes" },
    ],
  },
  Totes: {
    id: "Totes",
    slug: "totes",
    name: "Totes",
    highlight: "Everyday Essential",
    description: "Heavyweight canvas totes reinforced at every stress point for daily errands.",
    image: "/products/totes.jpg",
    subcategories: [
      { slug: "weekender-totes", label: "Weekender totes" },
      { slug: "market-totes", label: "Market totes" },
      { slug: "foldable-totes", label: "Foldable totes" },
    ],
  },
  Accessories: {
    id: "Accessories",
    slug: "accessories",
    name: "Accessories",
    highlight: "Finishing Touches",
    description: "Luggage tags, organizers, and small leather goods to round out your kit.",
    image: "/products/accessories.jpg",
    subcategories: [
      { slug: "luggage-tags", label: "Luggage tags" },
      { slug: "leather-goods", label: "Leather goods" },
    ],
  },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORY_META);

export function categoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORY_LIST.find((c) => c.slug === slug);
}
