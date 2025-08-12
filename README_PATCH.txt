# TalentPort — Patch to fix Vercel build + Stripe webhook

This patch does two things:
1) Moves Stripe webhook to an **App Route** (`app/api/stripe-webhook/route.ts`), so you don't need 'micro'.
2) Makes the checkout endpoint tolerant of missing Stripe keys (returns a demo session id).

It also contains a **SQL** file to set Storage RLS for the `resumes` bucket.

## How to apply
1) Unzip and copy the `app/` and `db/` folders into your project root (overwrite existing files when asked).
2) Remove the old file (if present): `pages/api/stripe-webhook.ts`
3) Commit & push to GitHub, then redeploy on Vercel.

## Supabase Storage
- Run `db/005_storage_bucket_resumes.sql` in Supabase SQL editor (after you created the private bucket `resumes`).

## Env for live Stripe
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
