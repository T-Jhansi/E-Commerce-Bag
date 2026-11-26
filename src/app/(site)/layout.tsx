import { SiteHeader } from "@/components/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-[var(--muted)]">
        <p>
          North Pole — Premium Luggage, Backpacks &amp; Travel Gear. Demo build —
          data is stored in this browser only (mock data, no live backend yet).{" "}
          <a href="/admin" className="underline hover:text-leather">
            Staff login
          </a>
        </p>
      </footer>
    </>
  );
}
