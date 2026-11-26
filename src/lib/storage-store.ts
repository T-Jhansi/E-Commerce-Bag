"use client";

import { NewStorageInput, StorageNote, StorageStatus, StorageTicket } from "./types";
import { readJSON, writeJSON, subscribeEvent } from "./persist";

const STORAGE_KEY = "northpole_clockroom_v1";
const EVENT_NAME = "northpole_clockroom_change";

const SEED_TICKETS: StorageTicket[] = [];

function readAll(): StorageTicket[] {
  return readJSON(STORAGE_KEY, SEED_TICKETS);
}

function writeAll(items: StorageTicket[]) {
  writeJSON(STORAGE_KEY, items, EVENT_NAME);
}

export function subscribeStorageTickets(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}

export function getAllStorageTickets(): StorageTicket[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getStorageTicketById(id: string): StorageTicket | undefined {
  return readAll().find((t) => t.id.toLowerCase() === id.trim().toLowerCase());
}

export function findStorageTicketByClaimCode(
  idOrCode: string,
  phone: string
): StorageTicket | undefined {
  const normalizedPhone = phone.replace(/\D/g, "");
  const query = idOrCode.trim().toLowerCase();
  return readAll().find(
    (t) =>
      (t.id.toLowerCase() === query || t.claimCode.toLowerCase() === query) &&
      t.phone.replace(/\D/g, "") === normalizedPhone
  );
}

function nextStorageId(existing: StorageTicket[]): string {
  const numbers = existing
    .map((t) => parseInt(t.id.replace("CR-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 1000) + 1;
  return `CR-${next}`;
}

function randomClaimCode(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function checkInBag(input: NewStorageInput): StorageTicket {
  const all = readAll();
  const now = new Date().toISOString();
  const ticket: StorageTicket = {
    id: nextStorageId(all),
    claimCode: randomClaimCode(),
    customerName: input.customerName,
    phone: input.phone,
    email: input.email,
    bagDescription: input.bagDescription,
    itemCount: input.itemCount,
    dropOffDate: now,
    expectedPickupDate: input.expectedPickupDate,
    status: "Checked In",
    notes: [
      {
        id: `n-${Date.now()}`,
        date: now,
        author: "Clock Room Desk",
        text: "Bag checked in. Keep your claim code safe to collect it.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  writeAll([ticket, ...all]);
  return ticket;
}

export function updateStorageStatus(
  id: string,
  status: StorageStatus,
  note?: string,
  author = "Admin"
): StorageTicket | undefined {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const updated = { ...all[idx], status, updatedAt: now };
  if (note && note.trim()) {
    updated.notes = [...updated.notes, { id: `n-${Date.now()}`, date: now, author, text: note.trim() } as StorageNote];
  }
  const next = [...all];
  next[idx] = updated;
  writeAll(next);
  return updated;
}
