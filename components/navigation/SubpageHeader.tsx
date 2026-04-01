'use client'

import Link from 'next/link'
import CtaButton from '@/components/ui/CtaButton'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

type SubpageHeaderProps = {
  showCta?: boolean
}

export default function SubpageHeader({ showCta = true }: SubpageHeaderProps) {
  const { locale } = useLanguage()

  return (
    <div className="border-b border-[#E5E0D8]">
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-sans text-xs uppercase tracking-widest text-[#8C8074] hover:text-[#D4AF37] transition-colors duration-200 shrink-0 flex items-center gap-2 absolute left-4 md:relative md:left-auto top-1/2 -translate-y-1/2 md:top-auto md:-translate-y-0"
        >
          <span aria-hidden="true">&larr;</span> {t(tr.subpage.home, locale)}
        </Link>
        <Link
          href="/"
          className="font-serif text-base tracking-[0.15em] text-[#1A1A1B] uppercase hover:text-[#D4AF37] transition-colors duration-300 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
        >
          Maison Élite
        </Link>
        {showCta ? (
          <div className="hidden md:flex">
            <CtaButton size="sm" label={t(tr.cta.bookNow, locale)} />
          </div>
        ) : (
          <div className="hidden md:block w-[140px]" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}
