"use client";

import { useCallback, useEffect, useState } from "react";
import { Dealer } from "@/lib/types";
import { getAllDealers, subscribeDealers } from "@/lib/dealer-store";

export function useDealers() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setDealers(getAllDealers());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeDealers(refresh);
  }, [refresh]);

  return { dealers, ready, refresh };
}
