"use client";

import { createContext, useContext, useState } from "react";

interface SiteUIState {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const SiteUIContext = createContext<SiteUIState | null>(null);

export function SiteUIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <SiteUIContext.Provider
      value={{ cartOpen, setCartOpen, mobileNavOpen, setMobileNavOpen, searchOpen, setSearchOpen }}
    >
      {children}
    </SiteUIContext.Provider>
  );
}

export function useSiteUI() {
  const ctx = useContext(SiteUIContext);
  if (!ctx) throw new Error("useSiteUI must be used within SiteUIProvider");
  return ctx;
}
