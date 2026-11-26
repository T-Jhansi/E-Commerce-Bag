"use client";

import { NewProductInput, Product } from "./types";
import { SEED_PRODUCTS } from "./mock-products";
import { readJSON, writeJSON, subscribeEvent } from "./persist";

const STORAGE_KEY = "bagco_products_v2";
const EVENT_NAME = "bagco_products_change";

function readAll(): Product[] {
  return readJSON(STORAGE_KEY, SEED_PRODUCTS);
}

function writeAll(products: Product[]) {
  writeJSON(STORAGE_KEY, products, EVENT_NAME);
}

export function subscribeProducts(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}

export function getAllProducts(): Product[] {
  return readAll().sort((a, b) => a.name.localeCompare(b.name));
}

export function getProductBySlug(slug: string): Product | undefined {
  return readAll().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return readAll().find((p) => p.id === id);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function nextProductId(existing: Product[]): string {
  const numbers = existing
    .map((p) => parseInt(p.id.replace("BAG-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `BAG-${String(next).padStart(3, "0")}`;
}

export function createProduct(input: NewProductInput): Product {
  const all = readAll();
  const now = new Date().toISOString();
  let slug = slugify(input.name);
  if (all.some((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }
  const product: Product = {
    ...input,
    id: nextProductId(all),
    slug,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([product, ...all]);
  return product;
}

export function updateProduct(
  id: string,
  patch: Partial<NewProductInput>
): Product | undefined {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const updated = { ...all[idx], ...patch, updatedAt: now };
  const next = [...all];
  next[idx] = updated;
  writeAll(next);
  return updated;
}

export function deleteProduct(id: string) {
  const all = readAll();
  writeAll(all.filter((p) => p.id !== id));
}

export function adjustStock(id: string, delta: number) {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  const next = [...all];
  next[idx] = {
    ...next[idx],
    stock: Math.max(0, next[idx].stock + delta),
    updatedAt: new Date().toISOString(),
  };
  writeAll(next);
}
