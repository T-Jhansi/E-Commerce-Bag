"use client";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: () => void) => void };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load the payment gateway. Check your connection and try again."));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function payWithRazorpay(opts: {
  amount: number; // rupees
  description: string;
  prefill: { name: string; email?: string; contact: string };
}): Promise<RazorpaySuccess> {
  await loadRazorpayScript();

  const createRes = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: opts.amount }),
  });
  const createData = await createRes.json();
  if (!createRes.ok) {
    throw new Error(createData.error || "Could not start payment.");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: createData.keyId,
      amount: createData.amount,
      currency: createData.currency,
      name: "North Pole",
      description: opts.description,
      order_id: createData.orderId,
      prefill: opts.prefill,
      theme: { color: "#d97706" },
      handler: (response: RazorpaySuccess) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled.")),
      },
    });
    rzp.on("payment.failed", () => reject(new Error("Payment failed. Please try again.")));
    rzp.open();
  });
}

export async function verifyRazorpayPayment(payload: RazorpaySuccess): Promise<boolean> {
  const res = await fetch("/api/razorpay/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return Boolean(data.verified);
}
