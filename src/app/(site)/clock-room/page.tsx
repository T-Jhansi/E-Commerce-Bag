"use client";

import Link from "next/link";
import { useState } from "react";
import { checkInBag, findStorageTicketByClaimCode } from "@/lib/storage-store";
import { StorageTicket } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

type Tab = "check-in" | "claim";

export default function ClockRoomPage() {
  const [tab, setTab] = useState<Tab>("check-in");

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-8">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back home
        </Link>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-leather">
          North Pole · Clock Room
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Bag check-in &amp; storage
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Leave your bag with us for safekeeping while you shop or travel, and
          collect it later with your claim code.
        </p>
      </header>

      <div className="mb-6 inline-flex rounded-full border border-[var(--border)] bg-[var(--card)] p-1">
        <TabButton active={tab === "check-in"} onClick={() => setTab("check-in")}>
          Check in a bag
        </TabButton>
        <TabButton active={tab === "claim"} onClick={() => setTab("claim")}>
          Claim my bag
        </TabButton>
      </div>

      {tab === "check-in" ? <CheckInForm /> : <ClaimForm />}
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
        active ? "bg-leather text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function CheckInForm() {
  const [submitted, setSubmitted] = useState<StorageTicket | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    bagDescription: "",
    itemCount: "1",
    expectedPickupDate: "",
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.customerName.trim() || !form.phone.trim() || !form.bagDescription.trim()) {
      setError("Please fill in your name, phone number, and a description of the bag.");
      return;
    }
    const ticket = checkInBag({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      bagDescription: form.bagDescription.trim(),
      itemCount: Number(form.itemCount) || 1,
      expectedPickupDate: form.expectedPickupDate || undefined,
    });
    setSubmitted(ticket);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Bag checked in</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{submitted.id}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">Your claim code</p>
        <p className="mt-1 font-display text-3xl font-bold tracking-widest text-leather">
          {submitted.claimCode}
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Keep this code and your phone number handy — you&apos;ll need both to
          claim your bag.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className="mt-6 text-sm font-medium text-leather hover:underline"
        >
          Check in another bag
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <input className="input" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} placeholder="Ananya Rao" />
        </Field>
        <Field label="Phone number" required>
          <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="98450 12345" />
        </Field>
      </div>

      <Field label="Email (optional)">
        <input type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
      </Field>

      <Field label="Bag description" required>
        <input className="input" value={form.bagDescription} onChange={(e) => update("bagDescription", e.target.value)} placeholder="e.g. Black Voyager backpack with a red luggage tag" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Number of items">
          <input type="number" min="1" className="input" value={form.itemCount} onChange={(e) => update("itemCount", e.target.value)} />
        </Field>
        <Field label="Expected pickup (optional)">
          <input type="date" className="input" value={form.expectedPickupDate} onChange={(e) => update("expectedPickupDate", e.target.value)} />
        </Field>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button type="submit" className="w-full rounded-lg bg-leather py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark sm:w-auto sm:px-6">
        Check in bag
      </button>
    </form>
  );
}

function ClaimForm() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<StorageTicket | null | undefined>(undefined);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const ticket = findStorageTicketByClaimCode(code, phone);
    setResult(ticket ?? null);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ticket number or claim code" required>
            <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="CR-1001 or claim code" />
          </Field>
          <Field label="Phone number" required>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98450 12345" />
          </Field>
        </div>
        <button type="submit" className="rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark">
          Find my bag
        </button>
      </form>

      {result === null && (
        <p className="text-sm text-[var(--muted)]">No matching bag found. Double-check the code and phone number.</p>
      )}

      {result && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display text-lg font-semibold">{result.id}</p>
              <p className="text-sm text-[var(--muted)]">{result.bagDescription}</p>
            </div>
            <span className="rounded-full bg-[var(--canvas)] px-2.5 py-1 text-xs font-medium">
              {result.status}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Checked in</dt>
              <dd>{formatDateTime(result.dropOffDate)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Items</dt>
              <dd>{result.itemCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Claim code</dt>
              <dd>{result.claimCode}</dd>
            </div>
          </dl>
        </div>
      )}
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
