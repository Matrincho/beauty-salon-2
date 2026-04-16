-- Remove `staff` from profiles.role enum (salon `staff_members` table is unchanged).
-- Former `staff` profiles become `admin` so they keep elevated access.
-- Redefine is_staff() as alias of is_admin() so existing RLS policies keep working.

begin;

update public.profiles
set role = 'admin'
where role = 'staff';

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
