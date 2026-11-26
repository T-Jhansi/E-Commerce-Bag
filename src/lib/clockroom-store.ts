"use client";

import { BookingNote, BookingStatus, ClockRoomBooking, NewBookingInput } from "./types";
import { readJSON, writeJSON, subscribeEvent } from "./persist";

const STORAGE_KEY = "northpole_clockroom_bookings_v1";
const EVENT_NAME = "northpole_clockroom_bookings_change";

const SEED_BOOKINGS: ClockRoomBooking[] = [];

function readAll(): ClockRoomBooking[] {
  return readJSON(STORAGE_KEY, SEED_BOOKINGS);
}

function writeAll(items: ClockRoomBooking[]) {
  writeJSON(STORAGE_KEY, items, EVENT_NAME);
}

export function subscribeBookings(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}

export function getAllBookings(): ClockRoomBooking[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getBookingById(id: string): ClockRoomBooking | undefined {
  return readAll().find((b) => b.id.toLowerCase() === id.trim().toLowerCase());
}

export function findBookingsByPhone(phone: string): ClockRoomBooking[] {
  const normalized = phone.replace(/\D/g, "");
  if (!normalized) return [];
  return readAll().filter((b) => b.phone.replace(/\D/g, "") === normalized);
}

/** Resolve a booking from a scanned QR payload (JSON) or a raw booking id / OTP, for the admin desk. */
export function findBookingByScan(raw: string): ClockRoomBooking | undefined {
  const text = raw.trim();
  if (!text) return undefined;
  try {
    const parsed = JSON.parse(text) as { id?: string; otp?: string };
    if (parsed.id) {
      const byId = getBookingById(parsed.id);
      if (byId && (!parsed.otp || byId.otp === parsed.otp)) return byId;
    }
  } catch {
    // not JSON — fall through to id/OTP lookup
  }
  const all = readAll();
  return (
    all.find((b) => b.id.toLowerCase() === text.toLowerCase()) ??
    all.find((b) => b.otp === text)
  );
}

function nextBookingId(existing: ClockRoomBooking[]): string {
  const numbers = existing
    .map((b) => parseInt(b.id.replace("CRB-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 1000) + 1;
  return `CRB-${next}`;
}

function randomOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Create a booking after payment has already been verified server-side. */
export function createBooking(input: NewBookingInput): ClockRoomBooking {
  const all = readAll();
  const now = new Date().toISOString();
  const booking: ClockRoomBooking = {
    id: nextBookingId(all),
    ...input,
    otp: randomOtp(),
    status: "Reserved",
    notes: [
      {
        id: `n-${Date.now()}`,
        date: now,
        author: "System",
        text: "Payment confirmed. Booking reserved — show your QR code or OTP at the store to check in.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  writeAll([booking, ...all]);
  return booking;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  note?: string,
  author = "Admin"
): ClockRoomBooking | undefined {
  const all = readAll();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const updated: ClockRoomBooking = {
    ...all[idx],
    status,
    checkedInAt: status === "Checked In" ? now : all[idx].checkedInAt,
    claimedAt: status === "Claimed" ? now : all[idx].claimedAt,
    updatedAt: now,
  };
  if (note && note.trim()) {
    updated.notes = [
      ...updated.notes,
      { id: `n-${Date.now()}`, date: now, author, text: note.trim() } as BookingNote,
    ];
  }
  const next = [...all];
  next[idx] = updated;
  writeAll(next);
  return updated;
}
