"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDealers } from "@/hooks/use-dealers";

export default function DealersPage() {
  const { dealers, ready } = useDealers();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dealers;
    return dealers.filter(
      (d) =>
        d.city.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q)
    );
  }, [dealers, search]);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <header className="mb-8">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back home
        </Link>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-leather">
          North Pole · Dealer Locator
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Find a dealer</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Visit an authorized North Pole store to try our bags in person.
        </p>
      </header>

      <input
        className="input mb-6"
        placeholder="Search by city or state"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {ready && filtered.length === 0 && (
        <p className="text-sm text-[var(--muted)]">No dealers match that search.</p>
      )}

      <div className="space-y-4">
        {filtered.map((dealer) => (
          <div key={dealer.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold">{dealer.name}</h2>
                <p className="text-sm text-[var(--muted)]">
                  {dealer.city}, {dealer.state}
                </p>
              </div>
              {dealer.mapUrl && (
                <a
                  href={dealer.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-leather hover:underline"
                >
                  View on map →
                </a>
              )}
            </div>
            <p className="mt-3 text-sm">{dealer.address}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{dealer.phone}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
