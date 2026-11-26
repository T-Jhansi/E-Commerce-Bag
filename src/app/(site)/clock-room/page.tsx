"use client";

import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Navigation, ShieldCheck, Loader2 } from "lucide-react";
import { useDealers } from "@/hooks/use-dealers";
import { distanceKm } from "@/lib/dealer-store";
import { createBooking } from "@/lib/clockroom-store";
import { Dealer, ClockRoomBooking } from "@/lib/types";
import { formatINR, formatDateTime } from "@/lib/format";
import { payWithRazorpay, verifyRazorpayPayment } from "@/lib/use-razorpay";

const RATE_PER_ITEM_PER_DAY = 49;

type Step = "location" | "details" | "confirmation";

function ClockRoomPageInner() {
  const { dealers, ready } = useDealers();
  const searchParams = useSearchParams();
  const clockRoomDealers = useMemo(() => dealers.filter((d) => d.hasClockRoom), [dealers]);

  const [step, setStep] = useState<Step>("location");
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ClockRoomBooking | null>(null);

  useEffect(() => {
    const dealerId = searchParams.get("dealer");
    if (dealerId && clockRoomDealers.length > 0) {
      const match = clockRoomDealers.find((d) => d.id === dealerId);
      if (match) {
        setSelectedDealer(match);
        setStep("details");
      }
    }
  }, [searchParams, clockRoomDealers]);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <header className="mb-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-amber-600">
          ← Back home
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">North Pole · Clock Room</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950">Bag storage, on demand</h1>
        <p className="mt-2 text-sm text-slate-500">
          Find a nearby North Pole store, reserve space, and pay online — then check your bag in or
          out with a QR code or OTP at the counter.
        </p>
      </header>

      {step === "location" && (
        <LocationStep
          dealers={clockRoomDealers}
          ready={ready}
          onSelect={(d) => {
            setSelectedDealer(d);
            setStep("details");
          }}
        />
      )}

      {step === "details" && selectedDealer && (
        <DetailsStep
          dealer={selectedDealer}
          onBack={() => setStep("location")}
          onPaid={(booking) => {
            setConfirmedBooking(booking);
            setStep("confirmation");
          }}
        />
      )}

      {step === "confirmation" && confirmedBooking && <ConfirmationStep booking={confirmedBooking} />}
    </main>
  );
}

export default function ClockRoomPage() {
  return (
    <Suspense fallback={null}>
      <ClockRoomPageInner />
    </Suspense>
  );
}

function LocationStep({
  dealers,
  ready,
  onSelect,
}: {
  dealers: Dealer[];
  ready: boolean;
  onSelect: (dealer: Dealer) => void;
}) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location — search by city instead.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("Couldn't access your location — search by city instead.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  const sorted = useMemo(() => {
    const filtered = citySearch.trim()
      ? dealers.filter((d) => d.city.toLowerCase().includes(citySearch.trim().toLowerCase()))
      : dealers;
    if (!userLocation) return filtered;
    return [...filtered].sort(
      (a, b) =>
        distanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        distanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng)
    );
  }, [dealers, citySearch, userLocation]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4 text-amber-400" />}
          {locating ? "Finding you..." : "Use my location"}
        </button>
        <input
          className="input flex-1"
          placeholder="Or search by city"
          value={citySearch}
          onChange={(e) => setCitySearch(e.target.value)}
        />
      </div>
      {locationError && <p className="text-xs text-rose-600">{locationError}</p>}

      {ready && sorted.length === 0 && <p className="text-sm text-slate-500">No Clock Room locations match.</p>}

      <div className="space-y-3">
        {sorted.map((dealer) => {
          const distance = userLocation
            ? distanceKm(userLocation.lat, userLocation.lng, dealer.lat, dealer.lng)
            : null;
          return (
            <button
              key={dealer.id}
              onClick={() => onSelect(dealer)}
              className="flex w-full items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-amber-400 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <h3 className="font-display text-base font-bold text-slate-900">{dealer.name}</h3>
                </div>
                <p className="mt-1 text-sm text-slate-500">{dealer.address}</p>
              </div>
              <div className="shrink-0 text-right">
                {distance !== null && (
                  <p className="text-sm font-bold tabular-nums text-amber-600">{distance.toFixed(1)} km</p>
                )}
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Select →</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailsStep({
  dealer,
  onBack,
  onPaid,
}: {
  dealer: Dealer;
  onBack: () => void;
  onPaid: (booking: ClockRoomBooking) => void;
}) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    bagDescription: "",
    itemCount: "1",
    durationDays: "1",
    dropOffDate: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const itemCount = Math.max(1, Number(form.itemCount) || 1);
  const durationDays = Math.max(1, Number(form.durationDays) || 1);
  const amount = RATE_PER_ITEM_PER_DAY * itemCount * durationDays;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.customerName.trim() || !form.phone.trim() || !form.bagDescription.trim()) {
      setError("Please fill in your name, phone number, and a description of the bag.");
      return;
    }

    setPaying(true);
    try {
      const payment = await payWithRazorpay({
        amount,
        description: `Clock Room — ${dealer.name} (${durationDays} day${durationDays > 1 ? "s" : ""})`,
        prefill: { name: form.customerName.trim(), email: form.email.trim() || undefined, contact: form.phone.trim() },
      });
      const verified = await verifyRazorpayPayment(payment);
      if (!verified) {
        setError("We couldn't verify that payment. Please try again or contact support.");
        setPaying(false);
        return;
      }
      const booking = createBooking({
        dealerId: dealer.id,
        dealerName: dealer.name,
        dealerAddress: dealer.address,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        bagDescription: form.bagDescription.trim(),
        itemCount,
        durationDays,
        dropOffDate: form.dropOffDate,
        amount,
        razorpayOrderId: payment.razorpay_order_id,
        razorpayPaymentId: payment.razorpay_payment_id,
      });
      onPaid(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Selected location</p>
          <p className="font-display text-base font-bold text-slate-900">{dealer.name}</p>
          <p className="text-xs text-slate-500">{dealer.address}</p>
        </div>
        <button type="button" onClick={onBack} className="text-xs font-medium text-amber-600 hover:underline">
          Change
        </button>
      </div>

      <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <input className="input" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} placeholder="Ananya Rao" />
        </Field>
        <Field label="Phone number" required>
          <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="98450 12345" />
        </Field>
      </div>

      <Field label="Email (optional)">
        <input type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
      </Field>

      <Field label="Bag description" required>
        <input
          className="input"
          value={form.bagDescription}
          onChange={(e) => update("bagDescription", e.target.value)}
          placeholder="e.g. Black Voyager backpack with a red luggage tag"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Number of items">
          <input type="number" min="1" className="input" value={form.itemCount} onChange={(e) => update("itemCount", e.target.value)} />
        </Field>
        <Field label="Duration (days)">
          <input type="number" min="1" className="input" value={form.durationDays} onChange={(e) => update("durationDays", e.target.value)} />
        </Field>
        <Field label="Drop-off date">
          <input type="date" className="input" value={form.dropOffDate} onChange={(e) => update("dropOffDate", e.target.value)} />
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm">
        <span className="text-slate-500">
          {formatINR(RATE_PER_ITEM_PER_DAY)} × {itemCount} item{itemCount > 1 ? "s" : ""} × {durationDays} day
          {durationDays > 1 ? "s" : ""}
        </span>
        <span className="text-lg font-extrabold tabular-nums text-slate-950">{formatINR(amount)}</span>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={paying}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 py-3 text-sm font-bold uppercase tracking-wide text-slate-950 transition hover:bg-amber-300 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {paying && <Loader2 className="h-4 w-4 animate-spin" />}
        {paying ? "Processing..." : `Reserve & pay ${formatINR(amount)}`}
      </button>
      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        Secured by Razorpay · test mode
      </p>
    </form>
  );
}

function ConfirmationStep({ booking }: { booking: ClockRoomBooking }) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(JSON.stringify({ id: booking.id, otp: booking.otp }), { width: 220, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [booking.id, booking.otp]);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Booking confirmed</p>
      <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-950">{booking.id}</h2>
      <p className="mt-2 text-sm text-slate-600">
        Paid {formatINR(booking.amount)} · {booking.dealerName}
      </p>

      {qrDataUrl && (
        <div className="mx-auto mt-5 w-fit rounded-xl border border-slate-200 bg-white p-4">
          <Image src={qrDataUrl} alt="Booking QR code" width={220} height={220} />
        </div>
      )}

      <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">Or show this code</p>
      <p className="font-display text-3xl font-black tracking-[0.3em] text-slate-950">{booking.otp}</p>

      <p className="mx-auto mt-5 max-w-sm text-sm text-slate-500">
        Show the QR code or OTP to staff at <strong>{booking.dealerName}</strong> ({booking.dealerAddress}) to
        check your bag in, and again to collect it.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/account?tab=clock-room" className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
          View in my account
        </Link>
        <Link href="/" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-950">
          Back home
        </Link>
      </div>
      <p className="mt-4 text-xs text-slate-400">Booked for {formatDateTime(booking.createdAt)}</p>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-amber-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
