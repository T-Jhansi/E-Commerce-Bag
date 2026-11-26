import { ProductCategory } from "./types";

export interface CategoryMeta {
  id: ProductCategory;
  slug: string;
  name: string;
  highlight: string;
  description: string;
  image: string;
  subcategories: string[];
}

export const CATEGORY_META: Record<ProductCategory, CategoryMeta> = {
  Backpacks: {
    id: "Backpacks",
    slug: "backpacks",
    name: "Backpacks",
    highlight: "Daily Carry",
    description: "Ergonomic air-mesh systems and tear-resistant ballistic fabrics for commutes and campus.",
    image: "/products/backpacks.jpg",
    subcategories: ["Laptop & commuter packs", "Everyday daypacks", "Water-resistant series"],
  },
  Travel: {
    id: "Travel",
    slug: "travel",
    name: "Travel",
    highlight: "Go the Distance",
    description: "Duffels and trolleys built for weekend trips, treks, and international gates.",
    image: "/products/travel.jpg",
    subcategories: ["Weekender duffels", "Hard-shell trolleys", "Expedition luggage"],
  },
  "Laptop Bags": {
    id: "Laptop Bags",
    slug: "laptop-bags",
    name: "Laptop Bags",
    highlight: "Boardroom Grade",
    description: "Drop-safe laptop compartments in messenger and sleeve formats for work on the move.",
    image: "/products/laptop-bags.jpg",
    subcategories: ["Messenger bags", "Slim sleeves", "Commuter totes"],
  },
  Totes: {
    id: "Totes",
    slug: "totes",
    name: "Totes",
    highlight: "Everyday Essential",
    description: "Heavyweight canvas totes reinforced at every stress point for daily errands.",
    image: "/products/totes.jpg",
    subcategories: ["Weekender totes", "Market totes", "Foldable totes"],
  },
  Accessories: {
    id: "Accessories",
    slug: "accessories",
    name: "Accessories",
    highlight: "Finishing Touches",
    description: "Luggage tags, organizers, and small leather goods to round out your kit.",
    image: "/products/accessories.jpg",
    subcategories: ["Luggage tags", "Packing organizers", "Leather goods"],
  },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORY_META);

export function categoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORY_LIST.find((c) => c.slug === slug);
}
