'use client'

import Link from 'next/link'
import { BriefcaseBusiness, CalendarPlus, Plus, Users } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const itemClassLight =
  'flex cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 focus:bg-[#F9F8F6] data-[highlighted]:bg-[#F9F8F6]'

const itemClassDark =
  'flex cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 focus:bg-white/10 data-[highlighted]:bg-white/10'

export function AdminQuickActionDropdown({
  onNavigate,
  className,
  variant = 'light',
}: {
  onNavigate?: () => void
  className?: string
  variant?: 'light' | 'dark'
}) {
  const dark = variant === 'dark'
  const itemClass = dark ? itemClassDark : itemClassLight

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          className={cn(
            'shrink-0 gap-1.5 rounded-lg border-0 px-3 py-2 font-sans text-sm font-semibold shadow-sm sm:px-4',
            dark
              ? 'bg-[#D4AF37] text-[#1A1A1B] hover:bg-[#c9a227]'
              : 'bg-[#D4AF37] text-[#1A1A1B] hover:bg-[#c9a227]',
            className
          )}
        >
          <Plus className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
          <span className="hidden sm:inline">Quick action</span>
          <span className="sm:hidden">Action</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          'z-[200] w-[min(100vw-2rem,17rem)] p-1 shadow-xl',
          dark
            ? 'border border-[#E5E0D8]/10 bg-[#222120] text-[#F9F8F6]'
            : 'border border-[#E5E0D8] bg-white'
        )}
      >
        <DropdownMenuItem asChild className={itemClass}>
          <Link href="/admin/bookings" onClick={onNavigate} className="flex w-full items-center gap-3">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                dark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/12 text-blue-600'
              )}
              aria-hidden
            >
              <CalendarPlus className="size-[18px]" strokeWidth={2} />
            </span>
            <span
              className={cn(
                'font-sans text-sm font-medium',
                dark ? 'text-[#F9F8F6]' : 'text-[#1A1A1B]'
              )}
            >
              New booking
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={itemClass}>
          <Link href="/admin/clients" onClick={onNavigate} className="flex w-full items-center gap-3">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                dark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/12 text-emerald-700'
              )}
              aria-hidden
            >
              <Users className="size-[18px]" strokeWidth={2} />
            </span>
            <span
              className={cn(
                'font-sans text-sm font-medium',
                dark ? 'text-[#F9F8F6]' : 'text-[#1A1A1B]'
              )}
            >
              Add client
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={itemClass}>
          <Link href="/admin/sessions" onClick={onNavigate} className="flex w-full items-center gap-3">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                dark ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-[#D4AF37]/12 text-[#9a7b1a]'
              )}
              aria-hidden
            >
              <BriefcaseBusiness className="size-[18px]" strokeWidth={2} />
            </span>
            <span
              className={cn(
                'font-sans text-sm font-medium',
                dark ? 'text-[#F9F8F6]' : 'text-[#1A1A1B]'
              )}
            >
              Sessions and catalog
            </span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
