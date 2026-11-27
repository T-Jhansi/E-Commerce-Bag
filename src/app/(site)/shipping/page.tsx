import Link from "next/link";

export const metadata = { title: "Shipping & Returns — North Pole" };

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-slate-500 hover:text-amber-600">
        ← Back home
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">North Pole · Legal</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950">Shipping &amp; Returns</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 1 January 2026</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">Shipping</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Free shipping on all orders above ₹2,500; a flat ₹99 fee applies below that.</li>
            <li>Orders are typically dispatched within 1-2 business days of confirmation.</li>
            <li>Delivery takes 3-7 business days depending on your pin code.</li>
            <li>You&apos;ll see a live status on your{" "}
              <Link href="/orders" className="text-amber-600 underline">
                order tracking page
              </Link>{" "}
              once it ships.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">Returns</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Unused items in original packaging can be returned within 7 days of delivery.</li>
            <li>Contact care@northpole.example with your order number to start a return.</li>
            <li>Approved returns are picked up free of charge; refunds are issued to the original payment method within 5-7 business days of pickup.</li>
            <li>Personalized or final-sale items (marked as such on the product page) are not eligible for return.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-slate-950">Damaged or defective items</h2>
          <p>
            If an item arrives damaged, please contact us within 48 hours of delivery with photos of the damage.
            For a manufacturing defect discovered later, use our{" "}
            <Link href="/warranty" className="text-amber-600 underline">
              warranty claim
            </Link>{" "}
            flow instead.
          </p>
        </section>
      </div>
    </main>
  );
}
