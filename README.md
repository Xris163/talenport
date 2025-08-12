# TalentPort — Full Bundle

## Rýchly štart
1) `cp .env.example .env` a doplň SERVICE key + (neskôr) Stripe/Resend/Mapbox.
2) `npm i`
3) `npm run dev` → http://localhost:3000

## Migrácie (Supabase)
Spusť v poradí: db/001_credits.sql → 002_auth_jobs.sql → 003_storage_search_email.sql → 004_notifications.sql
V Storage vytvor bucket `resumes` (private).

## Deployment (Vercel)
- Add Environment Variables podľa `.env.example`.
- (Stripe/Resend voliteľné; bez nich je Checkout v DEMO režime).

## Obsah
- Landing, Jobs, Employers (kredity DEMO), Pricing, Success
- Job detail s JSON‑LD
- Employer Applications UI + Export CSV
- Notifikácie (badge) + Signed CV URL
- API: jobs CRUD, applications (upload CV, mail), search, notifications, Stripe checkout + webhook
