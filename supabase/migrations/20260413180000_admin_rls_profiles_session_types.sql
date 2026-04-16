-- Staff directory + booking joins: staff may read all profiles (updates remain self-or-admin).
-- Session catalog writes: admin only. Staff/admin may read full session_types (incl. inactive).

drop policy if exists profiles_select_self_or_admin on public.profiles;

create policy profiles_select_self_or_staff
on public.profiles
for select
using (auth.uid() = id or public.is_staff(auth.uid()));

drop policy if exists session_types_staff_write on public.session_types;

create policy session_types_staff_select_all
on public.session_types
for select
using (public.is_staff(auth.uid()));

create policy session_types_admin_insert
on public.session_types
for insert
with check (public.is_admin(auth.uid()));

create policy session_types_admin_update
on public.session_types
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy session_types_admin_delete
on public.session_types
for delete
using (public.is_admin(auth.uid()));
