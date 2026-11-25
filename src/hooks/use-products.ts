"use client";

import { useCallback, useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { getAllProducts, getProductBySlug, subscribeProducts } from "@/lib/product-store";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setProducts(getAllProducts());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeProducts(refresh);
  }, [refresh]);

  return { products, ready, refresh };
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!slug) {
      setProduct(undefined);
      setReady(true);
      return;
    }
    setProduct(getProductBySlug(slug));
    setReady(true);
  }, [slug]);

  useEffect(() => {
    refresh();
    return subscribeProducts(refresh);
  }, [refresh]);

  return { product, ready, refresh };
}
