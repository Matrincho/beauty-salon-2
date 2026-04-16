-- Names, split phone, and postal address on profiles.

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists phone_prefix text,
  add column if not exists phone_number text,
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists city text,
  add column if not exists county text,
  add column if not exists postcode text,
  add column if not exists country text;

-- Migrate legacy single phone column into phone_number when present.
update public.profiles
set phone_number = phone
where phone is not null
  and trim(phone) <> ''
  and phone_number is null;

alter table public.profiles drop column if exists phone;

-- Backfill first / last from full_name where still empty.
update public.profiles p
set
  first_name = coalesce(
    nullif(trim(p.first_name), ''),
    case
      when p.full_name is not null and trim(p.full_name) <> '' then
        split_part(trim(p.full_name), ' ', 1)
      else null
    end
  ),
  last_name = coalesce(
    nullif(trim(p.last_name), ''),
    case
      when p.full_name is not null
        and trim(p.full_name) <> ''
        and position(' ' in trim(p.full_name)) > 0 then
        nullif(
          trim(substring(trim(p.full_name) from position(' ' in trim(p.full_name)) + 1)),
          ''
        )
      else null
    end
  )
where p.full_name is not null
  and trim(p.full_name) <> '';

-- Keep full_name aligned when first or last name changes from the app.
create or replace function public.profiles_sync_full_name()
returns trigger
language plpgsql
as $$
begin
  new.first_name := nullif(trim(coalesce(new.first_name, '')), '');
  new.last_name := nullif(trim(coalesce(new.last_name, '')), '');
  new.full_name := nullif(
    trim(coalesce(new.first_name, '') || ' ' || coalesce(new.last_name, '')),
    ''
  );
  return new;
end;
$$;

drop trigger if exists trg_profiles_sync_full_name on public.profiles;
create trigger trg_profiles_sync_full_name
before insert or update of first_name, last_name on public.profiles
for each row execute function public.profiles_sync_full_name();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_full text := nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), '');
  meta_first text := nullif(trim(coalesce(new.raw_user_meta_data->>'first_name', '')), '');
  meta_last text := nullif(trim(coalesce(new.raw_user_meta_data->>'last_name', '')), '');
  v_first text;
  v_last text;
  v_full text;
begin
  v_first := meta_first;
  v_last := meta_last;
  if v_first is null and v_last is null and meta_full is not null then
    v_first := split_part(meta_full, ' ', 1);
    v_last := nullif(trim(substring(meta_full from length(v_first) + 2)), '');
  end if;
  v_full := nullif(trim(coalesce(v_first, '') || ' ' || coalesce(v_last, '')), '');

  insert into public.profiles (id, email, full_name, first_name, last_name, role, account_status)
  values (
    new.id,
    new.email,
    v_full,
    v_first,
    v_last,
    'user',
    'active'
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;
