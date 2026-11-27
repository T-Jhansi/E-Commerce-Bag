"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, User, Menu, ChevronDown, Heart } from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MegaMenu } from "@/components/MegaMenu";
import { ServicesMenu } from "@/components/ServicesMenu";
import { MobileNav } from "@/components/MobileNav";
import { useSiteUI } from "@/components/SiteUIProvider";
import { useCart } from "@/hooks/use-cart";
import { useProducts } from "@/hooks/use-products";
import { useWishlist } from "@/hooks/use-wishlist";
import { CATEGORY_LIST, CATEGORY_META } from "@/lib/categories";
import { ProductCategory } from "@/lib/types";

export function SiteHeader() {
  const { setCartOpen, setMobileNavOpen, setSearchOpen } = useSiteUI();
  const { count } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  const activeMeta = activeCategory ? CATEGORY_META[activeCategory] : null;
  const featuredProduct = activeCategory
    ? products.find((p) => p.category === activeCategory && p.featured) ??
      products.find((p) => p.category === activeCategory)
    : undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white shadow-xs">
      <AnnouncementBar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="-ml-2 rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src="/north-pole-logo.png" alt="North Pole" width={44} height={44} className="h-9 w-9 object-contain sm:h-11 sm:w-11" />
            <span className="font-display text-lg font-bold tracking-tight text-slate-950">North Pole</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            {CATEGORY_LIST.map((cat) => {
              const isOpen = activeCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => {
                    setActiveCategory(cat.id);
                    setServicesOpen(false);
                  }}
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className={`flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      isOpen ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${isOpen ? "rotate-180 text-amber-500" : "text-slate-400"}`} />
                  </Link>
                </div>
              );
            })}
            <Link href="/shop" className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 hover:text-amber-800">
              All Products
            </Link>
            <div
              className="relative"
              onMouseEnter={() => {
                setServicesOpen(true);
                setActiveCategory(null);
              }}
            >
              <button
                className={`flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  servicesOpen ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${servicesOpen ? "rotate-180 text-amber-500" : "text-slate-400"}`} />
              </button>
              <ServicesMenu open={servicesOpen} onClose={() => setServicesOpen(false)} />
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
              aria-label="Search products"
            >
              <Search className="h-5 w-5 text-slate-600" />
            </button>
            <Link
              href="/account?tab=wishlist"
              className="relative rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="h-5 w-5 text-slate-600" />
              {wishlistIds.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold tabular-nums text-slate-950 shadow-xs">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
            <Link href="/account" className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950" aria-label="Account" title="My account & orders">
              <User className="h-5 w-5 text-slate-600" />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="ml-1 flex items-center gap-2.5 rounded-lg bg-slate-950 px-3.5 py-2 text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95"
              aria-label={`Shopping cart with ${count} items`}
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5 text-amber-400" />
                {count > 0 && (
                  <span className="absolute -right-2 -top-1.5 min-w-[16px] rounded-full bg-amber-400 px-1.5 py-0.2 text-center text-[10px] font-extrabold tabular-nums text-slate-950">
                    {count}
                  </span>
                )}
              </div>
              <span className="hidden text-xs font-bold uppercase tracking-wide sm:inline">Cart</span>
            </button>
          </div>
        </div>
      </div>

      <MegaMenu category={activeMeta} featuredProduct={featuredProduct} onClose={() => setActiveCategory(null)} />
      <MobileNav />
    </header>
  );
}
