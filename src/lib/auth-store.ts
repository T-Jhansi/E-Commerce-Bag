"use client";

import { CustomerAccount } from "./types";
import { isBrowser, subscribeEvent } from "./persist";

const STORAGE_KEY = "bagco_account_v1";
const EVENT_NAME = "bagco_account_change";

export function getCurrentAccount(): CustomerAccount | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomerAccount) : null;
  } catch {
    return null;
  }
}

export function signIn(account: CustomerAccount) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function signOut() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function subscribeAccount(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}
