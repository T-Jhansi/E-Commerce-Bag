"use client";

import { useState } from "react";
import { useDealers } from "@/hooks/use-dealers";
import { createDealer, deleteDealer, updateDealer } from "@/lib/dealer-store";
import { Dealer } from "@/lib/types";

interface DealerFormState {
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  mapUrl: string;
  lat: string;
  lng: string;
  hasClockRoom: boolean;
}

const EMPTY_FORM: DealerFormState = {
  name: "",
  city: "",
  state: "",
  address: "",
  phone: "",
  mapUrl: "",
  lat: "",
  lng: "",
  hasClockRoom: true,
};

export default function AdminDealersPage() {
  const { dealers, ready } = useDealers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DealerFormState>(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function update<K extends keyof DealerFormState>(key: K, value: DealerFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(dealer: Dealer) {
    setForm({
      name: dealer.name,
      city: dealer.city,
      state: dealer.state,
      address: dealer.address,
      phone: dealer.phone,
      mapUrl: dealer.mapUrl ?? "",
      lat: String(dealer.lat),
      lng: String(dealer.lng),
      hasClockRoom: dealer.hasClockRoom ?? true,
    });
    setEditingId(dealer.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim() || !form.address.trim() || !form.phone.trim()) return;
    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      mapUrl: form.mapUrl.trim() || undefined,
      lat: Number(form.lat) || 0,
      lng: Number(form.lng) || 0,
      hasClockRoom: form.hasClockRoom,
    };
    if (editingId) {
      updateDealer(editingId, payload);
    } else {
      createDealer(payload);
    }
    setShowForm(false);
    setEditingId(null);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dealers</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{dealers.length} locations</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-lg bg-leather px-4 py-2 text-sm font-medium text-white transition hover:bg-leather-dark"
        >
          Add dealer
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-display text-lg font-semibold">{editingId ? "Edit dealer" : "Add dealer"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Store name" required>
              <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="North Pole Flagship Store" />
            </Field>
            <Field label="Phone" required>
              <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 22 4000 1111" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" required>
              <input className="input" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Mumbai" />
            </Field>
            <Field label="State">
              <input className="input" value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="Maharashtra" />
            </Field>
          </div>
          <Field label="Address" required>
            <input className="input" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Shop 12, Linking Road, Bandra West" />
          </Field>
          <Field label="Map URL (optional)">
            <input className="input" value={form.mapUrl} onChange={(e) => update("mapUrl", e.target.value)} placeholder="https://maps.google.com/..." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude" required>
              <input className="input" value={form.lat} onChange={(e) => update("lat", e.target.value)} placeholder="19.0596" />
            </Field>
            <Field label="Longitude" required>
              <input className="input" value={form.lng} onChange={(e) => update("lng", e.target.value)} placeholder="72.8295" />
            </Field>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Used to power &ldquo;nearest Clock Room&rdquo; search. Find coordinates by right-clicking the location on Google Maps.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.hasClockRoom}
              onChange={(e) => update("hasClockRoom", e.target.checked)}
            />
            Offers Clock Room bag storage
          </label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-leather px-4 py-2 text-sm font-medium text-white transition hover:bg-leather-dark">
              {editingId ? "Save changes" : "Add dealer"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:border-leather"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Store</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Clock Room</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {ready && dealers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  No dealers yet.
                </td>
              </tr>
            )}
            {dealers.map((d) => (
              <tr key={d.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--canvas)]">
                <td className="px-4 py-3">{d.name}</td>
                <td className="px-4 py-3">
                  {d.city}, {d.state}
                </td>
                <td className="px-4 py-3">{d.phone}</td>
                <td className="px-4 py-3">{d.hasClockRoom ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(d)}
                    className="mr-3 text-sm font-medium text-leather hover:underline"
                  >
                    Edit
                  </button>
                  {confirmDeleteId === d.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        deleteDealer(d.id);
                        setConfirmDeleteId(null);
                      }}
                      className="text-sm font-medium text-rose-600 hover:underline"
                    >
                      Confirm delete?
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(d.id)}
                      className="text-sm font-medium text-[var(--muted)] hover:text-rose-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
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
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-leather"> *</span>}
      </span>
      {children}
    </label>
  );
}
