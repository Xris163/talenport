create table if not exists public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null, type text not null, payload jsonb not null default '{}'::jsonb, read_at timestamptz, created_at timestamptz default now());
create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);
alter table public.notifications enable row level security;
create policy if not exists "owner can read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy if not exists "owner can update read_at" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
