"use client";

import { useMemo, useState } from "react";
import { useStorageTickets } from "@/hooks/use-storage-tickets";
import { updateStorageStatus } from "@/lib/storage-store";
import { STORAGE_STATUSES, StorageStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

export default function AdminClockRoomPage() {
  const { tickets, ready } = useStorageTickets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StorageStatus | "All">("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.claimCode.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.phone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [tickets, search, statusFilter]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Clock Room</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{tickets.length} bags checked in overall</p>
      </header>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <StatusChip active={statusFilter === "All"} onClick={() => setStatusFilter("All")}>
            All
          </StatusChip>
          {STORAGE_STATUSES.map((s) => (
            <StatusChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {s}
            </StatusChip>
          ))}
        </div>
        <input
          className="input sm:max-w-xs"
          placeholder="Search by ticket, code, name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Bag</th>
              <th className="px-4 py-3 font-medium">Claim code</th>
              <th className="px-4 py-3 font-medium">Checked in</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ready && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">
                  No storage tickets match.
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--canvas)]">
                <td className="px-4 py-3 font-medium">{t.id}</td>
                <td className="px-4 py-3">
                  <p>{t.customerName}</p>
                  <p className="text-xs text-[var(--muted)]">{t.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{t.bagDescription}</p>
                  <p className="text-xs text-[var(--muted)]">{t.itemCount} item{t.itemCount === 1 ? "" : "s"}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{t.claimCode}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">{formatDateTime(t.dropOffDate)}</td>
                <td className="px-4 py-3">
                  <StatusDropdown
                    status={t.status}
                    onChange={(status) => updateStorageStatus(t.id, status, undefined, "Admin")}
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
  status: StorageStatus;
  onChange: (status: StorageStatus) => void;
}) {
  return (
    <select
      className="input w-auto py-1 text-xs"
      value={status}
      onChange={(e) => onChange(e.target.value as StorageStatus)}
    >
      {STORAGE_STATUSES.map((s) => (
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
