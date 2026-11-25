"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProducts } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { useTickets } from "@/hooks/use-tickets";
import { formatDate, formatINR } from "@/lib/format";

export default function AdminOverview() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { tickets } = useTickets();

  const lowStock = useMemo(() => products.filter((p) => p.stock <= 5), [products]);
  const openOrders = useMemo(
    () => orders.filter((o) => o.status === "Pending" || o.status === "Processing"),
    [orders]
  );
  const openTickets = useMemo(
    () => tickets.filter((t) => t.status === "Received" || t.status === "In Service"),
    [tickets]
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          A quick look at what needs attention today.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Products" value={products.length} href="/admin/products" />
        <Tile label="Open orders" value={openOrders.length} href="/admin/orders" />
        <Tile label="Open tickets" value={openTickets.length} href="/admin/tickets" />
        <Tile label="Low stock" value={lowStock.length} href="/admin/products" />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-leather hover:underline">
            View all →
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-[var(--canvas)]"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums">{formatINR(order.total)}</p>
                    <p className="text-xs text-[var(--muted)]">{order.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lowStock.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-lg font-semibold">Low stock</h2>
          <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            {lowStock.map((p) => (
              <li key={p.id}>
                <Link
                  href="/admin/products"
                  className="flex items-center justify-between gap-3 p-4 hover:bg-[var(--canvas)]"
                >
                  <span>{p.name}</span>
                  <span className="text-sm font-medium text-amber-600">
                    {p.stock} left
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function Tile({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-leather"
    >
      <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--muted)]">{label}</p>
    </Link>
  );
}
