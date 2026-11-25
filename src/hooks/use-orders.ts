"use client";

import { useCallback, useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { getAllOrders, getOrderById, subscribeOrders } from "@/lib/order-store";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setOrders(getAllOrders());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeOrders(refresh);
  }, [refresh]);

  return { orders, ready, refresh };
}

export function useOrder(id: string | undefined) {
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!id) {
      setOrder(undefined);
      setReady(true);
      return;
    }
    setOrder(getOrderById(id));
    setReady(true);
  }, [id]);

  useEffect(() => {
    refresh();
    return subscribeOrders(refresh);
  }, [refresh]);

  return { order, ready, refresh };
}
