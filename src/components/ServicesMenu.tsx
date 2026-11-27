"use client";

import Link from "next/link";
import { ShieldCheck, Wrench, PackageCheck, MapPin, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    href: "/service",
    icon: Wrench,
    label: "Maintenance & Service",
    desc: "Book a repair, track a ticket",
  },
  {
    href: "/clock-room",
    icon: PackageCheck,
    label: "Clock Room",
    desc: "Reserve bag storage at a store",
  },
  {
    href: "/warranty",
    icon: ShieldCheck,
    label: "Register Warranty",
    desc: "Protect your purchase, file a claim",
  },
  {
    href: "/dealers",
    icon: MapPin,
    label: "Find a Dealer",
    desc: "Authorized stores near you",
  },
];

export function ServicesMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className="absolute left-0 top-full z-50 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
      onMouseLeave={onClose}
    >
      {SERVICES.map((s) => {
        const Icon = s.icon;
        return (
          <Link
            key={s.href}
            href={s.href}
            onClick={onClose}
            className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between text-sm font-bold text-slate-900">
                {s.label}
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-amber-500" />
              </p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
