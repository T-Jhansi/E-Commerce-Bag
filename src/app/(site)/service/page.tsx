"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { createTicket, findTicketsByPhone, getTicketById } from "@/lib/store";
import { ServiceTicket } from "@/lib/types";

const BAG_TYPES = [
  "Laptop Backpack",
  "Travel Duffel",
  "Tote Bag",
  "Sling Bag",
  "Wallet / Accessory",
  "Other",
];

type Tab = "drop-off" | "track";

export default function ServicePage() {
  const [tab, setTab] = useState<Tab>("drop-off");

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-8">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back home
        </Link>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-leather">
          North Pole · Maintenance &amp; Service
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Repair &amp; service desk
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Drop off a bag for repair, or track an existing service ticket.
        </p>
      </header>

      <div className="mb-6 inline-flex rounded-full border border-[var(--border)] bg-[var(--card)] p-1">
        <TabButton active={tab === "drop-off"} onClick={() => setTab("drop-off")}>
          Drop off a bag
        </TabButton>
        <TabButton active={tab === "track"} onClick={() => setTab("track")}>
          Track my bag
        </TabButton>
      </div>

      {tab === "drop-off" ? <DropOffForm /> : <TrackForm />}
    </main>
  );
}

function TabButton({
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
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-leather text-white"
          : "text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function DropOffForm() {
  const [submitted, setSubmitted] = useState<ServiceTicket | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    bagType: BAG_TYPES[0],
    bagBrand: "",
    bagTag: "",
    issue: "",
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.customerName.trim() || !form.phone.trim() || !form.bagTag.trim() || !form.issue.trim()) {
      setError("Please fill in your name, phone number, bag tag, and the issue.");
      return;
    }
    const ticket = createTicket({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      bagType: form.bagType,
      bagBrand: form.bagBrand.trim() || undefined,
      bagTag: form.bagTag.trim(),
      issue: form.issue.trim(),
    });
    setSubmitted(ticket);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Bag registered
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          {submitted.id}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Save this ticket number — you&apos;ll need it (or your phone number) to
          track your bag&apos;s status.
        </p>
        <div className="mt-4">
          <StatusBadge status={submitted.status} />
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className="mt-6 text-sm font-medium text-leather hover:underline"
        >
          Register another bag
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            className="input"
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            placeholder="Ananya Rao"
          />
        </Field>
        <Field label="Phone number" required>
          <input
            className="input"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="98450 12345"
          />
        </Field>
      </div>

      <Field label="Email (optional)">
        <input
          type="email"
          className="input"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bag type">
          <select
            className="input"
            value={form.bagType}
            onChange={(e) => update("bagType", e.target.value)}
          >
            {BAG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Brand / model (optional)">
          <input
            className="input"
            value={form.bagBrand}
            onChange={(e) => update("bagBrand", e.target.value)}
            placeholder="North Pole Voyager"
          />
        </Field>
      </div>

      <Field label="Bag tag / serial number" required>
        <input
          className="input"
          value={form.bagTag}
          onChange={(e) => update("bagTag", e.target.value)}
          placeholder="Printed inside the bag's main pocket"
        />
      </Field>

      <Field label="What's wrong with it?" required>
        <textarea
          className="input min-h-24"
          value={form.issue}
          onChange={(e) => update("issue", e.target.value)}
          placeholder="e.g. Zipper is stuck and a strap has come loose"
        />
      </Field>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-leather py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark sm:w-auto sm:px-6"
      >
        Register for service
      </button>
    </form>
  );
}

function TrackForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ServiceTicket[] | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearched(true);
    if (!q) {
      setResults([]);
      return;
    }
    const byId = getTicketById(q);
    if (byId) {
      setResults([byId]);
      return;
    }
    setResults(findTicketsByPhone(q));
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row"
      >
        <input
          className="input flex-1"
          placeholder="Ticket number (FMB-1001) or phone number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark"
        >
          Track
        </button>
      </form>

      {searched && results && results.length === 0 && (
        <p className="text-sm text-[var(--muted)]">
          No service tickets found for that ticket number or phone. Double-check
          and try again.
        </p>
      )}

      {results?.map((ticket) => (
        <TicketTimeline key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
        {label}
        {required && <span className="text-leather"> *</span>}
      </span>
      {children}
    </label>
  );
}

function TicketTimeline({ ticket }: { ticket: ServiceTicket }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-display text-lg font-semibold">{ticket.id}</p>
          <p className="text-sm text-[var(--muted)]">
            {ticket.bagType}
            {ticket.bagBrand ? ` · ${ticket.bagBrand}` : ""}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Dropped off
          </dt>
          <dd>{formatDate(ticket.dropOffDate)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Est. completion
          </dt>
          <dd>
            {ticket.estimatedCompletion ? formatDate(ticket.estimatedCompletion) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Technician
          </dt>
          <dd>{ticket.technician ?? "Unassigned"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Bag tag
          </dt>
          <dd>{ticket.bagTag}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Updates
        </p>
        <ol className="space-y-3 border-l border-[var(--border)] pl-4">
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
      </div>
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
