"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount } from "@/hooks/use-account";
import { signIn, signOut } from "@/lib/auth-store";
import { findOrdersByPhone } from "@/lib/order-store";
import { formatDate, formatINR } from "@/lib/format";

export default function AccountPage() {
  const { account, ready } = useAccount();

  if (!ready) return null;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <h1 className="mb-6 font-display text-3xl font-semibold">Account</h1>
      {account ? <AccountHome account={account} /> : <SignInForm />}
    </main>
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
        device so your order history shows up here.
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

function AccountHome({ account }: { account: { name: string; phone: string; email: string } }) {
  const orders = findOrdersByPhone(account.phone);

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

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Order history</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No orders yet.{" "}
            <Link href="/shop" className="underline hover:text-leather">
              Start shopping
            </Link>
            .
          </p>
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
    </div>
  );
}
