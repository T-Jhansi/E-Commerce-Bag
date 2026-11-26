"use client";

import Link from "next/link";
import { useState } from "react";
import {
  findWarrantiesByPhone,
  getWarrantyById,
  registerWarranty,
  requestWarrantyClaim,
} from "@/lib/warranty-store";
import { WarrantyRegistration } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/format";

type Tab = "register" | "lookup";

export default function WarrantyPage() {
  const [tab, setTab] = useState<Tab>("register");

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-8">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back home
        </Link>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-leather">
          North Pole · Warranty
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Warranty registration
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Register your purchase to activate your manufacturer warranty, or
          look up an existing registration to file a claim.
        </p>
      </header>

      <div className="mb-6 inline-flex rounded-full border border-[var(--border)] bg-[var(--card)] p-1">
        <TabButton active={tab === "register"} onClick={() => setTab("register")}>
          Register a product
        </TabButton>
        <TabButton active={tab === "lookup"} onClick={() => setTab("lookup")}>
          My warranties
        </TabButton>
      </div>

      {tab === "register" ? <RegisterForm /> : <LookupForm />}
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

function RegisterForm() {
  const [submitted, setSubmitted] = useState<WarrantyRegistration | null>(null);
  const [form, setForm] = useState({
    productName: "",
    orderId: "",
    serialNumber: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    warrantyYears: "3",
    customerName: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.productName.trim() || !form.serialNumber.trim() || !form.customerName.trim() || !form.phone.trim()) {
      setError("Please fill in the product name, serial number, your name, and phone number.");
      return;
    }
    const registration = registerWarranty({
      productName: form.productName.trim(),
      orderId: form.orderId.trim() || undefined,
      serialNumber: form.serialNumber.trim(),
      purchaseDate: form.purchaseDate,
      warrantyYears: Number(form.warrantyYears) || 1,
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
    });
    setSubmitted(registration);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Warranty registered
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{submitted.id}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Save this registration ID — you&apos;ll need it (or your phone number)
          to file a claim later.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className="mt-6 text-sm font-medium text-leather hover:underline"
        >
          Register another product
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" required>
          <input
            className="input"
            value={form.productName}
            onChange={(e) => update("productName", e.target.value)}
            placeholder="North Pole Voyager Laptop Backpack"
          />
        </Field>
        <Field label="Order ID (optional)">
          <input
            className="input"
            value={form.orderId}
            onChange={(e) => update("orderId", e.target.value)}
            placeholder="ORD-1001"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Serial number" required>
          <input
            className="input"
            value={form.serialNumber}
            onChange={(e) => update("serialNumber", e.target.value)}
            placeholder="Printed inside the main pocket"
          />
        </Field>
        <Field label="Purchase date">
          <input
            type="date"
            className="input"
            value={form.purchaseDate}
            onChange={(e) => update("purchaseDate", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Warranty period">
        <select
          className="input"
          value={form.warrantyYears}
          onChange={(e) => update("warrantyYears", e.target.value)}
        >
          <option value="1">1 year</option>
          <option value="3">3 years</option>
          <option value="5">5 years</option>
        </select>
      </Field>

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

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-leather py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark sm:w-auto sm:px-6"
      >
        Register warranty
      </button>
    </form>
  );
}

function LookupForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WarrantyRegistration[] | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearched(true);
    if (!q) {
      setResults([]);
      return;
    }
    const byId = getWarrantyById(q);
    if (byId) {
      setResults([byId]);
      return;
    }
    setResults(findWarrantiesByPhone(q));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row">
        <input
          className="input flex-1"
          placeholder="Registration ID (WR-1001) or phone number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark">
          Search
        </button>
      </form>

      {searched && results && results.length === 0 && (
        <p className="text-sm text-[var(--muted)]">No warranty registrations found. Double-check and try again.</p>
      )}

      {results?.map((w) => (
        <WarrantyCard key={w.id} warranty={w} />
      ))}
    </div>
  );
}

function WarrantyCard({ warranty }: { warranty: WarrantyRegistration }) {
  const [reason, setReason] = useState("");
  const [claimed, setClaimed] = useState(false);

  function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    requestWarrantyClaim(warranty.id, reason.trim());
    setClaimed(true);
  }

  const canClaim = warranty.status === "Active";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-display text-lg font-semibold">{warranty.id}</p>
          <p className="text-sm text-[var(--muted)]">{warranty.productName}</p>
        </div>
        <span className="rounded-full bg-[var(--canvas)] px-2.5 py-1 text-xs font-medium">
          {warranty.status}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Purchased</dt>
          <dd>{formatDate(warranty.purchaseDate)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Warranty period</dt>
          <dd>{warranty.warrantyYears} year{warranty.warrantyYears === 1 ? "" : "s"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Serial no.</dt>
          <dd>{warranty.serialNumber}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Order ID</dt>
          <dd>{warranty.orderId ?? "—"}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Activity</p>
        <ol className="space-y-3 border-l border-[var(--border)] pl-4">
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
      </div>

      {canClaim && !claimed && (
        <form onSubmit={handleClaim} className="mt-5 border-t border-[var(--border)] pt-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">File a warranty claim</span>
            <textarea
              className="input min-h-20"
              placeholder="Describe the defect you're experiencing"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button type="submit" className="mt-3 rounded-lg bg-leather px-4 py-2 text-sm font-medium text-white transition hover:bg-leather-dark">
            Submit claim
          </button>
        </form>
      )}
      {claimed && (
        <p className="mt-5 border-t border-[var(--border)] pt-5 text-sm text-emerald-600">
          Claim submitted — our team will review it shortly.
        </p>
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
