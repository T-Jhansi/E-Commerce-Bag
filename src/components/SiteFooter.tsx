import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Lock } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 pb-12 pt-16 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="pr-0 lg:col-span-2 lg:pr-8">
            <Link href="/" className="mb-4 inline-block">
              <Image src="/north-pole-logo.png" alt="North Pole" width={40} height={40} className="h-10 w-auto object-contain" />
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
              Premium backpacks, trolleys, and travel gear built from weatherproof
              materials — backed by registered warranty, a dedicated service
              desk, a nationwide dealer network, and Clock Room safekeeping.
            </p>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>Customer care: +91 800-456-7890 (Mon-Sat 9AM-7PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>Support: care@northpole.example</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>Flagship HQ: Outer Ring Road, Bengaluru 560103</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Shop</h4>
            <ul className="space-y-2.5">
              {CATEGORY_LIST.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/shop?category=${cat.slug}`} className="transition-colors hover:text-amber-400">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Customer care</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/service" className="transition-colors hover:text-amber-400">
                  Maintenance &amp; Service
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="transition-colors hover:text-amber-400">
                  Register warranty
                </Link>
              </li>
              <li>
                <Link href="/clock-room" className="transition-colors hover:text-amber-400">
                  Clock Room
                </Link>
              </li>
              <li>
                <Link href="/dealers" className="transition-colors hover:text-amber-400">
                  Find a dealer
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition-colors hover:text-amber-400">
                  Track an order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Staff</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/admin" className="transition-colors hover:text-amber-400">
                  Staff login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 md:flex-row">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>Demo build — data is stored in this browser only (mock data, no live backend yet)</span>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} North Pole Luggage &amp; Bags. Demo site.</p>
        </div>
      </div>
    </footer>
  );
}
