"use client";

import { Order, OrderLine, OrderStatus } from "./types";
import { readJSON, writeJSON, subscribeEvent } from "./persist";
import { adjustStock } from "./product-store";

const STORAGE_KEY = "bagco_orders_v1";
const EVENT_NAME = "bagco_orders_change";

function readAll(): Order[] {
  return readJSON(STORAGE_KEY, [] as Order[]);
}

function writeAll(orders: Order[]) {
  writeJSON(STORAGE_KEY, orders, EVENT_NAME);
}

export function subscribeOrders(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}

export function getAllOrders(): Order[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id: string): Order | undefined {
  return readAll().find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
}

export function findOrdersByPhone(phone: string): Order[] {
  const normalized = phone.replace(/\D/g, "");
  if (!normalized) return [];
  return readAll().filter((o) => o.phone.replace(/\D/g, "") === normalized);
}

function nextOrderId(existing: Order[]): string {
  const numbers = existing
    .map((o) => parseInt(o.id.replace("ORD-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 2000) + 1;
  return `ORD-${next}`;
}

export interface PlaceOrderInput {
  lines: OrderLine[];
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: Order["paymentMethod"];
}

export const FLAT_SHIPPING = 99;
export const FREE_SHIPPING_THRESHOLD = 2500;

export function placeOrder(input: PlaceOrderInput): Order {
  const all = readAll();
  const now = new Date().toISOString();
  const subtotal = input.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const order: Order = {
    id: nextOrderId(all),
    lines: input.lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    customerName: input.customerName,
    phone: input.phone,
    email: input.email,
    address: input.address,
    city: input.city,
    pincode: input.pincode,
    paymentMethod: input.paymentMethod,
    status: "Pending",
    notes: [
      {
        id: `n-${Date.now()}`,
        date: now,
        author: "System",
        text: "Order placed. We'll confirm it shortly.",
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  writeAll([order, ...all]);
  input.lines.forEach((l) => adjustStock(l.productId, -l.quantity));
  return order;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
  author = "Admin"
): Order | undefined {
  const all = readAll();
  const idx = all.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const order = { ...all[idx], status, updatedAt: now };
  if (note && note.trim()) {
    order.notes = [
      ...order.notes,
      { id: `n-${Date.now()}`, date: now, author, text: note.trim() },
    ];
  }
  const next = [...all];
  next[idx] = order;
  writeAll(next);
  return order;
}
