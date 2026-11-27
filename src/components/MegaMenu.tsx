"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CategoryMeta } from "@/lib/categories";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";

export function MegaMenu({
  category,
  featuredProduct,
  onClose,
}: {
  category: CategoryMeta | null;
  featuredProduct: Product | undefined;
  onClose: () => void;
}) {
  if (!category) return null;

  return (
    <div
      className="absolute left-0 top-full z-50 w-full border-b border-slate-200 bg-white shadow-xl"
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-12 items-start gap-8">
          <div className="col-span-3 border-r border-slate-100 pr-6">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-amber-500">
              Category Spotlight
            </span>
            <h3 className="mb-2 text-xl font-bold text-slate-900">{category.name}</h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">{category.description}</p>
            <Link
              href={`/shop?category=${category.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              View full collection
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="col-span-4 border-r border-slate-100 pr-6">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Explore by style
            </h4>
            <ul className="space-y-3">
              {category.subcategories.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/shop?category=${category.slug}&subcategory=${sub.slug}`}
                    onClick={onClose}
                    className="group flex w-full items-center justify-between py-1 text-left text-sm font-medium text-slate-700 transition-all hover:translate-x-1 hover:text-amber-600"
                  >
                    <span>{sub.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-amber-500" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>All items covered by North Pole warranty</span>
              </span>
            </div>
          </div>

          {featuredProduct && (
            <div className="col-span-5 flex items-center gap-5 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="relative h-44 w-40 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <Image src={featuredProduct.image} alt={featuredProduct.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <span className="mb-1 inline-block rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Featured
                </span>
                <h5 className="mb-1 text-sm font-bold leading-snug text-slate-900">{featuredProduct.name}</h5>
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-base font-extrabold tabular-nums text-slate-900">
                    {formatINR(featuredProduct.price)}
                  </span>
                  {featuredProduct.compareAtPrice && (
                    <span className="text-xs tabular-nums text-slate-400 line-through">
                      {formatINR(featuredProduct.compareAtPrice)}
                    </span>
                  )}
                </div>
                <Link
                  href={`/shop/${featuredProduct.slug}`}
                  onClick={onClose}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600"
                >
                  Inspect specifications
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
