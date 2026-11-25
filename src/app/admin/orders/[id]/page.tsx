"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useOrder } from "@/hooks/use-orders";
import { updateOrderStatus } from "@/lib/order-store";
import { formatDateTime, formatINR } from "@/lib/format";
import { ORDER_STATUSES, OrderStatus } from "@/lib/types";

export default function AdminOrderDetail() {
  const params = useParams<{ id: string }>();
  const { order, ready } = useOrder(params.id);

  const [statusDraft, setStatusDraft] = useState<OrderStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  if (ready && !order) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin/orders" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to orders
        </Link>
        <p className="mt-6 text-[var(--muted)]">No order found for &ldquo;{params.id}&rdquo;.</p>
      </main>
    );
  }

  if (!order) return null;

  const currentStatus = statusDraft || order.status;

  function handleStatusSave() {
    if (!order) return;
    updateOrderStatus(order.id, (statusDraft || order.status) as OrderStatus, statusNote, "Admin");
    setStatusDraft("");
    setStatusNote("");
    setSavedFlash("Status updated.");
    setTimeout(() => setSavedFlash(null), 2500);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/orders" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to orders
        </Link>
        {savedFlash && <span className="text-sm font-medium text-emerald-600">{savedFlash}</span>}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Order</p>
            <h1 className="font-display text-2xl font-semibold">{order.id}</h1>
          </div>
          <span className="text-sm font-medium">{order.status}</span>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
          <Info label="Customer" value={order.customerName} />
          <Info label="Phone" value={order.phone} />
          <Info label="Email" value={order.email ?? "—"} />
          <Info label="City" value={order.city} />
          <Info label="Pincode" value={order.pincode} />
          <Info label="Payment" value={order.paymentMethod} />
        </dl>

        <div className="mt-5 rounded-lg bg-[var(--canvas)] p-4 text-sm">
          <p className="font-medium">Shipping address</p>
          <p className="mt-1 text-[var(--muted)]">{order.address}</p>
        </div>

        <ul className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {order.lines.map((line) => (
            <li key={line.productId} className="flex justify-between py-2 text-sm">
              <span>
                {line.name} × {line.quantity}
              </span>
              <span className="tabular-nums">{formatINR(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between text-base font-medium">
          <span>Total</span>
          <span className="tabular-nums">{formatINR(order.total)}</span>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-display text-lg font-semibold">Update status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">New status</span>
            <select
              className="input"
              value={currentStatus}
              onChange={(e) => setStatusDraft(e.target.value as OrderStatus)}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Note for this update (visible to the customer)
            </span>
            <input
              className="input"
              placeholder="e.g. Shipped via BlueDart, tracking ABC123"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleStatusSave}
          className="mt-4 rounded-lg bg-leather px-4 py-2 text-sm font-medium text-white transition hover:bg-leather-dark"
        >
          Save status
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-display text-lg font-semibold">Activity</h2>
        <ol className="mt-4 space-y-3 border-l border-[var(--border)] pl-4">
          {[...order.notes].reverse().map((note) => (
            <li key={note.id} className="relative">
              <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-leather" />
              <p className="text-sm">{note.text}</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                {note.author} · {formatDateTime(note.date)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
