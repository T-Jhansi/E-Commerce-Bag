"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCT_CATEGORIES, ProductCategory } from "@/lib/types";

export default function ShopPage() {
  const { products, ready } = useProducts();
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = !q || p.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-leather">
          Shop
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">All bags</h1>
      </header>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <CategoryChip active={category === "All"} onClick={() => setCategory("All")}>
            All
          </CategoryChip>
          {PRODUCT_CATEGORIES.map((c) => (
            <CategoryChip key={c} active={category === c} onClick={() => setCategory(c)}>
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

      {ready && filtered.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No bags match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-leather bg-leather text-white"
          : "border-[var(--border)] text-[var(--muted)] hover:border-leather hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}
