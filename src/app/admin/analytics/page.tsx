"use client";

import { useOrders } from "@/hooks/use-orders";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { TopProductsChart } from "@/components/admin/TopProductsChart";
import { OrderStatusBreakdown } from "@/components/admin/OrderStatusBreakdown";
import { formatINR } from "@/lib/format";

export default function AdminAnalyticsPage() {
  const { orders } = useOrders();
  const liveOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalRevenue = liveOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = liveOrders.length ? totalRevenue / liveOrders.length : 0;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Sales performance across all orders.</p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile label="Total revenue" value={formatINR(totalRevenue)} />
        <Tile label="Orders placed" value={String(liveOrders.length)} />
        <Tile label="Average order value" value={formatINR(Math.round(avgOrderValue))} />
      </div>

      <div className="space-y-6">
        <RevenueChart orders={orders} />
        <div className="grid gap-6 lg:grid-cols-2">
          <TopProductsChart orders={orders} />
          <OrderStatusBreakdown orders={orders} />
        </div>
      </div>
    </main>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
