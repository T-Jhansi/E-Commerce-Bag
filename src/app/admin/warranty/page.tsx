"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useWarranties } from "@/hooks/use-warranty";
import { updateWarrantyStatus } from "@/lib/warranty-store";
import { WARRANTY_STATUSES, WarrantyStatus } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function AdminWarrantyPage() {
  const { warranties, ready } = useWarranties();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WarrantyStatus | "All">("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return warranties.filter((w) => {
      const matchesStatus = statusFilter === "All" || w.status === statusFilter;
      const matchesSearch =
        !q ||
        w.id.toLowerCase().includes(q) ||
        w.customerName.toLowerCase().includes(q) ||
        w.phone.includes(q) ||
        w.productName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [warranties, search, statusFilter]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Warranty registrations</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{warranties.length} registered</p>
      </header>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <StatusChip active={statusFilter === "All"} onClick={() => setStatusFilter("All")}>
            All
          </StatusChip>
          {WARRANTY_STATUSES.map((s) => (
            <StatusChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {s}
            </StatusChip>
          ))}
        </div>
        <input
          className="input sm:max-w-xs"
          placeholder="Search by ID, name, phone or product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Purchased</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ready && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  No warranty registrations match.
                </td>
              </tr>
            )}
            {filtered.map((w) => (
              <tr key={w.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--canvas)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/warranty/${w.id}`} className="font-medium text-leather hover:underline">
                    {w.id}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p>{w.customerName}</p>
                  <p className="text-xs text-[var(--muted)]">{w.phone}</p>
                </td>
                <td className="px-4 py-3">{w.productName}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">{formatDate(w.purchaseDate)}</td>
                <td className="px-4 py-3">
                  <StatusDropdown
                    status={w.status}
                    onChange={(status) => updateWarrantyStatus(w.id, status, undefined, "Admin")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatusDropdown({
  status,
  onChange,
}: {
  status: WarrantyStatus;
  onChange: (status: WarrantyStatus) => void;
}) {
  return (
    <select
      className="input w-auto py-1 text-xs"
      value={status}
      onChange={(e) => onChange(e.target.value as WarrantyStatus)}
    >
      {WARRANTY_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
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
