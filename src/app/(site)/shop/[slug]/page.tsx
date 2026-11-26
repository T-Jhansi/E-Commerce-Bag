"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ShieldCheck, Truck, RotateCcw, ChevronRight } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/use-products";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { formatINR } from "@/lib/format";
import { addToCart } from "@/lib/cart-store";
import { CATEGORY_META } from "@/lib/categories";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { product, ready } = useProduct(params.slug);
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [products, product]);

  if (ready && !product) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/shop" className="text-sm text-slate-500 hover:text-amber-600">
          ← Back to shop
        </Link>
        <p className="mt-6 text-slate-500">Couldn&apos;t find that bag.</p>
      </main>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock <= 0;
  const categoryMeta = CATEGORY_META[product.category];
  const discountPercent = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  function handleAddToCart() {
    if (!product) return;
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!product) return;
    addToCart(product.id, quantity);
    router.push("/cart");
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-amber-600">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-amber-600">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop?category=${categoryMeta.slug}`} className="hover:text-amber-600">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-slate-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <ProductImage product={product} priority sizes="(min-width: 1024px) 50vw, 100vw" />
          {discountPercent > 0 && (
            <span className="absolute left-4 top-4 rounded bg-amber-400 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-xs">
              {discountPercent}% off
            </span>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            {product.category} · {product.colorway}
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-slate-950 sm:text-3xl">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tabular-nums text-slate-950">{formatINR(product.price)}</span>
            {product.compareAtPrice && (
              <span className="tabular-nums text-slate-400 line-through">{formatINR(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <p className="mt-4 text-sm">
            {outOfStock ? (
              <span className="font-semibold text-rose-600">Out of stock</span>
            ) : product.stock <= 5 ? (
              <span className="font-semibold text-amber-600">Only {product.stock} left</span>
            ) : (
              <span className="font-medium text-emerald-600">In stock</span>
            )}
          </p>

          {!outOfStock && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm text-slate-600 hover:text-slate-950"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-sm text-slate-600 hover:text-slate-950"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={outOfStock}
              onClick={handleAddToCart}
              className="rounded-lg border border-slate-900 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-900 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
            <button
              type="button"
              disabled={outOfStock}
              onClick={handleBuyNow}
              className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy now
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 border-y border-slate-100 py-5 sm:grid-cols-3">
            <TrustItem icon={ShieldCheck} text="Registered warranty" href="/warranty" />
            <TrustItem icon={RotateCcw} text="Maintenance & Service" href="/service" />
            <TrustItem icon={Truck} text="Free delivery above ₹2,500" />
          </div>

          <div className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Specifications</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Spec label="Category" value={product.category} />
              <Spec label="Colorway" value={product.colorway} />
              <Spec label="Product ID" value={product.id} />
              <Spec label="Availability" value={outOfStock ? "Out of stock" : `${product.stock} in stock`} />
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="mb-6 font-display text-xl font-extrabold text-slate-950">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function TrustItem({
  icon: Icon,
  text,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
      <Icon className="h-4 w-4 shrink-0 text-amber-500" />
      <span>{text}</span>
    </div>
  );
  if (!href) return content;
  return (
    <Link href={href} className="hover:text-amber-600">
      {content}
    </Link>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}
