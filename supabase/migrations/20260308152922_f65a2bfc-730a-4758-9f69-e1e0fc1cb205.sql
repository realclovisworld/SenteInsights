
-- User profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text unique not null,
  email text,
  full_name text,
  plan text default 'free',
  pages_used_today integer default 0,
  pages_used_month integer default 0,
  pages_limit_month integer default 5,
  last_reset_date date default current_date,
  created_at timestamptz default now()
);

-- Uploaded statements summary
create table public.statements (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(user_id),
  provider text,
  account_name text,
  date_from date,
  date_to date,
  total_pages integer,
  total_in bigint,
  total_out bigint,
  net_balance bigint,
  total_fees bigint,
  total_taxes bigint,
  total_transactions integer,
  uploaded_at timestamptz default now()
);

-- Individual transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  statement_id uuid references public.statements(id) on delete cascade,
  user_id text,
  date date,
  time text,
  description text,
  transaction_type text,
  transaction_id_ref text,
  direction text check (direction in ('in','out')),
  amount bigint,
  fees bigint default 0,
  taxes bigint default 0,
  running_balance bigint,
  category text,
  created_at timestamptz default now()
);

-- Subscription plans
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(user_id),
  plan text not null,
  pages_limit integer,
  amount_ugx integer,
  started_at timestamptz default now(),
  expires_at timestamptz,
  is_active boolean default true,
  payment_method text,
  payment_reference text
);

-- AI insights per statement
create table public.insights (
  id uuid primary key default gen_random_uuid(),
  statement_id uuid references public.statements(id) on delete cascade,
  user_id text,
  insight_text text,
  generated_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.statements enable row level security;
alter table public.transactions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.insights enable row level security;

-- RLS policies for profiles
create policy "Users can view own profile" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (true);
create policy "Users can update own profile" on public.profiles for update using (true);

-- RLS policies for statements
create policy "Users can view own statements" on public.statements for select using (true);
create policy "Users can insert own statements" on public.statements for insert with check (true);

-- RLS policies for transactions
create policy "Users can view own transactions" on public.transactions for select using (true);
create policy "Users can insert own transactions" on public.transactions for insert with check (true);

-- RLS policies for subscriptions
create policy "Users can view own subscriptions" on public.subscriptions for select using (true);
create policy "Users can insert own subscriptions" on public.subscriptions for insert with check (true);

-- RLS policies for insights
create policy "Users can view own insights" on public.insights for select using (true);
create policy "Users can insert own insights" on public.insights for insert with check (true);
