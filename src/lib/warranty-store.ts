"use client";

import { NewWarrantyInput, WarrantyNote, WarrantyRegistration, WarrantyStatus } from "./types";
import { readJSON, writeJSON, subscribeEvent } from "./persist";

const STORAGE_KEY = "northpole_warranty_v1";
const EVENT_NAME = "northpole_warranty_change";

const SEED_WARRANTIES: WarrantyRegistration[] = [];

function readAll(): WarrantyRegistration[] {
  return readJSON(STORAGE_KEY, SEED_WARRANTIES);
}

function writeAll(items: WarrantyRegistration[]) {
  writeJSON(STORAGE_KEY, items, EVENT_NAME);
}

export function subscribeWarranties(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}

export function getAllWarranties(): WarrantyRegistration[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getWarrantyById(id: string): WarrantyRegistration | undefined {
  return readAll().find((w) => w.id.toLowerCase() === id.trim().toLowerCase());
}

export function findWarrantiesByPhone(phone: string): WarrantyRegistration[] {
  const normalized = phone.replace(/\D/g, "");
  if (!normalized) return [];
  return readAll().filter((w) => w.phone.replace(/\D/g, "") === normalized);
}

function nextWarrantyId(existing: WarrantyRegistration[]): string {
  const numbers = existing
    .map((w) => parseInt(w.id.replace("WR-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 1000) + 1;
  return `WR-${next}`;
}

export function registerWarranty(input: NewWarrantyInput): WarrantyRegistration {
  const all = readAll();
  const now = new Date().toISOString();
  const registration: WarrantyRegistration = {
    id: nextWarrantyId(all),
    ...input,
    status: "Active",
    notes: [
      {
        id: `n-${Date.now()}`,
        date: now,
        author: "System",
        text: "Warranty registered. Keep your registration ID handy if you ever need to file a claim.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  writeAll([registration, ...all]);
  return registration;
}

export function requestWarrantyClaim(
  id: string,
  reason: string
): WarrantyRegistration | undefined {
  const all = readAll();
  const idx = all.findIndex((w) => w.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const updated = {
    ...all[idx],
    status: "Claim Requested" as WarrantyStatus,
    claimReason: reason,
    notes: [
      ...all[idx].notes,
      { id: `n-${Date.now()}`, date: now, author: "Customer", text: `Claim requested: ${reason}` },
    ],
    updatedAt: now,
  };
  const next = [...all];
  next[idx] = updated;
  writeAll(next);
  return updated;
}

export function updateWarrantyStatus(
  id: string,
  status: WarrantyStatus,
  note?: string,
  author = "Admin"
): WarrantyRegistration | undefined {
  const all = readAll();
  const idx = all.findIndex((w) => w.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const updated = { ...all[idx], status, updatedAt: now };
  if (note && note.trim()) {
    updated.notes = [...updated.notes, { id: `n-${Date.now()}`, date: now, author, text: note.trim() } as WarrantyNote];
  }
  const next = [...all];
  next[idx] = updated;
  writeAll(next);
  return updated;
}
