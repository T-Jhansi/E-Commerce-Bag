"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { useTickets } from "@/hooks/use-tickets";
import { TICKET_STATUSES, TicketStatus } from "@/lib/types";

export default function AdminDashboard() {
  const { tickets, ready } = useTickets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");

  const counts = useMemo(() => {
    const base: Record<TicketStatus, number> = {
      Received: 0,
      "In Service": 0,
      "Ready for Pickup": 0,
      Returned: 0,
      Cancelled: 0,
    };
    tickets.forEach((t) => {
      base[t.status] += 1;
    });
    return base;
  }, [tickets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.bagTag.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [tickets, search, statusFilter]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Find My Bag tickets</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Servicing requests dropped off by customers.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile
          label="All tickets"
          value={tickets.length}
          active={statusFilter === "All"}
          onClick={() => setStatusFilter("All")}
        />
        {TICKET_STATUSES.map((status) => (
          <StatTile
            key={status}
            label={status}
            value={counts[status]}
            active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          />
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="input sm:max-w-xs"
          placeholder="Search by ticket, name, phone or tag"
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
              <th className="px-4 py-3 font-medium">Technician</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {ready && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">
                  No tickets match.
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="group border-b border-[var(--border)] last:border-0 hover:bg-[var(--canvas)]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/tickets/${t.id}`}
                    className="font-medium text-leather group-hover:underline"
                  >
                    {t.id}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p>{t.customerName}</p>
                  <p className="text-xs text-[var(--muted)]">{t.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{t.bagType}</p>
                  <p className="text-xs text-[var(--muted)]">{t.bagTag}</p>
                </td>
                <td className="px-4 py-3">{t.technician ?? "Unassigned"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">
                  {new Date(t.updatedAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatTile({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition ${
        active
          ? "border-leather bg-leather/10"
          : "border-[var(--border)] bg-[var(--card)] hover:border-leather"
      }`}
    >
      <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--muted)]">{label}</p>
    </button>
  );
}
