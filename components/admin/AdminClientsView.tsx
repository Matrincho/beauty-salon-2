'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Loader2, Pencil, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { AdminProfileRow } from '@/lib/admin/data'
import { ACCOUNT_STATUS_LABELS, ROLE_LABELS } from '@/lib/admin/labels-bg'
import {
  ACCOUNT_STATUSES,
  USER_ROLES,
  type AccountStatus,
  type UserRole,
} from '@/lib/auth/roles'
import { profileDisplayName } from '@/lib/auth/profile-display'
import {
  deleteClientAccountAction,
  updateClientProfileAction,
} from '@/app/(admin)/admin/clients/actions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

function formatPhone(p: AdminProfileRow): string {
  const bits = [p.phone_prefix, p.phone_number].filter(
    (s): s is string => Boolean(s && String(s).trim())
  )
  return bits.join(' ') || '—'
}

function formatCreatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

type EditFormState = {
  first_name: string
  last_name: string
  phone_prefix: string
  phone_number: string
  address_line_1: string
  address_line_2: string
  city: string
  county: string
  postcode: string
  country: string
  role: UserRole
}

function rowToForm(row: AdminProfileRow): EditFormState {
  return {
    first_name: row.first_name ?? '',
    last_name: row.last_name ?? '',
    phone_prefix: row.phone_prefix ?? '',
    phone_number: row.phone_number ?? '',
    address_line_1: row.address_line_1 ?? '',
    address_line_2: row.address_line_2 ?? '',
    city: row.city ?? '',
    county: row.county ?? '',
    postcode: row.postcode ?? '',
    country: row.country ?? '',
    role: row.role,
  }
}

export function AdminClientsView({
  profiles,
  error,
  canManageRoles,
  actorId,
}: {
  profiles: AdminProfileRow[]
  error: string | null
  canManageRoles: boolean
  actorId: string | undefined
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all')
  const [viewRow, setViewRow] = useState<AdminProfileRow | null>(null)
  const [deleteConfirmRow, setDeleteConfirmRow] = useState<AdminProfileRow | null>(null)
  const [editRow, setEditRow] = useState<AdminProfileRow | null>(null)
  const [form, setForm] = useState<EditFormState | null>(null)
  const [pendingSave, setPendingSave] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (editRow) {
      setForm(rowToForm(editRow))
    } else {
      setForm(null)
    }
  }, [editRow])

  const filtered = useMemo(() => {
    let list = profiles
    if (roleFilter !== 'all') {
      list = list.filter((p) => p.role === roleFilter)
    }
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.account_status === statusFilter)
    }
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((p) => {
      const name = profileDisplayName(p)?.toLowerCase() ?? ''
      const email = p.email?.toLowerCase() ?? ''
      const phone = formatPhone(p).toLowerCase()
      return name.includes(q) || email.includes(q) || phone.includes(q)
    })
  }, [profiles, query, roleFilter, statusFilter])

  function openEditFromView() {
    if (!viewRow) return
    setEditRow(viewRow)
    setViewRow(null)
  }

  function confirmDeleteClient() {
    if (!deleteConfirmRow) return
    if (actorId && deleteConfirmRow.id === actorId) {
      toast.error('You cannot remove your own account.')
      setDeleteConfirmRow(null)
      return
    }
    setPendingDelete(true)
    startTransition(async () => {
      const res = await deleteClientAccountAction(deleteConfirmRow.id)
      setPendingDelete(false)
      if (res.ok) {
        toast.success('Account access removed (banned).')
        setDeleteConfirmRow(null)
        setViewRow(null)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })
  }

  function saveProfile() {
    if (!editRow || !form || !canManageRoles) return
    setPendingSave(true)
    startTransition(async () => {
      const res = await updateClientProfileAction(editRow.id, {
        first_name: form.first_name,
        last_name: form.last_name,
        phone_prefix: form.phone_prefix,
        phone_number: form.phone_number,
        address_line_1: form.address_line_1,
        address_line_2: form.address_line_2,
        city: form.city,
        county: form.county,
        postcode: form.postcode,
        country: form.country,
        role: form.role,
      })
      setPendingSave(false)
      if (res.ok) {
        toast.success('Profile updated.')
        setEditRow(null)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })
  }

  if (error) {
    return (
      <div
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
        role="alert"
      >
        {error}
      </div>
    )
  }

  const roleLocked = editRow && actorId === editRow.id

  return (
    <div className="admin-fade-in space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8C8074]"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="border-[#E5E0D8] bg-white pl-10 shadow-sm placeholder:text-[#8C8074]/70"
            aria-label="Search clients"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#8C8074]">
              Role
            </p>
            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as 'all' | UserRole)}
            >
              <SelectTrigger className="h-9 w-[10rem] border-[#E5E0D8] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {USER_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABELS[r] ?? r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#8C8074]">
              Account status
            </p>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as 'all' | AccountStatus)}
            >
              <SelectTrigger className="h-9 w-[11rem] border-[#E5E0D8] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ACCOUNT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ACCOUNT_STATUS_LABELS[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <p className="text-xs text-[#8C8074]">
        {profiles.length} profile{profiles.length === 1 ? '' : 's'} in Supabase · {filtered.length}{' '}
        shown
      </p>

      {!canManageRoles ? (
        <p className="rounded-lg border border-[#E5E0D8] bg-[#F9F8F6] px-3 py-2 text-sm text-[#8C8074]">
          Only admins can edit or remove accounts. You can still search, open profiles, and review the
          directory.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E0D8] bg-[#F9F8F6] text-xs uppercase tracking-wide text-[#8C8074]">
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="min-w-[7rem] px-4 py-3 font-medium">Role</th>
              <th className="w-36 px-4 py-3 font-medium">Status</th>
              <th className="w-14 px-3 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#8C8074]">
                  No rows match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => {
                const name = profileDisplayName(row) || '—'
                const isSelf = Boolean(actorId && row.id === actorId)

                return (
                  <tr
                    key={row.id}
                    onClick={() => setViewRow(row)}
                    aria-label={isSelf ? `Your profile, ${name}` : undefined}
                    className={cn(
                      'border-b border-[#E5E0D8]/70 last:border-0',
                      'cursor-pointer hover:bg-[#FAFAF8]/90',
                      isSelf && 'bg-[#FFFDF8] hover:bg-[#F9F5F0]',
                      'animate-in fade-in slide-in-from-bottom-1 duration-300'
                    )}
                    style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                  >
                    <td className="px-4 py-3 font-medium text-[#1A1A1B]">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="min-w-0 truncate">{name}</span>
                        {isSelf ? (
                          <span className="inline-flex shrink-0 items-center rounded border border-[#D4AF37]/45 bg-[#FFF9E8] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8A6F1A]">
                            You
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#8C8074]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#1A1A1B]/90">{row.email ?? '—'}</span>
                        <span className="text-xs">{formatPhone(row)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#1A1A1B]/90">
                      {ROLE_LABELS[row.role] ?? row.role}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-[#E5E0D8] bg-[#F9F8F6] px-2 py-0.5 text-xs text-[#1A1A1B]/80">
                        {ACCOUNT_STATUS_LABELS[row.account_status] ?? row.account_status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-end align-middle">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#8C8074] hover:bg-[#F9F8F6] hover:text-[#D4AF37]"
                        onClick={(e) => {
                          e.stopPropagation()
                          setViewRow(row)
                        }}
                        aria-label={`View profile for ${name}`}
                      >
                        <Eye className="size-4" aria-hidden />
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={viewRow !== null} onOpenChange={(o) => !o && setViewRow(null)}>
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto border-[#E5E0D8] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2 text-[#1A1A1B]">
              <span>{viewRow ? profileDisplayName(viewRow) || 'Client' : 'Client'}</span>
              {viewRow && actorId === viewRow.id ? (
                <span className="inline-flex shrink-0 items-center rounded border border-[#D4AF37]/45 bg-[#FFF9E8] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8A6F1A]">
                  You
                </span>
              ) : null}
            </DialogTitle>
            <DialogDescription className="text-[#8C8074]">
              Profile details · read-only
            </DialogDescription>
          </DialogHeader>
          {viewRow ? (
            <div className="space-y-4 py-1">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#8C8074]">
                    Email
                  </dt>
                  <dd className="mt-1 font-mono text-[#1A1A1B]/90">{viewRow.email ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#8C8074]">
                    Phone
                  </dt>
                  <dd className="mt-1 text-[#1A1A1B]/90">{formatPhone(viewRow)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#8C8074]">
                    Role
                  </dt>
                  <dd className="mt-1 text-[#1A1A1B]/90">
                    {ROLE_LABELS[viewRow.role] ?? viewRow.role}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#8C8074]">
                    Status
                  </dt>
                  <dd className="mt-1">
                    <span className="rounded-md border border-[#E5E0D8] bg-[#F9F8F6] px-2 py-0.5 text-xs text-[#1A1A1B]/80">
                      {ACCOUNT_STATUS_LABELS[viewRow.account_status] ?? viewRow.account_status}
                    </span>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#8C8074]">
                    Member since
                  </dt>
                  <dd className="mt-1 text-[#1A1A1B]/90">{formatCreatedAt(viewRow.created_at)}</dd>
                </div>
              </dl>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8C8074]">
                  Address
                </p>
                <div className="mt-2 space-y-1 rounded-lg border border-[#E5E0D8] bg-[#F9F8F6]/50 px-3 py-2 text-sm text-[#1A1A1B]/90">
                  {(() => {
                    const lines = [
                      viewRow.address_line_1,
                      viewRow.address_line_2,
                      [viewRow.city, viewRow.county, viewRow.postcode].filter(Boolean).join(', '),
                      viewRow.country,
                    ]
                      .map((s) => (s && String(s).trim()) || '')
                      .filter(Boolean)
                    if (lines.length === 0) {
                      return <span className="text-[#8C8074]">No address on file.</span>
                    }
                    return lines.map((line, i) => (
                      <p key={`${i}-${line.slice(0, 24)}`}>{line}</p>
                    ))
                  })()}
                </div>
              </div>
              {canManageRoles ? (
                <div className="flex flex-wrap gap-2 border-t border-[#E5E0D8] pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#E5E0D8] bg-white"
                    onClick={openEditFromView}
                  >
                    <Pencil className="mr-2 size-4" aria-hidden />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-200 bg-white text-red-700 hover:bg-red-50 hover:text-red-800"
                    disabled={
                      actorId === viewRow.id ||
                      viewRow.account_status === 'banned' ||
                      pendingDelete
                    }
                    title={
                      actorId === viewRow.id
                        ? 'You cannot remove your own account'
                        : viewRow.account_status === 'banned'
                          ? 'Account is already banned'
                          : undefined
                    }
                    onClick={() => {
                      if (actorId && viewRow.id === actorId) {
                        toast.error('You cannot remove your own account.')
                        return
                      }
                      setDeleteConfirmRow(viewRow)
                    }}
                  >
                    <Trash2 className="mr-2 size-4" aria-hidden />
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewRow(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteConfirmRow !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmRow(null)
        }}
      >
        <AlertDialogContent className="border-[#E5E0D8]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1A1A1B]">Remove account access?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8C8074]">
              This will ban{' '}
              <span className="font-medium text-[#1A1A1B]/90">
                {deleteConfirmRow ? profileDisplayName(deleteConfirmRow) || 'this client' : ''}
              </span>{' '}
              and block sign-in. Booking history stays in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#E5E0D8]">Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={
                pendingDelete ||
                Boolean(
                  deleteConfirmRow &&
                    actorId &&
                    deleteConfirmRow.id === actorId
                )
              }
              onClick={confirmDeleteClient}
            >
              {pendingDelete ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  Removing…
                </>
              ) : (
                'Remove access'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editRow !== null} onOpenChange={(o) => !o && setEditRow(null)}>
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto border-[#E5E0D8] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1A1A1B]">Edit client profile</DialogTitle>
          </DialogHeader>
          {form ? (
            <div className="space-y-4 py-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-first">First name</Label>
                  <Input
                    id="edit-first"
                    value={form.first_name}
                    onChange={(e) => setForm((f) => f && { ...f, first_name: e.target.value })}
                    className="border-[#E5E0D8]"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-last">Last name</Label>
                  <Input
                    id="edit-last"
                    value={form.last_name}
                    onChange={(e) => setForm((f) => f && { ...f, last_name: e.target.value })}
                    className="border-[#E5E0D8]"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  disabled={!canManageRoles || roleLocked}
                  onValueChange={(v) =>
                    setForm((f) => f && { ...f, role: v as UserRole })
                  }
                >
                  <SelectTrigger className="border-[#E5E0D8] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r] ?? r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {roleLocked ? (
                  <p className="text-xs text-[#8C8074]">
                    You cannot change your own role here.
                  </p>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-prefix">Phone prefix</Label>
                  <Input
                    id="edit-prefix"
                    value={form.phone_prefix}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, phone_prefix: e.target.value })
                    }
                    placeholder="+359"
                    className="border-[#E5E0D8]"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone number</Label>
                  <Input
                    id="edit-phone"
                    value={form.phone_number}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, phone_number: e.target.value })
                    }
                    className="border-[#E5E0D8]"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-addr1">Address line 1</Label>
                <Input
                  id="edit-addr1"
                  value={form.address_line_1}
                  onChange={(e) =>
                    setForm((f) => f && { ...f, address_line_1: e.target.value })
                  }
                  className="border-[#E5E0D8]"
                  autoComplete="street-address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-addr2">Address line 2</Label>
                <Input
                  id="edit-addr2"
                  value={form.address_line_2}
                  onChange={(e) =>
                    setForm((f) => f && { ...f, address_line_2: e.target.value })
                  }
                  className="border-[#E5E0D8]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={form.city}
                    onChange={(e) => setForm((f) => f && { ...f, city: e.target.value })}
                    className="border-[#E5E0D8]"
                    autoComplete="address-level2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-county">County / region</Label>
                  <Input
                    id="edit-county"
                    value={form.county}
                    onChange={(e) => setForm((f) => f && { ...f, county: e.target.value })}
                    className="border-[#E5E0D8]"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-post">Postcode</Label>
                  <Input
                    id="edit-post"
                    value={form.postcode}
                    onChange={(e) => setForm((f) => f && { ...f, postcode: e.target.value })}
                    className="border-[#E5E0D8]"
                    autoComplete="postal-code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={form.country}
                    onChange={(e) => setForm((f) => f && { ...f, country: e.target.value })}
                    className="border-[#E5E0D8]"
                    autoComplete="country-name"
                  />
                </div>
              </div>
              {editRow?.email ? (
                <p className="text-xs text-[#8C8074]">
                  Email <span className="font-mono text-[#1A1A1B]/80">{editRow.email}</span> is
                  managed via auth — not editable here.
                </p>
              ) : null}
            </div>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setEditRow(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!form || !canManageRoles || pendingSave}
              className="bg-[#D4AF37] font-semibold text-[#1A1A1B] hover:bg-[#c9a227]"
              onClick={saveProfile}
            >
              {pendingSave ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
