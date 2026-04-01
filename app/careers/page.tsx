'use client'

import CtaButton from '@/components/ui/CtaButton'
import Footer from '@/components/footer/Footer'
import SubpageHeader from '@/components/navigation/SubpageHeader'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function CareersPage() {
  const { locale } = useLanguage()

  const openRoles = [
    {
      title:       t(tr.careers.r1title, locale),
      type:        t(tr.careers.r1type,  locale),
      location:    t(tr.careers.r1loc,   locale),
      description: t(tr.careers.r1desc,  locale),
    },
    {
      title:       t(tr.careers.r2title, locale),
      type:        t(tr.careers.r2type,  locale),
      location:    t(tr.careers.r2loc,   locale),
      description: t(tr.careers.r2desc,  locale),
    },
    {
      title:       t(tr.careers.r3title, locale),
      type:        t(tr.careers.r3type,  locale),
      location:    t(tr.careers.r3loc,   locale),
      description: t(tr.careers.r3desc,  locale),
    },
  ]

  const perks = [
    t(tr.careers.p1, locale),
    t(tr.careers.p2, locale),
    t(tr.careers.p3, locale),
    t(tr.careers.p4, locale),
    t(tr.careers.p5, locale),
  ]

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <SubpageHeader />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">

        {/* Page heading */}
        <div className="mb-16 md:mb-24 max-w-3xl">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-5">
            {t(tr.careers.eyebrow, locale)}
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[#1A1A1B] text-balance mb-8">
            {t(tr.careers.headingA, locale)}<br />
            <em className="italic text-[#8C8074]">{t(tr.careers.headingB, locale)}</em>
          </h1>
          <p className="font-sans text-base md:text-lg leading-relaxed text-[#8C8074]">
            {t(tr.careers.intro, locale)}
          </p>
        </div>

        {/* Gold rule */}
        <div className="w-12 h-px bg-[#D4AF37] mb-20" />

        {/* Open roles */}
        <div className="mb-24">
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#8C8074] mb-10">
            {t(tr.careers.openPositions, locale)}
          </h2>
          <div className="flex flex-col gap-6">
            {openRoles.map(({ title, type, location, description }) => (
              <div
                key={title}
                className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border border-[#E5E0D8] p-8 hover:border-[#D4AF37]/50 transition-colors duration-300"
              >
                <div className="flex flex-col gap-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-xl text-[#1A1A1B]">{title}</h3>
                    <span className="font-sans text-xs uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/40 px-2.5 py-1">
                      {type}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#8C8074] uppercase tracking-widest">
                    {location}
                  </p>
                  <p className="font-sans text-sm leading-relaxed text-[#8C8074]">
                    {description}
                  </p>
                </div>
                <div className="shrink-0">
                  <a
                    href="mailto:careers@maisonelite.bg"
                    className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[#1A1A1B] border border-[#1A1A1B] px-6 py-3 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                  >
                    {t(tr.careers.apply, locale)}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perks */}
        <div className="mb-24">
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#8C8074] mb-10">
            {t(tr.careers.whatWeOffer, locale)}
          </h2>
          <ul className="flex flex-col gap-0">
            {perks.map((perk, i) => (
              <li
                key={perk}
                className={`flex items-start gap-5 py-5 ${
                  i < perks.length - 1 ? 'border-b border-[#E5E0D8]' : ''
                }`}
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" aria-hidden="true" />
                <p className="font-sans text-sm leading-relaxed text-[#1A1A1B]">{perk}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Speculative applications */}
        <div className="relative overflow-hidden bg-[#0F0F10] p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 0% 100%, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
          />
          <div className="absolute top-0 left-10 w-8 h-px bg-[#D4AF37]" aria-hidden="true" />
          <div className="relative flex flex-col gap-2">
            <h3 className="font-serif text-xl text-[#F9F8F6]">{t(tr.careers.noRole, locale)}</h3>
            <p className="font-sans text-sm text-[#F9F8F6]/50">
              {t(tr.careers.specBody, locale)}
            </p>
          </div>
          <a
            href="mailto:careers@maisonelite.bg"
            className="relative shrink-0 inline-flex items-center justify-center font-sans font-medium uppercase text-sm tracking-widest px-7 py-3.5 min-h-[44px] bg-transparent text-[#D4AF37] border border-[#D4AF37] shadow-md hover:bg-[#D4AF37] hover:text-[#1A1A1B] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300"
          >
            {t(tr.careers.specApply, locale)}
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
