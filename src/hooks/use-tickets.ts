"use client";

import { useCallback, useEffect, useState } from "react";
import { ServiceTicket } from "@/lib/types";
import { getAllTickets, getTicketById, subscribe } from "@/lib/store";

export function useTickets() {
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setTickets(getAllTickets());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe(refresh);
  }, [refresh]);

  return { tickets, ready, refresh };
}

export function useTicket(id: string | undefined) {
  const [ticket, setTicket] = useState<ServiceTicket | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!id) {
      setTicket(undefined);
      setReady(true);
      return;
    }
    setTicket(getTicketById(id));
    setReady(true);
  }, [id]);

  useEffect(() => {
    refresh();
    return subscribe(refresh);
  }, [refresh]);

  return { ticket, ready, refresh };
}
