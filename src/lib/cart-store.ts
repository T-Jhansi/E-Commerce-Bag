"use client";

import { CartItem } from "./types";
import { readJSON, writeJSON, subscribeEvent } from "./persist";
import { getProductById } from "./product-store";

const STORAGE_KEY = "bagco_cart_v1";
const EVENT_NAME = "bagco_cart_change";

function readCart(): CartItem[] {
  return readJSON(STORAGE_KEY, [] as CartItem[]);
}

function writeCart(items: CartItem[]) {
  writeJSON(STORAGE_KEY, items, EVENT_NAME);
}

export function subscribeCart(callback: () => void) {
  return subscribeEvent(EVENT_NAME, callback);
}

export function getCartItems(): CartItem[] {
  return readCart();
}

export function getCartCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(productId: string, quantity = 1) {
  const items = readCart();
  const idx = items.findIndex((i) => i.productId === productId);
  const product = getProductById(productId);
  const maxQty = product?.stock ?? 99;
  if (idx === -1) {
    items.push({ productId, quantity: Math.min(quantity, maxQty) });
  } else {
    items[idx] = {
      ...items[idx],
      quantity: Math.min(items[idx].quantity + quantity, maxQty),
    };
  }
  writeCart(items);
}

export function setCartQuantity(productId: string, quantity: number) {
  const items = readCart();
  const product = getProductById(productId);
  const maxQty = product?.stock ?? 99;
  if (quantity <= 0) {
    writeCart(items.filter((i) => i.productId !== productId));
    return;
  }
  const idx = items.findIndex((i) => i.productId === productId);
  if (idx === -1) return;
  const next = [...items];
  next[idx] = { ...next[idx], quantity: Math.min(quantity, maxQty) };
  writeCart(next);
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((i) => i.productId !== productId));
}

export function clearCart() {
  writeCart([]);
}

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  stock: number;
}

export function getCartLines(): CartLine[] {
  return readCart()
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
        stock: product.stock,
      };
    })
    .filter((line): line is CartLine => line !== null);
}
