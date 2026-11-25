"use client";

import { useCallback, useEffect, useState } from "react";
import { CartLine, getCartCount, getCartLines, subscribeCart } from "@/lib/cart-store";

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setLines(getCartLines());
    setCount(getCartCount());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeCart(refresh);
  }, [refresh]);

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  return { lines, count, subtotal, ready, refresh };
}
