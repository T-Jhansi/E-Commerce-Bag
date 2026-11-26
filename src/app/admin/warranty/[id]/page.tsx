"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useWarranty } from "@/hooks/use-warranty";
import { updateWarrantyStatus } from "@/lib/warranty-store";
import { WARRANTY_STATUSES, WarrantyStatus } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/format";

export default function AdminWarrantyDetail() {
  const params = useParams<{ id: string }>();
  const { warranty, ready } = useWarranty(params.id);

  const [statusDraft, setStatusDraft] = useState<WarrantyStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  if (ready && !warranty) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin/warranty" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to warranty
        </Link>
        <p className="mt-6 text-[var(--muted)]">No registration found for &ldquo;{params.id}&rdquo;.</p>
      </main>
    );
  }

  if (!warranty) return null;

  const currentStatus = statusDraft || warranty.status;

  function handleStatusSave() {
    if (!warranty) return;
    updateWarrantyStatus(warranty.id, (statusDraft || warranty.status) as WarrantyStatus, statusNote, "Admin");
    setStatusDraft("");
    setStatusNote("");
    setSavedFlash("Status updated.");
    setTimeout(() => setSavedFlash(null), 2500);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/warranty" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to warranty
        </Link>
        {savedFlash && <span className="text-sm font-medium text-emerald-600">{savedFlash}</span>}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Registration</p>
            <h1 className="font-display text-2xl font-semibold">{warranty.id}</h1>
          </div>
          <span className="text-sm font-medium">{warranty.status}</span>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
          <Info label="Customer" value={warranty.customerName} />
          <Info label="Phone" value={warranty.phone} />
          <Info label="Email" value={warranty.email ?? "—"} />
          <Info label="Product" value={warranty.productName} />
          <Info label="Serial no." value={warranty.serialNumber} />
          <Info label="Order ID" value={warranty.orderId ?? "—"} />
          <Info label="Purchased" value={formatDate(warranty.purchaseDate)} />
          <Info label="Warranty period" value={`${warranty.warrantyYears} year${warranty.warrantyYears === 1 ? "" : "s"}`} />
        </dl>

        {warranty.claimReason && (
          <div className="mt-5 rounded-lg bg-[var(--canvas)] p-4 text-sm">
            <p className="font-medium">Claim reason</p>
            <p className="mt-1 text-[var(--muted)]">{warranty.claimReason}</p>
          </div>
        )}
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-display text-lg font-semibold">Update status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">New status</span>
            <select
              className="input"
              value={currentStatus}
              onChange={(e) => setStatusDraft(e.target.value as WarrantyStatus)}
            >
              {WARRANTY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Note (visible to the customer)</span>
            <input
              className="input"
              placeholder="e.g. Claim approved, replacement shipped"
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
          {[...warranty.notes].reverse().map((note) => (
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
