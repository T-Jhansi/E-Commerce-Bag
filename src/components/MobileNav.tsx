"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X, ChevronRight, ChevronDown, ShoppingBag, User, ShieldCheck, Truck, Sparkles, Search } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/categories";
import { useSiteUI } from "@/components/SiteUIProvider";
import { useCart } from "@/hooks/use-cart";

export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen, setCartOpen, setSearchOpen } = useSiteUI();
  const { count } = useCart();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!mobileNavOpen) return null;

  function close() {
    setMobileNavOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={close} />
      <div className="relative z-10 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
          <Link href="/" onClick={close} className="flex items-center gap-2">
            <Image src="/north-pole-logo.png" alt="North Pole" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="font-display text-sm font-bold">North Pole</span>
          </Link>
          <button onClick={close} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900" aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
          <button
            onClick={() => {
              close();
              setSearchOpen(true);
            }}
            className="mb-3 flex w-full items-center justify-between rounded-lg bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 hover:bg-slate-200"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              Search products...
            </span>
          </button>

          <Link
            href="/shop"
            onClick={close}
            className="mb-2 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-700"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              View all products
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>

          {CATEGORY_LIST.map((cat) => {
            const isExpanded = expanded === cat.id;
            return (
              <div key={cat.id} className="border-b border-slate-100 last:border-none">
                <div className="flex items-center justify-between py-2.5">
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    onClick={close}
                    className="flex-1 text-left text-sm font-semibold text-slate-800 hover:text-amber-600"
                  >
                    {cat.name}
                  </Link>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : cat.id)}
                    className="rounded p-1 text-slate-400 hover:text-slate-700"
                    aria-label={`Toggle ${cat.name}`}
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-amber-500" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>
                {isExpanded && (
                  <div className="space-y-1.5 pb-3 pl-4 pr-2">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/shop?category=${cat.slug}`}
                        onClick={close}
                        className="flex items-center justify-between py-1.5 text-xs text-slate-600 hover:text-amber-600"
                      >
                        <span>{sub}</span>
                        <ChevronRight className="h-3 w-3 text-slate-300" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <Link href="/service" onClick={close} className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Truck className="h-4 w-4 text-slate-400" />
              Maintenance &amp; Service
            </Link>
            <Link href="/warranty" onClick={close} className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              Warranty registration
            </Link>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-200 bg-slate-50 p-4">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/account"
              onClick={close}
              className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 hover:border-amber-400"
            >
              <User className="mb-1 h-4 w-4 text-slate-600" />
              <span className="text-[11px] font-medium">Account</span>
            </Link>
            <button
              onClick={() => {
                close();
                setCartOpen(true);
              }}
              className="flex flex-col items-center justify-center rounded-lg bg-slate-900 p-2.5 text-white hover:bg-slate-800"
            >
              <ShoppingBag className="mb-1 h-4 w-4 text-amber-400" />
              <span className="text-[11px] font-bold">Bag ({count})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
