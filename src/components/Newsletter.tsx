"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }
    setError("");
    setSubscribed(true);
  }

  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 text-white sm:py-20">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Exclusive community privileges</span>
        </div>

        <h2 className="mb-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">STAY IN THE LOOP.</h2>

        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Be the first to hear about new arrivals and seasonal offers. Subscribe for{" "}
          <strong className="text-amber-400">10% off</strong> your first order.
        </p>

        {subscribed ? (
          <div className="mx-auto max-w-md rounded-2xl border border-amber-400/30 bg-slate-800/90 p-6 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-amber-400" />
            <h4 className="mb-1 text-lg font-bold text-white">You&apos;re on the list!</h4>
            <p className="mb-3 text-xs text-slate-300">We&apos;ve saved your welcome voucher code:</p>
            <div className="inline-block rounded-lg border border-amber-400/40 bg-slate-950 px-4 py-2 font-mono text-sm font-bold tracking-widest text-amber-400">
              NORTHPOLE10
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email address..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-400 transition-colors focus:border-amber-400 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition-all hover:bg-amber-300 active:scale-95"
              >
                <span>Subscribe</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {error && <p className="mt-2 text-left text-xs text-rose-400">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
