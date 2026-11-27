"use client";

import Link from "next/link";
import { useState } from "react";
import { findOrdersByPhone, getOrderById } from "@/lib/order-store";
import { Order } from "@/lib/types";
import { formatDate, formatINR } from "@/lib/format";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Order[] | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearched(true);
    if (!q) {
      setResults([]);
      return;
    }
    const byId = getOrderById(q);
    if (byId) {
      setResults([byId]);
      return;
    }
    setResults(findOrdersByPhone(q));
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-amber-600">
          ← Back home
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">North Pole · Orders</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950">Track an order</h1>
        <p className="mt-2 text-sm text-slate-500">
          Look up an order by its order number or the phone number used at checkout. Signed in?{" "}
          <Link href="/account" className="underline hover:text-amber-600">
            See your full order history
          </Link>
          .
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row">
        <input
          className="input flex-1"
          placeholder="Order number (ORD-2001) or phone number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-950 transition hover:bg-amber-300">
          Track
        </button>
      </form>

      {searched && results && results.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          No orders found for that order number or phone. Double-check and try again.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {results?.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-sm"
          >
            <div>
              <p className="font-display text-base font-bold text-slate-900">{order.id}</p>
              <p className="text-sm text-slate-500">
                {formatDate(order.createdAt)} · {order.lines.reduce((n, l) => n + l.quantity, 0)} item
                {order.lines.reduce((n, l) => n + l.quantity, 0) === 1 ? "" : "s"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold tabular-nums text-slate-950">{formatINR(order.total)}</p>
              <p className="text-xs font-medium text-amber-600">{order.status} →</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
