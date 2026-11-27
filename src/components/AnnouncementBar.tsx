"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck, Truck, Sparkles, ChevronRight } from "lucide-react";

const MESSAGES = [
  { text: "PACK SMART. TRAVEL FURTHER — Explore the North Pole collection", icon: Sparkles, href: "/shop", action: "Shop now" },
  { text: "Free shipping on orders above ₹2,500", icon: Truck, href: "/shop", action: "Details" },
  { text: "Register your purchase for manufacturer warranty", icon: ShieldCheck, href: "/warranty", action: "Register" },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const current = MESSAGES[index];
  const Icon = current.icon;

  return (
    <div className="border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="hidden items-center gap-4 text-[11px] text-slate-400 md:flex">
          <span>Official Brand Store</span>
          <span>·</span>
          <span>Guaranteed Authentic</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden text-center">
          <Icon className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span className="max-w-[260px] truncate font-medium tracking-wide text-white sm:max-w-md md:max-w-none">
            {current.text}
          </span>
          <Link
            href={current.href}
            className="ml-1 inline-flex shrink-0 items-center text-[11px] font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300"
          >
            {current.action}
            <ChevronRight className="ml-0.5 h-3 w-3" />
          </Link>
        </div>
        <div className="hidden items-center gap-3 text-[11px] text-slate-300 xl:flex">
          <Link href="/orders" className="hover:text-amber-400">
            Track order
          </Link>
          <span>·</span>
          <Link href="/warranty" className="hover:text-amber-400">
            Warranty
          </Link>
          <span>·</span>
          <Link href="/clock-room" className="hover:text-amber-400">
            Clock Room
          </Link>
          <span>·</span>
          <Link href="/dealers" className="hover:text-amber-400">
            Dealers
          </Link>
        </div>
      </div>
    </div>
  );
}
