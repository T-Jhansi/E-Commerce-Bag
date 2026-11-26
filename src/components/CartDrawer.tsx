"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, ShoppingBag, ShieldCheck } from "lucide-react";
import { useSiteUI } from "@/components/SiteUIProvider";
import { useCart } from "@/hooks/use-cart";
import { setCartQuantity, removeFromCart } from "@/lib/cart-store";
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from "@/lib/order-store";
import { formatINR } from "@/lib/format";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useSiteUI();
  const { lines, count, subtotal } = useCart();
  const router = useRouter();

  if (!cartOpen) return null;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  function close() {
    setCartOpen(false);
  }

  function goToCheckout() {
    close();
    router.push("/checkout");
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={close} />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Shopping Bag ({count})</h2>
          </div>
          <button onClick={close} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-950" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-amber-100 bg-amber-50/70 px-5 py-3">
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-800">
              {amountNeeded === 0 ? (
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  You&apos;ve unlocked free delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-amber-800">{formatINR(amountNeeded)}</strong> more for <strong>free delivery</strong>
                </span>
              )}
            </span>
            <span className="text-[10px] tabular-nums text-slate-500">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <h3 className="mb-1 text-base font-bold text-slate-800">Your bag is empty</h3>
              <p className="mx-auto mb-6 max-w-xs text-xs text-slate-500">
                Discover durable backpacks, trolleys, and travel gear ready for your next journey.
              </p>
              <Link
                href="/shop"
                onClick={close}
                className="inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase text-white transition-colors hover:bg-amber-400 hover:text-slate-950"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.productId} className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-slate-50 p-3">
                <Link href={`/shop/${line.slug}`} onClick={close} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <Image src={line.image} alt={line.name} fill className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-bold text-slate-900">{line.name}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-slate-200 bg-white">
                      <button onClick={() => setCartQuantity(line.productId, line.quantity - 1)} className="p-1 text-slate-500 hover:text-slate-900" aria-label="Decrease quantity">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-bold tabular-nums text-slate-900">{line.quantity}</span>
                      <button
                        onClick={() => setCartQuantity(line.productId, line.quantity + 1)}
                        disabled={line.quantity >= line.stock}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs font-black tabular-nums text-slate-950">{formatINR(line.lineTotal)}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(line.productId)} className="shrink-0 p-1.5 text-slate-400 hover:text-rose-600" aria-label="Remove item">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className="space-y-4 border-t border-slate-200 bg-white p-5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated shipping</span>
                <span className="font-semibold tabular-nums">
                  {shipping === 0 ? <span className="text-[11px] font-bold uppercase text-emerald-600">Free</span> : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-extrabold text-slate-950">
                <span>Total</span>
                <span className="text-base tabular-nums">{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={goToCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition-all hover:bg-amber-300 active:scale-95"
            >
              Proceed to checkout
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Covered by North Pole warranty &amp; Maintenance &amp; Service
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
