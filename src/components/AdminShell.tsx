"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminSignOut } from "@/components/AdminGate";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/tickets", label: "Maintenance & Service" },
  { href: "/admin/warranty", label: "Warranty" },
  { href: "/admin/clock-room", label: "Clock Room" },
  { href: "/admin/dealers", label: "Dealers" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-[var(--border)] bg-[var(--card)] sm:w-56 sm:border-b-0 sm:border-r">
        <div className="px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-leather">
            North Pole
          </p>
          <p className="font-display text-lg font-semibold">Staff panel</p>
        </div>
        <nav className="flex flex-1 gap-1 overflow-x-auto px-3 pb-3 sm:flex-col sm:overflow-visible">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-leather/10 text-leather"
                    : "text-[var(--muted)] hover:bg-[var(--canvas)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex gap-1 px-3 pb-5">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Storefront
          </Link>
          <button
            type="button"
            onClick={() => adminSignOut()}
            className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:text-rose-600"
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
