"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Check, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { addToCart } from "@/lib/cart-store";
import { isInWishlist, subscribeWishlist, toggleWishlist } from "@/lib/wishlist-store";

export function ProductCard({ product }: { product: Product }) {
  const [justAdded, setJustAdded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const outOfStock = product.stock <= 0;

  useEffect(() => {
    setFavorited(isInWishlist(product.id));
    return subscribeWishlist(() => setFavorited(isInWishlist(product.id)));
  }, [product.id]);

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleWishlist(product.id);
  }
  const discountPercent = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <ProductImage product={product} className="transition-transform duration-500 group-hover:scale-105" />

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-xs">
              {discountPercent}% off
            </span>
          )}
          {product.featured && (
            <span className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              Best seller
            </span>
          )}
          {outOfStock && (
            <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              Out of stock
            </span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          className={`absolute right-3 top-3 z-10 rounded-full p-2 transition-all ${
            favorited ? "bg-rose-50 text-rose-600 shadow-sm" : "bg-white/80 text-slate-600 shadow-xs hover:bg-white hover:text-slate-950"
          }`}
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-rose-600 text-rose-600" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600">{product.category}</p>
          <h3 className="mb-3 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-slate-100 pt-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-base font-extrabold tabular-nums text-slate-950">{formatINR(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-xs tabular-nums text-slate-400 line-through">{formatINR(product.compareAtPrice)}</span>
              )}
            </div>
            <div className="text-[10px]">
              {outOfStock ? (
                <span className="font-medium text-rose-600">Out of stock</span>
              ) : product.stock < 10 ? (
                <span className="font-medium text-amber-600">Only {product.stock} left</span>
              ) : (
                <span className="font-medium text-emerald-600">In stock</span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={outOfStock}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
              justAdded ? "bg-emerald-600 text-white" : "bg-slate-900 text-white hover:bg-amber-400 hover:text-slate-950 active:scale-95"
            }`}
            aria-label="Add to cart"
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
