"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/use-orders";
import { formatDateTime, formatINR } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  Processing: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const { order, ready } = useOrder(params.id);

  if (ready && !order) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/shop" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to shop
        </Link>
        <p className="mt-6 text-[var(--muted)]">
          No order found for &ldquo;{params.id}&rdquo;.
        </p>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <Link href="/shop" className="text-sm text-[var(--muted)] hover:text-leather">
        ← Continue shopping
      </Link>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Order confirmed
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold">{order.id}</h1>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {order.status}
          </span>
        </div>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Thanks, {order.customerName}. Save this order number to track it — we&apos;ll
          text updates to {order.phone}.
        </p>

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

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Subtotal</span>
            <span className="tabular-nums">{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Shipping</span>
            <span className="tabular-nums">
              {order.shipping === 0 ? "Free" : formatINR(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-base font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatINR(order.total)}</span>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-[var(--canvas)] p-4 text-sm">
          <p className="font-medium">Shipping to</p>
          <p className="mt-1 text-[var(--muted)]">
            {order.address}, {order.city} {order.pincode}
          </p>
          <p className="mt-2 text-[var(--muted)]">Payment: {order.paymentMethod}</p>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Updates
          </p>
          <ol className="space-y-3 border-l border-[var(--border)] pl-4">
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
        </div>
      </div>
    </main>
  );
}
