"use client";

import { readJSON, writeJSON, subscribeEvent } from "./persist";

const STORAGE_KEY = "northpole_wishlist_v1";
const EVENT_NAME = "northpole_wishlist_change";

function readAll(): string[] {
  return readJSON(STORAGE_KEY, [] as string[]);
}

function writeAll(ids: string[]) {
  writeJSON(STORAGE_KEY, ids, EVENT_NAME);
}

export function subscribeWishlist(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}

export function getWishlist(): string[] {
  return readAll();
}

export function isInWishlist(productId: string): boolean {
  return readAll().includes(productId);
}

export function toggleWishlist(productId: string) {
  const all = readAll();
  if (all.includes(productId)) {
    writeAll(all.filter((id) => id !== productId));
  } else {
    writeAll([...all, productId]);
  }
}
