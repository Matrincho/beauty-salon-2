'use client'

import { Camera } from 'lucide-react'
import { uploadAvatarAction, removeAvatarAction } from '@/app/profile/actions'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type ProfileAvatarHeaderProps = {
  avatarPreviewUrl: string | null
  initials: string
  displayName: string
  email: string
  hasStoredAvatar: boolean
}

export function ProfileAvatarHeader({
  avatarPreviewUrl,
  initials,
  displayName,
  email,
  hasStoredAvatar,
}: ProfileAvatarHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 border-b border-[#E5E0D8] pb-8 sm:flex-row sm:items-center sm:gap-10">
      <form action={uploadAvatarAction} className="relative shrink-0">
        <div
          className="relative h-[7.5rem] w-[7.5rem] overflow-hidden rounded-full border-2 border-[#D4AF37]/45 bg-[#1A1A1B] shadow-[0_4px_24px_rgba(26,26,27,0.15),0_0_0_1px_rgba(212,175,55,0.15)]"
          aria-hidden={!!avatarPreviewUrl}
        >
          {avatarPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- signed URL / legacy http
            <img
              src={avatarPreviewUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-sans text-3xl font-semibold tracking-tight text-[#D4AF37]">
                {initials.slice(0, 2)}
              </span>
            </div>
          )}
        </div>

        <input
          type="file"
          name="avatar"
          id="profile-avatar-input"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const form = e.currentTarget.form
            if (e.currentTarget.files?.length && form) {
              form.requestSubmit()
            }
            e.currentTarget.value = ''
          }}
        />

        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <label
              htmlFor="profile-avatar-input"
              className="absolute -bottom-0.5 -right-0.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-[0_2px_12px_rgba(212,175,55,0.45)] ring-2 ring-white transition-colors hover:bg-[#c9a431] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
            >
              <Camera className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
              <span className="sr-only">Смени снимката на профила</span>
            </label>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={6}
            className="border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-medium text-[#1A1A1B] shadow-md"
          >
            Смени снимката на профила
          </TooltipContent>
        </Tooltip>
      </form>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1A1A1B] md:text-3xl">
          {displayName}
        </h2>
        <p className="mt-1.5 truncate text-sm text-[#8C8074]" title={email}>
          {email}
        </p>
        {hasStoredAvatar ? (
          <form action={removeAvatarAction} className="mt-4">
            <button
              type="submit"
              className="text-xs font-sans uppercase tracking-widest text-[#8C8074] underline decoration-[#8C8074]/50 underline-offset-2 transition-colors hover:text-red-700 hover:decoration-red-700/50"
            >
              Премахни снимката
            </button>
          </form>
        ) : null}
      </div>
    </div>
  )
}
