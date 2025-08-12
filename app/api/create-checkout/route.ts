import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const { company_id, credits = 1 } = await req.json();
  if (!company_id) return NextResponse.json({ error: "Missing company_id" }, { status: 400 });

  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) {
    // No keys? Return demo id so UI won't break during build/preview
    return NextResponse.json({ id: "sess_demo_no_stripe_key" });
  }
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" } as any);
  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const price = (c: number) => (c >= 20 ? 24900 : c >= 5 ? 7900 : 1900);

  const ses = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      price_data: { currency: "eur", product_data: { name: `TalentPort kredit (${credits})` }, unit_amount: price(Number(credits)) },
      quantity: 1
    }],
    metadata: { kind: "credit_topup", company_id, credits: String(credits) },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`
  });

  return NextResponse.json({ id: ses.id });
}
