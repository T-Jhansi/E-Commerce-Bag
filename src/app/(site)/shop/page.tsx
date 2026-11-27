"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCT_CATEGORIES, ProductCategory } from "@/lib/types";
import { CATEGORY_META, categoryBySlug } from "@/lib/categories";

function ShopPageInner() {
  const { products, ready } = useProducts();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const slug = searchParams.get("category");
    const match = slug ? categoryBySlug(slug) : undefined;
    setCategory(match ? match.id : "All");
    setSubcategory(searchParams.get("subcategory"));
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  const activeSubcategoryMeta =
    category !== "All" ? CATEGORY_META[category].subcategories.find((s) => s.slug === subcategory) : undefined;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSubcategory = !subcategory || p.subcategory === subcategory;
      const matchesSearch = !q || p.name.toLowerCase().includes(q);
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [products, category, subcategory, search]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">North Pole · Shop</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950">All bags</h1>
      </header>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            active={category === "All"}
            onClick={() => {
              setCategory("All");
              setSubcategory(null);
            }}
          >
            All
          </CategoryChip>
          {PRODUCT_CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              active={category === c}
              onClick={() => {
                setCategory(c);
                setSubcategory(null);
              }}
            >
              {c}
            </CategoryChip>
          ))}
        </div>
        <input
          className="input sm:max-w-xs"
          placeholder="Search bags"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {category !== "All" && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Style:</span>
          {CATEGORY_META[category].subcategories.map((sub) => (
            <CategoryChip key={sub.slug} active={subcategory === sub.slug} onClick={() => setSubcategory(sub.slug)} small>
              {sub.label}
            </CategoryChip>
          ))}
          {activeSubcategoryMeta && (
            <button
              type="button"
              onClick={() => setSubcategory(null)}
              className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {ready && filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No bags match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageInner />
    </Suspense>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  const activeClass = small ? "border-amber-500 bg-amber-500 text-white" : "border-slate-950 bg-slate-950 text-white";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border font-bold uppercase tracking-wide transition ${
        small ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      } ${active ? activeClass : "border-slate-300 text-slate-600 hover:border-slate-950 hover:text-slate-950"}`}
    >
      {children}
    </button>
  );
}
