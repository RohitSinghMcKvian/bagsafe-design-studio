-- Roles enum
create type public.app_role as enum ('customer', 'vendor', 'admin');

-- Order status enum
create type public.order_status as enum ('scheduled', 'picked_up', 'in_transit', 'delivered', 'cancelled');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Security definer role check
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  airline text,
  flight_number text,
  travel_date date,
  route_type text,
  origin_city text,
  destination_city text,
  pickup_address text not null,
  pickup_slot text,
  delivery_address text not null,
  recipient_name text,
  recipient_phone text,
  bag_count int not null default 1,
  weight_kg numeric not null default 0,
  contents_note text,
  estimated_price numeric,
  status order_status not null default 'scheduled',
  tracking_url text,
  courier_name text,
  vendor_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- Auto-create profile + customer role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    new.email
  );
  insert into public.user_roles (user_id, role) values (new.id, 'customer');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Vendors can view all profiles" on public.profiles
  for select using (public.has_role(auth.uid(), 'vendor'));
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can update any profile" on public.profiles
  for update using (public.has_role(auth.uid(), 'admin'));

-- RLS: user_roles
create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can insert roles" on public.user_roles
  for insert with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete roles" on public.user_roles
  for delete using (public.has_role(auth.uid(), 'admin'));

-- RLS: orders
create policy "Customers can view own orders" on public.orders
  for select using (auth.uid() = customer_id);
create policy "Vendors can view all orders" on public.orders
  for select using (public.has_role(auth.uid(), 'vendor'));
create policy "Admins can view all orders" on public.orders
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Customers can create own orders" on public.orders
  for insert with check (auth.uid() = customer_id);
create policy "Customers can update own scheduled orders" on public.orders
  for update using (auth.uid() = customer_id and status = 'scheduled');
create policy "Vendors can update any order" on public.orders
  for update using (public.has_role(auth.uid(), 'vendor'));
create policy "Admins can update any order" on public.orders
  for update using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete orders" on public.orders
  for delete using (public.has_role(auth.uid(), 'admin'));

create index idx_orders_customer on public.orders(customer_id);
create index idx_orders_status on public.orders(status);
create index idx_user_roles_user on public.user_roles(user_id);