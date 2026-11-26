"use client";

import { Dealer, NewDealerInput } from "./types";
import { readJSON, writeJSON, subscribeEvent } from "./persist";

const STORAGE_KEY = "northpole_dealers_v1";
const EVENT_NAME = "northpole_dealers_change";

const now = new Date().toISOString();

const SEED_DEALERS: Dealer[] = [
  {
    id: "DLR-001",
    name: "North Pole Flagship Store",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Shop 12, Linking Road, Bandra West, Mumbai 400050",
    phone: "+91 22 4000 1111",
    mapUrl: "https://maps.google.com/?q=Linking+Road+Bandra+West+Mumbai",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "DLR-002",
    name: "North Pole Select — Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    address: "100 Feet Road, Indiranagar, Bengaluru 560038",
    phone: "+91 80 4000 2222",
    mapUrl: "https://maps.google.com/?q=100+Feet+Road+Indiranagar+Bengaluru",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "DLR-003",
    name: "North Pole Travel Co.",
    city: "Delhi",
    state: "Delhi",
    address: "Khan Market, New Delhi 110003",
    phone: "+91 11 4000 3333",
    mapUrl: "https://maps.google.com/?q=Khan+Market+New+Delhi",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "DLR-004",
    name: "North Pole Authorized Dealer",
    city: "Pune",
    state: "Maharashtra",
    address: "FC Road, Shivajinagar, Pune 411005",
    phone: "+91 20 4000 4444",
    mapUrl: "https://maps.google.com/?q=FC+Road+Shivajinagar+Pune",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "DLR-005",
    name: "North Pole Select — Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    address: "Road No. 36, Jubilee Hills, Hyderabad 500033",
    phone: "+91 40 4000 5555",
    mapUrl: "https://maps.google.com/?q=Jubilee+Hills+Hyderabad",
    createdAt: now,
    updatedAt: now,
  },
];

function readAll(): Dealer[] {
  return readJSON(STORAGE_KEY, SEED_DEALERS);
}

function writeAll(items: Dealer[]) {
  writeJSON(STORAGE_KEY, items, EVENT_NAME);
}

export function subscribeDealers(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}

export function getAllDealers(): Dealer[] {
  return readAll().sort((a, b) => a.city.localeCompare(b.city));
}

export function getDealerById(id: string): Dealer | undefined {
  return readAll().find((d) => d.id === id);
}

function nextDealerId(existing: Dealer[]): string {
  const numbers = existing
    .map((d) => parseInt(d.id.replace("DLR-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `DLR-${String(next).padStart(3, "0")}`;
}

export function createDealer(input: NewDealerInput): Dealer {
  const all = readAll();
  const ts = new Date().toISOString();
  const dealer: Dealer = { ...input, id: nextDealerId(all), createdAt: ts, updatedAt: ts };
  writeAll([dealer, ...all]);
  return dealer;
}

export function updateDealer(id: string, patch: Partial<NewDealerInput>): Dealer | undefined {
  const all = readAll();
  const idx = all.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  const next = [...all];
  next[idx] = updated;
  writeAll(next);
  return updated;
}

export function deleteDealer(id: string) {
  writeAll(readAll().filter((d) => d.id !== id));
}
