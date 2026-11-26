"use client";

import { useState } from "react";
import { Order } from "@/lib/types";
import { formatINR } from "@/lib/format";

export function RevenueChart({ orders }: { orders: Order[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d;
  });

  const revenueByDay = days.map((d) => {
    const key = d.toISOString().slice(0, 10);
    const revenue = orders
      .filter((o) => o.createdAt.slice(0, 10) === key && o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    return { date: d, key, revenue };
  });

  const max = Math.max(1, ...revenueByDay.map((d) => d.revenue));

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Revenue, last 14 days</h2>
          <p className="text-xs text-[var(--muted)]">Excludes cancelled orders</p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-xs font-medium text-leather hover:underline"
        >
          {showTable ? "View chart" : "View table"}
        </button>
      </div>

      {showTable ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {revenueByDay.map((d) => (
              <tr key={d.key} className="border-b border-[var(--border)] last:border-0">
                <td className="py-2">{d.date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}</td>
                <td className="py-2 tabular-nums">{formatINR(d.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="relative flex h-40 gap-1.5 sm:gap-2">
          {revenueByDay.map((d, i) => (
            <div
              key={d.key}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            >
              {hovered === i && (
                <div className="absolute -top-9 z-10 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                  {d.date.toLocaleDateString(undefined, { day: "numeric", month: "short" })} · {formatINR(d.revenue)}
                </div>
              )}
              <div
                className={`w-full max-w-[22px] rounded-t transition-colors ${
                  hovered === i ? "bg-amber-600" : "bg-amber-400"
                }`}
                style={{ height: `${Math.max(2, (d.revenue / max) * 100)}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {!showTable && (
        <div className="mt-2 flex justify-between text-[10px] text-[var(--muted)]">
          <span>{revenueByDay[0].date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
          <span>{revenueByDay[revenueByDay.length - 1].date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
        </div>
      )}
    </div>
  );
}
