import Link from "next/link";

export const metadata = { title: "Privacy Policy — North Pole" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-slate-500 hover:text-amber-600">
        ← Back home
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">North Pole · Legal</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 1 January 2026</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">1. What we collect</h2>
          <p>
            When you place an order, register a warranty, book a Clock Room slot, or sign in, we collect your
            name, phone number, email address, and shipping address. Payment card details are processed directly
            by our payment partner (Razorpay) and are never stored on our servers.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">2. How we use it</h2>
          <p>
            We use this information to process orders, fulfil warranty and service requests, manage Clock Room
            bookings, send order and delivery updates, and provide customer support. We do not sell your personal
            information to third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">3. Cookies &amp; local storage</h2>
          <p>
            This site uses your browser&apos;s local storage to remember your cart, wishlist, and sign-in state
            on this device. Clearing your browser data will remove this information.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">4. Data sharing</h2>
          <p>
            We share order details with logistics partners solely to deliver your order, and payment details
            with Razorpay solely to process payment. These partners are contractually required to protect your
            data and use it only for the stated purpose.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">5. Your rights</h2>
          <p>
            You may request a copy of the personal data we hold about you, or request its deletion, by writing
            to care@northpole.example. We will respond within 30 days.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">6. Contact</h2>
          <p>Questions about this policy can be sent to care@northpole.example.</p>
        </section>
      </div>
    </main>
  );
}
