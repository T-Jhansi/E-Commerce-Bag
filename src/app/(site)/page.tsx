"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const { products, ready } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <section className="flex flex-col gap-4">
        <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-leather">
          Bag Co.
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-balance sm:text-5xl">
          Bags built to be used, not babied
        </h1>
        <p className="max-w-xl text-base text-[var(--muted)]">
          Backpacks, travel bags, and laptop cases made from materials that
          hold up to a daily commute — backed by free repairs through our Find
          My Bag service desk.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark"
          >
            Shop all bags
          </Link>
          <Link
            href="/customer"
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:border-leather hover:text-leather"
          >
            Track a repair
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold">Featured</h2>
          <Link href="/shop" className="text-sm font-medium text-leather hover:underline">
            View all →
          </Link>
        </div>
        {ready && featured.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
