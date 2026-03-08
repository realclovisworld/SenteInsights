
create table public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  email text not null,
  plan text not null,
  amount_ugx integer not null,
  network text,
  momo_transaction_id text not null,
  status text default 'pending',
  submitted_at timestamptz default now(),
  verified_at timestamptz
);

alter table public.payment_requests enable row level security;

create policy "Anyone can insert payment requests"
on public.payment_requests for insert
with check (true);

create policy "Anyone can view own payment requests"
on public.payment_requests for select
using (true);

create policy "Anyone can update payment requests"
on public.payment_requests for update
using (true);
