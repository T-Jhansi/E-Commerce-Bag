"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useSiteUI } from "@/components/SiteUIProvider";
import { useProducts } from "@/hooks/use-products";
import { ProductImage } from "@/components/ProductImage";
import { formatINR } from "@/lib/format";

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useSiteUI();
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 6);
  }, [products, query]);

  if (!searchOpen) return null;

  function close() {
    setSearchOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={close} />

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl mx-4">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search backpacks, trolleys, totes..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
          />
          <button onClick={close} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900" aria-label="Close search">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.trim() === "" ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">Start typing to search the catalogue.</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">No products match &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/shop/${p.slug}`}
                    onClick={close}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      <ProductImage product={p} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.category}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-slate-900">{formatINR(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {query.trim() !== "" && (
          <div className="border-t border-slate-100 px-4 py-3">
            <Link
              href={`/shop?search=${encodeURIComponent(query.trim())}`}
              onClick={close}
              className="text-xs font-bold uppercase tracking-wide text-amber-600 hover:text-amber-700"
            >
              View all results for &ldquo;{query.trim()}&rdquo; →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
