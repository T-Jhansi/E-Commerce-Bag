"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatINR } from "@/lib/format";
import { removeFromCart, setCartQuantity } from "@/lib/cart-store";

export default function CartPage() {
  const { lines, subtotal, ready } = useCart();

  if (ready && lines.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Browse the shop and add a bag you like.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark"
        >
          Go to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <h1 className="mb-6 font-display text-3xl font-semibold">Your cart</h1>

      <div className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {lines.map((line) => (
          <div key={line.productId} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-medium">{line.name}</p>
              <p className="text-sm text-[var(--muted)]">{formatINR(line.price)} each</p>
            </div>
            <div className="flex items-center rounded-lg border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setCartQuantity(line.productId, line.quantity - 1)}
                className="px-3 py-1.5 text-sm"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
              <button
                type="button"
                onClick={() => setCartQuantity(line.productId, line.quantity + 1)}
                disabled={line.quantity >= line.stock}
                className="px-3 py-1.5 text-sm disabled:opacity-30"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-medium tabular-nums">
              {formatINR(line.lineTotal)}
            </p>
            <button
              type="button"
              onClick={() => removeFromCart(line.productId)}
              className="text-sm text-[var(--muted)] hover:text-rose-600"
              aria-label={`Remove ${line.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-end gap-1">
        <p className="text-sm text-[var(--muted)]">
          Subtotal: <span className="font-medium text-[var(--foreground)]">{formatINR(subtotal)}</span>
        </p>
        <p className="text-xs text-[var(--muted)]">
          Shipping and totals are calculated at checkout.
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link
          href="/shop"
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:border-leather hover:text-leather"
        >
          Continue shopping
        </Link>
        <Link
          href="/checkout"
          className="rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark"
        >
          Checkout
        </Link>
      </div>
    </main>
  );
}
