"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Droplets, Compass, Wind } from "lucide-react";

interface Slide {
  id: string;
  tagline: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryHref: string;
  secondaryCtaText: string;
  secondaryHref: string;
  image: string;
  badge: string;
}

const SLIDES: Slide[] = [
  {
    id: "slide-1",
    tagline: "Engineered for Everyday Journeys",
    headline: "PACK SMART. TRAVEL FURTHER.",
    subheadline:
      "High-density weatherproof backpacks, hard-shell trolleys, and laptop bags crafted for relentless daily travel.",
    primaryCtaText: "Shop collection",
    primaryHref: "/shop",
    secondaryCtaText: "Explore backpacks",
    secondaryHref: "/shop?category=backpacks",
    image: "/products/backpacks.jpg",
    badge: "2026 Travel Edition",
  },
  {
    id: "slide-2",
    tagline: "Airport Glide & Impact Protection",
    headline: "GO THE DISTANCE.",
    subheadline:
      "Lightweight duffels and trolleys built for weekend trips, treks, and international gates.",
    primaryCtaText: "Explore travel gear",
    primaryHref: "/shop?category=travel",
    secondaryCtaText: "Register warranty",
    secondaryHref: "/warranty",
    image: "/products/travel.jpg",
    badge: "Manufacturer warranty included",
  },
  {
    id: "slide-3",
    tagline: "Urban Commute & Boardroom Grade",
    headline: "WORK ON THE MOVE.",
    subheadline:
      "Drop-safe laptop compartments and weatherproof builds for tech professionals.",
    primaryCtaText: "Shop laptop bags",
    primaryHref: "/shop?category=laptop-bags",
    secondaryCtaText: "Find a dealer",
    secondaryHref: "/dealers",
    image: "/products/laptop-bags.jpg",
    badge: "Bestseller for commuters",
  },
];

export function HeroBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.image}
          alt={slide.headline}
          fill
          priority
          className="scale-105 object-cover object-center brightness-[0.45] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent lg:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-20 sm:min-h-[580px] sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">{slide.tagline}</span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-medium text-slate-300">{slide.badge}</span>
          </div>

          <h1 className="mb-5 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            {slide.headline}
          </h1>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{slide.subheadline}</p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={slide.primaryHref}
              className="flex items-center gap-2 rounded-lg bg-amber-400 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg transition-all hover:bg-amber-300 hover:shadow-amber-400/20"
            >
              <span>{slide.primaryCtaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={slide.secondaryHref}
              className="rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-xs transition-all hover:bg-white/20"
            >
              {slide.secondaryCtaText}
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-3">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActive(idx)}
              className={`h-1.5 rounded-full transition-all ${active === idx ? "w-10 bg-amber-400" : "w-3 bg-white/30 hover:bg-white/60"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 text-slate-300 sm:gap-6 md:grid-cols-4">
            <TrustItem icon={ShieldCheck} title="Registered Warranty" subtitle="Claim and track it online" />
            <TrustItem icon={Droplets} title="Weatherproof Builds" subtitle="PU-coated ballistic fabrics" />
            <TrustItem icon={Wind} title="Ergonomic Carry" subtitle="Air-mesh back panels" />
            <TrustItem icon={Compass} title="Nationwide Dealers" subtitle="Try before you buy" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 shrink-0 text-amber-400" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-white">{title}</p>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
