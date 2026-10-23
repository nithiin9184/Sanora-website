-- Run once in the SANORA mobile app database (SQL editor).
create table if not exists public.coupons (
  code text primary key,
  discount_percent int not null check (discount_percent between 0 and 100),
  max_redemptions int not null,
  redeemed_count int not null default 0,
  plan_ids text[],
  active boolean not null default true
);
alter table public.coupons enable row level security;
insert into public.coupons (code, discount_percent, max_redemptions, plan_ids)
values ('SANORA9184', 40, 509, array['pro-1m']) on conflict (code) do nothing;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  amount int not null,
  coupon_code text,
  razorpay_order_id text not null,
  razorpay_payment_id text not null unique,
  status text not null default 'active',
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "own subscriptions" on public.subscriptions for select to authenticated using (auth.uid() = user_id);

alter table public.profiles add column if not exists plan_id text;
alter table public.profiles add column if not exists plan_expires_at timestamptz;

create or replace function public.redeem_coupon(p_code text) returns void
language sql security definer set search_path = public as $$
  update coupons set redeemed_count = redeemed_count + 1
  where code = upper(p_code) and redeemed_count < max_redemptions;
$$;
revoke execute on function public.redeem_coupon(text) from public, anon, authenticated;
