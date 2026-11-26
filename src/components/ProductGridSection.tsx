"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Flame } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { PRODUCT_CATEGORIES, ProductCategory } from "@/lib/types";
import { CATEGORY_META } from "@/lib/categories";

export function ProductGridSection({
  title = "Best Sellers & Top Picks",
  subtitle = "Discover the gear chosen by thousands of daily commuters and travelers.",
  tag = "North Pole Flagships",
}: {
  title?: string;
  subtitle?: string;
  tag?: string;
}) {
  const { products, ready } = useProducts();
  const [activeTab, setActiveTab] = useState<"all" | ProductCategory>("all");

  const filtered = useMemo(() => {
    if (activeTab === "all") return products;
    return products.filter((p) => p.category === activeTab);
  }, [products, activeTab]);

  return (
    <section className="border-b border-slate-200 bg-slate-50/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{tag}</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-950 sm:text-4xl">{title}</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white p-1 shadow-xs md:self-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "all" ? "bg-slate-950 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              All Gear
            </button>
            {PRODUCT_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveTab(c)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === c ? "bg-slate-950 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {ready && filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {filtered.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href={activeTab === "all" ? "/shop" : `/shop?category=${CATEGORY_META[activeTab].slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-xs transition-all hover:border-slate-950 hover:bg-slate-950 hover:text-white sm:text-sm"
          >
            <span>Explore full {activeTab === "all" ? "catalog" : activeTab} range</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
