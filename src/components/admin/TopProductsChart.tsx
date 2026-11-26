import { Order } from "@/lib/types";

export function TopProductsChart({ orders }: { orders: Order[] }) {
  const unitsByProduct = new Map<string, { name: string; units: number }>();
  orders
    .filter((o) => o.status !== "Cancelled")
    .forEach((o) => {
      o.lines.forEach((line) => {
        const existing = unitsByProduct.get(line.productId);
        if (existing) {
          existing.units += line.quantity;
        } else {
          unitsByProduct.set(line.productId, { name: line.name, units: line.quantity });
        }
      });
    });

  const top = Array.from(unitsByProduct.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const max = Math.max(1, ...top.map((p) => p.units));

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-4 font-display text-lg font-semibold">Top products by units sold</h2>
      {top.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No sales yet.</p>
      ) : (
        <div className="space-y-3">
          {top.map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-xs font-medium sm:w-40">{p.name}</span>
              <div className="h-5 flex-1 rounded bg-[var(--canvas)]">
                <div
                  className="h-5 rounded bg-amber-500"
                  style={{ width: `${Math.max(4, (p.units / max) * 100)}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums">{p.units}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
