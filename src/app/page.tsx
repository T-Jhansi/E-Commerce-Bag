import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-leather">
        Bag Co.
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-balance sm:text-5xl">
        Find My Bag — our in-house servicing desk
      </h1>
      <p className="mt-4 max-w-xl text-base text-[var(--muted)]">
        Drop a bag in for repair, track where it stands, and keep the back office
        in sync — from first check-in to ready-for-pickup.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Link
          href="/customer"
          className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-leather hover:shadow-sm"
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Customers
            </span>
            <h2 className="mt-2 font-display text-xl font-semibold">
              Drop off or track a bag
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Register a bag for service and get a ticket number, or look up an
              existing one to see its current status.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-leather">
            Open customer portal
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </Link>

        <Link
          href="/admin"
          className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-leather hover:shadow-sm"
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Staff
            </span>
            <h2 className="mt-2 font-display text-xl font-semibold">
              Admin panel
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              See every open ticket, assign a technician, update status, and
              leave notes the customer can see when they track their bag.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-leather">
            Open admin panel
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </Link>
      </div>

      <p className="mt-10 text-xs text-[var(--muted)]">
        Demo build — data is stored in this browser only (mock data, no live
        backend yet).
      </p>
    </main>
  );
}
