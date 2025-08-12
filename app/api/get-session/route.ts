// Force Node.js runtime for Stripe SDK
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("session_id");
  if (!id) return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 400 });

  const stripe = new Stripe(key, { apiVersion: "2024-06-20" } as any);
  const ses = await stripe.checkout.sessions.retrieve(id);
  return NextResponse.json({ session: ses });
}
