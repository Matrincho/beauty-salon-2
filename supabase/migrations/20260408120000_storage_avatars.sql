-- Private bucket for profile avatars. Object path: {auth.uid}/avatar.{ext}
-- SELECT: owner or admin. INSERT/UPDATE/DELETE: owner only (first path segment = user id).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
select
  'avatars',
  'avatars',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
where not exists (select 1 from storage.buckets where id = 'avatars');

drop policy if exists "avatars_select_own_or_admin" on storage.objects;
create policy "avatars_select_own_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin(auth.uid())
  )
);

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);
