import Link from "next/link";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:border-leather hover:shadow-sm"
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductImage
          product={product}
          className="transition duration-300 group-hover:scale-105"
        />
        {product.compareAtPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-leather px-2.5 py-1 text-xs font-medium text-white">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
          {product.category}
        </p>
        <h3 className="font-display text-base font-semibold leading-snug">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-medium tabular-nums">{formatINR(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm tabular-nums text-[var(--muted)] line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
