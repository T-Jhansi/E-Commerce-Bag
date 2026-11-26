"use client";

import { useCallback, useEffect, useState } from "react";
import { getWishlist, subscribeWishlist, toggleWishlist } from "@/lib/wishlist-store";
import { useProducts } from "@/hooks/use-products";

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const { products } = useProducts();

  const refresh = useCallback(() => {
    setIds(getWishlist());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeWishlist(refresh);
  }, [refresh]);

  const items = products.filter((p) => ids.includes(p.id));

  return { ids, items, toggle: toggleWishlist };
}
