import Link from "next/link";

export const metadata = { title: "Terms & Conditions — North Pole" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-slate-500 hover:text-amber-600">
        ← Back home
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">North Pole · Legal</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 1 January 2026</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">1. Acceptance of terms</h2>
          <p>
            By accessing or placing an order through northpole.example (&ldquo;North Pole,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us&rdquo;), you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do
            not use this site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">2. Products &amp; pricing</h2>
          <p>
            All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated
            otherwise. We reserve the right to correct pricing errors and to modify or discontinue any product
            without prior notice.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">3. Orders &amp; payment</h2>
          <p>
            An order is confirmed once payment is successfully authorized (for prepaid orders) or once placed
            (for Cash on Delivery, where available). We may cancel an order at our discretion in cases of
            suspected fraud, stock unavailability, or pricing errors, with a full refund issued for any amount
            already collected.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">4. Warranty</h2>
          <p>
            Products carry a manufacturer warranty of 1, 3, or 5 years as specified at the time of registration,
            covering manufacturing defects in materials and workmanship. The warranty does not cover damage from
            misuse, accidents, unauthorized repairs, or normal wear and tear. See our{" "}
            <Link href="/warranty" className="text-amber-600 underline">
              warranty registration
            </Link>{" "}
            page for full claim procedures.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">5. Clock Room service</h2>
          <p>
            Clock Room bookings are a paid, time-bound bag storage service offered at participating stores.
            North Pole is not liable for cash, electronics, or valuables left inside stored bags. Items
            uncollected 30 days past the booked duration may be treated as abandoned per store policy.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">6. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, North Pole&apos;s liability for any claim arising from your
            use of this site or our products is limited to the amount you paid for the relevant order.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">7. Governing law</h2>
          <p>These terms are governed by the laws of India, with courts in Bengaluru, Karnataka having jurisdiction.</p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">8. Contact</h2>
          <p>Questions about these terms can be sent to care@northpole.example.</p>
        </section>
      </div>
    </main>
  );
}
