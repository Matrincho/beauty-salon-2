'use client'

import Link from 'next/link'
import CtaButton from '@/components/ui/CtaButton'
import Footer from '@/components/footer/Footer'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function ContactPage() {
  const { locale } = useLanguage()

  const contactDetails = [
    { label: t(tr.contact.phoneLabel,   locale), value: '+359 2 900 1234',        href: 'tel:+35929001234' },
    { label: t(tr.contact.emailLabel,   locale), value: 'hello@maisonelite.bg',   href: 'mailto:hello@maisonelite.bg' },
    { label: t(tr.contact.addressLabel, locale), value: t(tr.contact.mapAddress, locale), href: 'https://maps.google.com' },
  ]

  const hours = [
    { day: t(tr.contact.monFri,   locale), time: '09:00 – 19:00' },
    { day: t(tr.contact.saturday, locale), time: '09:00 – 17:00' },
    { day: t(tr.contact.sunday,   locale), time: t(tr.contact.closed, locale) },
  ]

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Header bar */}
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
            className="font-serif text-base tracking-[0.15em] text-[#1A1A1B] uppercase hover:text-[#D4AF37] transition-colors duration-300 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:top-auto md:left-auto md:relative md:transform-none"
          >
            Maison Élite
          </Link>
          <div className="hidden md:flex">
            <CtaButton size="sm" label={t(tr.cta.bookNow, locale)} />
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">

        {/* Page heading */}
        <div className="mb-16 md:mb-20">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-5">
            {t(tr.contact.eyebrow, locale)}
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[#1A1A1B] text-balance">
            {t(tr.contact.headingA, locale)}<br />
            <em className="italic text-[#8C8074]">{t(tr.contact.headingB, locale)}</em>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left — contact details + hours */}
          <div className="flex flex-col gap-12">

            {/* Contact details */}
            <div className="flex flex-col gap-6">
              {contactDetails.map(({ label, value, href }) => (
                <div key={label} className="flex flex-col gap-1 border-b border-[#E5E0D8] pb-6">
                  <span className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                    {label}
                  </span>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="font-serif text-lg text-[#1A1A1B] hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {value}
                  </a>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-4">
              <h2 className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                {t(tr.contact.hoursHeading, locale)}
              </h2>
              <ul className="flex flex-col gap-3">
                {hours.map(({ day, time }) => (
                  <li
                    key={day}
                    className="flex items-center justify-between font-sans text-sm text-[#1A1A1B] border-b border-[#E5E0D8] pb-3"
                  >
                    <span>{day}</span>
                    <span className={time === t(tr.contact.closed, locale) ? 'text-[#8C8074]' : 'text-[#D4AF37]'}>
                      {time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — map placeholder + booking nudge */}
          <div className="flex flex-col gap-8">
            {/* Map placeholder */}
            <div className="relative w-full aspect-[4/3] bg-[#F0EDE8] border border-[#E5E0D8] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center px-8">
                <div className="w-8 h-px bg-[#D4AF37]" />
                <p className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                  {t(tr.contact.mapAddress, locale)}
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37]/40 pb-0.5 hover:border-[#D4AF37] transition-colors duration-200"
                >
                  {t(tr.contact.openInMaps, locale)}
                </a>
              </div>
            </div>

            {/* Booking nudge */}
            <div className="relative flex flex-col gap-5 p-8 bg-[#0F0F10] overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(212,175,55,0.14) 0%, transparent 70%)' }}
              />
              <div className="absolute top-0 left-8 w-8 h-px bg-[#D4AF37]" aria-hidden="true" />
              <h3 className="relative font-serif text-xl text-[#F9F8F6]">
                {t(tr.contact.ctaHeading, locale)}
              </h3>
              <p className="relative font-sans text-sm leading-relaxed text-[#F9F8F6]/50">
                {t(tr.contact.ctaBody, locale)}
              </p>
              <div className="relative">
                <CtaButton variant="outline-gold-fill" size="md" label={t(tr.cta.bookNow, locale)} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
