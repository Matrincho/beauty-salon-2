'use client'

import Link from 'next/link'
import CtaButton from '@/components/ui/CtaButton'
import Footer from '@/components/footer/Footer'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function AboutPage() {
  const { locale } = useLanguage()

  const values = [
    { title: t(tr.about.v1title, locale), body: t(tr.about.v1body, locale) },
    { title: t(tr.about.v2title, locale), body: t(tr.about.v2body, locale) },
    { title: t(tr.about.v3title, locale), body: t(tr.about.v3body, locale) },
  ]

  const milestones = [
    { year: t(tr.about.m1year, locale), event: t(tr.about.m1event, locale) },
    { year: t(tr.about.m2year, locale), event: t(tr.about.m2event, locale) },
    { year: t(tr.about.m3year, locale), event: t(tr.about.m3event, locale) },
    { year: t(tr.about.m4year, locale), event: t(tr.about.m4event, locale) },
    { year: t(tr.about.m5year, locale), event: t(tr.about.m5event, locale) },
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

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">

        {/* Page heading */}
        <div className="mb-16 md:mb-24 max-w-3xl">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-5">
            {t(tr.about.eyebrow, locale)}
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[#1A1A1B] text-balance mb-8">
            {t(tr.about.headingA, locale)}<br />
            <em className="italic text-[#8C8074]">{t(tr.about.headingB, locale)}</em>
          </h1>
          <p className="font-sans text-base md:text-lg leading-relaxed text-[#8C8074]">
            {t(tr.about.intro, locale)}
          </p>
        </div>

        {/* Gold rule */}
        <div className="w-12 h-px bg-[#D4AF37] mb-20" />

        {/* Values */}
        <div className="mb-24">
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#8C8074] mb-10">
            {t(tr.about.valuesHeading, locale)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ title, body }) => (
              <div
                key={title}
                className="flex flex-col gap-4 border-t-2 border-[#D4AF37] pt-6"
              >
                <h3 className="font-serif text-xl text-[#1A1A1B]">{title}</h3>
                <p className="font-sans text-sm leading-relaxed text-[#8C8074]">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#8C8074] mb-10">
            {t(tr.about.timelineHeading, locale)}
          </h2>
          <ol className="flex flex-col gap-0">
            {milestones.map(({ year, event }, i) => (
              <li
                key={year}
                className={`flex gap-8 items-start py-7 ${
                  i < milestones.length - 1 ? 'border-b border-[#E5E0D8]' : ''
                }`}
              >
                <span className="font-serif text-sm text-[#D4AF37] shrink-0 w-12">{year}</span>
                <p className="font-sans text-sm leading-relaxed text-[#1A1A1B]">{event}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA nudge */}
        <div className="relative overflow-hidden bg-[#0F0F10] p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 0% 100%, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
          />
          <div className="absolute top-0 left-10 w-8 h-px bg-[#D4AF37]" aria-hidden="true" />
          <div className="relative flex flex-col gap-2">
            <h3 className="font-serif text-xl text-[#F9F8F6]">{t(tr.about.ctaHeading, locale)}</h3>
            <p className="font-sans text-sm text-[#F9F8F6]/50">
              {t(tr.about.ctaBody, locale)}
            </p>
          </div>
          <div className="relative shrink-0">
            <CtaButton variant="outline-gold-fill" size="md" label={t(tr.cta.bookNow, locale)} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
