-- ETHEREALMARKET Supabase schema
-- Run in Supabase SQL editor

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  bin text not null,
  country text not null,
  brand text not null,
  card_type text not null,
  card_level text not null,
  issuer text not null,
  price numeric(10,2) not null,
  status text not null default 'active' check (status in ('active', 'sold', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  user_id uuid not null references profiles(id),
  status text not null default 'pending',
  total numeric(12,2) not null,
  payment_method text not null check (payment_method in ('balance', 'crypto')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  price numeric(10,2) not null,
  quantity int not null default 1
);

create table if not exists deposits (
  id text primary key,
  user_id uuid not null references profiles(id),
  amount_usd numeric(12,2) not null,
  crypto_type text not null,
  crypto_amount numeric(18,8) not null,
  wallet_address text not null,
  txid text,
  proof_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references profiles(id),
  action text not null,
  entity_type text,
  entity_id text,
  details text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table deposits enable row level security;
alter table audit_logs enable row level security;

create policy "profiles_select_own" on profiles for select using (auth.uid() = id or exists (
  select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
));
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

create policy "products_select" on products for select to authenticated using (true);
create policy "products_admin" on products for all using (exists (
  select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
));

create policy "orders_select_own" on orders for select using (auth.uid() = user_id or exists (
  select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
));
create policy "orders_insert_own" on orders for insert with check (auth.uid() = user_id);

create policy "deposits_select_own" on deposits for select using (auth.uid() = user_id or exists (
  select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
));
create policy "deposits_insert_own" on deposits for insert with check (auth.uid() = user_id);
create policy "deposits_admin_update" on deposits for update using (exists (
  select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
));

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, balance)
  values (new.id, new.email, 'customer', 0);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
