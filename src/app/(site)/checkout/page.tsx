"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAccount } from "@/hooks/use-account";
import { formatINR } from "@/lib/format";
import { clearCart } from "@/lib/cart-store";
import { placeOrder } from "@/lib/order-store";
import { Order } from "@/lib/types";

const FREE_SHIPPING_THRESHOLD = 2500;
const FLAT_SHIPPING = 99;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, ready } = useCart();
  const { account } = useAccount();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash on Delivery" as Order["paymentMethod"],
  });
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (account) {
      setForm((f) => ({
        ...f,
        customerName: f.customerName || account.name,
        phone: f.phone || account.phone,
        email: f.email || account.email,
      }));
    }
  }, [account]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (ready && lines.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark"
        >
          Go to shop
        </Link>
      </main>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (
      !form.customerName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.pincode.trim()
    ) {
      setError("Please fill in your name, phone, and full address.");
      return;
    }
    setPlacing(true);
    const order = placeOrder({
      lines: lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        price: l.price,
        quantity: l.quantity,
      })),
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      address: form.address.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      paymentMethod: form.paymentMethod,
    });
    clearCart();
    router.push(`/orders/${order.id}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <h1 className="mb-6 font-display text-3xl font-semibold">Checkout</h1>

      <div className="grid gap-8 sm:grid-cols-[1fr_280px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                className="input"
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                placeholder="Ananya Rao"
              />
            </Field>
            <Field label="Phone number" required>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="98450 12345"
              />
            </Field>
          </div>

          <Field label="Email (optional)">
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Address" required>
            <textarea
              className="input min-h-20"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="House / street / landmark"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" required>
              <input
                className="input"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Bengaluru"
              />
            </Field>
            <Field label="Pincode" required>
              <input
                className="input"
                value={form.pincode}
                onChange={(e) => update("pincode", e.target.value)}
                placeholder="560001"
              />
            </Field>
          </div>

          <Field label="Payment method">
            <select
              className="input"
              value={form.paymentMethod}
              onChange={(e) => update("paymentMethod", e.target.value as Order["paymentMethod"])}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Card / UPI (mock)">Card / UPI (mock — no real payment yet)</option>
            </select>
          </Field>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="w-full rounded-lg bg-leather py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark disabled:opacity-60 sm:w-auto sm:px-6"
          >
            Place order
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-display text-base font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">
                  {line.name} × {line.quantity}
                </span>
                <span className="tabular-nums">{formatINR(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-[var(--border)] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span className="tabular-nums">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Shipping</span>
              <span className="tabular-nums">{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-medium">
              <span>Total</span>
              <span className="tabular-nums">{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-leather"> *</span>}
      </span>
      {children}
    </label>
  );
}
