"use client";

import { useCallback, useEffect, useState } from "react";
import { StorageTicket } from "@/lib/types";
import {
  getAllStorageTickets,
  getStorageTicketById,
  subscribeStorageTickets,
} from "@/lib/storage-store";

export function useStorageTickets() {
  const [tickets, setTickets] = useState<StorageTicket[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setTickets(getAllStorageTickets());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeStorageTickets(refresh);
  }, [refresh]);

  return { tickets, ready, refresh };
}

export function useStorageTicket(id: string | undefined) {
  const [ticket, setTicket] = useState<StorageTicket | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!id) {
      setTicket(undefined);
      setReady(true);
      return;
    }
    setTicket(getStorageTicketById(id));
    setReady(true);
  }, [id]);

  useEffect(() => {
    refresh();
    return subscribeStorageTickets(refresh);
  }, [refresh]);

  return { ticket, ready, refresh };
}
