import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/categories";

export function CategoryShowcase() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>North Pole Catalog</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-950 sm:text-4xl">Shop by category</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
              Weatherproof textiles, reinforced hardware, and precision ergonomics for every journey.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 self-start text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-amber-600 md:self-auto"
          >
            <span>View all collections</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {CATEGORY_LIST.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-slate-200/50 bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover object-center brightness-90 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

              <div className="relative z-10">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">{cat.highlight}</span>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-amber-300 sm:text-2xl">{cat.name}</h3>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-amber-400 group-hover:text-slate-950">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
