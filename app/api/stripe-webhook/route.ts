import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) return new Stripe("sk_test_dummy", { apiVersion: "2024-06-20" } as any);
  return new Stripe(key, { apiVersion: "2024-06-20" } as any);
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Missing STRIPE_WEBHOOK_SECRET" });
  }

  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature") as string;
  const raw = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const sb = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);

  if (event.type === "checkout.session.completed") {
    const ses = event.data.object as any;
    const meta = ses.metadata || {};
    if (meta.kind === "credit_topup" && meta.company_id) {
      const credits = parseInt(String(meta.credits || "1"), 10) || 1;
      await sb.rpc("add_credits", { p_company: meta.company_id, p_delta: credits, p_reason: "topup", p_session: ses.id, p_meta: meta });
      if (meta.job_id) {
        const { data } = await sb.rpc("consume_credits", { p_company: meta.company_id, p_cost: 1, p_reason: "post_job", p_meta: meta });
        if (data) await sb.from("jobs").update({ status: "published" }).eq("id", meta.job_id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
