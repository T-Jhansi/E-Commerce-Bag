import { Order, ORDER_STATUSES, OrderStatus } from "@/lib/types";

const STATUS_DOT: Record<OrderStatus, string> = {
  Pending: "bg-slate-400",
  Processing: "bg-amber-500",
  Shipped: "bg-blue-500",
  Delivered: "bg-emerald-500",
  Cancelled: "bg-rose-500",
};

export function OrderStatusBreakdown({ orders }: { orders: Order[] }) {
  const counts: Record<OrderStatus, number> = {
    Pending: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };
  orders.forEach((o) => {
    counts[o.status] += 1;
  });
  const total = orders.length || 1;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-4 font-display text-lg font-semibold">Orders by status</h2>
      <div className="space-y-3">
        {ORDER_STATUSES.map((status) => {
          const count = counts[status];
          const percent = Math.round((count / total) * 100);
          return (
            <div key={status} className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
              <span className="w-24 shrink-0 text-xs font-medium">{status}</span>
              <div className="h-2 flex-1 rounded-full bg-[var(--canvas)]">
                <div className={`h-2 rounded-full ${STATUS_DOT[status]}`} style={{ width: `${percent}%` }} />
              </div>
              <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
