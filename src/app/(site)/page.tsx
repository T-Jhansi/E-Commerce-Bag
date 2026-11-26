"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";

const QUICK_LINKS = [
  { href: "/shop", label: "Shop the collection", desc: "Backpacks, trolleys, totes & more" },
  { href: "/warranty", label: "Register your warranty", desc: "Protect your purchase in minutes" },
  { href: "/service", label: "Maintenance & Service", desc: "Book a repair, track a ticket" },
  { href: "/clock-room", label: "Clock Room", desc: "Check a bag in for safekeeping" },
  { href: "/dealers", label: "Find a dealer", desc: "Authorized stores near you" },
];

export default function Home() {
  const { products, ready } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              North Pole
            </p>
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
            Pack smart. Travel further.
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
            Premium backpacks, trolleys, and laptop bags built from
            weatherproof materials that hold up to a daily commute — backed
            by registered warranty, a dedicated service desk, and a nationwide
            dealer network.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-lg bg-amber-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-950 transition hover:bg-amber-300"
            >
              Shop all bags
            </Link>
            <Link
              href="/warranty"
              className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/20"
            >
              Register warranty
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-5">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-[var(--card)] p-5 transition hover:bg-[var(--canvas)]"
            >
              <p className="text-sm font-semibold">{link.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
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
