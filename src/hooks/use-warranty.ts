"use client";

import { useCallback, useEffect, useState } from "react";
import { WarrantyRegistration } from "@/lib/types";
import { getAllWarranties, getWarrantyById, subscribeWarranties } from "@/lib/warranty-store";

export function useWarranties() {
  const [warranties, setWarranties] = useState<WarrantyRegistration[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setWarranties(getAllWarranties());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeWarranties(refresh);
  }, [refresh]);

  return { warranties, ready, refresh };
}

export function useWarranty(id: string | undefined) {
  const [warranty, setWarranty] = useState<WarrantyRegistration | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!id) {
      setWarranty(undefined);
      setReady(true);
      return;
    }
    setWarranty(getWarrantyById(id));
    setReady(true);
  }, [id]);

  useEffect(() => {
    refresh();
    return subscribeWarranties(refresh);
  }, [refresh]);

  return { warranty, ready, refresh };
}
