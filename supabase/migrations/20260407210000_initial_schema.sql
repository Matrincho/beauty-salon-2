create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'staff', 'user', 'client');
  end if;

  if not exists (select 1 from pg_type where typname = 'account_status') then
    create type public.account_status as enum ('active', 'pending_review', 'rejected', 'banned');
  end if;

  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
  end if;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  role public.user_role not null default 'user',
  account_status public.account_status not null default 'active',
  rejected_at timestamptz,
  rejected_reason text,
  banned_at timestamptz,
  ban_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salon_settings (
  id boolean primary key default true,
  salon_name text not null default 'Maison Elite',
  timezone text not null default 'Europe/Sofia',
  address text,
  phone text,
  email text,
  default_appointment_duration_minutes integer,
  updated_at timestamptz not null default now(),
  constraint salon_settings_singleton check (id = true)
);

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  title text,
  bio text,
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.session_types (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  base_price numeric(12,2) not null check (base_price >= 0),
  currency text not null default 'BGN',
  location_label text,
  is_active boolean not null default true,
  active_from timestamptz,
  active_to timestamptz,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint session_active_range_chk check (active_to is null or active_from is null or active_to > active_from)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete restrict,
  session_type_id uuid not null references public.session_types(id) on delete restrict,
  staff_member_id uuid not null references public.staff_members(id) on delete restrict,
  status public.booking_status not null default 'pending',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  price_final numeric(12,2) not null check (price_final >= 0),
  price_override boolean not null default false,
  admin_note text,
  cancelled_at timestamptz,
  cancel_reason text,
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_time_range_chk check (ends_at > starts_at)
);

create table if not exists public.login_events (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  email_attempt text,
  ip text,
  user_agent text,
  success boolean not null,
  error_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  payload_before jsonb,
  payload_after jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_staff_members_user_id on public.staff_members(user_id);
create index if not exists idx_bookings_client_id on public.bookings(client_id);
create index if not exists idx_bookings_staff_member_id on public.bookings(staff_member_id);
create index if not exists idx_bookings_starts_at on public.bookings(starts_at);
create index if not exists idx_login_events_user_id on public.login_events(user_id);
create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_staff_members_updated_at on public.staff_members;
create trigger trg_staff_members_updated_at
before update on public.staff_members
for each row execute function public.set_updated_at();

drop trigger if exists trg_session_types_updated_at on public.session_types;
create trigger trg_session_types_updated_at
before update on public.session_types
for each row execute function public.set_updated_at();

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists trg_salon_settings_updated_at on public.salon_settings;
create trigger trg_salon_settings_updated_at
before update on public.salon_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, account_status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    'user',
    'active'
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid
      and role = 'admin'
  );
$$;

create or replace function public.is_staff(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid
      and role in ('admin', 'staff')
  );
$$;

create or replace function public.promote_user_to_client()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('confirmed', 'completed') then
    update public.profiles
    set role = 'client'
    where id = new.client_id
      and role = 'user';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_promote_user_to_client on public.bookings;
create trigger trg_promote_user_to_client
after insert or update of status on public.bookings
for each row execute function public.promote_user_to_client();

insert into public.salon_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.salon_settings enable row level security;
alter table public.staff_members enable row level security;
alter table public.session_types enable row level security;
alter table public.bookings enable row level security;
alter table public.login_events enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin
on public.profiles
for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists profiles_admin_insert on public.profiles;
create policy profiles_admin_insert
on public.profiles
for insert
with check (public.is_admin(auth.uid()));

drop policy if exists salon_settings_read on public.salon_settings;
create policy salon_settings_read
on public.salon_settings
for select
using (true);

drop policy if exists salon_settings_admin_write on public.salon_settings;
create policy salon_settings_admin_write
on public.salon_settings
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists staff_members_read_authenticated on public.staff_members;
create policy staff_members_read_authenticated
on public.staff_members
for select
using (auth.uid() is not null);

drop policy if exists staff_members_staff_write on public.staff_members;
create policy staff_members_staff_write
on public.staff_members
for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

drop policy if exists session_types_public_read_active on public.session_types;
create policy session_types_public_read_active
on public.session_types
for select
using (
  is_active = true
  and (active_from is null or active_from <= now())
  and (active_to is null or active_to >= now())
);

drop policy if exists session_types_staff_write on public.session_types;
create policy session_types_staff_write
on public.session_types
for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

drop policy if exists bookings_select_own_or_staff on public.bookings;
create policy bookings_select_own_or_staff
on public.bookings
for select
using (
  client_id = auth.uid()
  or public.is_staff(auth.uid())
);

drop policy if exists bookings_insert_own_or_staff on public.bookings;
create policy bookings_insert_own_or_staff
on public.bookings
for insert
with check (
  client_id = auth.uid()
  or public.is_staff(auth.uid())
);

drop policy if exists bookings_update_own_or_staff on public.bookings;
create policy bookings_update_own_or_staff
on public.bookings
for update
using (
  client_id = auth.uid()
  or public.is_staff(auth.uid())
)
with check (
  client_id = auth.uid()
  or public.is_staff(auth.uid())
);

drop policy if exists login_events_select_own_or_admin on public.login_events;
create policy login_events_select_own_or_admin
on public.login_events
for select
using (
  user_id = auth.uid()
  or public.is_admin(auth.uid())
);

drop policy if exists login_events_admin_insert on public.login_events;
create policy login_events_admin_insert
on public.login_events
for insert
with check (public.is_admin(auth.uid()));

drop policy if exists audit_logs_admin_read on public.audit_logs;
create policy audit_logs_admin_read
on public.audit_logs
for select
using (public.is_admin(auth.uid()));

drop policy if exists audit_logs_staff_insert on public.audit_logs;
create policy audit_logs_staff_insert
on public.audit_logs
for insert
with check (public.is_staff(auth.uid()));

