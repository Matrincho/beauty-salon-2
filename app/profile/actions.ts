'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { AVATARS_BUCKET, isStoredAvatarPath } from '@/lib/supabase/avatar-display'

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

const AVATAR_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])
const MAX_AVATAR_BYTES = 5 * 1024 * 1024

export async function uploadAvatarAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const file = formData.get('avatar')
  if (!(file instanceof File) || file.size === 0) {
    redirect('/profile?avatar_error=no_file')
  }
  if (file.size > MAX_AVATAR_BYTES) {
    redirect('/profile?avatar_error=too_large')
  }
  const ext = AVATAR_TYPES.get(file.type)
  if (!ext) {
    redirect('/profile?avatar_error=invalid_type')
  }

  const objectPath = `${user.id}/avatar.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(objectPath, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    redirect('/profile?avatar_error=upload_failed')
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_url: objectPath })
    .eq('id', user.id)

  if (profileError) {
    redirect('/profile?avatar_error=profile_failed')
  }

  revalidatePath('/profile')
  redirect('/profile?avatar_saved=1')
}

export async function removeAvatarAction() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: row } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single()

  const path = row?.avatar_url
  if (path && isStoredAvatarPath(path)) {
    await supabase.storage.from(AVATARS_BUCKET).remove([path])
  }

  await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id)

  revalidatePath('/profile')
  redirect('/profile?avatar_removed=1')
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const fullName = getString(formData, 'fullName') || null
  const phone = getString(formData, 'phone') || null

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, phone })
    .eq('id', user.id)

  if (error) {
    redirect('/profile?error=save_failed')
  }

  revalidatePath('/profile')
  redirect('/profile?saved=1')
}
