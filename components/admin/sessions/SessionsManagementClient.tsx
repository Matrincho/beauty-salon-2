'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react'
import type { AdminBookingRow } from '@/lib/admin/data'
import {
  type MockCategory,
  type MockSessionType,
  type SessionsMockState,
  countTypesInCategory,
  loadSessionsMockState,
  saveSessionsMockState,
  seedSessionsMockState,
} from '@/lib/admin/sessions-mock'
import { ActiveSessionsPanel } from '@/components/admin/sessions/ActiveSessionsPanel'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

const SESSIONS_TAB_CONTENT =
  'mt-0 outline-none focus-visible:ring-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300'

const TABS = ['categories', 'catalog', 'active'] as const
type TabId = (typeof TABS)[number]

function isTabId(s: string | null): s is TabId {
  return s === 'categories' || s === 'catalog' || s === 'active'
}

export function SessionsManagementClient({
  activeBookings,
  activeBookingsError,
}: {
  activeBookings: AdminBookingRow[]
  activeBookingsError: string | null
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const activeTab: TabId = isTabId(tabFromUrl) ? tabFromUrl : 'categories'

  const setTab = useCallback(
    (v: string) => {
      const next = isTabId(v) ? v : 'categories'
      router.replace(`/admin/sessions?tab=${next}`, { scroll: false })
    },
    [router]
  )

  const [state, setState] = useState<SessionsMockState | null>(null)

  useEffect(() => {
    setState(loadSessionsMockState())
  }, [])

  useEffect(() => {
    if (state) saveSessionsMockState(state)
  }, [state])

  const resetDemo = () => {
    const s = seedSessionsMockState()
    setState(s)
    saveSessionsMockState(s)
    toast.success('Demo data reset.')
  }

  if (!state) {
    return (
      <div className="mx-auto max-w-6xl rounded-xl border border-[#E5E0D8] bg-white p-8 text-center text-sm text-[#8C8074]">
        Loading sessions…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm text-[#8C8074]">
          Categories and service catalog use demo data in this browser (mock). Active sessions load
          from Supabase (pending or confirmed bookings that have not ended).
        </p>
        <div className="flex shrink-0 flex-col items-end gap-1 sm:text-right">
          <button
            type="button"
            onClick={resetDemo}
            className="text-xs font-medium text-[#8C8074] underline-offset-2 hover:text-[#D4AF37] hover:underline"
          >
            Reset demo data
          </button>
          <p className="max-w-[16rem] text-[10px] text-[#8C8074]/90">
            Counts update when you add services under each category in the Service catalog tab.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setTab} className="w-full gap-3 sm:gap-4">
        <TabsList className="relative z-10 h-auto w-full flex-wrap justify-start gap-1 rounded-lg border border-[#E5E0D8] bg-[#F9F8F6] p-1 shadow-sm transition-shadow duration-200">
          <TabsTrigger
            value="categories"
            className="transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:text-[#1A1A1B] data-[state=active]:shadow-sm"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="catalog"
            className="transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:text-[#1A1A1B] data-[state=active]:shadow-sm"
          >
            Service catalog
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:text-[#1A1A1B] data-[state=active]:shadow-sm"
          >
            Active sessions
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[min(28rem,72vh)] pt-1 sm:min-h-[26rem]">
          <TabsContent value="categories" className={SESSIONS_TAB_CONTENT}>
            <CategoriesPanel state={state} setState={setState} />
          </TabsContent>
          <TabsContent value="catalog" className={SESSIONS_TAB_CONTENT}>
            <CatalogPanel state={state} setState={setState} />
          </TabsContent>
          <TabsContent value="active" className={SESSIONS_TAB_CONTENT}>
            <ActiveSessionsPanel bookings={activeBookings} error={activeBookingsError} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function CategoriesPanel({
  state,
  setState,
}: {
  state: SessionsMockState
  setState: React.Dispatch<React.SetStateAction<SessionsMockState | null>>
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<MockCategory>({
    id: '',
    name: '',
  })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openCreate = () => {
    setForm({
      id: '',
      name: '',
    })
    setOpen(true)
  }

  const openEdit = (c: MockCategory) => {
    setForm({ ...c })
    setOpen(true)
  }

  const save = () => {
    const name = form.name.trim()
    if (!name) {
      toast.error('Name is required.')
      return
    }
    if (form.id) {
      setState((s) => {
        if (!s) return s
        return {
          ...s,
          categories: s.categories
            .map((c) => (c.id === form.id ? { ...form, name } : c))
            .sort((a, b) => a.name.localeCompare(b.name)),
        }
      })
      toast.success('Category updated.')
    } else {
      const id = `cat_${crypto.randomUUID().slice(0, 8)}`
      setState((s) => {
        if (!s) return s
        return {
          ...s,
          categories: [...s.categories, { ...form, id, name }].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        }
      })
      toast.success('Category created.')
    }
    setOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    const n = countTypesInCategory(state, deleteId)
    if (n > 0) {
      toast.error(`Move or delete ${n} service(s) in this category first.`)
      setDeleteId(null)
      return
    }
    setState((s) => {
      if (!s) return s
      return {
        ...s,
        categories: s.categories.filter((c) => c.id !== deleteId),
      }
    })
    toast.success('Category removed.')
    setDeleteId(null)
  }

  const sorted = useMemo(
    () => [...state.categories].sort((a, b) => a.name.localeCompare(b.name)),
    [state.categories]
  )

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="max-w-2xl min-w-0 flex-1 space-y-1">
            <h3 className="font-sans text-base font-semibold text-[#1A1A1B]">
              Category groups
            </h3>
            <p className="text-sm leading-relaxed text-[#8C8074]">
              Categories are buckets for the service catalog (next tab).{' '}
              <span className="font-medium text-[#1A1A1B]/80">Catalog items</span> counts how many
              services you have assigned here — not bookings. Rows are sorted by name.
            </p>
          </div>
          <Button
            type="button"
            onClick={openCreate}
            className="shrink-0 self-end bg-[#D4AF37] font-semibold text-[#1A1A1B] hover:bg-[#c9a227] sm:self-start"
          >
            <Plus className="mr-1.5 size-4" aria-hidden />
            Add category
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white shadow-sm">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E0D8] bg-[#F9F8F6] text-xs uppercase tracking-wide text-[#8C8074]">
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="w-32 px-4 py-3 font-medium">
                <span className="block">Catalog items</span>
              </th>
              <th className="min-w-[10rem] px-4 py-3 text-end font-medium">Manage</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id} className="border-b border-[#E5E0D8]/80 last:border-0">
                <td className="px-4 py-3 font-medium text-[#1A1A1B]">{row.name}</td>
                <td className="px-4 py-3 tabular-nums text-[#1A1A1B]/90">
                  {countTypesInCategory(state, row.id)}
                </td>
                <td className="px-4 py-3 text-end align-middle">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-[#E5E0D8] text-[#1A1A1B] hover:border-[#D4AF37]/50 hover:bg-[#FFFCF8]"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="mr-1.5 size-3.5" aria-hidden />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteId(row.id)}
                    >
                      <Trash2 className="mr-1.5 size-3.5" aria-hidden />
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[#E5E0D8] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1A1A1B]">
              {form.id ? 'Edit category' : 'New category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="border-[#E5E0D8]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#D4AF37] font-semibold text-[#1A1A1B] hover:bg-[#c9a227]"
              onClick={save}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-[#E5E0D8]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The category must have no services attached.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function CatalogPanel({
  state,
  setState,
}: {
  state: SessionsMockState
  setState: React.Dispatch<React.SetStateAction<SessionsMockState | null>>
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<MockSessionType | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openCreate = () => {
    const firstCat = state.categories[0]?.id ?? ''
    setForm({
      id: '',
      categoryId: firstCat,
      slug: '',
      title: '',
      description: '',
      durationMinutes: 60,
      basePrice: 0,
      currency: 'BGN',
      isActive: true,
      imageUrl: '',
      sortOrder: 1,
    })
    setOpen(true)
  }

  const openEdit = (t: MockSessionType) => {
    setForm({ ...t, imageUrl: t.imageUrl ?? '' })
    setOpen(true)
  }

  const save = () => {
    if (!form) return
    const title = form.title.trim()
    const slug = form.slug.trim().toLowerCase().replace(/\s+/g, '-')
    if (!title || !slug) {
      toast.error('Title and slug are required.')
      return
    }
    if (!form.categoryId) {
      toast.error('Choose a category.')
      return
    }
    const imageUrl = form.imageUrl?.trim() || null
    const payload: MockSessionType = {
      ...form,
      title,
      slug,
      imageUrl,
    }
    if (form.id) {
      setState((s) => {
        if (!s) return s
        return {
          ...s,
          sessionTypes: s.sessionTypes.map((x) => (x.id === form.id ? payload : x)),
        }
      })
      toast.success('Service updated.')
    } else {
      const id = `st_${crypto.randomUUID().slice(0, 8)}`
      setState((s) => {
        if (!s) return s
        return { ...s, sessionTypes: [...s.sessionTypes, { ...payload, id }] }
      })
      toast.success('Service created.')
    }
    setOpen(false)
    setForm(null)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    setState((s) => {
      if (!s) return s
      return {
        ...s,
        sessionTypes: s.sessionTypes.filter((x) => x.id !== deleteId),
      }
    })
    toast.success('Service removed.')
    setDeleteId(null)
  }

  const sortedTypes = useMemo(
    () =>
      [...state.sessionTypes].sort((a, b) => {
        const na =
          state.categories.find((c) => c.id === a.categoryId)?.name ?? ''
        const nb =
          state.categories.find((c) => c.id === b.categoryId)?.name ?? ''
        const cmp = na.localeCompare(nb)
        if (cmp !== 0) return cmp
        return a.sortOrder - b.sortOrder
      }),
    [state.sessionTypes, state.categories]
  )

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="max-w-2xl min-w-0 flex-1 space-y-1">
            <h3 className="font-sans text-base font-semibold text-[#1A1A1B]">
              Service catalog
            </h3>
            <p className="text-sm leading-relaxed text-[#8C8074]">
              Services clients can book. Slug under each title is the stable URL key. Use Active to
              show or hide a service from the live catalog.
            </p>
          </div>
          <Button
            type="button"
            onClick={openCreate}
            className="shrink-0 self-end bg-[#D4AF37] font-semibold text-[#1A1A1B] hover:bg-[#c9a227] sm:self-start"
          >
            <Plus className="mr-1.5 size-4" aria-hidden />
            Add service
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white shadow-sm">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E0D8] bg-[#F9F8F6] text-xs uppercase tracking-wide text-[#8C8074]">
              <th className="px-3 py-3 font-medium">Image</th>
              <th className="px-3 py-3 font-medium">Service</th>
              <th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 font-medium">Mins</th>
              <th className="px-3 py-3 font-medium">Price</th>
              <th className="px-3 py-3 font-medium">Active</th>
              <th className="w-28 px-3 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTypes.map((row) => {
              const cat = state.categories.find((c) => c.id === row.categoryId)
              return (
                <tr key={row.id} className="border-b border-[#E5E0D8]/80 last:border-0">
                  <td className="px-3 py-2">
                    {row.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- remote mock URLs
                      <img
                        src={row.imageUrl}
                        alt=""
                        className="h-12 w-20 rounded-md border border-[#E5E0D8] object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-20 items-center justify-center rounded-md border border-dashed border-[#E5E0D8] bg-[#F9F8F6]">
                        <ImageIcon className="size-5 text-[#8C8074]" aria-hidden />
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-[#1A1A1B]">{row.title}</p>
                    <p className="font-mono text-xs text-[#8C8074]">{row.slug}</p>
                  </td>
                  <td className="px-3 py-3 text-[#8C8074]">{cat?.name ?? '—'}</td>
                  <td className="px-3 py-3 tabular-nums">{row.durationMinutes}</td>
                  <td className="px-3 py-3 tabular-nums">
                    {row.basePrice.toFixed(2)} {row.currency}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        'rounded border px-2 py-0.5 text-xs',
                        row.isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                          : 'border-[#E5E0D8] bg-[#F9F8F6] text-[#8C8074]'
                      )}
                    >
                      {row.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-end align-middle">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(row)}
                        aria-label={`Edit ${row.title}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => setDeleteId(row.id)}
                        aria-label={`Delete ${row.title}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) setForm(null)
        }}
      >
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto border-[#E5E0D8] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1A1A1B]">
              {form?.id ? 'Edit service' : 'New service'}
            </DialogTitle>
          </DialogHeader>
          {form ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm((f) => f && { ...f, categoryId: v })}
                >
                  <SelectTrigger className="border-[#E5E0D8]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="st-title">Title</Label>
                  <Input
                    id="st-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => f && { ...f, title: e.target.value })}
                    className="border-[#E5E0D8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="st-slug">Slug</Label>
                  <Input
                    id="st-slug"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, slug: e.target.value.toLowerCase() })
                    }
                    className="border-[#E5E0D8] font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="st-desc">Description</Label>
                <Textarea
                  id="st-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => f && { ...f, description: e.target.value })
                  }
                  className="border-[#E5E0D8]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="st-dur">Duration (min)</Label>
                  <Input
                    id="st-dur"
                    type="number"
                    min={1}
                    value={form.durationMinutes}
                    onChange={(e) =>
                      setForm((f) =>
                        f ? { ...f, durationMinutes: Number(e.target.value) || 1 } : f
                      )
                    }
                    className="border-[#E5E0D8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="st-price">Base price</Label>
                  <Input
                    id="st-price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.basePrice}
                    onChange={(e) =>
                      setForm((f) =>
                        f ? { ...f, basePrice: Number(e.target.value) || 0 } : f
                      )
                    }
                    className="border-[#E5E0D8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={form.currency}
                    onValueChange={(v) => setForm((f) => f && { ...f, currency: v })}
                  >
                    <SelectTrigger className="border-[#E5E0D8]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BGN">BGN</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="st-img">Image URL</Label>
                <Input
                  id="st-img"
                  value={form.imageUrl ?? ''}
                  onChange={(e) => setForm((f) => f && { ...f, imageUrl: e.target.value })}
                  placeholder="https://…"
                  className="border-[#E5E0D8]"
                />
                <p className="text-xs text-[#8C8074]">
                  Optional. Paste a URL; preview appears in the list after save.
                </p>
                {form.imageUrl ? (
                  <div className="mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.imageUrl}
                      alt=""
                      className="max-h-40 rounded-lg border border-[#E5E0D8] object-cover"
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-2">
                  <Label htmlFor="st-sort">Sort</Label>
                  <Input
                    id="st-sort"
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((f) =>
                        f ? { ...f, sortOrder: Number(e.target.value) || 0 } : f
                      )
                    }
                    className="w-24 border-[#E5E0D8]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox
                    id="st-active"
                    checked={form.isActive}
                    onCheckedChange={(c) =>
                      setForm((f) => f && { ...f, isActive: Boolean(c) })
                    }
                  />
                  <Label htmlFor="st-active" className="font-normal">
                    Active in catalog
                  </Label>
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setForm(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#D4AF37] font-semibold text-[#1A1A1B] hover:bg-[#c9a227]"
              onClick={save}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-[#E5E0D8]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete service?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the service from the mock catalog only.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

