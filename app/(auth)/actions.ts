'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getDefaultRedirectPath } from '@/lib/auth/roles'
import { getCurrentUserProfile } from '@/lib/auth/profile'

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function loginAction(formData: FormData) {
  const email = getString(formData, 'email')
  const password = getString(formData, 'password')

  if (!email || !password) {
    redirect('/login?error=missing_fields')
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/login?error=invalid_credentials')
  }

  const { profile } = await getCurrentUserProfile()
  redirect(getDefaultRedirectPath(profile?.role))
}

export async function signupAction(formData: FormData) {
  const email = getString(formData, 'email')
  const password = getString(formData, 'password')
  const fullName = getString(formData, 'fullName')

  if (!email || !password) {
    redirect('/signup?error=missing_fields')
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
    },
  })

  if (error) {
    redirect('/signup?error=signup_failed')
  }

  redirect('/login?message=account_created')
}

