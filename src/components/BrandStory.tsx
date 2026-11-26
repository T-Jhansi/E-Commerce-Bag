import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const VALUES = [
  { title: "Built for Relentless Journeys", description: "Tested across monsoons, treks, and daily commutes." },
  { title: "Precision Ergonomic Design", description: "Back panels engineered to spread load evenly." },
  { title: "Registered Manufacturer Warranty", description: "Replacement guarantee against defects and zipper failures." },
  { title: "Durability Over Disposability", description: "Built to last years, not seasons." },
];

export function BrandStory() {
  return (
    <section className="border-b border-slate-200 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl">
              <Image src="/products/travel.jpg" alt="North Pole traveler" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950">
                    <Image src="/north-pole-logo.png" alt="North Pole" width={24} height={24} className="h-6 w-6 object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">North Pole Design Studio</h4>
                    <p className="text-[11px] text-slate-500">Bengaluru &amp; New Delhi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Our heritage &amp; promise</span>
            </div>

            <h2 className="mb-6 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance text-slate-950 sm:text-4xl lg:text-5xl">
              EVERY JOURNEY STARTS WITH THE RIGHT COMPANION.
            </h2>

            <p className="mb-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              At <strong className="font-semibold text-slate-900">North Pole</strong>, travel is not an occasional
              luxury — it is how modern people commute, work, and explore.
            </p>

            <p className="mb-8 text-sm leading-relaxed text-slate-500 sm:text-base">
              We obsess over stitch counts, stress-tested zippers, and durable materials, so
              each bag becomes an extension of your daily routine rather than a disposable
              accessory.
            </p>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {VALUES.map((v) => (
                <div key={v.title} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{v.title}</h4>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-slate-800 active:scale-95 sm:text-sm"
            >
              <span>Explore the full catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
