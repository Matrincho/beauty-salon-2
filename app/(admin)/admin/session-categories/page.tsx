import { redirect } from 'next/navigation'

export default function AdminSessionCategoriesRedirectPage() {
  redirect('/admin/sessions?tab=categories')
}
