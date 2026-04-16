-- Optional dev seed: staff + session_types so Supabase has catalog data for bookings/admin joins.
-- Run in SQL Editor after migrations. Safe to re-run (ON CONFLICT DO NOTHING on slug).

-- At least one staff row is required for real bookings (bookings.staff_member_id FK).
insert into public.staff_members (display_name, title, is_active)
select 'House stylist', 'Senior stylist', true
where not exists (select 1 from public.staff_members);

insert into public.session_types (
  slug,
  title,
  description,
  duration_minutes,
  base_price,
  currency,
  is_active,
  sort_order
) values
  (
    'full-manicure',
    'Full manicure',
    'Shape, cuticle care, gel polish.',
    60,
    85,
    'BGN',
    true,
    1
  ),
  (
    'haircut-blowdry',
    'Cut & blow-dry',
    'Wash, cut, and style.',
    45,
    65,
    'BGN',
    true,
    2
  ),
  (
    'balayage',
    'Balayage',
    'Hand-painted colour and tone.',
    120,
    180,
    'BGN',
    true,
    3
  ),
  (
    'classic-massage',
    'Classic massage',
    'Full body relaxation.',
    50,
    95,
    'BGN',
    false,
    4
  )
on conflict (slug) do nothing;
