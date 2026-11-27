"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { formatDate, formatINR } from "@/lib/format";
import { ORDER_STATUSES, OrderStatus } from "@/lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-slate-100 text-slate-700",
  Processing: "bg-amber-100 text-amber-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-700",
};

export default function AdminOrdersPage() {
  const { orders, ready } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{orders.length} placed</p>
      </header>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <StatusChip active={statusFilter === "All"} onClick={() => setStatusFilter("All")}>
            All
          </StatusChip>
          {ORDER_STATUSES.map((s) => (
            <StatusChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {s}
            </StatusChip>
          ))}
        </div>
        <input
          className="input sm:max-w-xs"
          placeholder="Search by order, name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {ready && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">
                  No orders match.
                </td>
              </tr>
            )}
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--canvas)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-leather hover:underline">
                    {o.id}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p>{o.customerName}</p>
                  <p className="text-xs text-[var(--muted)]">{o.phone}</p>
                </td>
                <td className="px-4 py-3">{o.lines.reduce((n, l) => n + l.quantity, 0)}</td>
                <td className="px-4 py-3 tabular-nums">{formatINR(o.total)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[o.status]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatusChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-leather bg-leather text-white"
          : "border-[var(--border)] text-[var(--muted)] hover:border-leather hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}
