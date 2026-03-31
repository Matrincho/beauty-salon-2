'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function BookingPage() {
  const { locale } = useLanguage()

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      {/* Header bar */}
      <div className="border-b border-[#E5E0D8]">
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-sans text-xs uppercase tracking-widest text-[#8C8074] hover:text-[#D4AF37] transition-colors duration-200 shrink-0 flex items-center gap-2"
          >
            <span aria-hidden="true">&larr;</span> {t(tr.subpage.home, locale)}
          </Link>
          <Link
            href="/"
            className="font-serif text-base tracking-[0.15em] text-[#1A1A1B] uppercase hover:text-[#D4AF37] transition-colors duration-300 absolute left-1/2 -translate-x-1/2"
          >
            Maison Élite
          </Link>
        </div>
      </div>

      {/* Centred content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Gold rule */}
        <div className="w-10 h-px bg-[#D4AF37] mb-12" />

        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1B] text-center text-balance leading-tight mb-6">
          {t(tr.booking.headingA, locale)}<br />
          <span className="italic text-[#8C8074]">{t(tr.booking.headingB, locale)}</span>
        </h1>

        {/* Subtext */}
        <p className="font-sans text-sm md:text-base text-[#8C8074] text-center text-pretty max-w-md leading-relaxed mb-14">
          {t(tr.booking.subtext, locale)}
        </p>

        {/* Contact detail */}
        <a
          href="tel:+35929001234"
          className="font-sans text-xs tracking-[0.2em] uppercase text-[#D4AF37] border-b border-[#D4AF37]/40 pb-0.5 hover:border-[#D4AF37] transition-colors duration-300"
        >
          +359 2 900 1234
        </a>

        {/* Bottom rule */}
        <div className="w-10 h-px bg-[#D4AF37] mt-16" />
      </div>
    </div>
  )
}
