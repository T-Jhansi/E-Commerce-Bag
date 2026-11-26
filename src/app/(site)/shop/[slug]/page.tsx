"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useProduct } from "@/hooks/use-products";
import { ProductImage } from "@/components/ProductImage";
import { formatINR } from "@/lib/format";
import { addToCart } from "@/lib/cart-store";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { product, ready } = useProduct(params.slug);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (ready && !product) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/shop" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to shop
        </Link>
        <p className="mt-6 text-[var(--muted)]">Couldn&apos;t find that bag.</p>
      </main>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock <= 0;

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
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <Link href="/shop" className="text-sm text-[var(--muted)] hover:text-leather">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--border)]">
          <ProductImage product={product} priority sizes="(min-width: 640px) 50vw, 100vw" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
            {product.category} · {product.colorway}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-medium tabular-nums">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="tabular-nums text-[var(--muted)] line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            {product.description}
          </p>

          <p className="mt-4 text-sm">
            {outOfStock ? (
              <span className="font-medium text-rose-600">Out of stock</span>
            ) : product.stock <= 5 ? (
              <span className="font-medium text-amber-600">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-[var(--muted)]">In stock</span>
            )}
          </p>

          {!outOfStock && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-sm"
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
              className="rounded-lg border border-leather px-5 py-2.5 text-sm font-medium text-leather transition hover:bg-leather/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
            <button
              type="button"
              disabled={outOfStock}
              onClick={handleBuyNow}
              className="rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy now
            </button>
          </div>

          <p className="mt-6 text-xs text-[var(--muted)]">
            Every North Pole purchase can be{" "}
            <Link href="/warranty" className="underline hover:text-leather">
              registered for warranty
            </Link>{" "}
            and is backed by our{" "}
            <Link href="/service" className="underline hover:text-leather">
              Maintenance &amp; Service
            </Link>{" "}
            desk.
          </p>
        </div>
      </div>
    </main>
  );
}
