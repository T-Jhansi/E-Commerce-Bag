"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "@/hooks/use-account";
import { signIn, signOut } from "@/lib/auth-store";
import { findOrdersByPhone } from "@/lib/order-store";
import { findWarrantiesByPhone } from "@/lib/warranty-store";
import { findStorageTicketsByPhone } from "@/lib/storage-store";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/ProductCard";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";

type Tab = "orders" | "warranty" | "clock-room" | "wishlist";

function AccountPageInner() {
  const { account, ready } = useAccount();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) ?? "orders";
  const [tab, setTab] = useState<Tab>(initialTab);

  if (!ready) return null;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <h1 className="mb-6 font-display text-3xl font-semibold">Account</h1>
      {account ? <AccountHome account={account} tab={tab} setTab={setTab} /> : <SignInForm />}
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageInner />
    </Suspense>
  );
}

function SignInForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    signIn({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <p className="text-sm text-[var(--muted)]">
        Demo sign-in — no password needed, this just remembers you on this
        device so your orders, warranty, and Clock Room activity show up here.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Name</span>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ananya Rao"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Phone number</span>
          <input
            className="input"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="98450 12345"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email (optional)</span>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </label>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-leather py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark sm:w-auto sm:px-6"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: "orders", label: "Orders" },
  { id: "warranty", label: "Warranty" },
  { id: "clock-room", label: "Clock Room" },
  { id: "wishlist", label: "Wishlist" },
];

function AccountHome({
  account,
  tab,
  setTab,
}: {
  account: { name: string; phone: string; email: string };
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  const orders = findOrdersByPhone(account.phone);
  const warranties = findWarrantiesByPhone(account.phone);
  const storageTickets = findStorageTicketsByPhone(account.phone);
  const { items: wishlistItems } = useWishlist();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div>
          <p className="font-medium">{account.name}</p>
          <p className="text-sm text-[var(--muted)]">{account.phone}</p>
          {account.email && <p className="text-sm text-[var(--muted)]">{account.email}</p>}
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="text-sm font-medium text-[var(--muted)] hover:text-rose-600"
        >
          Sign out
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
              tab === t.id
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-300 text-slate-600 hover:border-slate-950 hover:text-slate-950"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <EmptyState href="/shop" label="Start shopping" text="No orders yet." />
          ) : (
            <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 p-4 hover:bg-[var(--canvas)]"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {formatDate(order.createdAt)} · {order.status}
                      </p>
                    </div>
                    <span className="tabular-nums">{formatINR(order.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "warranty" && (
        <div>
          {warranties.length === 0 ? (
            <EmptyState href="/warranty" label="Register a product" text="No warranty registrations yet." />
          ) : (
            <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              {warranties.map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium">{w.id}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {w.productName} · {formatDate(w.purchaseDate)}
                    </p>
                  </div>
                  <span className="text-xs font-medium">{w.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "clock-room" && (
        <div>
          {storageTickets.length === 0 ? (
            <EmptyState href="/clock-room" label="Check in a bag" text="No Clock Room activity yet." />
          ) : (
            <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              {storageTickets.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium">{t.id}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {t.bagDescription} · {formatDateTime(t.dropOffDate)}
                    </p>
                  </div>
                  <span className="text-xs font-medium">{t.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "wishlist" && (
        <div>
          {wishlistItems.length === 0 ? (
            <EmptyState href="/shop" label="Browse the shop" text="Your wishlist is empty." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {wishlistItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text, href, label }: { text: string; href: string; label: string }) {
  return (
    <p className="text-sm text-[var(--muted)]">
      {text}{" "}
      <Link href={href} className="underline hover:text-leather">
        {label}
      </Link>
      .
    </p>
  );
}
