'use client'

import { useState } from 'react'
import SubpageHeader from '@/components/navigation/SubpageHeader'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function BookingPage() {
  const { locale } = useLanguage()
  const [requestSent, setRequestSent] = useState(false)

  const callLabel = locale === 'bg' ? 'Обадете се' : 'Call now'
  const emailLabel = locale === 'bg' ? 'Изпратете имейл' : 'Send email'
  const requestLabel = locale === 'bg' ? 'Изпрати заявка' : 'Request appointment'
  const requestDone = locale === 'bg' ? 'Заявката е изпратена' : 'Request sent'
  const locationLabel = locale === 'bg' ? 'Център, София' : 'Sofia City Center'
  const hoursLabel = locale === 'bg' ? 'Пон–Пет: 09:00–19:00 | Съб: 09:00–17:00' : 'Mon-Fri: 09:00-19:00 | Sat: 09:00-17:00'

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <SubpageHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Gold rule */}
          <div className="w-10 h-px bg-[#D4AF37] mb-10 md:mb-12 mx-auto" />

        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1B] text-center text-balance leading-tight mb-6">
          {t(tr.booking.headingA, locale)}<br />
          <span className="italic text-[#8C8074]">{t(tr.booking.headingB, locale)}</span>
        </h1>

        {/* Subtext */}
        <p className="font-sans text-sm md:text-base text-[#8C8074] text-center text-pretty max-w-md mx-auto leading-relaxed mb-14">
          {t(tr.booking.subtext, locale)}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <a
            href="tel:+35929001234"
            className="inline-flex items-center justify-center min-h-[52px] px-5 font-sans text-xs uppercase tracking-widest bg-[#1A1A1B] text-[#F9F8F6] hover:bg-[#0F0F10] transition-colors duration-200"
            aria-label={`${callLabel} +359 2 900 1234`}
          >
            {callLabel}
          </a>
          <a
            href="mailto:hello@maisonelite.bg"
            className="inline-flex items-center justify-center min-h-[52px] px-5 font-sans text-xs uppercase tracking-widest border border-[#D4AF37] text-[#1A1A1B] hover:bg-[#D4AF37]/10 transition-colors duration-200"
            aria-label={`${emailLabel} hello@maisonelite.bg`}
          >
            {emailLabel}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setRequestSent(true)}
          className="w-full min-h-[52px] px-5 font-sans text-xs uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors duration-200"
          aria-label={requestLabel}
        >
          {requestSent ? requestDone : requestLabel}
        </button>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#E5E0D8] p-5">
            <p className="font-sans text-xs uppercase tracking-widest text-[#8C8074] mb-2">
              {locale === 'bg' ? 'Работно време' : 'Opening hours'}
            </p>
            <p className="font-sans text-sm text-[#1A1A1B] leading-relaxed">{hoursLabel}</p>
          </div>
          <div className="border border-[#E5E0D8] p-5">
            <p className="font-sans text-xs uppercase tracking-widest text-[#8C8074] mb-2">
              {locale === 'bg' ? 'Локация' : 'Location'}
            </p>
            <p className="font-sans text-sm text-[#1A1A1B] mb-3">{locationLabel}</p>
            <a
              href="https://maps.google.com/?q=Sofia+Center"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37]/40 pb-0.5 hover:border-[#D4AF37] transition-colors duration-200"
            >
              {locale === 'bg' ? 'Отвори в карти' : 'Open in maps'}
            </a>
          </div>
        </div>

          {/* Bottom rule */}
          <div className="w-10 h-px bg-[#D4AF37] mt-16 mx-auto" />
        </div>
      </main>
    </div>
  )
}
