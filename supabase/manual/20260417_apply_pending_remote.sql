-- Run this ONCE in Supabase Dashboard → SQL Editor (linked project).
-- Order: staff enum fix → realtime bookings → session_categories + seed.
-- Safe to re-run: realtime block is idempotent; categories use IF NOT EXISTS + ON CONFLICT DO NOTHING.

-- =============================================================================
-- 1) remove_staff_user_role (was 20260414120000)
-- =============================================================================
begin;

update public.profiles
set role = 'admin'
where role::text = 'staff';

alter table public.profiles alter column role drop default;

alter table public.profiles alter column role type text using role::text;

drop type public.user_role;

create type public.user_role as enum ('admin', 'user', 'client');

alter table public.profiles
  alter column role type public.user_role using role::public.user_role;

alter table public.profiles
  alter column role set default 'user'::public.user_role;

create or replace function public.is_staff(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin(uid);
$$;

commit;

-- =============================================================================
-- 2) realtime_bookings (was 20260415120000)
-- =============================================================================
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'bookings'
  ) then
    alter publication supabase_realtime add table public.bookings;
  end if;
end $$;

-- =============================================================================
-- 3) session_categories (was 20260416120000)
-- =============================================================================
create table if not exists public.session_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint session_categories_slug_unique unique (slug)
);

drop trigger if exists trg_session_categories_updated_at on public.session_categories;
create trigger trg_session_categories_updated_at
before update on public.session_categories
for each row execute function public.set_updated_at();

alter table public.session_categories enable row level security;

drop policy if exists session_categories_select_all on public.session_categories;
create policy session_categories_select_all
on public.session_categories
for select
using (true);

drop policy if exists session_categories_admin_insert on public.session_categories;
create policy session_categories_admin_insert
on public.session_categories
for insert
with check (public.is_admin(auth.uid()));

drop policy if exists session_categories_admin_update on public.session_categories;
create policy session_categories_admin_update
on public.session_categories
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists session_categories_admin_delete on public.session_categories;
create policy session_categories_admin_delete
on public.session_categories
for delete
using (public.is_admin(auth.uid()));

insert into public.session_categories (slug, name, sort_order) values
  ('hair', 'Hair', 1),
  ('nails', 'Nails', 2),
  ('body', 'Body', 3),
  ('face', 'Face', 4),
  ('wellness', 'Wellness', 5)
on conflict (slug) do nothing;
