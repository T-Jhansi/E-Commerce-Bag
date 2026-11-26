"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Cpu, Sparkles, Anchor } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { formatINR } from "@/lib/format";

export function PromotionalBanner() {
  const { products } = useProducts();
  const spotlight = products.find((p) => p.category === "Travel" && p.featured) ?? products[0];

  return (
    <section className="relative overflow-hidden border-b border-slate-900 bg-slate-950 py-20 text-white sm:py-28">
      <div className="absolute inset-0 z-0 opacity-25">
        <Image src="/products/travel.jpg" alt="" fill className="object-cover object-center brightness-75 contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Crafted for Extremes &amp; Everyday Life
              </span>
            </div>

            <h2 className="mb-6 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              READY FOR EVERY JOURNEY?
            </h2>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              From monsoon metro commutes to weekend treks, North Pole gear is built with
              ripstop fibers, reinforced hardware, and impact-dissipating shells.
            </p>

            <div className="mb-8 grid grid-cols-2 gap-4">
              <Feature icon={ShieldAlert} title="Ballistic weave" subtitle="Tear-resistant, water-repellent" />
              <Feature icon={Cpu} title="Laptop protection" subtitle="Padded, drop-safe compartments" />
              <Feature icon={Sparkles} title="Air-suspension back" subtitle="Ergonomic ventilation channels" />
              <Feature icon={Anchor} title="Whisper wheels" subtitle="Smooth, silent glide" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/shop?category=travel"
                className="flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg transition-all hover:bg-amber-300 hover:shadow-amber-400/20 sm:text-sm"
              >
                <span>Explore travel gear</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/warranty"
                className="rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/20 sm:text-sm"
              >
                Register warranty
              </Link>
            </div>
          </div>

          {spotlight && (
            <div className="relative lg:col-span-5">
              <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-950">
                  <Image
                    src={spotlight.image}
                    alt={spotlight.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3 rounded bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-950">
                    Featured
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">{spotlight.category}</span>
                    <h4 className="text-lg font-bold text-white">{spotlight.name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black tabular-nums text-white">{formatINR(spotlight.price)}</div>
                    {spotlight.compareAtPrice && (
                      <div className="text-xs tabular-nums text-slate-400 line-through">{formatINR(spotlight.compareAtPrice)}</div>
                    )}
                  </div>
                </div>

                <Link
                  href={`/shop/${spotlight.slug}`}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition-colors hover:bg-amber-400"
                >
                  <span>View full product specs</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
      <div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
