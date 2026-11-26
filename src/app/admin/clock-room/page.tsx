"use client";

import { useMemo, useState } from "react";
import { ScanLine } from "lucide-react";
import { useBookings } from "@/hooks/use-clockroom";
import { findBookingByScan, updateBookingStatus } from "@/lib/clockroom-store";
import { BOOKING_STATUSES, BookingStatus, ClockRoomBooking } from "@/lib/types";
import { formatDateTime, formatINR } from "@/lib/format";

export default function AdminClockRoomPage() {
  const { bookings, ready } = useBookings();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "All">("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      const matchesSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.dealerName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Clock Room desk</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{bookings.length} bookings total</p>
      </header>

      <ScanPanel />

      <div className="mb-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-semibold">All bookings</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <StatusChip active={statusFilter === "All"} onClick={() => setStatusFilter("All")}>
              All
            </StatusChip>
            {BOOKING_STATUSES.map((s) => (
              <StatusChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {s}
              </StatusChip>
            ))}
          </div>
          <input
            className="input sm:max-w-xs"
            placeholder="Search by ID, name, phone, store"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Store</th>
              <th className="px-4 py-3 font-medium">Paid</th>
              <th className="px-4 py-3 font-medium">Reserved</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ready && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">
                  No bookings match.
                </td>
              </tr>
            )}
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--canvas)]">
                <td className="px-4 py-3 font-medium">{b.id}</td>
                <td className="px-4 py-3">
                  <p>{b.customerName}</p>
                  <p className="text-xs text-[var(--muted)]">{b.phone}</p>
                </td>
                <td className="px-4 py-3">{b.dealerName}</td>
                <td className="px-4 py-3 tabular-nums">{formatINR(b.amount)}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">{formatDateTime(b.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[var(--canvas)] px-2.5 py-1 text-xs font-medium">{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function ScanPanel() {
  const [code, setCode] = useState("");
  const [booking, setBooking] = useState<ClockRoomBooking | null | undefined>(undefined);
  const [flash, setFlash] = useState<string | null>(null);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const found = findBookingByScan(code);
    setBooking(found ?? null);
    setFlash(null);
  }

  function handleAction(nextStatus: BookingStatus) {
    if (!booking) return;
    const note =
      nextStatus === "Checked In"
        ? "Bag checked in at the store counter."
        : nextStatus === "Claimed"
        ? "Bag collected by customer."
        : undefined;
    const updated = updateBookingStatus(booking.id, nextStatus, note, "Clock Room Desk");
    setBooking(updated ?? null);
    setFlash(`Marked as ${nextStatus}.`);
    setCode("");
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold">
        <ScanLine className="h-5 w-5 text-leather" />
        Scan or enter a code
      </h2>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Scan the customer&apos;s QR code with any scanner app and paste the result, or type their 6-digit OTP.
      </p>
      <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
        <input
          className="input flex-1"
          placeholder="Paste scanned QR text or type OTP"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark">
          Look up
        </button>
      </form>

      {booking === null && <p className="mt-4 text-sm text-rose-600">No booking matches that code.</p>}

      {booking && (
        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display text-base font-semibold">{booking.id}</p>
              <p className="text-xs text-[var(--muted)]">
                {booking.customerName} · {booking.phone} · {booking.bagDescription}
              </p>
            </div>
            <span className="rounded-full bg-[var(--card)] px-2.5 py-1 text-xs font-medium">{booking.status}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {booking.status === "Reserved" && (
              <button
                type="button"
                onClick={() => handleAction("Checked In")}
                className="rounded-lg bg-leather px-4 py-2 text-sm font-medium text-white transition hover:bg-leather-dark"
              >
                Check in bag
              </button>
            )}
            {booking.status === "Checked In" && (
              <button
                type="button"
                onClick={() => handleAction("Claimed")}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Release bag to customer
              </button>
            )}
            {(booking.status === "Claimed" || booking.status === "Cancelled") && (
              <p className="text-sm text-[var(--muted)]">This booking is already {booking.status.toLowerCase()}.</p>
            )}
          </div>
          {flash && <p className="mt-3 text-sm font-medium text-emerald-600">{flash}</p>}
        </div>
      )}
    </section>
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
