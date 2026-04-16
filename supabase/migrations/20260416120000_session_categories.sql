-- Session service categories (groups for catalog / booking UX).

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

-- Idempotent seed (safe to re-run).
insert into public.session_categories (slug, name, sort_order) values
  ('hair', 'Hair', 1),
  ('nails', 'Nails', 2),
  ('body', 'Body', 3),
  ('face', 'Face', 4),
  ('wellness', 'Wellness', 5)
on conflict (slug) do nothing;
