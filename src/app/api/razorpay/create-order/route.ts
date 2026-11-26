import { NextResponse } from "next/server";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payment gateway is not configured yet. Add RAZORPAY_KEY_SECRET and NEXT_PUBLIC_RAZORPAY_KEY_ID." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const amount = Number(body?.amount);
  const receipt = typeof body?.receipt === "string" ? body.receipt : `rcpt_${Date.now()}`;

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
  }

  try {
    const order = await createRazorpayOrder(amount, receipt);
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return NextResponse.json({ error: "Could not create payment order.", detail: String(err) }, { status: 502 });
  }
}
