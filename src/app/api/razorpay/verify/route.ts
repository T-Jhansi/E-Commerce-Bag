import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body ?? {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ verified: false, error: "Missing payment fields." }, { status: 400 });
  }

  const verified = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  return NextResponse.json({ verified });
}
