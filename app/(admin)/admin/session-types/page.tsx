import { redirect } from 'next/navigation'

export default function AdminSessionTypesRedirectPage() {
  redirect('/admin/sessions?tab=catalog')
}
