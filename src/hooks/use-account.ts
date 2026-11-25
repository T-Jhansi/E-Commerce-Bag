"use client";

import { useCallback, useEffect, useState } from "react";
import { CustomerAccount } from "@/lib/types";
import { getCurrentAccount, subscribeAccount } from "@/lib/auth-store";

export function useAccount() {
  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setAccount(getCurrentAccount());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeAccount(refresh);
  }, [refresh]);

  return { account, ready, refresh };
}
