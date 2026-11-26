import { ShieldCheck, Truck, RotateCcw, Clock, Award, Headphones } from "lucide-react";

const PROPS = [
  { icon: Truck, title: "Free Express Shipping", description: "On all orders above ₹2,500 nationwide." },
  { icon: ShieldCheck, title: "Registered Warranty", description: "Zero hassle repair or replacement claims." },
  { icon: RotateCcw, title: "Maintenance & Service", description: "A dedicated desk for repairs and tune-ups." },
  { icon: Award, title: "Guaranteed Authentic", description: "Direct from North Pole manufacturing." },
  { icon: Clock, title: "Clock Room Safekeeping", description: "Check a bag in while you shop or travel." },
  { icon: Headphones, title: "Dedicated Support", description: "Real specialists, six days a week." },
];

export function ValueProps() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-amber-600">North Pole Assurance</span>
          <h2 className="font-display text-2xl font-extrabold text-slate-950 sm:text-3xl">Why choose North Pole?</h2>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Every stitch, zip, and buckle is backed by a real service promise.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
          {PROPS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="flex flex-col items-center rounded-xl border border-slate-200/80 bg-white p-5 text-center shadow-xs transition-all hover:border-amber-400 hover:shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-xs font-bold leading-snug text-slate-900">{p.title}</h3>
                <p className="text-[11px] leading-normal text-slate-500">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
