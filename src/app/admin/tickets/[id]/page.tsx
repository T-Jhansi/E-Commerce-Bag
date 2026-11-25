"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { useTicket } from "@/hooks/use-tickets";
import { addTicketNote, updateTicketDetails, updateTicketStatus } from "@/lib/store";
import { TICKET_STATUSES, TicketStatus } from "@/lib/types";

export default function AdminTicketDetail() {
  const params = useParams<{ id: string }>();
  const { ticket, ready } = useTicket(params.id);

  const [statusDraft, setStatusDraft] = useState<TicketStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [newNote, setNewNote] = useState("");
  const [technician, setTechnician] = useState("");
  const [eta, setEta] = useState("");
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  if (ready && !ticket) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin/tickets" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to service desk
        </Link>
        <p className="mt-6 text-[var(--muted)]">
          No ticket found for &ldquo;{params.id}&rdquo;.
        </p>
      </main>
    );
  }

  if (!ticket) return null;

  const currentStatus = statusDraft || ticket.status;
  const currentTechnician = technician || ticket.technician || "";
  const currentEta = eta || ticket.estimatedCompletion || "";

  function flash(message: string) {
    setSavedFlash(message);
    setTimeout(() => setSavedFlash(null), 2500);
  }

  function handleStatusSave() {
    if (!ticket) return;
    updateTicketStatus(ticket.id, (statusDraft || ticket.status) as TicketStatus, statusNote, "Admin");
    setStatusDraft("");
    setStatusNote("");
    flash("Status updated.");
  }

  function handleNoteSave() {
    if (!ticket || !newNote.trim()) return;
    addTicketNote(ticket.id, newNote.trim(), "Admin");
    setNewNote("");
    flash("Note added.");
  }

  function handleAssignmentSave() {
    if (!ticket) return;
    updateTicketDetails(ticket.id, {
      technician: currentTechnician || undefined,
      estimatedCompletion: currentEta || undefined,
    });
    setTechnician("");
    setEta("");
    flash("Assignment saved.");
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/tickets" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to service desk
        </Link>
        {savedFlash && (
          <span className="text-sm font-medium text-emerald-600">{savedFlash}</span>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Ticket
            </p>
            <h1 className="font-display text-2xl font-semibold">{ticket.id}</h1>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
          <Info label="Customer" value={ticket.customerName} />
          <Info label="Phone" value={ticket.phone} />
          <Info label="Email" value={ticket.email ?? "—"} />
          <Info label="Bag type" value={ticket.bagType} />
          <Info label="Brand / model" value={ticket.bagBrand ?? "—"} />
          <Info label="Bag tag" value={ticket.bagTag} />
          <Info label="Dropped off" value={formatDate(ticket.dropOffDate)} />
        </dl>

        <div className="mt-5 rounded-lg bg-[var(--canvas)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Reported issue
          </p>
          <p className="mt-1 text-sm">{ticket.issue}</p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-display text-lg font-semibold">Assignment</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Technician</span>
            <input
              className="input"
              placeholder={ticket.technician ?? "Unassigned"}
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Estimated completion</span>
            <input
              type="date"
              className="input"
              value={currentEta.slice(0, 10)}
              onChange={(e) => setEta(e.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleAssignmentSave}
          className="mt-4 rounded-lg bg-leather px-4 py-2 text-sm font-medium text-white transition hover:bg-leather-dark"
        >
          Save assignment
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-display text-lg font-semibold">Update status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">New status</span>
            <select
              className="input"
              value={currentStatus}
              onChange={(e) => setStatusDraft(e.target.value as TicketStatus)}
            >
              {TICKET_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Note for this update (visible to the customer)
            </span>
            <input
              className="input"
              placeholder="e.g. Ready for pickup, SMS sent to customer"
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
          {[...ticket.notes].reverse().map((note) => (
            <li key={note.id} className="relative">
              <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-leather" />
              <p className="text-sm">{note.text}</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                {note.author} · {formatDateTime(note.date)}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            className="input flex-1"
            placeholder="Add an internal or customer-visible note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button
            type="button"
            onClick={handleNoteSave}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:border-leather hover:text-leather"
          >
            Add note
          </button>
        </div>
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
