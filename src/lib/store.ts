"use client";

import { ServiceTicket, TicketNote, TicketStatus } from "./types";
import { SEED_TICKETS } from "./mock-data";

const STORAGE_KEY = "bagco_fmb_tickets_v1";
const EVENT_NAME = "bagco_fmb_store_change";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): ServiceTicket[] {
  if (!isBrowser()) return SEED_TICKETS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TICKETS));
      return SEED_TICKETS;
    }
    return JSON.parse(raw) as ServiceTicket[];
  } catch {
    return SEED_TICKETS;
  }
}

function writeAll(tickets: ServiceTicket[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function subscribe(callback: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getAllTickets(): ServiceTicket[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getTicketById(id: string): ServiceTicket | undefined {
  return readAll().find((t) => t.id.toLowerCase() === id.trim().toLowerCase());
}

export function findTicketsByPhone(phone: string): ServiceTicket[] {
  const normalized = phone.replace(/\D/g, "");
  if (!normalized) return [];
  return readAll().filter((t) => t.phone.replace(/\D/g, "") === normalized);
}

function nextTicketId(existing: ServiceTicket[]): string {
  const numbers = existing
    .map((t) => parseInt(t.id.replace("FMB-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 1000) + 1;
  return `FMB-${next}`;
}

export function createTicket(input: {
  customerName: string;
  phone: string;
  email?: string;
  bagType: string;
  bagBrand?: string;
  bagTag: string;
  issue: string;
}): ServiceTicket {
  const all = readAll();
  const now = new Date().toISOString();
  const ticket: ServiceTicket = {
    id: nextTicketId(all),
    customerName: input.customerName,
    phone: input.phone,
    email: input.email,
    bagType: input.bagType,
    bagBrand: input.bagBrand,
    bagTag: input.bagTag,
    issue: input.issue,
    dropOffDate: now.slice(0, 10),
    status: "Received",
    notes: [
      {
        id: `n-${Date.now()}`,
        date: now,
        author: "Front Desk",
        text: "Service request registered. We'll update you as soon as it's assessed.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  writeAll([ticket, ...all]);
  return ticket;
}

export function updateTicketStatus(
  id: string,
  status: TicketStatus,
  note?: string,
  author = "Admin"
): ServiceTicket | undefined {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const ticket = { ...all[idx], status, updatedAt: now };
  if (note && note.trim()) {
    ticket.notes = [
      ...ticket.notes,
      { id: `n-${Date.now()}`, date: now, author, text: note.trim() },
    ];
  }
  const updated = [...all];
  updated[idx] = ticket;
  writeAll(updated);
  return ticket;
}

export function addTicketNote(
  id: string,
  text: string,
  author = "Admin"
): ServiceTicket | undefined {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const note: TicketNote = { id: `n-${Date.now()}`, date: now, author, text };
  const ticket = { ...all[idx], notes: [...all[idx].notes, note], updatedAt: now };
  const updated = [...all];
  updated[idx] = ticket;
  writeAll(updated);
  return ticket;
}

export function updateTicketDetails(
  id: string,
  patch: Partial<Pick<ServiceTicket, "technician" | "estimatedCompletion">>
): ServiceTicket | undefined {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const ticket = { ...all[idx], ...patch, updatedAt: now };
  const updated = [...all];
  updated[idx] = ticket;
  writeAll(updated);
  return ticket;
}

export function resetToSeed() {
  writeAll(SEED_TICKETS);
}
